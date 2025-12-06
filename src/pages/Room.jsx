import client, { databases } from "../appwrite/appwriteConfig";
import config from "../config/config";
import { useEffect, useState, useRef } from "react";
import { ID, Permission, Query, Role } from "appwrite";
import { Send, Trash2 } from "react-feather";
import { useAuth } from "../contexts/AuthContext";

const Room = () => {
  const [messages, setMessages] = useState([]);
  const [messageBody, setMessageBody] = useState("");
  const { user, handleLogout } = useAuth();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    getMessages();

    const unsubscribe = client.subscribe(
      `databases.${config.appwriteDatabaseId}.collections.${config.appwriteCollectionId}.documents`,
      (response) => {
        console.log("Realtime: ", response);

        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.create"
          )
        ) {
          setMessages((prevMessages) => [...prevMessages, response.payload]);
        }
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.delete"
          )
        ) {
          setMessages((prevMessages) =>
            prevMessages.filter(
              (message) => message.$id !== response.payload.$id
            )
          );
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const permissions = [
      Permission.write(Role.user(user.$id)),
      Permission.read(Role.any()),
    ];

    const payload = {
      user_id: user.$id,
      username: user.name,
      body: messageBody,
    };

    try {
      await databases.createDocument(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        ID.unique(),
        payload,
        permissions
      );
      setMessageBody("");
    } catch (error) {
      console.error("Error creating document:", error);
    }
  };

  const getMessages = async () => {
    const response = await databases.listDocuments(
      config.appwriteDatabaseId,
      config.appwriteCollectionId,
      [Query.orderAsc("$createdAt"), Query.limit(100)]
    );
    console.log("Fetched messages:", response.documents); // Add this line
    setMessages(response.documents);
    scrollToBottom();
  };

  const deleteMessage = async (message_id) => {
    await databases.deleteDocument(
      config.appwriteDatabaseId,
      config.appwriteCollectionId,
      message_id
    );
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const dateOnly = date.toDateString();
    const todayOnly = today.toDateString();
    const yesterdayOnly = yesterday.toDateString();

    if (dateOnly === todayOnly) return "Today";
    if (dateOnly === yesterdayOnly) return "Yesterday";
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // Group messages by date
  const groupMessagesByDate = () => {
    const groups = {};
    messages.forEach((message) => {
      const date = new Date(message.$createdAt).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(message);
    });
    return groups;
  };

  const messagesByDate = groupMessagesByDate();

  return (
    <div className="w-full h-full flex justify-center">
      <div className="w-11/12 h-full lg:w-2/4 flex flex-col">
        {/* Header */}
        <div className="h-[7%] lg:h-[10%] flex justify-between items-center p-4 lg:px-6 border-b border-gray-700 mt-4">
          <h1 className="text-lg lg:text-2xl text-white font-medium">
            Welcome <span className="text-blue-500 font-bold">{user.name}</span>
            ! 👋
          </h1>
          <button
            className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300 font-medium text-white"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        {/* Chat Container */}
        <div className="h-[93%] lg:h-[90%] relative bg-[#0e1624] mb-4 border border-gray-700">
          <div className="overflow-y-auto h-full pb-20 px-4 lg:px-6 pt-4 no-scrollbar">
            {Object.entries(messagesByDate).map(([date, dateMessages]) => (
              <div key={date}>
                {/* Date separator */}
                <div className="flex items-center justify-center my-4">
                  <div className="bg-gray-700 px-4 py-1 rounded-full">
                    <span className="text-xs text-gray-300 font-medium">
                      {formatDate(dateMessages[0].$createdAt)}
                    </span>
                  </div>
                </div>

                {/* Messages for this date */}
                {dateMessages.map((message) => (
                  <div
                    key={message.$id}
                    className={`mb-4 flex ${
                      message.user_id === user.$id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[75%] ${
                        message.user_id === user.$id
                          ? "items-end"
                          : "items-start"
                      } flex flex-col`}
                    >
                      {/* Username and timestamp */}
                      <div
                        className={`flex items-center gap-2 mb-1 px-1 ${
                          message.user_id === user.$id ? "flex-row-reverse" : ""
                        }`}
                      >
                        <p className="text-sm font-semibold text-white">
                          {message.username || "Anonymous"}
                        </p>
                        <span className="text-xs text-gray-400">
                          {new Date(message.$createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      {/* Message bubble */}
                      <div
                        className={`flex items-start gap-2 ${
                          message.user_id === user.$id ? "flex-row-reverse" : ""
                        }`}
                      >
                        <div
                          className={`px-4 py-3 rounded-2xl text-base ${
                            message.user_id === user.$id
                              ? "bg-blue-600 text-white rounded-br-sm"
                              : "bg-gray-700 text-white rounded-bl-sm"
                          }`}
                        >
                          <p className="break-words">{message.body}</p>
                        </div>

                        {/* Delete button */}
                        {message.$permissions.includes(
                          `delete("user:${user.$id}")`
                        ) && (
                          <button
                            className="opacity-80 hover:opacity-100 transition-opacity duration-200 p-1.5 hover:bg-red-600/20 rounded-lg group"
                            onClick={() => deleteMessage(message.$id)}
                            title="Delete message"
                          >
                            <Trash2
                              className="text-red-400 group-hover:text-red-500"
                              size={18}
                            />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSubmit}
            className="absolute bottom-0 left-0 w-full"
          >
            <div className="flex gap-2 p-3 bg-[#1a2332] border-t border-gray-700">
              <input
                className="flex-1 bg-gray-700 text-white text-base lg:text-lg px-5 py-3 lg:py-3.5 rounded-full outline-none border border-gray-600 focus:border-blue-500 transition duration-200 placeholder-gray-400"
                type="text"
                placeholder="Type your message..."
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                required
              />
              <button
                className="px-5 lg:px-6 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-white"
                type="submit"
                disabled={!messageBody.trim()}
              >
                <Send size={22} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Room;
