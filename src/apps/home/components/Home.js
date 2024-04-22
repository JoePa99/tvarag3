import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileUpload } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import Sidebar from "./Sidebar";
import Chat from "../../chat/components/Chat";
import ChangePassword from "../../menu/components/ChangePassword";
import Admin from "../../admin/components/Admin";
import Workflow from "../../menu/components/Workflows";
import FileUpload from "../../menu/components/FileUpload";
import SetPrompt from "../../menu/components/SetPrompt";
import "../style.css";
import { getAllQueries } from "../apis";
import setAuthHeader from "../../../_helpers/setAuthHeader";
import UploadModal from "../../menu/components/UploadModal";
import { useFormik } from "formik";
import { FileUploader } from "react-drag-drop-files";
import { ScrapURL } from "../../menu/validations";
import { uploadFile, uploadURL } from "../../menu/apis";
import { ToastContainer, toast } from "react-toastify";

const fileTypes = ["PDF", "TXT", "DOCX"];

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("");
  const [isCurrentMenuOpen, setIsCurrentMenuOpen] = useState(false);
  const [queries, setQueries] = useState([]);
  const [activeChat, setActiveChat] = useState({ queries: [] });
  const [questionList, setQuestionList] = useState([]);
  const [open, setOpen] = useState(false);
  const [isFile, setIsFile] = useState(true);
  const [file, setFile] = useState(null);

  const theme = useSelector((store) => store.setting.isDark);

  const formik = useFormik({
    initialValues: {
      url: "",
    },
    validationSchema: !isFile ? ScrapURL : null,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });
  const onSubmit = async (values) => {
    if (isFile) {
      try {
        if (file) {
          setIsLoading(true);
          console.log("file------------", file);
          await uploadFile({ file, sid: activeChat.id, core: 0 });
          handleClose();
          setIsLoading(false);
          // getDocuments();
          toast.success("Upload successful", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      } catch (e) {
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
        console.log(e.message);
      }
    } else {
      try {
        setIsLoading(true);
        await uploadURL({ url: values.url, sid: activeChat.id, core: 0 });
        handleClose();
        // getDocuments();
        toast.success("Upload successful", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } catch (e) {
        setIsLoading(false);
        // toast.error("Something Went wrong!", {
        //   position: "bottom-right",
        //   autoClose: 5000,
        //   hideProgressBar: false,
        //   closeOnClick: true,
        //   pauseOnHover: true,
        //   draggable: true,
        //   progress: undefined,
        //   theme: "dark",
        // });
        console.log(e.message);
      }
    }
  };

  const handleFileChange = (file) => {
    setFile(file);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const getQueries = async () => {
    setIsLoading(true);
    await getAllQueries()
      .then((res) => {
        setQueries(res.data?.chats || []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log("error ", err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    const parsed_session_data = JSON.parse(sessionStorage.getItem("user"));
    console.log("parsed_session_data----", parsed_session_data);
    setAuthHeader(parsed_session_data.token.token);
    getQueries();
    setCurrentPage("");
  }, []);

  const handleCreateNewChat = () => {
    setActiveChat({ queries: [] });
    setIsMenuOpen && setIsMenuOpen(false);
    setCurrentPage("");
    setQuestionList([]);
  };

  // if (isLoading) {
  //   return <div className="coverSpinner"></div>;
  // }

  const handleUpload = () => {
    setOpen(true);
  };

  return (
    <>
      {
        <div className="md:w-full h-screen flex">
          {isLoading && <div className="coverSpinner"></div>}
          <div className={`hidden md:block  md:w-[40%] lg:w-[20%]`}>
            <Sidebar
              queries={queries}
              setCurrentPage={setCurrentPage}
              setActiveChat={setActiveChat}
              setQueries={setQueries}
              getQueries={getQueries}
              activeChat={activeChat}
              currentPage={currentPage}
              isCurrentMenuOpen={isCurrentMenuOpen}
              setIsCurrentMenuOpen={setIsCurrentMenuOpen}
              handleCreateNewChat={handleCreateNewChat}
              questionList={questionList}
              setQuestionList={setQuestionList}
            />
          </div>

          <div
            className={`w-full md:w-[100%] h-screen md:h-screen ${
              theme === true ? "bg-chat_back" : "bg-white"
            }`}
          >
            <div className="flex flex-row justify-between items-center">
              <h1
                className={`font-bold text-xl ${
                  theme === true ? "text-[#ececf1]" : "text-black"
                } p-4`}
              >
                <span className="font-bold">{"Joe's Agent"}</span>
              </h1>
              {activeChat.queries.length > 0 && currentPage === "" ? (
                <button
                  className={`p-3 h-full rounded-lg cursor-pointer ${
                    theme === true
                      ? "text-[#ececf1] hover:bg-sidebar_setting_back"
                      : "text-black hover:bg-gray-100"
                  }`}
                  onClick={() => handleUpload()}
                >
                  <FontAwesomeIcon icon={faFileUpload} />
                  <span className="ml-2">Data Upload for this session</span>
                </button>
              ) : (
                <></>
              )}
              <UploadModal isOpen={open} onClose={handleClose}>
                <div className="p-2">
                  <form onSubmit={formik.handleSubmit}>
                    <div className="form-content-area">
                      <p className="text-xl my-2">Add new data source</p>
                      <div className="flex justify-center items-center my-2">
                        <button
                          type="button"
                          className={
                            isFile
                              ? `btn bg-black text-white`
                              : `btn bg-white border`
                          }
                          onClick={() => {
                            setIsFile(true);
                          }}
                        >
                          File
                        </button>
                        <button
                          type="button"
                          className={
                            !isFile
                              ? `btn bg-black text-white`
                              : `btn bg-white border`
                          }
                          onClick={() => {
                            setIsFile(false);
                          }}
                        >
                          URL
                        </button>
                      </div>
                      <div className="my-2">
                        {isFile ? (
                          <>
                            <FileUploader
                              handleChange={handleFileChange}
                              name="file"
                              types={fileTypes}
                            />

                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center",
                              }}
                            >
                              <button
                                type="submit"
                                className="btn forgot-btn !w-full"
                              >
                                Submit
                              </button>
                            </div>
                          </>
                        ) : (
                          <div>
                            <div className="form-control">
                              <span className="input-error">
                                <label>URL </label>
                                {formik.touched.url && formik.errors.url ? (
                                  <div className="error">
                                    {formik.errors.url}
                                  </div>
                                ) : null}
                              </span>

                              <input
                                type="url"
                                id="url"
                                name="url"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.url}
                                className="input-box"
                                placeholder="Enter URL"
                              />
                            </div>

                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center",
                              }}
                            >
                              <button
                                type="submit"
                                className="btn forgot-btn !w-full"
                              >
                                Submit
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                      <button
                        className="btn cancel-btn !w-full"
                        onClick={handleClose}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </UploadModal>
            </div>
            {currentPage === "" ? (
              <Chat
                setIsMenuOpen={setIsMenuOpen}
                isMenuOpen={isMenuOpen}
                activeChat={activeChat}
                setActiveChat={setActiveChat}
                setQueries={setQueries}
                questionList={questionList}
                setQuestionList={setQuestionList}
              />
            ) : (
              <>
                {currentPage === "User Manager" && (
                  <Admin setCurrentPage={setCurrentPage} />
                )}
                {currentPage === "Workflow" && (
                  <Workflow setCurrentPage={setCurrentPage} />
                )}
                {currentPage === "Change Password" && (
                  <ChangePassword setCurrentPage={setCurrentPage} />
                )}
                {currentPage === "Upload Data" && (
                  <FileUpload setCurrentPage={setCurrentPage} />
                )}
                {currentPage === "System Prompt" && (
                  <SetPrompt setCurrentPage={setCurrentPage} />
                )}
              </>
            )}
          </div>
          <ToastContainer />
        </div>
      }
    </>
  );
};

export default Home;
