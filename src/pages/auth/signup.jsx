import React, { useState } from "react";
import { useRouter } from "next/router";
import { redirectIfUserIsAuthenticated } from "../../helpers/redirect";
import styles from "./auth.module.scss";
import { Info } from "@mui/icons-material";
function signup() {}
const SignupPage = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState(null);
  const router = useRouter();

  async function signup({ username, password }) {
    const data = await fetch("/api/user/add", {
      method: "POST",
      body: JSON.stringify({
        username,
        password,
        name,
      }),
    }).then((e) => e.json());

    if (data.success) {
      alert(data.message);
    } else {
      setError(data.errMessage);
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (confirmPassword !== password) {
      setError("Passwords don't match!");
      return;
    }
    try {
      await signup({ username, password });
      router.push("/auth/signin");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.box} onSubmit={handleSubmit}>
        <h1>Sign Up</h1>
        {error && (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Info color="error" />
            <span>{error}</span>
          </div>
        )}
        <div>
          <label htmlFor="name">Name:</label>
          <input
            id="name"
            type="text"
            placeholder="John Doe"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            placeholder="john@email.com"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="pass">Password:</label>
          <input
            id="pass"
            type="password"
            value={password}
            required
            placeholder="****"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="ConPass">Confirm Password:</label>
          <input
            id="ConPass"
            type="password"
            value={confirmPassword}
            required
            placeholder="****"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <input className={styles.submitButton} type="submit" value="Sign Up" />
      </form>
    </div>
  );
};
export async function getServerSideProps(context) {
  return redirectIfUserIsAuthenticated({ context });
}

export default SignupPage;
