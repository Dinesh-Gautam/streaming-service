import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { getPendingMovies } from "@/helpers/api/data/admin";
import { useRouter } from "next/router";
function Upload({ pending }) {
  console.log(pending);
  const [inputTitle, setInputTitle] = useState(pending?.title || "");
  const [progressData, setProgressData] = useState(
    pending?.progress?.completed ? 100 : null
  );
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

  async function inputFileHandler(event) {
    const file = event.target.files[0];

    // Create a new FormData object to send the file
    const formData = new FormData();
    formData.append("video", file);

    // Send the file to the server
    const response = await fetch("/api/admin/convert?title=" + inputTitle, {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const { data } = await response.json();
      console.log(data);
      router.replace(location.href + "?id=" + data.uid);
    }
    // const uid = response.data.uid;

    // Handle the response

    // get progress

    // startProgressInterval(uid);

    // const xhr = new XMLHttpRequest();
    // xhr.upload.addEventListener("progress", (event) => {
    //   if (event.lengthComputable) {
    //     // Update the progress bar
    //     const percentComplete = event.loaded / event.total;
    //     console.log(percentComplete);
    //   }
    // });
  }

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

  async function publishVideo(event) {
    if (pending.uid) {
      event.preventDefault();

      const publish = await fetch("/api/publish?id=" + pending.uid);
    }
  }

  function inputTitleHandler(event) {
    setInputTitle(event.target.value);
  }
  // console.log(pending);
  return (
    <div>
      <input
        type="text"
        value={inputTitle}
        onChange={(event) => inputTitleHandler(event)}
        placeholder="title of the video"
      />
      {pending ? (
        progressData > 99 && <button onClick={publishVideo}>publish</button>
      ) : (
        <input type="file" onChange={(event) => inputFileHandler(event)} />
      )}
      <div>
        {progressData && <span>converting Video: {progressData + "%"}</span>}
      </div>
    </div>
  );
}

export function getServerSideProps(context) {
  const { id } = context.query;

  if (!id) {
    return {
      props: {},
    };
  }

  const pending = getPendingMovies(id);
  return {
    props: pending
      ? {
          pending,
        }
      : {},
  };
}

export default Upload;
