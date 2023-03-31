import { useRouter } from "next/router";

import React, { useState } from "react";
import Link from "next/link";
export function useViewRedirect() {
  const router = useRouter();
  // return (item) => () => router.push(`/${item.media_type}/?id=` + item.id);
  return (item) => () =>
    router.push(`/title/?id=` + item.id + "&type=" + item.media_type);
}

export function checkIfStringIsValidUrl(string) {
  const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
  const isUrl = urlRegex.test(string);
  if (isUrl) {
    return (
      <Link target="_blank" href={string}>
        {string}
      </Link>
    );
  } else {
    return string;
  }
}

export function FormatParagraph({ hideShowClickHere, para, wordsLimit = 40 }) {
  const [paraClicked, setParaClicked] = useState(false);

  const paraArr = para.split(" ");
  if (paraArr.length > wordsLimit) paraArr.length = wordsLimit;
  else return <p>{para}</p>;
  return (
    <p onClick={() => !hideShowClickHere && setParaClicked((prev) => !prev)}>
      {paraClicked ? (
        para
      ) : (
        <>
          {paraArr.join(" ") + "... "}
          {!hideShowClickHere && (
            <span style={{ opacity: 0.5 }}>click to read more.</span>
          )}
        </>
      )}
    </p>
  );
}
