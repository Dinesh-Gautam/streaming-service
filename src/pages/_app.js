import "../styles/globals.scss";
import { SessionProvider } from "next-auth/react";
import { AnimateSharedLayout } from "framer-motion";

export default function App({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <AnimateSharedLayout>
        <Component {...pageProps} />
      </AnimateSharedLayout>
    </SessionProvider>
  );
}
