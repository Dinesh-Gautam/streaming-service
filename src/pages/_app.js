import "../styles/globals.scss";
import "../components/videoPlayer/customStyle.scss";
import { SessionProvider } from "next-auth/react";
import { CssVarsProvider } from "@mui/joy";
import NextNProgress from "nextjs-progressbar";

export default function App({ Component, pageProps }) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page) => page);
  return (
    <SessionProvider session={pageProps.session}>
      {/* <CssVarsProvider defaultMode="dark"> */}
      <NextNProgress color="rgba(255,255,255,0.8)" />
      {getLayout(<Component {...pageProps} />)}
      {/* </CssVarsProvider> */}
    </SessionProvider>
  );
}
