import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { useFormik } from "formik";
import { ToastContainer, toast } from "react-toastify";

import { passwordSchema } from "../validations";
import { updatePassword } from "../apis";
import "../style.css";

const ChangePassword = ({ setCurrentPage }) => {
  const formik = useFormik({
    initialValues: {
      old_password: "",
      new_password: "",
      confirm_password: "",
    },
    validationSchema: passwordSchema,
    onSubmit: (values) => {
      changePassword(values);
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const changePassword = async (values) => {
    setIsLoading(true);
    await updatePassword(values)
      .then((res) => {
        console.log("Res", res);
        toast.success(res.data.msg, {
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
          setCurrentPage("");
        }, 5000);
        // setIsLoading(false);
        // setCurrentPage("");
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
      <section className="menu-section">
        {/* <div className="container"> */}
        <div className="menu-area">
          <div className="flex flex-col align-center">
            <div className="flex cursor-pointer">
              <FontAwesomeIcon
                icon={faXmark}
                // size={25}
                onClick={() => setCurrentPage("")}
              />
            </div>
            <h1 align="center" className="title">
              Change Password
            </h1>
          </div>
          <form onSubmit={formik.handleSubmit}>
            <div className="form-content-area">
              <div className="form-control">
                <span className="input-error">
                  <label>Old Password </label>
                  {formik.touched.old_password && formik.errors.old_password ? (
                    <div className="error">{formik.errors.old_password}</div>
                  ) : null}
                </span>

                <input
                  type="password"
                  id="old_password"
                  name="old_password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.old_password}
                  className="input-box"
                  placeholder="Old Password"
                />
              </div>

              <div className="form-control">
                <span className="input-error">
                  <label>New Password </label>
                  {formik.touched.new_password && formik.errors.new_password ? (
                    <div className="error">{formik.errors.new_password}</div>
                  ) : null}
                </span>

                <input
                  type="password"
                  id="new_password"
                  name="new_password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.new_password}
                  className="input-box"
                  placeholder="Create New Password"
                />
              </div>

              <div className="form-control">
                <span className="input-error">
                  <label>Confirm Password </label>
                  {formik.touched.confirm_password &&
                  formik.errors.confirm_password ? (
                    <div className="error">
                      {formik.errors.confirm_password}
                    </div>
                  ) : null}
                </span>

                <input
                  type="password"
                  id="confirm_password"
                  name="confirm_password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.confirm_password}
                  className="input-box"
                  placeholder="Enter Confirm New Password"
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
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
        {/* </div> */}
        <ToastContainer />
      </section>
    </>
  );
};

export default ChangePassword;
