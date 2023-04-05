import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  AspectRatio,
  Box,
  Button,
  Card,
  CardOverflow,
  CircularProgress,
  FormControl,
  FormLabel,
  Input,
  Sheet,
  Textarea,
  Typography,
} from "@mui/joy";
import { Add, Check, Delete, Upload } from "@mui/icons-material";
import { CardContent } from "@mui/material";

function UploadPage({ pending }) {
  // const [inputTitle, setInputTitle] = useState(pending?.title || "");
  const [inputValue, setInputValue] = useState({
    title: pending?.title || "",
    description: pending?.description || "",
    genres: pending?.genres || "",
  });

  function updateInputValue(event) {
    const value = event.target.value;
    const name = event.target.name;
    setInputValue((prev) => ({ ...prev, [name]: value }));
  }
  const [progressData, setProgressData] = useState(
    pending?.progress?.completed ? 100 : 0
    // 89
  );

  const [publishedStatus, setPublishStatus] = useState({ published: false });
  const [uploadingState, setUploadingState] = useState(false);
  const progressInterval = useRef(null);
  const router = useRouter();
  const inputFileRef = useRef({});
  const [videoFileInfo, setVideoFileInfo] = useState({
    video: pending?.video && JSON.parse(pending?.video),
    poster: pending?.poster && JSON.parse(pending?.poster),
    backdrop: pending?.backdrop && JSON.parse(pending?.backdrop),
  });
  console.log(pending);
  useEffect(() => {
    if (!progressInterval.current && pending && !pending.progress?.completed) {
      console.log("starting progress interval");
      if (pending?.progress?.progressPercent) {
        if (!isNaN(pending?.progress?.progressPercent)) {
          setProgressData(Math.round(pending?.progress?.progressPercent));
        }
      }
      startProgressInterval(pending.uid);
    }

    // return () => {
    //   if (progressInterval.current) {
    //     console.log("clearing progress interval");
    //     clearInterval(progressInterval.current);
    //   }
    // };

    console.log(pending);
  }, [pending]);
  function startProgressInterval(uid) {
    if (!uid) {
      return;
    }
    if (!progressInterval.current) {
      progressInterval.current = setInterval(async () => {
        const progressData = await fetch(
          "/api/admin/movie/progress?id=" + uid
        ).then((res) => res.json());
        if (progressData.completed) {
          clearInterval(progressInterval.current);
          setProgressData(100);
          return;
        }
        if (progressData.error) {
          clearInterval(progressInterval.current);
          setProgressData(progressData);
          return;
        }
        setProgressData(Math.round(progressData.progressPercent));
        console.log(progressData);
      }, 1000);
    }
  }

  async function inputFileHandler(event) {
    const elementName = event.target.name;
    // inputFileRef.current[name] = event.value;

    const file = event.target.files[0];

    if (!file) {
      return;
    }
    if (elementName == "video") {
      videoInputHandler(file, elementName);
    }
    if (elementName == "poster") {
      posterInputHandler(file, elementName);
    }
    if (elementName == "backdrop") {
      posterInputHandler(file, elementName);
    }
  }
  useEffect(() => {
    console.log(inputFileRef.current);
  }, [inputFileRef]);

  async function videoInputHandler(file, elementName) {
    const URL = window.URL || window.webkitURL;
    const videoURL = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.src = videoURL;

    await video.play();
    video.pause();

    const name = file.name;
    const duration = video.duration;
    const minutes = Math.floor(duration / 60);
    const seconds = (duration % 60).toFixed(0);

    const formattedDuration =
      minutes > 1 ? minutes + "min " : "" + seconds + "s";

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth / 4;
    canvas.height = video.videoHeight / 4;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const thumbnail = canvas.toDataURL();
    setVideoFileInfo((prev) => ({
      ...prev,
      [elementName]: {
        name,
        duration: formattedDuration,
        thumbnailUrl: thumbnail,
        size: formatFileSize(file.size),
        type: file.type.split("/")[0],
        file,
      },
    }));
  }

  async function posterInputHandler(file, elementName) {
    console.log(file);
    const name = file.name;
    const URL = window.URL || window.webkitURL;
    const photoUrl = URL.createObjectURL(file);
    setVideoFileInfo((prev) => ({
      ...prev,
      [elementName]: {
        name,
        size: formatFileSize(file.size),
        thumbnailUrl: photoUrl,
        type: file.type.split("/")[0],
        file,
      },
    }));
  }

  function formatFileSize(bytes, decimalPoint) {
    if (bytes == 0) return "0 Bytes";
    var k = 1000,
      dm = decimalPoint || 2,
      sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
      i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  async function publishVideo(event) {
    if (pending.uid) {
      event.preventDefault();

      const publish = await fetch("/api/publish?id=" + pending.uid);

      if (publish.ok) {
        setPublishStatus({ published: true });
      }
    }
  }

  async function uploadDataAndFiles(event) {
    // const file = event.target.files[0];
    // Create a new FormData object to send the file
    setUploadingState(true);
    const formData = new FormData();
    Object.keys(videoFileInfo).forEach((key) => {
      const value = videoFileInfo[key];
      formData.append("data", value.file);
    });

    Object.keys(videoFileInfo).forEach((key) => {
      const { name, type, size } = videoFileInfo[key];
      formData.append(
        key,
        JSON.stringify({
          name,
          duration: videoFileInfo[key]?.duration,
          size,
          type,
        })
      );
    });

    Object.keys(inputValue).forEach((key) => {
      const value = inputValue[key];
      formData.append(key, value);
    });
    formData.append(
      "first_air_date",
      new Date().toLocaleDateString().replaceAll("/", "-")
    );

    formData.append("media_type", "movie");
    // Send the file to the server
    const response = await fetch("/api/admin/convert", {
      method: "POST",
      body: formData,
    }).then((e) => e.json());

    if (response.uploadDone) {
      console.log(response);
      router.replace(location.href + "?id=" + response.uid);
    }
    setUploadingState(false);
  }

  async function editMovieData(event) {
    const body = { ...inputValue };

    // Send the file to the server
    const response = await fetch(
      "/api/admin/movie/editMovieData?id=" + pending.uid,
      {
        method: "POST",
        body: JSON.stringify(body),
      }
    );

    if (response.ok) {
      const { data } = await response.json();
      console.log(data);
      alert("changes Saved");
      // router.replace(location.href + "?id=" + data.uid);
    }
  }

  function disablePublishButton() {
    return (
      publishedStatus.published ||
      progressData < 99 ||
      Object.keys(inputValue).some((e) => !inputValue[e])
    );
  }
  function disableUploadButton() {
    return !(
      videoFileInfo.video &&
      videoFileInfo.poster &&
      videoFileInfo.backdrop
    );
  }

  async function deletePendingVideo() {
    const id = pending.uid;

    const res = await fetch("/api/admin/movie/delete?id=" + id);

    if (res.ok) {
      console.log("Pending video deleted");
      router.replace("/admin");
    }
  }

  return (
    <>
      <Box sx={{ minHeight: 0, display: "flex", flexDirection: "row", gap: 2 }}>
        <Card sx={{ flex: 1, gap: 2 }}>
          <FormControl>
            <FormLabel>Title</FormLabel>
            <Input
              size="md"
              type="text"
              name="title"
              value={inputValue.title}
              onChange={(event) => updateInputValue(event)}
              placeholder="Title of the video"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Description</FormLabel>
            <Textarea
              type="text"
              value={inputValue.description}
              name="description"
              onChange={(event) => updateInputValue(event)}
              minRows="4"
              placeholder="Description of the video"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Genres</FormLabel>
            <Input
              type="text"
              value={inputValue.genres}
              name="genres"
              onChange={(event) => updateInputValue(event)}
              placeholder="Drama, Thriller, Mystery"
            />
          </FormControl>
        </Card>

        <Card
          sx={{
            width: "30vw",
            display: "flex",
            flexDirection: "column",
            p: 2,
            minHeight: 0,
            overflowY: "auto",
          }}
        >
          {["video", "poster", "backdrop"].map((item) => {
            return (
              <Box key={item}>
                <Typography>{`${item} file`.toUpperCase()}</Typography>
                {videoFileInfo[item] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <Card
                    size="sm"
                    orientation="horizontal"
                    variant="outlined"
                    sx={{
                      minHeight: 0,
                      my: 2,
                      bgcolor: "background.body",
                    }}
                  >
                    {videoFileInfo[item].thumbnailUrl && (
                      <CardOverflow sx={{ minHeight: 0 }}>
                        <AspectRatio ratio="1" sx={{ width: 130 }}>
                          {
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={videoFileInfo[item].thumbnailUrl}
                              alt="img"
                            />
                          }
                        </AspectRatio>
                      </CardOverflow>
                    )}

                    <CardContent sx={{ px: 2 }}>
                      <Typography fontWeight="md" mb={0.5}>
                        {[videoFileInfo[item].name]}
                      </Typography>
                      <Typography level="body2">
                        {videoFileInfo[item].duration
                          ? videoFileInfo[item].duration + ", "
                          : ""}
                        {videoFileInfo[item].size}
                      </Typography>
                      <Typography level="body2">
                        Type: {videoFileInfo[item].type}
                      </Typography>
                    </CardContent>
                    {/* <Divider /> */}
                    {/* <CardOverflow
        variant="soft"
        color="primary"
        sx={{
          px: 0.2,
          writingMode: 'vertical-rl',
          textAlign: 'center',
          fontSize: 'xs2',
          fontWeight: 'xl2',
          letterSpacing: '1px',
          textTransform: 'uppercase',
        }}
      >
        Ticket
      </CardOverflow> */}
                  </Card>
                ) : (
                  // <Card key={item}>
                  //   <img src={videoFileInfo[item].thumbnailUrl} alt="img" />
                  // </Card>
                  <FormControl sx={{ minHeight: 0 }} key={item}>
                    <FormLabel
                      sx={{
                        p: 2,
                        px: 4,
                        minHeight: 0,
                        borderRadius: "md",
                        border: "1px solid",
                        borderColor: "neutral.800",
                        backgroundColor: "neutral.900",
                        cursor: "pointer",
                        my: 2,
                        justifyContent: "center",
                      }}
                    >
                      <h2
                        style={{
                          opacity: 0.2,
                        }}
                      >
                        Select {item} file
                      </h2>
                    </FormLabel>
                    <Input
                      ref={(e) => (inputFileRef.current[item] = e)}
                      sx={{ display: "none" }}
                      name={item}
                      type="file"
                      onChange={(event) => inputFileHandler(event)}
                    />
                  </FormControl>
                )}
              </Box>
            );
          })}
        </Card>
      </Box>
      <Card
        sx={{
          // position: "absolute",
          mt: "auto",
          p: 2,
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
          borderTop: "1px solid",
          borderColor: "neutral.800",
        }}
      >
        {" "}
        {uploadingState && (
          <Typography
            // endDecorator={<Check color="success" />}
            level="h5"
            endDecorator={<CircularProgress />}
          >
            uploading
          </Typography>
        )}
        {pending && (
          <Box>
            {progressData && progressData === 100 ? (
              <Typography endDecorator={<Check color="success" />} level="h5">
                Conversion done
              </Typography>
            ) : progressData && progressData.error ? (
              <>
                <Typography endDecorator={<Check color="danger" />} level="h5">
                  Conversion failed
                </Typography>
              </>
            ) : (
              <>
                <Typography level="h5">
                  Converting video: {progressData + "%"}
                </Typography>
                <Box
                  sx={{
                    height: 3,
                    bgcolor: "primary.600",
                    transition: "width 1s ease-in-out",
                    width: (progressData ? progressData : 0) + "%",
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                  }}
                ></Box>
              </>
            )}
          </Box>
        )}
        <Box
          sx={{
            alignSelf: "flex-start",
            ml: "auto",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          {!pending || isNaN(progressData) ? (
            <Button
              disabled={uploadingState || disableUploadButton()}
              onClick={() => uploadDataAndFiles()}
              size="lg"
              startDecorator={<Upload />}
            >
              Upload
            </Button>
          ) : (
            <Button
              onClick={() => editMovieData()}
              size="lg"
              startDecorator={<Upload />}
            >
              Save
            </Button>
          )}
          {pending && (
            <Button
              color="danger"
              variant="outlined"
              onClick={() => deletePendingVideo()}
              size="lg"
              startDecorator={<Delete />}
            >
              Delete
            </Button>
          )}
          <Button
            disabled={disablePublishButton()}
            variant={disablePublishButton() ? "outlined" : "solid"}
            color={disablePublishButton() ? "neutral" : "primary"}
            onClick={publishVideo}
            size="lg"
            startDecorator={publishedStatus.published ? <Check /> : <Add />}
          >
            {publishedStatus.published ? "published" : "publish"}
          </Button>
        </Box>
      </Card>
    </>
  );
}

export default UploadPage;
