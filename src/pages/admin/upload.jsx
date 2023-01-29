import React from "react";

function upload() {
  async function inputFileHandler(event) {
    const file = event.target.files[0];

    // Create a new FormData object to send the file
    const formData = new FormData();
    formData.append("video", file);

    // Send the file to the server
    const response = await fetch("/api/admin/convert", {
      method: "POST",
      body: formData,
    });

    // Handle the response
    if (response.ok) {
      // Get the video URL from the response
      const videoUrl = await response.text();

      // Update the video player source
      //   const videoPlayer = document.getElementById("video-player");
      //   videoPlayer.src = videoUrl;

      console.log(videoUrl);
    } else {
      // Handle error
      console.error("An error occurred while uploading the video");
    }
  }

  return (
    <div>
      <input type="file" onChange={(event) => inputFileHandler(event)} />
    </div>
  );
}

export default upload;
