import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";

import { loginSchema } from "../validations";
import { login, setTheme, verifyURL } from "../actions";
import "../style.css";
import { Helmet } from "react-helmet";
import {
  EMAIL_ALREADY_EXIST,
  EMAIL_EXIST_MSG,
  EMAIL_VERIFY,
  EMAIL_VERIFY_MSG,
  INCORRECT_E_P,
  LOGIN_ERROR,
  LOGIN_NOT_EXIST,
  NOT_REGISTER_MSG,
  UNKNOWN_MSG,
  URL_VERIFY_ERROR,
  URL_VERIFY_ERROR_MSG,
} from "../constants";

const Login = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const [queryParam] = useSearchParams();

  useEffect(() => {
    if (queryParam.size > 0) {
      const u_token = queryParam.get("u_token");
      const c_token = queryParam.get("c_token");
      const b_token = queryParam.get("b_token");
      const r_token = queryParam.get("r_token");
      dispatch(verifyURL({ u_token, c_token, b_token, r_token }));
    }
  }, [queryParam]);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const { messages, error, isAuthenticated, errorType } = useSelector(
    (state) => state.auth
  );
  const theme = useSelector((store) => store.setting.isDark);
  const session_theme = sessionStorage.getItem("dark");

  const onSubmit = async (values) => {
    setIsLoading(true);
    dispatch(login(values));
  };

  useEffect(() => {
    if (session_theme === "false" || session_theme === false) {
      dispatch(setTheme(false));
    } else {
      dispatch(setTheme(true));
    }
    if (error) {
      console.log("errors ", errorType, error);
      setIsLoading(false);
      if (errorType === LOGIN_NOT_EXIST) {
        toast.error(NOT_REGISTER_MSG, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else if (errorType === LOGIN_ERROR) {
        toast.error(INCORRECT_E_P, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else if (errorType === EMAIL_VERIFY) {
        toast.warning(EMAIL_VERIFY_MSG, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else if (errorType === EMAIL_ALREADY_EXIST) {
        toast.warning(EMAIL_EXIST_MSG, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else if (errorType === URL_VERIFY_ERROR) {
        toast.warning(URL_VERIFY_ERROR_MSG, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } else {
        toast.warning(UNKNOWN_MSG, {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    }
    if (isAuthenticated) {
      setIsLoading(false);
    }
  }, [error, isAuthenticated, messages, errorType]);

  return (
    <>
      {isLoading && <div className="coverSpinner"></div>}
      <section
        className={`form-section ${
          theme === true ? "bg-chat_back" : "bg-white"
        }`}
      >
        {/* <div className="container"> */}
        <div className="login-area">
          <h1 align="center" className="title">
            Login
          </h1>

          <form onSubmit={formik.handleSubmit}>
            <div className="form-area">
              <div className="form-control">
                <span className="input-error">
                  <label>Email </label>
                  {formik.touched.email && formik.errors.email ? (
                    <div className="error">{formik.errors.email}</div>
                  ) : null}
                </span>

                <input
                  type="text"
                  id="email"
                  name="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  className="input-box"
                  placeholder="Enter your email"
                />
              </div>

              <div className="form-control">
                <span className="input-error">
                  <label>Password </label>
                  {formik.touched.password && formik.errors.password ? (
                    <div className="error">{formik.errors.password}</div>
                  ) : null}
                </span>
                <input
                  type="password"
                  id="password"
                  name="password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  className="input-box"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                align="center"
                className="btn text-white bg-neutral-950 hover:bg-neutral-800 w-full relative flex items-center flex justify-center !w-full"
              >
                Login
              </button>
            </div>
          </form>

          <div
            style={{
              textAlign: "center",
              marginTop: "12px",
              fontSize: "15px",
            }}
          >
            Don't have an account? &nbsp;
            <Link to={`/signup`} style={{ textDecoration: "none" }}>
              Signup
            </Link>
          </div>
        </div>
        {/* </div> */}
        <ToastContainer />
      </section>
    </>
  );
};

export default Login;
