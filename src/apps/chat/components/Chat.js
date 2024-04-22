import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faTimes } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import { insertQueries, getWorkflows, setSolution } from "../apis";
import "../style.css";
import { useSelector } from "react-redux";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import setAuthHeader from "../../../_helpers/setAuthHeader";
import { ReactComponent as LogoIcon } from "../../../assets/svgs/logo.svg";
import { logout } from "../../auth/actions";
import { io } from "socket.io-client";

function Chat({
  activeChat,
  setActiveChat,
  setQueries,
  questionList,
  setQuestionList,
}) {
  const theme = useSelector((store) => store.setting.isDark);

  const [question, setQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [work_flow, setWorkFlows] = useState([]);
  const [user_id, setUserID] = useState(null);
  const [is_connected, setIsConnected] = useState(false);
  const [temp_str, setTmpStr] = useState("");

  const bottomRef = useRef(null);
  let socketRef = useRef(null);
  const isSocketCalled = useRef(0);
  const question_id = useRef(null);
  const chat_id = useRef(null);

  const handleSendMessage = async (data = null) => {
    // e.preventDefault();
    setQuestionList([...questionList, data ? data.prompt : question]);
    if (!question && !data) {
      console.log("No questions");
      return;
    }
    let payload = {
      question: data ? data.prompt : question,
      workflow: data ? data : null,
      prompt: data ? data.prompt : null,
    };
    if (!activeChat.id) {
      const splitQues = data ? data.prompt.split(" ") : question.split(" ");

      payload.isNew = true;
      payload.title =
        splitQues[0] + " " + (splitQues[1] || "") + " " + (splitQues[2] || "");
    } else {
      payload.sid = activeChat.id;
      payload.prompt = activeChat.prompt;
      payload.userId = user_id;
    }
    setIsLoading(true);
    setQuestion("");
    const res = await insertQueries(payload);
    console.log("res-------------", res);
    if (res.response?.status === 401) {
      logout();
    } else {
      await setQueries(res.data.chats);
    }
    const oldActiveChat = res.data.chats.find(
      (chat) => chat.id === activeChat.id
    );
    const chat = oldActiveChat
      ? oldActiveChat
      : res.data.chats[res.data.chats.length - 1];
    question_id.current = chat.queries[chat.queries.length - 1].question_id;
    console.log("test chat---", chat);
    await setActiveChat(chat);
    chat_id.current = chat.id;

    socketRef.current.emit(
      "chat",
      {
        payload,
      },
      (e) => {
        console.log("e---socket---e", e);
      }
    );
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.queries?.length]);

  const getWorkflow = async () => {
    const res = await getWorkflows();
    if (res !== 401 && res.data) {
      setWorkFlows(res.data);
    } else {
      logout();
    }
  };
  useEffect(() => {
    const parsed_session_data = JSON.parse(sessionStorage.getItem("user"));
    setUserID(parsed_session_data.id);
    setAuthHeader(parsed_session_data.token.token);
    getWorkflow();

    //socket start
    if (isSocketCalled.current === 0) {
      isSocketCalled.current = 1;
      socketConnect();
    }
  }, []);

  const socketConnect = () => {
    socketRef.current = io(process.env.REACT_APP_SOCKET_URL);
    socketRef.current.on("connect", () => {
      setIsConnected(true);
      console.log("Socket has connected -----");
    });
    socketRef.current.on("disconnect", (data) => {
      setIsConnected(false);
      console.log("--- disconnected ---");
    });
    socketRef.current.on("end", (data) => {
      console.log("socket ended -------");
      console.log(data);
      setSolutions(data.text);
      setTmpStr("");
      setIsLoading(false);
    });

    socketRef.current.on("response", async (data) => {
      setTmpStr((prevState) => {
        let result = prevState + data;
        setActiveChat((prevActiveChat) => {
          const updatedQueries = prevActiveChat.queries.map((query) => {
            if (query.question_id === question_id.current) {
              return {
                ...query,
                solution: result,
              };
            }
            return query;
          });

          return {
            ...prevActiveChat,
            queries: updatedQueries,
          };
        });
        return result;
      });
    });
  };

  const setSolutions = async (texts) => {
    const res = await setSolution({
      q_id: question_id.current,
      c_id: chat_id.current,
      content: texts,
    });
    if (res.response?.status === 401) {
      logout();
    } else {
      setQueries(res.data.chats);
      setActiveChat((prevState) => {
        const updatedQueries = res.data.chats.find(
          (chat) => chat.id === prevState.id
        ).queries;
        return { ...prevState, queries: updatedQueries };
      });
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      // console.log("Enter key pressed ✅");
      handleSendMessage();
    }
  };

  const handleInputChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleWorkflow = async (data) => {
    handleSendMessage(data);
  };

  return (
    <>
      <div className="flex flex-col justify-between mb-2">
        <div
          // style={{ backgroundColor: chat_back }}
          className={`${
            (questionList.length > 0 || activeChat.queries.length > 0) &&
            (theme === true
              ? `bg-chat_back  text-white`
              : "white border-slate-300")
          } rounded overflow-y-scroll h-[70vh] md:h-[75vh] w-full md:w-[70%] mx-auto md:p-0 p-4 flex flex-col`}
        >
          {questionList.length === 0 ? (
            <div
              className={`text-xl font-bold flex flex-col justify-center items-center ${
                theme === true ? "text-[#ececf1]" : "text-black"
              }`}
            >
              <div className="my-32 flex flex-col justify-center items-center">
                <div className="bg-white rounded-full p-4 w-fit my-4">
                  <LogoIcon className="text-black" />
                </div>
                <p className="text-2xl font-bold">How can I assit you today?</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {work_flow.length > 0
                  ? work_flow.map((item, i) => {
                      return (
                        <div
                          key={i}
                          className={`p-4 border cursor-pointer rounded-lg h-24 overflow-y-scroll ${
                            theme === true ? "border-gray" : "border-black"
                          }`}
                          onClick={() => handleWorkflow(item)}
                        >
                          <p className="text-base font-bold">{item.name}</p>
                          <p className="mt-4 text-sm">{item.description}</p>
                        </div>
                      );
                    })
                  : "There is no workflow! Please insert workflow"}
              </div>
            </div>
          ) : (
            <></>
          )}
          {questionList.length > 0 &&
            questionList.map((m, index) => (
              <div key={index} className="flex items-start space-x-4 my-6 p-2">
                <div className="flex flex-col items-start">
                  <p
                    style={
                      theme === true ? { color: "white" } : { color: "black" }
                    }
                    className={`font-bold`}
                  >
                    {m && "You"}
                  </p>
                  <p
                    style={
                      theme === true ? { color: "white" } : { color: "black" }
                    }
                    className={`${
                      theme === true ? "text-gray-300" : "text-black"
                    }`}
                  >
                    {m}
                  </p>

                  <p
                    style={
                      theme === true ? { color: "white" } : { color: "black" }
                    }
                    className={`${
                      theme === true ? "text-gray-300" : "text-black"
                    } font-bold`}
                  >
                    {m && "Answer"}
                  </p>
                  {isLoading && questionList.length - 1 === index && (
                    <>
                      <p
                        style={
                          theme === true
                            ? { color: "white" }
                            : { color: "black" }
                        }
                        className={`${
                          theme === true ? "text-gray-300" : "text-black"
                        } text-sm animate-pulse text-center`}
                      >
                        Loading...
                      </p>
                    </>
                  )}
                  {activeChat?.queries?.map((ans, index) => (
                    <div
                      style={
                        theme === true ? { color: "white" } : { color: "black" }
                      }
                      key={index}
                      className={`${
                        theme === true ? "text-gray-300" : "text-black"
                      }`}
                    >
                      <div
                        style={
                          theme === true
                            ? { color: "white" }
                            : { color: "black" }
                        }
                        key={index}
                        className={`${
                          theme === true ? "text-gray-300" : "text-black"
                        }`}
                      >
                        <Markdown remarkPlugins={[remarkGfm]}>
                          {m === ans?.question && ans?.solution}
                        </Markdown>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          <div ref={bottomRef} />
        </div>
        {/* {isLoading && (
          <p className="text-black text-sm animate-pulse text-center">
            Loading...
          </p>
        )} */}
        <div className="w-full flex  justify-center items-center flex-row p-4 md:p-0">
          <div className="w-full md:w-[65%] h-[55px] border border-gray-600 flex items-center rounded-lg p-2">
            <button
              onClick={() => setQuestion("")}
              className="h-full p-2 rounded-lg icon-style text-[#ececf1]"
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <input
              value={question}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className={`${
                theme === true ? "text-gray-300" : "text-black"
              } h-full w-full p-2 outline-none bg-inherit`}
              type="text"
              placeholder="Type a message..."
            />
            <button
              onClick={handleSendMessage}
              className="h-full p-2 rounded-lg icon-style text-[#ececf1]"
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </div>
          <p className="text-xs text-white p-2 text-center"></p>
          <ToastContainer />
        </div>
      </div>
    </>
  );
}

export default Chat;
