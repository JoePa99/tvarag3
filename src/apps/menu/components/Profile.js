import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";

import { profileSchema } from "../validations";
import { getProfile, editProfile } from "../apis";
import { useDispatch } from "react-redux";
import { setUser } from "../../auth/actions";

export default function Profile({ setCurrentPage }) {
  const dispatch = useDispatch();
  const userInfo = {
    firstName: "",
    lastName: "",
    mobile_no: "",
    email: "",
  };
  const [isLoading, setIsLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [userData, setUserData] = useState(userInfo);

  const handleEditData = async (values) => {
    setIsLoading(true);
    await editProfile(values)
      .then((res) => {
        setUserData(res.data);

        toast.success("User info updated successfully!", {
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
          dispatch(setUser(res.data));
          // setIsEdit(false);
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

  const getUserDetails = async () => {
    setIsLoading(true);
    await getProfile()
      .then((res) => {
        const { data } = res;
        setUserData((prevValues) => ({
          ...prevValues,
          ...data,
        }));
        // setUserData(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log("error ", err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <>
      {isLoading && <div className="coverSpinner"></div>}
      {isEdit ? (
        <section className="menu-section">
          {/* <div className="container"> */}
          <div className="menu-area">
            <div className="flex flex-col align-center cursor-pointer">
              <div className="flex">
                <FontAwesomeIcon
                  icon={faXmark}
                  onClick={() => setCurrentPage("")}
                />
              </div>

              <h1 align="center" className="title">
                Edit Profile
              </h1>
            </div>

            <div className="form-content-area">
              <Formik
                initialValues={userData}
                validationSchema={profileSchema}
                enableReinitialize={true}
                onSubmit={handleEditData}
              >
                {({
                  values,
                  errors,
                  touched,
                  isSubmitting,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                }) => {
                  const { firstName, lastName, mobile_no, email } = values;
                  return (
                    <>
                      <div>
                        <div className="form-control">
                          <span>
                            <label htmlFor="firstname">First Name</label>
                            {touched.firstName && errors.firstName ? (
                              <div className="error">{errors.firstName}</div>
                            ) : null}
                          </span>
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={firstName}
                            className="input-box"
                            placeholder="Enter First Name"
                          />
                        </div>
                        <div className="form-control">
                          <span>
                            <label htmlFor="firstname">Last Name</label>
                            {touched.lastName && errors.lastName ? (
                              <div className="error">{errors.lastName}</div>
                            ) : null}
                          </span>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={lastName}
                            className="input-box"
                            placeholder="Enter Last Name"
                          />
                        </div>
                      </div>

                      <div className="form-control">
                        <span>
                          <label htmlFor="email">Email</label>
                          {/* {touched.email && errors.email ? (
                            <div className="error">{errors.email}</div>
                          ) : null} */}
                        </span>
                        <input
                          style={{ backgroundColor: "gray" }}
                          className="input-box"
                          type="text"
                          id="email"
                          name="email"
                          disabled
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={email}
                          placeholder="Enter Email"
                        />
                      </div>

                      <div className="form-control">
                        <span>
                          <label htmlFor="mobileno">Contact</label>
                          {touched.mobile_no && errors.mobile_no ? (
                            <div className="error">{errors.mobile_no}</div>
                          ) : null}
                        </span>
                        <input
                          type="text"
                          id="mobile_no"
                          name="mobile_no"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={mobile_no}
                          className="input-box"
                          placeholder="Enter Contact"
                        />
                      </div>

                      <button
                        submitting={isSubmitting}
                        onClick={handleSubmit}
                        // type="submit"
                        align="center"
                        className="btn submit-btn"
                      >
                        Edit
                      </button>
                      {/* // </form> */}
                    </>
                  );
                }}
              </Formik>
            </div>
          </div>
          <ToastContainer />
        </section>
      ) : (
        <section className="menu-section">
          <div className="mx-5 container">
            <div className="mx-auto my-20 h-auto max-w-sm overflow-hidden rounded-md menu-area">
              <div className="flex flex-col align-center">
                <div className="flex cursor-pointer">
                  <FontAwesomeIcon
                    icon={faXmark}
                    size={25}
                    onClick={() => setCurrentPage("")}
                  />
                </div>
                <h1 align="center" className="title">
                  User Profile
                </h1>
              </div>
              <img
                className="border-black-600 m-1 mx-auto h-36 w-36 rounded-full border-4 object-cover p-1 mt-2"
                src="/images/default_user.jpg"
                alt="user_profile_image"
              />

              <div className="px-6 py-4">
                <div className="flex flex-col">
                  <div className="text-center text-xl font-bold text-gray-800">
                    {userData.firstName + " " + userData.lastName}
                  </div>
                  <div className="text-center text-sm text-gray-600 mt-2">
                    {userData.email}
                  </div>
                  <div className="text-center text-sm text-gray-600 mt-2">
                    {userData.mobile_no}
                  </div>
                  <button
                    className="btn forgot-btn"
                    onClick={() => setIsEdit(true)}
                    style={{
                      marginRight: "4px",
                    }}
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
