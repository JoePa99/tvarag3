import React, { useState, useEffect } from "react";
import { register, setActiveModel, setTheme } from "../../../auth/actions";
import { EMAIL_VERIFY_MSG, EMAIL_VERIFY } from "../../../auth/constants";
import { addUserSchema, editUserSchema } from "../../../admin/validations";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import "../../style.css";
import { updateUser } from "../../apis";

const CustomModal = ({ data, onClose, getUsers, showToast, roles }) => {
  const dispatch = useDispatch();
  const { messages, error, isAuthenticated, errorType } = useSelector(
    (state) => state.auth
  );

  const [isLoading, changeIsLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      user_name: "",
      full_name: "",
      phone_number: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "2",
    },
    validationSchema: addUserSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const formik_edit = useFormik({
    initialValues: {
      full_name: "",
      user_name: "",
      phone_number: "",
      email: "",
      role: "",
    },
    validationSchema: editUserSchema,
    onSubmit: (values) => {
      onSubmitEdit(values);
    },
  });

  const onSubmit = async (values) => {
    changeIsLoading(true);
    try {
      const response = await dispatch(register(values));
      console.log("add user--", response);
      changeIsLoading(false);
      onClose();
      getUsers();
      if (response) {
        showToast(response);
      }
    } catch (e) {
      console.log("error ", e.message);
      changeIsLoading(false);
    }
  };

  const onSubmitEdit = async (values) => {
    let data = { ...values, state: "user", is_EV: true };
    changeIsLoading(true);
    try {
      const response = await updateUser(values);
      changeIsLoading(false);
      onClose();
      getUsers();
      if (response) {
        showToast(response);
      }
    } catch (e) {
      console.log("error ", e.message);
      changeIsLoading(false);
    }
  };

  const theme = useSelector((store) => store.setting.isDark);
  const session_theme = sessionStorage.getItem("dark");

  useEffect(() => {
    if (data?.length > 0) {
      formik.setValues(data[0]);
      formik_edit.setValues(data[0]);
    } else {
      formik.setValues({
        email: "",
        full_name: "",
        user_name: "",
        phone_number: "",
        password: "",
        confirmPassword: "",
        role: 2,
      });
      formik_edit.setValues({
        email: "",
        full_name: "",
        user_name: "",
        phone_number: "",
        password: "",
        confirmPassword: "",
        role: 2,
      });
    }
  }, [data]);

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
        toast.error(error, {
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
    <>
      {data === null ? (
        <section
          className={`form-sections ${
            theme === true ? "" : "bg-white"
          } relative `}
        >
          <div className="login-area fixed top-[15%]">
            <h1 align="center" className="title">
              Add User
            </h1>
            <div className="form-area">
              <form onSubmit={formik.handleSubmit}>
                <div className="form-control">
                  <span>
                    <label htmlFor="full_name">Full Name</label>
                    {formik.touched.full_name && formik.errors.full_name ? (
                      <div className="error">{formik.errors.full_name}</div>
                    ) : null}
                  </span>
                  <input
                    type="text"
                    autoComplete="off"
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
                    autoComplete="off"
                    id="user_name"
                    name="user_name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.user_name}
                    className="input-box"
                    placeholder="Enter User Name"
                  />
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
                    autoComplete="off"
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
                    <label htmlFor="mobile_no">Contact</label>
                    {formik.touched.phone_number &&
                    formik.errors.phone_number ? (
                      <div className="error">{formik.errors.phone_number}</div>
                    ) : null}
                  </span>
                  <input
                    type="text"
                    autoComplete="off"
                    id="phone_number"
                    name="phone_number"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.phone_number}
                    className="input-box"
                    placeholder="Enter Contact"
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
                    autoComplete="off"
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
                      <div className="error">
                        {formik.errors.confirmPassword}
                      </div>
                    ) : null}
                  </span>
                  <input
                    type="password"
                    autoComplete="off"
                    id="confirmPassword"
                    name="confirmPassword"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values?.confirmPassword}
                    className="input-box"
                    placeholder="Confirm Password"
                  />
                </div>
                <div className="form-control">
                  <span>
                    <label htmlFor="confirmPassword">Roles</label>
                    {formik.touched.role && formik.errors.role ? (
                      <div className="error">{formik.errors.role}</div>
                    ) : null}
                  </span>
                  <select
                    id="role"
                    name="role"
                    className="input-box"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.role}
                  >
                    <option key={0} value={0}>
                      {"Admin"}
                    </option>
                    <option key={1} value={1}>
                      {"VIP"}
                    </option>
                    <option key={2} value={2}>
                      {"User"}
                    </option>
                  </select>
                </div>
                <div style={{ display: "flex" }}>
                  <button
                    type="submit"
                    align="center"
                    className="btn submit-btn"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    align="center"
                    className="btn submit-btn"
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      ) : (
        <section
          className={`form-sections ${
            theme === true ? "" : "bg-white"
          } relative`}
        >
          <div className="login-area fixed top-[15%]">
            <h1 align="center" className="title">
              Edit User
            </h1>
            <div className="form-area">
              <form onSubmit={formik_edit.handleSubmit}>
                <div className="signupForm">
                  <div className="form-control">
                    <span>
                      <label htmlFor="full_name">Full Name</label>
                      {formik_edit.touched.full_name &&
                      formik_edit.errors.full_name ? (
                        <div className="error">
                          {formik_edit.errors.full_name}
                        </div>
                      ) : null}
                    </span>
                    <input
                      type="text"
                      autoComplete="off"
                      id="full_name"
                      name="full_name"
                      onChange={formik_edit.handleChange}
                      onBlur={formik_edit.handleBlur}
                      value={formik_edit.values.full_name}
                      className="input-box"
                      placeholder="Enter Full Name"
                    />
                  </div>
                </div>
                <div className="form-control">
                  <span>
                    <label htmlFor="email">Email</label>
                    {formik_edit.touched.email && formik_edit.errors.email ? (
                      <div className="error">{formik_edit.errors.email}</div>
                    ) : null}
                  </span>
                  <input
                    type="text"
                    autoComplete="off"
                    id="email"
                    name="email"
                    onChange={formik_edit.handleChange}
                    onBlur={formik_edit.handleBlur}
                    value={formik_edit.values.email}
                    className="input-box disabled"
                    disabled
                  />
                </div>

                <div className="form-control">
                  <span>
                    <label htmlFor="user_name">User Name</label>
                    {formik_edit.touched.user_name &&
                    formik_edit.errors.user_name ? (
                      <div className="error">
                        {formik_edit.errors.user_name}
                      </div>
                    ) : null}
                  </span>
                  <input
                    type="text"
                    autoComplete="off"
                    id="user_name"
                    name="user_name"
                    onChange={formik_edit.handleChange}
                    onBlur={formik_edit.handleBlur}
                    value={formik_edit.values.user_name}
                    className="input-box disabled"
                    disabled
                  />
                </div>

                <div className="form-control">
                  <span>
                    <label htmlFor="phone_number">Contact</label>
                    {formik_edit.touched.phone_number &&
                    formik_edit.errors.phone_number ? (
                      <div className="error">
                        {formik_edit.errors.phone_number}
                      </div>
                    ) : null}
                  </span>
                  <input
                    type="text"
                    autoComplete="off"
                    id="phone_number"
                    name="phone_number"
                    onChange={formik_edit.handleChange}
                    onBlur={formik_edit.handleBlur}
                    value={formik_edit.values.phone_number}
                    className="input-box"
                    placeholder="Enter Contact"
                  />
                </div>

                <div className="form-control">
                  <span>
                    <label htmlFor="role">Role</label>
                    {formik_edit.touched.role && formik_edit.errors.role ? (
                      <div className="error">{formik_edit.errors.role}</div>
                    ) : null}
                  </span>

                  <select
                    id="role"
                    name="role"
                    className="input-box"
                    onChange={formik_edit.handleChange}
                    onBlur={formik_edit.handleBlur}
                    value={formik_edit.values.role}
                  >
                    <option key={0} value={0}>
                      {"Admin"}
                    </option>
                    <option key={1} value={1}>
                      {"VIP"}
                    </option>
                    <option key={2} value={2}>
                      {"User"}
                    </option>
                  </select>
                </div>
                <div style={{ display: "flex" }}>
                  <button
                    type="submit"
                    align="center"
                    className="btn submit-btn"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    align="center"
                    className="btn submit-btn"
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default CustomModal;
