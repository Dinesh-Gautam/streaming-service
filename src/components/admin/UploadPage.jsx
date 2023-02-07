import React, { useRef, useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  Box,
  Button,
  Card,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  TextField,
  Typography,
} from "@mui/joy";
import { Add, Check } from "@mui/icons-material";

function UploadPage({ pending }) {
  // const [inputTitle, setInputTitle] = useState(pending?.title || "");

  const [inputValue, setInputValue] = useState({
    title: "",
    description: "",
    genres: "",
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

  useEffect(() => {
    if (!progressInterval.current && pending && !pending.progress?.completed) {
      console.log("starting progress interval");
      if (pending?.progress?.percent) {
        setProgressData(percent);
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
    const file = event.target.files[0];
    // Create a new FormData object to send the file
    const formData = new FormData();
    formData.append("video", file);

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

  async function publishVideo(event) {
    if (pending.uid) {
      event.preventDefault();

      const publish = await fetch("/api/publish?id=" + pending.uid);

      if (publish.ok) {
        setPublishStatus({ published: true });
      }
    }
  }
  return (
    <Box p={2} sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
      <Box sx={{ flex: 1 }}>
        <FormControl>
          <FormLabel>Title</FormLabel>
          <Input
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
      </Box>
      {pending ? (
        // progressData > 99 &&
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
          {progressData && progressData === 100 ? (
            <Typography endDecorator={<Check color="success" />} level="h5">
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

          <Box>
            <Button
              disabled={publishedStatus.published || progressData < 99}
              variant={
                publishedStatus.published || progressData < 99
                  ? "outlined"
                  : "solid"
              }
              color={
                publishedStatus.published || progressData < 99
                  ? "neutral"
                  : "primary"
              }
              onClick={publishVideo}
              size="lg"
              startDecorator={publishedStatus.published ? <Check /> : <Add />}
            >
              {publishedStatus.published ? "published" : "publish"}
            </Button>
          </Box>
        </Card>
      ) : (
        <Box sx={{ width: "30vw", display: "flex", flexWrap: "wrap" }}>
          <FormControl>
            <FormLabel
              sx={{
                p: 6,
                borderRadius: "md",
                border: "1px solid",
                borderColor: "neutral.800",
                backgroundColor: "neutral.900",
                cursor: "pointer",
                m: 2,
              }}
            >
              Select video file
            </FormLabel>
            <Input
              sx={{ display: "none" }}
              type="file"
              onChange={(event) => inputFileHandler(event)}
            />
          </FormControl>
          <FormControl>
            <FormLabel
              sx={{
                p: 6,
                borderRadius: "md",
                border: "1px solid",
                borderColor: "neutral.800",
                backgroundColor: "neutral.900",
                cursor: "pointer",
                m: 2,
              }}
            >
              Select Poster file
            </FormLabel>
            <Input
              sx={{ display: "none" }}
              type="file"
              onChange={(event) => inputFileHandler(event)}
            />
          </FormControl>
          <FormControl>
            <FormLabel
              sx={{
                p: 6,
                borderRadius: "md",
                border: "1px solid",
                borderColor: "neutral.800",
                backgroundColor: "neutral.900",
                cursor: "pointer",
                m: 2,
              }}
            >
              Select Backdrop file
            </FormLabel>
            <Input
              sx={{ display: "none" }}
              type="file"
              onChange={(event) => inputFileHandler(event)}
            />
          </FormControl>
        </Box>
      )}
    </Box>
  );
}

export default UploadPage;
