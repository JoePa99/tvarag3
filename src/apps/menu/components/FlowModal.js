import React, { useState, useEffect } from "react";
import { addWorkflowSchema, editWorkflowSchema } from "../validations";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { updateWorkflow, createWorkFlow } from "../apis";

const FlowModal = ({ data, onClose, getWorkflow, showToast, roles }) => {
  const [isLoading, changeIsLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      prompt: "",
    },
    validationSchema: addWorkflowSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  const formik_edit = useFormik({
    initialValues: {
      name: "",
      description: "",
      prompt: "",
    },
    validationSchema: editWorkflowSchema,
    onSubmit: (values) => {
      onSubmitEdit(values);
    },
  });

  const onSubmit = async (values) => {
    changeIsLoading(true);
    try {
      const res = await createWorkFlow(values);
      console.log("r------------es", res);
      changeIsLoading(false);
      onClose();
      getWorkflow();
      if (res) {
        showToast("A new workflow was created successfully!");
      }
    } catch (e) {
      console.log("error ", e.message);
      changeIsLoading(false);
    }
  };

  const onSubmitEdit = async (values) => {
    changeIsLoading(true);
    try {
      const response = await updateWorkflow(values);
      changeIsLoading(false);
      onClose();
      getWorkflow();
      if (response) {
        showToast("Workflow was updated succesfully!");
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
        name: "",
        description: "",
        prompt: "",
      });
      formik_edit.setValues({
        name: "",
        description: "",
        prompt: "",
      });
    }
  }, [data]);

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
              Add Workflow
            </h1>
            <div className="form-area">
              <form onSubmit={formik.handleSubmit}>
                <div className="form-control">
                  <span>
                    <label htmlFor="name">Workflow Name</label>
                    {formik.touched.name && formik.errors.name ? (
                      <div className="error">{formik.errors.name}</div>
                    ) : null}
                  </span>
                  <input
                    type="text"
                    autoComplete="off"
                    id="name"
                    name="name"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.name}
                    className="input-box"
                    placeholder="Enter Workflow Name"
                  />
                </div>
                <div className="form-control">
                  <span>
                    <label htmlFor="description">Description</label>
                    {formik.touched.description && formik.errors.description ? (
                      <div className="error">{formik.errors.description}</div>
                    ) : null}
                  </span>
                  <textarea
                    type="text"
                    autoComplete="off"
                    id="description"
                    name="description"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.description}
                    className="input-box h-36"
                    placeholder="Enter Description"
                  />
                </div>

                <div className="form-control">
                  <span>
                    <label htmlFor="prompt">Prompt</label>
                    {formik.touched.prompt && formik.errors.prompt ? (
                      <div className="error">{formik.errors.prompt}</div>
                    ) : null}
                  </span>
                  <textarea
                    type="text"
                    autoComplete="off"
                    id="prompt"
                    name="prompt"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.prompt}
                    className="input-box h-36"
                    placeholder="Enter Prompt"
                  />
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
                      <label htmlFor="name">Workflow Name</label>
                      {formik_edit.touched.name && formik_edit.errors.name ? (
                        <div className="error">{formik_edit.errors.name}</div>
                      ) : null}
                    </span>
                    <input
                      type="text"
                      autoComplete="off"
                      id="name"
                      name="name"
                      onChange={formik_edit.handleChange}
                      onBlur={formik_edit.handleBlur}
                      value={formik_edit.values.name}
                      className="input-box"
                      placeholder="Enter Workflow Name"
                    />
                  </div>
                </div>

                <div className="form-control">
                  <span>
                    <label htmlFor="description">Description</label>
                    {formik_edit.touched.description &&
                    formik_edit.errors.description ? (
                      <div className="error">
                        {formik_edit.errors.description}
                      </div>
                    ) : null}
                  </span>
                  <textarea
                    type="text"
                    autoComplete="off"
                    id="description"
                    name="description"
                    onChange={formik_edit.handleChange}
                    onBlur={formik_edit.handleBlur}
                    value={formik_edit.values.description}
                    className="input-box h-36"
                  />
                </div>

                <div className="form-control">
                  <span>
                    <label htmlFor="prompt">Prompt</label>
                    {formik_edit.touched.prompt && formik_edit.errors.prompt ? (
                      <div className="error">{formik_edit.errors.prompt}</div>
                    ) : null}
                  </span>
                  <textarea
                    type="text"
                    autoComplete="off"
                    id="prompt"
                    name="prompt"
                    onChange={formik_edit.handleChange}
                    onBlur={formik_edit.handleBlur}
                    value={formik_edit.values.prompt}
                    className="input-box h-36"
                    placeholder="Enter Prompt"
                  />
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

export default FlowModal;
