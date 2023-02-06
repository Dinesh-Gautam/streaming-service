import "../styles/globals.scss";
import { SessionProvider } from "next-auth/react";
import { AnimateSharedLayout } from "framer-motion";
import { CssVarsProvider } from "@mui/joy";

export default function App({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <AnimateSharedLayout>
        <CssVarsProvider>
          <Component {...pageProps} />
        </CssVarsProvider>
      </AnimateSharedLayout>
    </SessionProvider>
  );
}
