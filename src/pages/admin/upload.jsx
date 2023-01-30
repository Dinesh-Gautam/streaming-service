import React, { useRef, useState } from "react";

function upload() {
const [inputTitle, setInputTitle] = useState("")
const [progressData, setProgressData] = useState();
const progressInterval = useRef(null);
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

    // Handle the response
    if (response.ok) {
      // get progress
      if(!progressInterval.current){
        progressInterval.current = setInterval(() => {
          const progressData = fetch('/api/progress?title=' + inputTitle)
          setProgressData(progressData.percent)
          console.log(progressData)
        } , 1000)
      }
    } else {
      // Handle error
      console.error("An error occurred while uploading the video");
    }

    // const xhr = new XMLHttpRequest();
    // xhr.upload.addEventListener("progress", (event) => {
    //   if (event.lengthComputable) {
    //     // Update the progress bar
    //     const percentComplete = event.loaded / event.total;
    //     console.log(percentComplete);
    //   }
    // });
  }

function inputTitleHandler(event) {
  setInputTitle(event.target.value)
}

  return (
    <div>
      <input type="text" value={inputTitle} onChange={(event) => inputTitleHandler(event)} placeholder="title of the video" />
      <input type="file" onChange={(event) => inputFileHandler(event)} />
      <div>
        {
          progressData && 
            <span>
              {progressData + "%"} 
            </span>
          
        }
       
      </div>
    </div>

  );
}

export default upload;
