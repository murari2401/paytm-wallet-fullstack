import { useState } from "react";
import axios from "axios";
import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/Inputbox";
import { SubHeading } from "../components/SubHeading";

export const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign up"} />
          <SubHeading label={"Enter your infromation to create an account"} />
          <InputBox //FirstNameInput
            onChange={(e) => {
              setFirstName(e.target.value);
            }}
            placeholder="First name"
            label={"First Name"}
            type={"text"}
          />
          <InputBox //LastNameInput
            onChange={(e) => {
              setLastName(e.target.value);
            }}
            placeholder="Last name"
            label={"Last Name"}
            type={"text"}
          />
          <InputBox //username input
            onChange={(e) => {
              setusername(e.target.value);
            }}
            placeholder="name@gmail.com"
            label={"Email"}
            type={"text"}
          />
          <InputBox //PasswordInput
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            placeholder=""
            label={"Password"}
            type={"password"}
          />
          <div className="pt-4">
            <Button
              onClick={async () => {
                const response = await axios.post("http://localhost:3000/api/v1/user/signup", {
                  username,
                  firstName,
                  lastName,
                  password,
                });
                localStorage.setItem("token", response.data.token);
              }}
              label={"Sign up"}
            />
          </div>
          <BottomWarning
            label={"Already have an account?"}
            buttonText={"Sign in"}
            to={"/signin"}
          />
        </div>
      </div>
    </div>
  );
};
