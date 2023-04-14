import { Box, Card } from "@mui/joy";
import { CardContent } from "@mui/material";
import Link from "next/link";
import * as React from "react";
const urls = [
  {
    icon: "film",
    text: "View Movies",
    href: "/admin/movies",
  },
  {
    icon: "user",
    text: "View users",
    href: "/admin/users",
  },
];

export default function App() {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 2,
        width: "100%",
      }}
    >
      {urls.map((e, i) => {
        return (
          <Link key={i} href={e.href}>
            <Card
              boxShadow="md"
              sx={{
                width: 200,
                maxWidth: 200,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                svg: {
                  transition: "transform 0.2s ease-in-out",
                },
                "&:hover svg": {
                  transform: "scale(1.5)",
                },
              }}
            >
              <CardContent>
                <i data-feather={e.icon} />
              </CardContent>
              {e.text}
            </Card>
          </Link>
        );
      })}
    </Box>
  );
}
