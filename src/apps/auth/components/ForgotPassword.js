import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { ToastContainer, toast } from "react-toastify";

import { forgotPasswordSchema } from "../validations";
import { forgotPassword } from "../api";
import "../style.css";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: forgotPasswordSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  //   const [wrongCredError, changeWrongCredError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values) => {
    console.log("data1 ", values);
    setIsLoading(true);

    await forgotPassword(values)
      .then((res) => {
        console.log("Reset password link sent to your registered email.", res);
        toast.success("Link ", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setTimeout(() => {
          setIsLoading(false);
        }, 5000);
      })
      .catch((err) => {
        console.log("error ", err);

        setIsLoading(false);
        toast.error("Something Went wrong!", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      });
  };

  return (
    <>
      {isLoading && <div className="coverSpinner"></div>}
      <section className="form-section">
        <div className="container">
          <div className="login-area">
            <h1 align="center" className="title">
              Forgot Password
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

                <div
                  style={{
                    textAlign: "center",
                    marginTop: "4px",
                    fontSize: "11px",
                  }}
                >
                  We’ll send a verification code to this email if it matches
                  your existing account.
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    className="btn cancel-btn"
                    onClick={() => navigate("/login")}
                    style={{
                      marginRight: "4px",
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn forgot-btn">
                    Submit
                  </button>
                </div>
              </div>
            </form>
            <div
              style={{
                textAlign: "center",
                marginTop: "20px",
                fontSize: "15px",
              }}
            ></div>
          </div>
        </div>
        <ToastContainer />
      </section>
    </>
  );
};

export default ForgotPassword;
