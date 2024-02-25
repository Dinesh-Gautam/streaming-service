import "../styles/globals.scss";
// import "../components/videoPlayer/customStyle.scss";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import { SessionProvider } from "next-auth/react";
import { Poppins } from "@next/font/google";
import NextNProgress from "nextjs-progressbar";
import { ExtensionProvider } from "../extension/manager";

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export default function App({ Component, pageProps }) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page) => page);
  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${poppins.style.fontFamily};
        }
      `}</style>
      <SessionProvider session={pageProps.session}>
        <ExtensionProvider>
          <NextNProgress color="rgba(255,255,255,0.8)" />
          {getLayout(<Component {...pageProps} />)}
        </ExtensionProvider>
      </SessionProvider>
    </>
  );
}
