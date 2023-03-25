import "../styles/globals.scss";
import "../components/videoPlayer/customStyle.scss";
import { SessionProvider } from "next-auth/react";
import { CssVarsProvider } from "@mui/joy";

export default function App({ Component, pageProps }) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page) => page);
  return (
    <SessionProvider session={pageProps.session}>
      {/* <CssVarsProvider defaultMode="dark"> */}
      {getLayout(<Component {...pageProps} />)}
      {/* </CssVarsProvider> */}
    </SessionProvider>
  );
}
