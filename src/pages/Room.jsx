import client, { databases } from '../appwrite/appwriteConfig'
import config from '../config/config'
import { useEffect, useState, useRef } from 'react'
import { ID, Permission, Query, Role } from 'appwrite'
import { Send, Trash2 } from 'react-feather'
import { useAuth } from '../contexts/AuthContext'

const Room = () => {

  const [messages, setMessages] = useState([]);
  const [messageBody, setMessageBody] = useState('');
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

        if (response.events.includes("databases.*.collections.*.documents.*.create")) {
          setMessages((prevMessages) => [...prevMessages, response.payload]);
          scrollToBottom();  // Scroll to bottom when a new message is added
        }
        if (response.events.includes("databases.*.collections.*.documents.*.delete")) {
          setMessages((prevMessages) => prevMessages.filter(message => message.$id !== response.payload.$id));
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const permissions = [
      Permission.write(Role.user(user.$id))
    ];

    const payload = {
      user_id: user.$id,
      username: user.name,
      body: messageBody
    };

    try {
      await databases.createDocument(
        config.appwriteDatabaseId,
        config.appwriteCollectionId,
        ID.unique(),
        payload,
        permissions
      );
      setMessageBody('');
    } catch (error) {
      console.error("Error creating document:", error);
    }
  };

  const getMessages = async () => {
    const response = await databases.listDocuments(
      config.appwriteDatabaseId,
      config.appwriteCollectionId,
      [Query.orderAsc("$createdAt")]
    );
    setMessages(response.documents);
    scrollToBottom();
  };

  const deleteMessage = async (message_id) => {
    await databases.deleteDocument(
      config.appwriteDatabaseId, config.appwriteCollectionId, message_id
    );
  };

  return (
    <div className='w-full h-full flex justify-center'>
      <div className='w-11/12 h-full lg:w-2/4'>
        <div className=" pl-2 h-[7%] lg:h-[10%] flex justify-between items-center">
          <h1 className='text-xl lg:text-2xl text-gray-400'>
            Welcome <span className='bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 text-transparent bg-clip-text font-semibold'>{user.name}</span>!
          </h1>
          <button
            className='bg-slate-700 p-2 m-1 rounded-lg hover:bg-red-700 transition duration-200'
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
        <div className='h-[93%] lg:h-[90%] relative p-5 lg:p-9 border border-slate-800'>
          <div className='overflow-y-auto h-full pb-14 lg:pb-10 no-scrollbar'>
            {messages.map(message => (
              <div key={message.$id} className=''>
                <div className='flex justify-between pl-1'>
                  <p className='text-slate-200'>
                    {message.username ? <span className='font-sans'>{message.username}</span> : <span className='font-sans'>Anonymous</span>}
                  </p>
                  <span className='text-slate-400 text-xs p-1 font-sans'>
                    {new Date(message.$createdAt).toLocaleString()}
                  </span>
                </div>
                <div className='mb-2 gap-2 flex justify-between'>
                  <span
                    className={`px-3 py-2 rounded-2xl text-lg 
                      ${message.user_id === user.$id ?
                        'border-2 border-blue-600 text-white' :
                        'bg-blue-600 text-white'
                      }`}
                  >
                    {message.body}
                  </span>
                  {message.$permissions.includes(`delete(\"user:${user.$id}\")`) && (
                    <button
                      className='hover:scale-125 transition duration-200'
                      onClick={() => deleteMessage(message.$id)}
                    >
                      <Trash2 color='red' size={20} />
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSubmit}>
            <div className="flex absolute bottom-0 left-0 px-5 lg:px-8 pt-2 pb-4 gap-1 w-full border-b border-slate-800">
              <input
                className='w-10/12 bg-white text-black text-xl px-5 py-3 rounded-3xl outline-none'
                type="text"
                placeholder='write your message...'
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                required
              />
              <button
                className='w-2/12 text-xl rounded-full bg-blue-500 flex items-center justify-center transition duration-300 hover:bg-blue-700'
                type="submit"
              >
                <Send className='bg-inherit' size={30} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Room;
