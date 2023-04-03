import { Add } from "@mui/icons-material";
import { Box, Button, Card, Sheet, Typography } from "@mui/joy";
import Link from "next/link";
import React from "react";
import { getPendingMovies } from "../../../helpers/api/data/admin";
import { getPublishedMovies } from "../../../helpers/api/data/movie";
import Layout from "../../../components/admin/Layout";

function MoviePage({ pendingUploads, uploadedVideos }) {
  return (
    <>
      <Box>
        {/* <Box sx={{ m: 2 }}>
          <Typography level="h3">Admin</Typography>
        </Box> */}
        <Box sx={{ display: "flex", width: "100%", gap: 2, m: 2 }}>
          {pendingUploads ? (
            <Sheet
              variant="outlined"
              sx={{
                borderRadius: "md",
                p: 2,
                flex: 1,
              }}
            >
              {pendingUploads && (
                <Typography level="h4" fontWeight="bold">
                  Pending Uploads
                </Typography>
              )}

              {pendingUploads.map((e) => (
                <Link key={e.uid} href={"/admin/movies/upload?id=" + e.uid}>
                  <Card variant="soft" sx={{ p: 2, mt: 2 }}>
                    {e.title}
                  </Card>
                </Link>
              ))}
            </Sheet>
          ) : (
            <Sheet
              variant="outlined"
              sx={{
                borderRadius: "md",
                p: 4,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
              }}
            >
              <Typography
                level="h4"
                fontWeight={"bold"}
                style={{ opacity: 0.5 }}
              >
                No pending uploads
              </Typography>
            </Sheet>
          )}

          {uploadedVideos ? (
            <Sheet
              variant="outlined"
              sx={{
                borderRadius: "md",
                p: 2,
                flex: 1,
                gap: 2,
              }}
            >
              {uploadedVideos && (
                <Typography level="h4" fontWeight="bold">
                  Uploaded Movies
                </Typography>
              )}

              {uploadedVideos.map((e) => (
                <Card key={e.id} variant="soft" sx={{ p: 2, mt: 2 }}>
                  {e.title}
                </Card>
              ))}
            </Sheet>
          ) : (
            <Sheet
              variant="outlined"
              sx={{
                borderRadius: "md",
                p: 4,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
              }}
            >
              <Typography
                level="h4"
                fontWeight={"bold"}
                style={{ opacity: 0.5 }}
              >
                No movies published
              </Typography>
            </Sheet>
          )}

          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              right: 0,
              p: 4,
            }}
          >
            <Link href="/admin/movies/upload">
              <Button size="lg" startDecorator={<Add />}>
                Upload
              </Button>
            </Link>
          </Box>
        </Box>
      </Box>
    </>
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
export const moviesPageSideBarItems = [
  {
    icon: "activity",
    value: "Overview",
    href: "/admin/movies",
  },
  {
    icon: "upload",
    value: "Upload",
    href: "/admin/movies/upload",
  },
  // {
  //   icon: "check-square",
  //   value: "Published",
  //   href: "/admin/uploaded",
  // },
];

MoviePage.getLayout = function getLayout(page) {
  return (
    <Layout sideBarItems={moviesPageSideBarItems} pageTitle="Movies">
      {page}
    </Layout>
  );
};

export default MoviePage;
