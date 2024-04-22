import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { ToastContainer, toast } from "react-toastify";
import { uploadFile, uploadURL, getDocumentsList, initDB } from "../apis";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlus, faStore } from "@fortawesome/free-solid-svg-icons";
import UploadModal from "./UploadModal";
import { useFormik } from "formik";
import { ScrapURL } from "../validations";
import { FileUploader } from "react-drag-drop-files";

const fileTypes = ["PDF", "TXT", "DOCX"];

const FileUpload = () => {
  const theme = useSelector((store) => store.setting.isDark);
  const [uploaddata, setUploadData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [PER_PAGE, setPER_PAGE] = useState(6);
  const [isFile, setIsFile] = useState(true);

  const [file, setFile] = useState(null);
  const handleFileChange = (file) => {
    setFile(file);
  };

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
          await uploadFile({ file, sid: -1, core: 1 });
          handleClose();
          getDocuments();
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
        await uploadURL({ url: values.url, sid: -1, core: 1 });
        handleClose();
        getDocuments();
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

  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handlePageClick = ({ selected: selectedPage }) => {
    setCurrentPage(selectedPage);
  };

  const offset = currentPage * PER_PAGE;
  const pageCount = Math.ceil(uploaddata.length / PER_PAGE);

  useEffect(() => {
    getDocuments();
  }, []);

  const getDocuments = async () => {
    try {
      const res = await getDocumentsList();
      setUploadData(res.data);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    } catch (e) {
      setIsLoading(false);
      console.log(e.message);
    }
  };

  const handleRemoveDB = async () => {
    try {
      const isDel = window.confirm("Are you sure you want to init this DB?");
      if (isDel) {
        setIsLoading(true);
        const res = await initDB();
        console.log("res---------------", res);
        getDocuments();
        setIsLoading(false);
        toast.success("Init DB was done", {
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
      console.error("init db error", e);
    }
  };

  const TABLE_HEAD = ["Type", "Name"];

  return (
    <div className="w-full bg-white p-3 rounded-xl border border-gray-500">
      {isLoading && <div className="coverSpinner"></div>}
      <div className="firstSection">
        <div
          style={{
            display: "flex",
            flexDirection: "row-reverse",

            alignItems: "baseline",
            // justifyContent: "flex-end",
            // width: "12%",
          }}
        >
          <>
            <button
              className={` ${
                theme === true
                  ? "bg-white text-black hover:bg-gray-300"
                  : "bg-black text-white"
              }  p-2 text-base font-bold rounded cursor-pointer`}
              onClick={() => {
                handleRemoveDB();
              }}
            >
              <FontAwesomeIcon icon={faStore} className="mr-2" />
              Init DB
            </button>
            <button
              className={` ${
                theme === true
                  ? "bg-white text-black hover:bg-gray-300"
                  : "bg-black text-white"
              }  p-2 text-base font-bold rounded cursor-pointer`}
              onClick={handleOpen}
            >
              <FontAwesomeIcon icon={faCirclePlus} className="mr-2" />
              Upload and Store into DB
            </button>
          </>
        </div>
      </div>
      {uploaddata.length ? (
        <>
          <table
            id="filesTable"
            className="mt-4 w-full min-w-max table-auto text-left"
          >
            <thead>
              <tr key={-1}>
                {TABLE_HEAD.map((head, index) => (
                  <th
                    key={index}
                    className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                  >
                    <p
                      variant="small"
                      color="blue-gray"
                      className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                    >
                      {head}
                    </p>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {uploaddata.slice(offset, offset + PER_PAGE).map((item, i) => {
                const isLast = i === uploaddata.length - 1;
                const classes = isLast
                  ? "p-4"
                  : "p-4 border-b border-blue-gray-50";
                return (
                  <>
                    <tr key={i}>
                      <td className={classes}>
                        {item.type === 0 ? "Document" : "URL"}
                      </td>
                      <td className={classes}>{item.name}</td>
                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>

          <div className="tableFooter">
            <ReactPaginate
              previousLabel={"Previous"}
              nextLabel={"Next"}
              pageCount={pageCount}
              onPageChange={handlePageClick}
              containerClassName={"pagination"}
              pageClassName="page-item"
              pageLinkClassName="page-link"
              previousClassName="page-item"
              previousLinkClassName={"page-link"}
              nextClassName={"page-item"}
              nextLinkClassName={"page-link"}
              disabledClassName={"page-item"}
              activeClassName={"page-item active"}
              activeLinkClassName="page-link"
            />
          </div>
        </>
      ) : (
        <div className="noRecordFound">
          <h2 className={`${theme === true ? "text-black" : "text-black"}`}>
            No record found
          </h2>
        </div>
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
                    isFile ? `btn bg-black text-white` : `btn bg-white border`
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
                    !isFile ? `btn bg-black text-white` : `btn bg-white border`
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
                      <button type="submit" className="btn forgot-btn !w-full">
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
                          <div className="error">{formik.errors.url}</div>
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
                      <button type="submit" className="btn forgot-btn !w-full">
                        Submit
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <button className="btn cancel-btn !w-full" onClick={handleClose}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </UploadModal>
      <ToastContainer />
    </div>
  );
};

export default FileUpload;
