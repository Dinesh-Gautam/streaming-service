import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEventHandler, useState } from "react";
import { redirectIfUserIsAuthenticated } from "../../helpers/redirect";
import styles from "./auth.module.scss";
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
    <div className={styles.container}>
      <form className={styles.box} onSubmit={handleSubmit}>
        <h1>Login</h1>
        <div>
          <div>
            <label htmlFor="email">Email</label>
          </div>
          <input
            value={userInfo.email}
            id="email"
            onChange={({ target }) =>
              setUserInfo({ ...userInfo, email: target.value })
            }
            type="email"
            placeholder="john@email.com"
            required
          />
        </div>
        <div>
          <label htmlFor="pass">Password</label>
          <input
            id="pass"
            value={userInfo.password}
            onChange={({ target }) =>
              setUserInfo({ ...userInfo, password: target.value })
            }
            type="password"
            placeholder="********"
            required
          />
        </div>

        <input className={styles.submitButton} type="submit" value="Login" />
      </form>

      <div className={styles.box}>
        Don&apos;t have an account <Link href="/auth/signup">Sign Up.</Link>
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  return redirectIfUserIsAuthenticated({ context });
}

export default SignIn;
