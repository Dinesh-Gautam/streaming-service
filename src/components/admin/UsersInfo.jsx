import { Avatar, Box, Sheet, Typography } from "@mui/joy";
import React from "react";

export const UserHeader = ({ userData }) => {
  return (
    <Box sx={{ mb: 1, display: "flex", gap: 2, alignItems: "baseline" }}>
      <Typography>Total Users:</Typography>
      <Typography sx={{ opacity: 0.5 }}>{userData.length}</Typography>
    </Box>
  );
};

function UsersInfo({ userData, type }) {
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          p: 1,
          gap: 1,
          maxHeight: "80%",
          overflowY: "auto",
        }}
      >
        {!userData && <h1>Cannot get user Data</h1>}
        {userData && <UserHeader userData={userData} />}
        {userData &&
          userData.map((user) => {
            return (
              <Box
                key={user.id}
                sx={{
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                  backgroundColor: "background.body",
                  p: 1,
                  px: 2,
                  borderRadius: 12,
                }}
              >
                <Avatar size="sm" />
                <div>
                  <Typography
                    fontWeight="lg"
                    level="body3"
                    textColor="text.primary"
                  >
                    {user.name}
                  </Typography>
                  <Typography level="body3">{user.email}</Typography>
                </div>
              </Box>
            );
          })}
      </Box>
    </>
  );
}

export default UsersInfo;
