import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  AspectRatio,
  Box,
  Button,
  Card,
  CardOverflow,
  FormControl,
  FormLabel,
  Input,
  Sheet,
  Textarea,
  Typography,
} from "@mui/joy";
import { Add, Check, Upload } from "@mui/icons-material";
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
  const progressInterval = useRef(null);
  const router = useRouter();
  const inputFileRef = useRef({});
  const [videoFileInfo, setVideoFileInfo] = useState({});

  useEffect(() => {
    if (!progressInterval.current && pending && !pending.progress?.completed) {
      console.log("starting progress interval");
      if (pending?.progress?.percent) {
        if (!isNaN(pending?.progress?.percent)) {
          setProgressData(Math.round(pending?.progress?.percent));
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
        setProgressData(Math.round(progressData.percent));
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
    if(elementName == "video"){
      videoInputHandler(file , elementName)
    }
    if(elementName == "poster"){
      posterInputHandler(file , elementName)
    }
    if(elementName == "backdrop"){
      posterInputHandler(file , elementName)
    }
  }
  useEffect(() => {
    console.log(inputFileRef.current)
  }, [inputFileRef])


  async function videoInputHandler(file , elementName) {
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
        file,
      },
    }));
  }

  async function posterInputHandler(file , elementName) {
    console.log(file)
    const name = file.name;
    const URL = window.URL || window.webkitURL;
    const photoUrl = URL.createObjectURL(file);
    setVideoFileInfo((prev) => ({
      ...prev,
      [elementName]: {
        name,
        size: formatFileSize(file.size),
        thumbnailUrl: photoUrl,
        file
      },
    }));
  }

  function formatFileSize(bytes,decimalPoint) {
    if(bytes == 0) return '0 Bytes';
    var k = 1000,
        dm = decimalPoint || 2,
        sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
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
    const formData = new FormData();
    console.log(videoFileInfo)
    Object.keys(videoFileInfo).forEach((key) => {
      const value = videoFileInfo[key]
      formData.append("data" , value.file)
    })

    Object.keys(inputValue).forEach((key) => {
      const value = inputValue[key];
      formData.append(key, value);
    });
   
  

    // Send the file to the server
    const response = await fetch("/api/admin/convert", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const { data } = await response.json();
      console.log(data);
      router.replace(location.href + "?id=" + data.uid);
    }
  }

  function disablePublishButton() {
    return (
      publishedStatus.published ||
      progressData < 99 ||
      Object.keys(inputValue).some((e) => !inputValue[e])
    );
  }

  return (
    <Box p={2} sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
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
      {
        // progressData > 99 &&
        <>
          <Card
            sx={{
              position: "absolute",
              bottom: 0,
              right: 0,
              p: 4,
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
              borderTop: "1px solid",
              borderColor: "neutral.800",
            }}
          >
            {pending && (
              <Box>
                {progressData && progressData === 100 ? (
                  <Typography
                    endDecorator={<Check color="success" />}
                    level="h5"
                  >
                    Conversion done
                  </Typography>
                ) : (
                  <>
                    <Typography level="h5">
                      Converting video: {progressData + "%"}
                    </Typography>
                    <Box
                      sx={{
                        height: 3,
                        bgcolor: "primary.600",
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
              <Button
                onClick={() => uploadDataAndFiles()}
                size="lg"
                startDecorator={<Upload />}
              >
                Upload
              </Button>
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

          <Card
            sx={{
              width: "30vw",
              display: "flex",
              flexDirection: "column",
              flexWrap: "wrap",
              mr: 2,
            }}
          >
            {["video", "poster", "backdrop"].map((item) => {

              return <Box key={item}>
            
                <Typography>{`${item} file`.toUpperCase()}</Typography>
             {  videoFileInfo[item] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <Card
                  orientation="horizontal"
                  variant="outlined"
                  sx={{ width: "100%", bgcolor: "background.body" }}
                >
                  <CardOverflow>
                    <AspectRatio ratio="1" sx={{ width: 130 }}>
                      {
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={videoFileInfo[item].thumbnailUrl} alt="img" />
                      }
                    </AspectRatio>
                  </CardOverflow>
                  <CardContent sx={{ px: 2 }}>
                    <Typography fontWeight="md" mb={0.5}>
                      {[videoFileInfo[item].name]}
                    </Typography>
                    <Typography level="body2">
                      {videoFileInfo[item].duration || videoFileInfo[item].size}
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
                <FormControl key={item}>
                  <FormLabel
                    sx={{
                      p: 4,
                      borderRadius: "md",
                      border: "1px solid",
                      borderColor: "neutral.800",
                      backgroundColor: "neutral.900",
                      cursor: "pointer",
                      m: 2,
                      width: "100%",
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
                    ref={(e) => inputFileRef.current[item] = e}
                    sx={{ display: "none" }}
                    name={item}
                    type="file"
                    onChange={(event) => inputFileHandler(event)}
                  />
                </FormControl>
              )}
            </Box>
            })}
          </Card>
        </>
      }
    </Box>
  );
}

export default UploadPage;
