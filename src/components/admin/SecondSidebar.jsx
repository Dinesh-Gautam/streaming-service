import * as React from "react";
import Box from "@mui/joy/Box";
import List from "@mui/joy/List";
import ListSubheader from "@mui/joy/ListSubheader";
import ListItem from "@mui/joy/ListItem";
import ListItemContent from "@mui/joy/ListItemContent";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import ListItemButton from "@mui/joy/ListItemButton";
import IconButton from "@mui/joy/IconButton";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import { closeSidebar } from "./utils";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function SecondSidebar({ sideBarItems, title }) {
  const session = useSession();
  const [userData, setUserData] = React.useState(null);
  const url = useRouter();
  useEffect(() => {
    if (session.data) {
      setUserData(session.data);
    }
  }, [session.data]);

  return (
    <React.Fragment>
      <Box
        className="SecondSidebar-overlay"
        sx={{
          position: "fixed",
          zIndex: 9998,
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          bgcolor: "background.body",
          opacity: "calc(var(--SideNavigation-slideIn, 0) - 0.2)",
          transition: "opacity 0.4s",
          transform: {
            xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--FirstSidebar-width, 0px)))",
            lg: "translateX(-100%)",
          },
        }}
        onClick={() => closeSidebar()}
      />
      <Sheet
        className="SecondSidebar"
        sx={{
          position: {
            xs: "fixed",
            lg: "sticky",
          },
          transform: {
            xs: "translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--FirstSidebar-width, 0px)))",
            lg: "none",
          },
          borderRight: "1px solid",
          borderColor: "divider",
          transition: "transform 0.4s",
          zIndex: 9999,
          height: "100dvh",
          top: 0,
          p: 2,
          py: 3,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <List
          sx={{
            "--List-item-radius": "8px",
            "--List-item-minHeight": "32px",
            "--List-gap": "4px",
          }}
        >
          <ListSubheader role="presentation" sx={{ color: "text.primary" }}>
            {title}
          </ListSubheader>

          {sideBarItems &&
            sideBarItems.map(({ icon, value, href }, index) => {
              const selected = url.pathname === href;

              return (
                <Link key={index} href={href || "#"}>
                  <ListItem>
                    <ListItemButton
                      variant={selected ? "solid" : "plain"}
                      color="neutral"
                      selected={selected}
                      onClick={() => closeSidebar()}
                    >
                      <ListItemDecorator>
                        <i data-feather={icon} />
                      </ListItemDecorator>
                      <ListItemContent>{value}</ListItemContent>
                    </ListItemButton>
                  </ListItem>
                </Link>
              );
            })}
        </List>
        <Box
          sx={{
            pl: 1,
            mt: "auto",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <div>
            <Typography fontWeight="lg" level="body2">
              {userData?.user?.name || "Loading"}
            </Typography>
            <Typography level="body2">
              {userData?.user?.email || "Loading"}
            </Typography>
          </div>
          <IconButton
            onClick={() => signOut()}
            variant="plain"
            sx={{ ml: "auto" }}
          >
            <i data-feather="log-out" />
          </IconButton>
        </Box>
      </Sheet>
    </React.Fragment>
  );
}
