import { Breadcrumbs, CssVarsProvider, Link } from "@mui/joy";
import { CssBaseline, Typography } from "@mui/material";
import { GlobalStyles, StyledEngineProvider } from "@mui/styled-engine";
import { Box } from "@mui/system";
import React from "react";
import FirstSidebar from "./FirstSidebar";
import Header from "./Header";
import SecondSidebar from "./SecondSidebar";
import customTheme from "../theme";
import useScript from "../useScript";
import { useRouter } from "next/router";

const useEnhancedEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

function Layout({ children, pageTitle, sideBarItems }) {
  const urlPath = useRouter();
  const status = useScript(`https://unpkg.com/feather-icons`);

  useEnhancedEffect(() => {
    // Feather icon setup: https://github.com/feathericons/feather#4-replace
    // @ts-ignore
    if (typeof feather !== "undefined") {
      // @ts-ignore
      feather.replace();
    }
  }, [status, urlPath.pathname]);
  return (
    <StyledEngineProvider injectFirst>
      <CssVarsProvider disableTransitionOnChange theme={customTheme}>
        <GlobalStyles
          styles={{
            "[data-feather], .feather": {
              color: "var(--Icon-color)",
              margin: "var(--Icon-margin)",
              fontSize: "var(--Icon-fontSize, 20px)",
              width: "1em",
              height: "1em",
            },
          }}
        />
        <CssBaseline />
        <Box sx={{ display: "flex", minHeight: "100dvh" }}>
          <Header />
          <FirstSidebar />
          <SecondSidebar title={pageTitle} sideBarItems={sideBarItems} />
          <CssBaseline />
          <Box
            component="main"
            className="MainContent"
            sx={(theme) => ({
              px: {
                xs: 2,
                md: 6,
              },
              pt: {
                xs: `calc(${theme.spacing(2)} + var(--Header-height))`,
                sm: `calc(${theme.spacing(2)} + var(--Header-height))`,
                md: 3,
              },
              pb: {
                xs: 2,
                sm: 2,
                md: 3,
              },
              flex: 1,
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
              height: "100dvh",
              gap: 1,
            })}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Breadcrumbs
                size="sm"
                aria-label="breadcrumbs"
                separator={<i data-feather="chevron-right" />}
                sx={{
                  "--Breadcrumbs-gap": "1rem",
                  "--Icon-fontSize": "16px",
                  fontWeight: "lg",
                  color: "neutral.400",
                  px: 0,
                }}
              >
                {urlPath &&
                  urlPath.pathname
                    .split("/")
                    .filter((e) => e)
                    .map((e, i, arr) => {
                      if (e == "admin") {
                        return (
                          <Link
                            key={i}
                            underline="none"
                            color="neutral"
                            fontSize="inherit"
                            href={"/" + e}
                            aria-label="Home"
                          >
                            <i data-feather="home" />
                          </Link>
                        );
                      }
                      if (i == arr.length - 1) {
                        return (
                          <Typography
                            key={i}
                            fontSize="inherit"
                            variant="soft"
                            color="primary"
                          >
                            {e}
                          </Typography>
                        );
                      }
                      return (
                        <Link
                          key={i}
                          underline="hover"
                          color="neutral"
                          fontSize="inherit"
                          href={arr.splice(0, i).join("/")}
                        >
                          {e}
                        </Link>
                      );
                    })}
              </Breadcrumbs>
              {/* <ColorSchemeToggle
          sx={{ ml: "auto", display: { xs: "none", md: "inline-flex" } }}
        /> */}
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                my: 1,
                gap: 1,
                flexWrap: "wrap",
                "& > *": {
                  minWidth: "clamp(0px, (500px - 100%) * 999, 100%)",
                  flexGrow: 1,
                },
              }}
            >
              <Typography level="h1" fontSize="xl4">
                {pageTitle}
              </Typography>
              {/* <Box sx={{ flex: 999 }} /> */}
              {/* <Box sx={{ display: "flex", gap: 1, "& > *": { flexGrow: 1 } }}>
              <Button
                variant="outlined"
                color="neutral"
                startDecorator={<i data-feather="download-cloud" />}
              >
                Download PDF
              </Button>
              <Button
                variant="outlined"
                color="neutral"
                startDecorator={<i data-feather="table" />}
              >
                Download CSV
              </Button>
            </Box> */}
            </Box>
            {children}
            {/* <OrderTable /> */}
          </Box>
          {/* <Box
          component="main"
          className="MainContent"
          sx={(theme) => ({
            px: {
              xs: 2,
              md: 6,
            },
            pt: {
              xs: `calc(${theme.spacing(2)} + var(--Header-height))`,
              sm: `calc(${theme.spacing(2)} + var(--Header-height))`,
              md: 3,
            },
            pb: {
              xs: 2,
              sm: 2,
              md: 3,
            },
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            height: "100dvh",
            gap: 1,
          })}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Breadcrumbs
              size="sm"
              aria-label="breadcrumbs"
              separator={<i data-feather="chevron-right" />}
              sx={{
                "--Breadcrumbs-gap": "1rem",
                "--Icon-fontSize": "16px",
                fontWeight: "lg",
                color: "neutral.400",
                px: 0,
              }}
            >
              <Link
                underline="none"
                color="neutral"
                fontSize="inherit"
                href="#some-link"
                aria-label="Home"
              >
                <i data-feather="home" />
              </Link>
              <Link
                underline="hover"
                color="neutral"
                fontSize="inherit"
                href="#some-link"
              >
                Dashboard
              </Link>
              <Typography fontSize="inherit" variant="soft" color="primary">
                Orders
              </Typography>
            </Breadcrumbs>
            <ColorSchemeToggle
              sx={{ ml: "auto", display: { xs: "none", md: "inline-flex" } }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              my: 1,
              gap: 1,
              flexWrap: "wrap",
              "& > *": {
                minWidth: "clamp(0px, (500px - 100%) * 999, 100%)",
                flexGrow: 1,
              },
            }}
          >
            <Typography level="h1" fontSize="xl4">
              Orders
            </Typography>
            {/* <Box sx={{ flex: 999 }} /> */}
          {/* <Box sx={{ display: "flex", gap: 1, "& > *": { flexGrow: 1 } }}>
          <Button
            variant="outlined"
            color="neutral"
            startDecorator={<i data-feather="download-cloud" />}
          >
            Download PDF
          </Button>
          <Button
            variant="outlined"
            color="neutral"
            startDecorator={<i data-feather="table" />}
          >
            Download CSV
          </Button>
        </Box> */}
          {/* </Box> */}
          {/* <OrderTable /> */}
          {/* </Box> */}
        </Box>
      </CssVarsProvider>
    </StyledEngineProvider>
  );
}

export default Layout;
