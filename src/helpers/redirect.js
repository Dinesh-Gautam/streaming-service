import { getSession } from "next-auth/react";

export async function redirectIfUserIsNotAuthenticated({
  context,
  path,
  props = {},
}) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: path || "/auth/signin",
        permanent: false,
      },
    };
  }
  return {
    props: { session, ...props },
  };
}

export async function redirectIfUserIsAuthenticated({
  context,
  props = {},
  path,
}) {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: path || "/",
        permanent: false,
      },
    };
  }
  return {
    props: { session, ...props },
  };
}
