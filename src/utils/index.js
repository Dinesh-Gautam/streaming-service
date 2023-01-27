import { useRouter } from "next/router";

export function useViewRedirect() {
  const router = useRouter();
  return (item) => () => router.push(`/${item.media_type}/?id=` + item.id);
}
