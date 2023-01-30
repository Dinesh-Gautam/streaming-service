const multer = require("multer");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
console.log("storage created");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage }).single("video");

export default async function handler(req, res) {
  return await upload(req, res, (err) => {
    const movieData = {
      title: req.query.title,
      uid: uuidv4(),
    };

    saveMovieData(movieData);
    // consoleEncode(req.file.path);
  });
}

function saveMovieData(data) {
  if (!data) {
    return;
  }
  console.log("saving data");
  try {
    const fileData = JSON.parse(fs.readFileSync("data.json").toString()) || [];
    if (fileData.some((e) => e.title === data.title)) {
      console.log("movie already exists");
      return;
    }
    fileData.push(data);
    fs.writeFileSync("data.json", JSON.stringify(fileData));
  } catch (error) {
    fs.writeFileSync("data.json", JSON.stringify([data]));
  }
}

function consoleEncode(fn) {
  // height, bitrate
  const sizes = [
    [240, 350],
    [480, 700],
    [720, 2500],
    [1080, 10000],
  ];
  const fallback = [480, 400];

  let name = path.basename(fn, path.extname(fn));
  const targetdir = path.resolve(
    path.join(
      // "/Users/dines/Desktop/major project (OTT streaming service)/streaming-service/converted/mpdVideos",
      "converted/mpdVideos",
      name
    )
  );
  const sourcefn = path.resolve(fn);

  console.log("source", sourcefn);
  console.log("info", sizes);
  console.log("info", targetdir);

  try {
    var targetdirInfo = fs.statSync(targetdir);
  } catch (err) {
    if (err.code === "ENOENT") {
      fs.mkdirSync(targetdir);
    } else {
      throw err;
    }
  }

  var proc = ffmpeg({
    source: sourcefn,
    cwd: targetdir,
  });

  var targetfn = path.join(targetdir, `${name + "Output"}.mpd`);
  console.log("targetFIleName : " + targetfn);
  proc
    .addOption("-loglevel", "debug")

    .output(targetfn)
    .format("dash")
    .videoCodec("libx264")
    .audioCodec("aac")
    .audioChannels(2)
    .audioFrequency(44100)
    .outputOptions([
      "-preset veryfast",
      "-keyint_min 60",
      "-g 60",
      "-sc_threshold 0",
      "-profile:v main",
      "-use_template 1",
      "-use_timeline 1",
      "-b_strategy 0",
      "-bf 1",
      "-map 0:a",
      "-b:a 96k",
    ]);

  for (var size of sizes) {
    let index = sizes.indexOf(size);

    proc.outputOptions([
      `-filter_complex [0]format=pix_fmts=yuv420p[temp${index}];[temp${index}]scale=-2:${size[0]}[A${index}]`,
      `-map [A${index}]:v`,
      `-b:v:${index} ${size[1]}k`,
    ]);
  }

  //Fallback version
  // proc
  //   .output(path.join(targetdir, `${name + "Output"}.mp4`))
  //   .format("mp4")
  //   .videoCodec("libx264")
  //   .videoBitrate(fallback[1])
  //   .size(`?x${fallback[0]}`)
  //   .audioCodec("aac")
  //   .audioChannels(2)
  //   .audioFrequency(44100)
  //   .audioBitrate(128)
  //   .outputOptions([
  //     "-preset veryfast",
  //     "-movflags +faststart",
  //     "-keyint_min 60",
  //     "-refs 5",
  //     "-g 60",
  //     "-pix_fmt yuv420p",
  //     "-sc_threshold 0",
  //     "-profile:v main",
  //   ]);

  proc.on("start", function (commandLine) {
    console.log("progress", "Spawned Ffmpeg with command: " + commandLine);
  });

  proc
    .on("progress", function (info) {
      console.log("progress", info);
    })
    .on("stderr", function (stderrLine) {
      // console.log("Stderr output: " + stderrLine);
    })
    .on("end", function () {
      console.log("complete");
    })
    .on("error", function (err) {
      console.log("error", err);
    });
  return proc.run();
}

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};
