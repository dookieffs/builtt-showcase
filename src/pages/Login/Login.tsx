import { useState } from "react";
import { withRedirectAuthenticated } from "../../components/RedirectAuthenticated";
import { useAuthContext } from "../../context/AuthContext";
import { LoginPayload } from "../../utils/types";
import style from "./Login.module.scss";

function Login() {
  const [loginPayload, setLoginPayload] = useState<LoginPayload>({
    username: "test@test.test",
    password: "password"
  });
  const { login, logout } = useAuthContext();

  const handleInput = (key: keyof LoginPayload, value: string) => {
    setLoginPayload({ ...loginPayload, [key]: value });
  };

  return (
    <>
      <div className={style.wrapper}>
        <div>Prijavi se na svoj nalog</div>
        <input
          defaultValue={loginPayload.username}
          type="text"
          placeholder="Upišite e-mail adresu"
          onChange={(event) => {
            handleInput("username", event?.target.value);
          }}
        />

        <input
          defaultValue={loginPayload.password}
          type="password"
          placeholder="Upišite šifru"
          onChange={(event) => {
            handleInput("password", event?.target.value);
          }}
        />

        <button
          onClick={() => {
            login(loginPayload);
          }}
        >
          Login
        </button>
      </div>
    </>
  );
}

export default withRedirectAuthenticated(Login, { redirectUrl: "/products" });
