import { getWorkflows, deleteWorkFlow } from "../apis";
import ReactPaginate from "react-paginate";
import FlowModal from "./FlowModal";
import React, { useState, useEffect } from "react";
import { TrashIcon } from "@heroicons/react/24/solid";
import { Button, Tooltip } from "@material-tailwind/react";
import "../style.css";
import { ToastContainer, toast } from "react-toastify";
import { EMAIL_EXIST_MSG } from "../../auth/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

const TABLE_HEAD = ["Name", "Description", "Prompt", "Action"];

const Workflows = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [workflowData, setWorkflowData] = useState([]);
  const [is_open_flow_modal, setIsOpenUModal] = useState(false);
  const [flow_modal_data, setUModalData] = useState(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [PER_PAGE] = useState(5);

  const handlePageClick = ({ selected: selectedPage }) => {
    setCurrentPage(selectedPage);
  };

  const offset = currentPage * PER_PAGE;
  const pageCount = Math.ceil(workflowData?.length / PER_PAGE);

  const showToast = (value) => {
    if (value !== "") {
      toast.success(value, {
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
  };

  const handleEdit = (e) => {
    const filterFlow = workflowData.filter((flow) => flow.id === e);
    setUModalData(filterFlow);
    setIsOpenUModal(true);
  };

  const handleOpen = () => {
    setIsOpenUModal(true);
  };

  const handleClose = () => {
    setIsOpenUModal(false);
  };

  const handleDelete = async (id) => {
    console.log("user  id--------", id);
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this workflow?"
    );
    if (isConfirmed) {
      setIsLoading(true);
      await deleteWorkFlow(id)
        .then((res) => {
          setWorkflowData((flowData) =>
            flowData.filter((flow) => flow.id !== res.data.id)
          );
          setIsLoading(false);
        })
        .catch((err) => {
          console.log("error ", err);
          setIsLoading(false);
        });
    } else {
      console.log("User deletion cancelled");
      return false;
    }
  };
  const getWorkflow = async () => {
    setIsLoading(true);
    await getWorkflows()
      .then(async (res) => {
        console.log("res----------", res);
        setWorkflowData(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log("error ", err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getWorkflow();
  }, []);

  return (
    <>
      {is_open_flow_modal && (
        <FlowModal
          data={flow_modal_data}
          onClose={handleClose}
          getWorkflow={getWorkflow}
          showToast={showToast}
          // roles={user_roles}
        />
      )}
      {isLoading && <div className="coverSpinner"></div>}

      {
        <div className="w-full bg-white p-3 rounded-xl">
          <div className="rounded-none">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <Button
                className="btn danger bg-neutral-950 hover:bg-neutral-800"
                onClick={handleOpen}
              >
                Add Workflow
              </Button>
            </div>
          </div>
          <div className="px-0">
            <table className="mt-4 w-full min-w-max table-auto text-left">
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
                {workflowData
                  .slice(offset, offset + PER_PAGE)
                  .map(({ name, description, prompt, type, id }, index) => {
                    const isLast = index === workflowData.length - 1;
                    const classes = isLast
                      ? "p-4"
                      : "p-4 border-b border-blue-gray-50";

                    return (
                      <tr key={index} id={id}>
                        <td className={classes}>
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                              <p
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {name}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="flex flex-col">
                            <p
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {description}
                            </p>
                          </div>
                        </td>
                        <td className={classes}>
                          <div className="w-max">
                            <p
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                            >
                              {prompt}
                            </p>
                          </div>
                        </td>
                        <td className={classes}>
                          <p
                            variant="small"
                            color="blue-gray"
                            className="font-normal"
                          >
                            <Tooltip content="Delete">
                              <Button
                                onClick={() => handleDelete(id)}
                                variant="text"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </Button>
                            </Tooltip>
                            <Tooltip content="Edit">
                              <Button
                                onClick={() => handleEdit(id)}
                                variant="text"
                              >
                                <FontAwesomeIcon
                                  icon={faEdit}
                                  className="mr-1"
                                />
                              </Button>
                            </Tooltip>
                          </p>
                        </td>
                      </tr>
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
          </div>
        </div>
      }
      <ToastContainer />
    </>
  );
};

export default Workflows;
