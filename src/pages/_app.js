import "../styles/globals.scss";
import "../components/videoPlayer/customStyle.scss";
import { SessionProvider } from "next-auth/react";
import { Poppins } from "@next/font/google";
import dynamic from "next/dynamic";
// import NextNProgress from "nextjs-progressbar";
const NextNProgress = dynamic(() => import("nextjs-progressbar"), {
  ssr: false,
});
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
        html,
        body {
          font-family: ${poppins.style.fontFamily};
        }
      `}</style>
      <SessionProvider session={pageProps.session}>
        <NextNProgress
          transformCSS={(css) => {
            return (
              <style>
                {css}
                {`#nprogress .bar  {
                  z-index : 10000000000;
                }`}
              </style>
            );
          }}
          showOnShallow={true}
          color="rgba(255,255,255,0.8)"
        />
        {getLayout(<Component {...pageProps} />)}
      </SessionProvider>
    </>
  );
}
