import { useRouter } from "next/router";

export function useViewRedirect() {
  const router = useRouter();
  // return (item) => () => router.push(`/${item.media_type}/?id=` + item.id);
  return (item) => () =>
    router.push(`/title/?id=` + item.id + "&type=" + item.media_type);
}

export function formatParagraph(para, wordsLimit = 40) {
  const paraArr = para.split(" ");
  if (paraArr.length > wordsLimit) paraArr.length = wordsLimit;
  else return para;
  return paraArr.join(" ") + "...";
}
