import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEventHandler, useState } from "react";
import { redirectIfUserIsAuthenticated } from "../../helpers/redirect";

const SignIn = (props) => {
  const [userInfo, setUserInfo] = useState({ email: "", password: "" });

  const router = useRouter();
  const handleSubmit = async (e) => {
    // validate your userinfo
    e.preventDefault();

    const res = await signIn("credentials", {
      email: userInfo.email,
      password: userInfo.password,
      redirect: false,
    });

    router.push("/home");
    console.log(res);
  };
  return (
    <div className="sign-in-form">
      <form onSubmit={handleSubmit}>
        <h1>Login</h1>
        <input
          value={userInfo.email}
          onChange={({ target }) =>
            setUserInfo({ ...userInfo, email: target.value })
          }
          type="text"
          placeholder="john@email.com"
        />
        <input
          value={userInfo.password}
          onChange={({ target }) =>
            setUserInfo({ ...userInfo, password: target.value })
          }
          type="password"
          placeholder="********"
        />
        <input type="submit" value="Login" />
      </form>

      <div>
        Don&apos;t have an account <Link href="/auth/signup">Sign Up.</Link>
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  return redirectIfUserIsAuthenticated({ context });
}

export default SignIn;
