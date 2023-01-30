import React from "react";
import Link from "next/link";
import { getPendingMovies } from "@/helpers/api/data/admin";
import { getPublishedMovies } from "@/helpers/api/data/movie";

function index({ pendingUploads, uploadedVideos }) {
  return (
    <div>
      <h1>Admin Page:</h1>
      {pendingUploads ? (
        <div>
          {pendingUploads && <h2>Pending Uploads</h2>}

          {pendingUploads.map((e) => (
            <div key={e.uid}>
              <Link href={"admin/upload?id=" + e.uid}>{e.title}</Link>
            </div>
          ))}
        </div>
      ) : (
        <h2>No pending uploads</h2>
      )}

      {uploadedVideos ? (
        <div>
          {uploadedVideos && <h2>uploaded Movies</h2>}

          {uploadedVideos.map((e) => (
            <div key={e.uid}>
              <Link href={"admin/upload?id=" + e.uid}>{e.title}</Link>
            </div>
          ))}
        </div>
      ) : (
        <h2>No movies published</h2>
      )}

      <div>
        <Link href="admin/upload">upload video</Link>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const data = getPendingMovies();
  const uploadedVideos = getPublishedMovies();
  return {
    props: {
      pendingUploads: data && data.length ? data : null,
      uploadedVideos,
    },
  };
}

export default index;
