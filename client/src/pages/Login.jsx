import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form"; // userform is a custom hook to manage form state and validation. a hook is a special function in react that lets you use state and other react features without writing a class. state is a way to store and manage data in a component.
import { useNavigate } from "react-router-dom";
import TextBox from "../components/Textbox.jsx";
import Button from "../components/Button.jsx";
import { useSelector, useDispatch } from "react-redux"; // useSelector allows for extracting data from redux store state. usedispatch used to dispatch actions to the redux store
import { setCredentials, logout } from "../redux/slices/authSlice.js"; //importing the setCredentials action from the auth slice of the redux store


const fakeUser = {
  email: "user@example.com",
  password: "Password123!",
  name: "Zunairah Khan",
};

const Login = () => {
  const user = useSelector((state) => state.auth.user); // accessing the user state from the auth slice of the redux store using useSelector hook. useSelector is a hook that allows us to extract data from the redux store state.
  const dispatch = useDispatch();
  const [loginError, setLoginError] = useState("");
  
  const {
    register,
    handleSubmit, 
    formState: { errors },
  } = useForm(); // destructuring the useForm hook to get register, handleSubmit and errors. register is used to register input fields, handleSubmit is used to handle form submission and errors is used to display validation errors.

  const navigate = useNavigate();// Placeholder for navigation function

  //when we pass handlesubmit to the form's onsubmit, it will first validate the form and then call the submitHandler function if the form is valid. the submitHandler function will receive the form data as an argument and we can use that data to perform any action we want, like sending it to the server or updating the state.
  const submitHandler = async (data) => {
    const { email, password } = data;

    if (email === fakeUser.email && password === fakeUser.password) {
      dispatch(
        setCredentials({
          email: fakeUser.email,
          name: fakeUser.name,
        }),
      );
      setLoginError("");
      navigate("/executive-dashboard");
      return;
    }

    setLoginError("Invalid email or password. Use user@example.com / Password123!");
  };
 
  useEffect(() => {
    if (user) {
      navigate("/executive-dashboard");
    }
  }, [user, navigate]); //dependency array to re-run the effect when user changes

  useEffect(() => {
    dispatch(logout());
  }, [dispatch]); // logout when visiting login page



  return <div className="w-full min-h-screen flex items-center justify-center flex-col lg:flex-row bg-[#f3f4f6]"> {/*main container*/}
    <div className="w-full md:w-auto flex gap-0 md:gap-40 flex-col md:flex-row items-center justify-center"> {/*inner container*/}

      {/*LHS OF SCREEN FOR BRANDING*/}
      <div className="h-full w-full lg:w-2/3 flex flex-col items-center justify-center">
        <div className="w-full md:max-w-lg 2xl:max-w-3xl flex flex-col items-center justify-center gap-5 md:gap-y-10 2xl:-mt-20 mt-4"> 
          <span className="flex gap-1 py-1 px-3 border rounded-full text-sm md:text-base border-gray-300 text-gray-600">Your supply chain management application</span>
          <p className = "flex flex-col gap-0 md:gap-4 text-4xl md:text-6xl 2xl:text-7xl font-black text-center text-blue-700">
            <span className="text-yellow-400 italic">Supply.EY</span>
            <span>Supplier Intelligence Tool</span>
          </p>
          

          <div className="cell">
            <div className="circle rotate-in-up-left"></div>
          </div>

        </div>
      </div>

      {/*RHS OF SCREEN FOR FORM*/}
      <div className="w-full md:w-1/3 p-10 md:p-1 flex flex-col justify-center items-center">
        <form
            onSubmit={handleSubmit(submitHandler)}
            className="form-container w-full md:w-100 2xl:w-150 flex flex-col gap-y-8 bg-white px-10 pt-0.3 pb-10"
        >
          <div className="">
            <p className="text-blue-600 text-3xl font-bold text-center pt-20 justify-center">Welcome back!</p> 
            <p className="text-center text-base text-gray-700"> Keep your credentials safe.</p>  
          </div>

          <div className="flex flex-col gap-y-5">
          <TextBox
          placeholder="email@example.com"
          type="email"
          name="email"
          id="email"
          label="Email Address"
          className="w-full rounded-full"
          register={register("email",{
            required: "Email is required",
          })}
          error={errors.email ? errors.email.message : ""}
          autocomplete="email"
          />
          <TextBox
          placeholder="password"
          type="password"
          name="password"
          id="password"
          label="Password"
          className="w-full rounded-full"
          register={register("password",{
            required: "Password is required",
          })}
          error={errors.password ? errors.password.message : ""}
          autocomplete="current-password"
          />

          {loginError && (
            <div className="text-sm text-red-600">{loginError}</div>
          )}

          <span className="text-sm text-gray-600 cursor-pointer hover:text-blue-600 hover:underline">
            I have forgotten my password
          </span>

          <Button
            type="submit"
            label="Login"
            className="w-full h-10 bg-blue-700 text-white rounded-full"
            />

          </div>
        </form>
      </div>

    </div>
  </div>
};

export default Login; 
