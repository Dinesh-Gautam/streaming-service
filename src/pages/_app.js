import "../styles/globals.scss";
import "../components/videoPlayer/customStyle.scss";
import { SessionProvider } from "next-auth/react";
import { AnimateSharedLayout } from "framer-motion";
import { CssVarsProvider } from "@mui/joy";

export default function App({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <AnimateSharedLayout>
        <CssVarsProvider defaultMode="dark">
          <Component {...pageProps} />
        </CssVarsProvider>
      </AnimateSharedLayout>
    </SessionProvider>
  );
}
