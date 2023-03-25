import React from "react";
import Link from "next/link";
import { getPendingMovies } from "@/helpers/api/data/admin";
import { getPublishedMovies } from "@/helpers/api/data/movie";
import {
  Box,
  Button,
  Card,
  Sheet,
  StyledEngineProvider,
  Typography,
} from "@mui/joy";
import { Add } from "@mui/icons-material";
import SideBar from "./sidebar/SideBar";
import App from "./AdminApp";
import Layout from "./components/Layout";
function adminPage({ pendingUploads, uploadedVideos }) {
  return <App />;
  return (
    <>
      <SideBar />
      <Box>
        <Box sx={{ m: 2 }}>
          <Typography level="h3">Admin</Typography>
        </Box>
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
                <Link key={e.uid} href={"admin/upload?id=" + e.uid}>
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
                <Link href={"admin/upload?id=" + e.uid} key={e.uid}>
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
                No movies published
              </Typography>
            </Sheet>
          )}

          <div>
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                p: 4,
              }}
            >
              <Link href="admin/upload">
                <Button size="lg" startDecorator={<Add />}>
                  Upload
                </Button>
              </Link>
            </Box>
          </div>
        </Box>
      </Box>
    </>
  );
}

adminPage.getLayout = function getLayout(page) {
  return <Layout pageTitle="Admin">{page}</Layout>;
};
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

export default adminPage;
