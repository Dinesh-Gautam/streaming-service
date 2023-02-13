import "../styles/globals.scss";
import "../components/videoPlayer/customStyle.scss";
import { SessionProvider } from "next-auth/react";
import { CssVarsProvider } from "@mui/joy";

export default function App({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <CssVarsProvider defaultMode="dark">
        <Component {...pageProps} />
      </CssVarsProvider>
    </SessionProvider>
  );
}
