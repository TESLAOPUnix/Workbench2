import * as Form from "@radix-ui/react-form";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import InputComponent from "../../components/inputComponent";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { CONTROL_LOGIN_STATE } from "../../constants/constants";
import { alertContext } from "../../contexts/alertContext";
import { AuthContext } from "../../contexts/authContext";
import { getLoggedUser, onLogin } from "../../controllers/API";
import { LoginType } from "../../types/api";
import {
  inputHandlerEventType,
  loginInputStateType,
} from "../../types/components";
import logo from "../../assets/fintricitylogo.png";

export default function LoginPage(): JSX.Element {
  const [inputState, setInputState] =
    useState<loginInputStateType>(CONTROL_LOGIN_STATE);

  const { password, username } = inputState;
  const { login, getAuthentication, setUserData, setIsAdmin } =
    useContext(AuthContext);
  const navigate = useNavigate();
  const { setErrorData } = useContext(alertContext);

  function handleInput({
    target: { name, value },
  }: inputHandlerEventType): void {
    setInputState((prev) => ({ ...prev, [name]: value }));
  }

  function signIn() {
    const user: LoginType = {
      username: username.trim(),
      password: password.trim(),
    };
    onLogin(user)
      .then((user) => {
        login(user.access_token, user.refresh_token);
        getUser();
        navigate("/");
      })
      .catch((error) => {
        setErrorData({
          title: "Error signing in",
          list: [error["response"]["data"]["detail"]],
        });
      });
  }

  function getUser() {
    if (getAuthentication()) {
      setTimeout(() => {
        getLoggedUser()
          .then((user) => {
            const isSuperUser = user!.is_superuser;
            setIsAdmin(isSuperUser);
            setUserData(user);
          })
          .catch((error) => {
            console.log("login page", error);
          });
      }, 500);
    }
  }

  return (
    <Form.Root
      onSubmit={(event) => {
        if (password === "") {
          event.preventDefault();
          return;
        }
        signIn();
        const data = Object.fromEntries(new FormData(event.currentTarget));
        event.preventDefault();
      }}
      className="h-full w-full"
    >
      <div className="flex h-full w-full flex-col items-center justify-center bg-muted">
        <div className="flex w-72 flex-col items-center justify-center gap-2">
          <span className="mb-4 text-5xl"><img src={ logo } /></span>
          <span className="mb-6 text-2xl font-semibold text-primary">
            Sign in to KENDRALABS WORKBENCH
          </span>
          <div className="mb-3 w-full">
            <Form.Field name="username">
              <Form.Label className="data-[invalid]:label-invalid">
                Username <span className="font-medium text-destructive">*</span>
              </Form.Label>

              <Form.Control asChild>
                <Input
                  type="username"
                  onChange={({ target: { value } }) => {
                    handleInput({ target: { name: "username", value } });
                  }}
                  value={username}
                  className="w-full"
                  required
                  placeholder="Username"
                />
              </Form.Control>

              <Form.Message match="valueMissing" className="field-invalid">
                Please enter your username
              </Form.Message>
            </Form.Field>
          </div>
          <div className="mb-3 w-full">
            <Form.Field name="password">
              <Form.Label className="data-[invalid]:label-invalid">
                Password <span className="font-medium text-destructive">*</span>
              </Form.Label>

              <InputComponent
                onChange={(value) => {
                  handleInput({ target: { name: "password", value } });
                }}
                value={password}
                isForm
                password={true}
                required
                placeholder="Password"
                className="w-full"
              />

              <Form.Message className="field-invalid" match="valueMissing">
                Please enter your password
              </Form.Message>
            </Form.Field>
          </div>
          <div className="w-full">
            <Form.Submit asChild>
              <Button className="mr-3 mt-6 w-full" type="submit">
                Sign in
              </Button>
            </Form.Submit>
          </div>
          <div className="w-full">
            <Link to="/signup">
              <Button className="w-full" variant="outline" type="button">
                Don't have an account?&nbsp;<b>Sign Up</b>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Form.Root>
  );
}
