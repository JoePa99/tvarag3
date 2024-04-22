import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
// import swal from 'sweetalert'

import { signupSchema } from "../validations";
import { register, setActiveModel, verifyEmail, setTheme } from "../actions";

import "../style.css";
import { EMAIL_VERIFY_MSG, EMAIL_VERIFY, EMAIL_EXIST_MSG } from "../constants";

const Signup = () => {
  const dispatch = useDispatch();
  const [isLoading, changeIsLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      user_name: "",
      full_name: "",
      phone_number: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: 2,
    },
    validationSchema: signupSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const { messages, error, isAuthenticated, errorType } = useSelector(
    (state) => state.auth
  );

  const onSubmit = async (values) => {
    changeIsLoading(true);
    try {
      const response = dispatch(register(values));
      changeIsLoading(false);
    } catch (e) {
      console.log("error ", e.message);
      changeIsLoading(false);
    }
  };

  const theme = useSelector((store) => store.setting.isDark);
  const session_theme = sessionStorage.getItem("dark");

  useEffect(() => {
    if (session_theme === "false" || session_theme === false) {
      dispatch(setTheme(false));
    } else {
      dispatch(setTheme(true));
    }
    if (error) {
      console.log("errors ", error);
      changeIsLoading(false);
      if (errorType === EMAIL_VERIFY) {
        toast.success(EMAIL_VERIFY_MSG, {
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
        toast.error("Email Already Exist", {
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
      changeIsLoading(false);
    }
  }, [error, isAuthenticated, messages]);

  if (isLoading) {
    return <div className="coverSpinner"></div>;
  }

  return (
    <section
      className={`form-section ${theme === true ? "bg-chat_back" : "bg-white"}`}
    >
      <div className="container">
        <div className="login-area">
          <h1 align="center" className="title">
            Signup
          </h1>
          <div className="form-area">
            <form onSubmit={formik.handleSubmit}>
              <div className="signupForm">
                <div className="form-control">
                  <span>
                    <label htmlFor="full_Name">Full Name</label>
                    {formik.touched.full_name && formik.errors.full_name ? (
                      <div className="error">{formik.errors.full_name}</div>
                    ) : null}
                  </span>
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.full_name}
                    className="input-box"
                    placeholder="Enter Full Name"
                  />
                </div>
                <div className="form-control">
                  <span>
                    <label htmlFor="user_name">User Name</label>
                    {formik.touched.user_name && formik.errors.user_name ? (
                      <div className="error">{formik.errors.user_name}</div>
                    ) : null}
                  </span>
                  <input
                    type="text"
                    id="user_name"
                    name="user_name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.user_name}
                    className="input-box"
                    placeholder="Enter User Name"
                  />
                </div>
              </div>
              <div className="form-control">
                <span>
                  <label htmlFor="email">Email</label>
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
                  placeholder="Enter Email"
                />
              </div>

              <div className="form-control">
                <span>
                  <label htmlFor="phone_number">Phone Number</label>
                  {formik.touched.phone_number && formik.errors.phone_number ? (
                    <div className="error">{formik.errors.phone_number}</div>
                  ) : null}
                </span>
                <input
                  type="text"
                  id="phone_number"
                  name="phone_number"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.phone_number}
                  className="input-box"
                  placeholder="Enter Phone number"
                />
              </div>

              <div className="form-control">
                <span>
                  <label htmlFor="password">Password</label>
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
                  placeholder="Create Password"
                />
              </div>

              <div className="form-control">
                <span>
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword ? (
                    <div className="error">{formik.errors.confirmPassword}</div>
                  ) : null}
                </span>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.confirmPassword}
                  className="input-box"
                  placeholder="Confirm Password"
                />
              </div>

              <button type="submit" align="center" className="btn submit-btn">
                Submit
              </button>
            </form>
            <div
              style={{
                textAlign: "center",
                marginTop: "12px",
                fontSize: "15px",
              }}
            >
              Already have an account? &nbsp;
              <Link to={`/login`} style={{ textDecoration: "none" }}>
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </section>
  );
};

export default Signup;
