import { TextField } from "@mui/material";
import { useForm, SubmitHandler } from "react-hook-form";
import styled from "styled-components";
import { RootState, useAppDispatch } from "../../redux";
import { changeLoginState, changeRegState } from "../../redux/modalSlice";
import { ErrorAlert } from "./RegistrationForm";
import { fetchUser } from "../../redux/usersSlice";
import { useSelector } from "react-redux";

interface IFormInput {
  password: string;
  nickname: string;
}

const LoginForm = () => {
  
  const { register, handleSubmit,formState:{errors} } = useForm<IFormInput>();
const loginStatus=useSelector((root:RootState)=>root.userReducer.fetchUserStatus)

  const dispatch = useAppDispatch();

  const onSubmit: SubmitHandler<IFormInput> = async(data) => {
    await dispatch(fetchUser({nickname:data.nickname,password:data.password}))
    if(loginStatus){
      dispatch(changeLoginState())
    }
  };

  const switchToRegistration = () => {
    dispatch(changeLoginState());
    dispatch(changeRegState());
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormContainer>
        <h3>Login</h3>
        <TextField
          {...register("nickname", {
            required: { value: true, message: "nickname is required" },
            maxLength: { value: 10, message: "max length is 10" },
            minLength: { value: 3, message: "min length is 3" },
          })}
          size="small"
          label="Nickname"
          color="secondary"
          variant="filled"
        ></TextField>
        {errors.nickname?.type === "required" && (
          <ErrorAlert role="alert">Nickname is required</ErrorAlert>
        )}
        {errors.nickname?.type === "maxLength" && (
          <ErrorAlert role="alert">Max length is 10</ErrorAlert>
        )}
        {errors.nickname?.type === "minLength" && (
          <ErrorAlert role="alert">Min length is 3</ErrorAlert>
        )}
        
        <TextField
          type="password"
          {...register("password", {
            required: true,
          })}
          size="small"
          label="Password"
          color="secondary"
          variant="filled"
        ></TextField>

          {errors.password?.type === "required" && (
          <ErrorAlert role="alert">Password is required</ErrorAlert>
        )}

        <FormButtons>
          <LoginButton type="submit">Welcome back</LoginButton>
          <RegButton onClick={switchToRegistration}>Sign Up</RegButton>
        </FormButtons>
      </FormContainer>
    </form>
  );
};

const FormContainer = styled.div`
  width: 100%;
  padding: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  row-gap: 20px;
`;

const FormButtons = styled.div`
  width: 100%;
  display: flex;
  column-gap: 20px;
`;

const LoginButton = styled.button`
  font-weight: 700;
  font-size: 14px;
  font-family: montserrat;
  text-transform: uppercase;
  color: #fff;
  padding: 5px 15px;
  border-radius: 4px;
  background-size: 100%;
  background-color: #df1818;
  height: 40px;

  border: 0;
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #282828;
    transform: scale(1.05);
  }
`;

const RegButton = styled.button`
  border: 0;
  padding: 5px 15px;
  border-radius: 3px;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #c3c3c3;
    transform: scale(1.05);
    cursor: pointer;
  }
`;

export default LoginForm;
