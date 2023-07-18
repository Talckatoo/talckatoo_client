import React, { useState, useContext, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import ChatInput from "../components/ChatInput";
import { UserContext } from "../context/user-context";
import ChatWelcome from "../components/ChatWelcome";
import { getTime } from "../util/getTime";
import { v4 as uuidv4 } from "uuid";
import JumpingDotsAnimation from "../UI/animation"
import { HiOutlineLanguage } from "react-icons/hi2";
import languagesArray from "../util/languages";
import textToVoiceLanguages from "../util/textToVoiceLanguages";
import TextToSpeech from "../components/TextToSpeech";
import DOMAIN from "../util/url";

interface Socket {
  current: any;
}

const ChatContainer = ({ socket }: { socket: Socket }): JSX.Element => {

    const {
        user, 
        conversationId, 
        setConversationId,
        selectId, 
        isDarkMode,
        recipient, setRecipient,
        messages, setMessages,
        language, 
    } = useContext(UserContext)


    const [usersArray, setUsersArray] = useState([])
    const [arrivalMessages, setArrivalMessages] = useState(null)
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const [selectedTyping, setSelectedTyping] = useState()
    const scrollRef = useRef<HTMLDivElement | null>(null)
    const token: {token: string } | null = JSON.parse(localStorage.getItem("token") || "null")
    const idArray = usersArray?.map((obj) => obj._id)


    const fullLanguage = languagesArray.map((l) => {
      if (l.code === language) return l.language
    })

    const voiceCode = textToVoiceLanguages.find((la) => la.code === language)?.voiceCode


    const fetchMessages = async () => {
        try {
            if (user && !!conversationId) {
                const {data} = await axios.get(`${DOMAIN.BACKEND_DEPLOY_URL}/api/v1/users/${user._id}/conversations/${conversationId}`, 
                {
                    headers: {
                      Authorization: `Bearer ${token}`
                    }
                  }
                )
                const {messages} = data.conversation
                const {users} = data.conversation

                if (users[0].userName === user?.userName) {
                    setRecipient(users[1].userName)
                } else {
                    setRecipient(users[0].userName)
                }
                setMessages(messages)
                const AIuser = {
                  userName: "AI Assistant",
                  _id: import.meta.env.VITE_AI_ASSISTANT_ID
                }
                setUsersArray([...data.conversation.users, AIuser])

            }
        } catch (err) {
            toast.error("Error fetching messages, please try again");
        }
    }



  useEffect(() => {
    if (socket.current) {
      socket.current.on("isTyping", (data:any) => {
        setSelectedTyping(data)
        setIsTyping(true)
      }
      );
      socket.current.on("stopTyping", () => setIsTyping(false));
    }
  }, [socket.current]);


  useEffect(() => {
    fetchMessages();    
  }, [selectId, conversationId]);


    const sendAIMessage = (messageAI: any) => {
        socket.current.emit("sendMessageChatGPT", {
            message: messageAI, 
            from: user?._id,
            to: selectId, 
            createdAt: Date.now()
        })

        setMessages( prev => [...prev, {
            createdAt: Date.now(),
            message: messageAI, 
            sender: user?._id, 
            _id: uuidv4(),
        }])
    }

  


    const sendMessage = async (messageText:any) => {

        socket.current.emit("stopTyping", selectId)
        if (selectId && conversationId) {
       
          try {

            const {data} = await axios.post(`${DOMAIN.BACKEND_DEPLOY_URL}/api/v1/messages`, {
                 from: user?._id,
                 to: selectId, 
                 targetLanguage: language,
                 message: messageText
             },
             {
                 headers: {
                   Authorization: `Bearer ${token}`
                 }
               }
             )

             const {message} = data
        

             socket.current.emit("sendMessage", {
                 createdAt: message.createdAt,
                 from: user?._id,
                 to: selectId, 
                 targetLanguage: language,
                 message: message.message
             })
 
             setMessages( prev => [...prev, {
                 createdAt: message.createdAt,
                 message: message.message, 
                 sender: user?._id, 
                 _id: message._id,
             }])
 
 
         } catch (err) {
             toast.error("Error sending messages, please try again");
         }
        } else if (selectId && conversationId === null) {
          setMessages([])
          try {
            const {data} = await axios.post(`${DOMAIN.BACKEND_DEPLOY_URL}/api/v1/messages`, {
                 from: user?._id,
                 to: selectId, 
                 targetLanguage: language,
                 message: messageText
             },
             {
                 headers: {
                   Authorization: `Bearer ${token}`
                 }
               }
             )
             const {message} = data
             if(data.conversation._id){
               setConversationId(data.conversation._id)
             }

            
             socket.current.emit("sendMessage", {
                 createdAt: message.createdAt,
                 from: user?._id,
                 to: selectId, 
                 targetLanguage: language,
                 message: message.message
             })
         } 
         catch (err) {
             toast.error("Error sending messages, please try again");
         }
        }
    }

    


    useEffect(() => {
        if (socket.current) {
            socket.current.on("getMessage", (data:any) => {
                if(data.message) {
                    setArrivalMessages({
                        createdAt: data.createdAt,
                        message: data.message , 
                        sender: data.from, 
                        _id: uuidv4(),
                    })
                } else if (data.voiceNote) {
                    setArrivalMessages({
                        createdAt: data.createdAt,
                        voiceNote: {
                            url: data.voiceNote.url
                        }, 
                        sender: data.from, 
                        _id: uuidv4(),
                    })
                } else if (data.messageReply) {
                    toast.update(2, { render: "done", type: "success", hideProgressBar: true, autoClose:1000, isLoading: false });
                    setArrivalMessages({
                        createdAt: data.messageReply.createdAt,
                        message: data.messageReply.message, 
                        sender: data.messageReply.sender, 
                        _id: uuidv4(),
                    })
                }
            } )}
        
    }, [socket.current, arrivalMessages])



    useEffect(() => {
        arrivalMessages  
        && idArray?.includes(arrivalMessages.sender) 
        && setMessages((prev) =>[...prev, arrivalMessages])
    }, [arrivalMessages])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);


  const onHandleTranslateText = async (translateText: string) => {

    socket.current.emit("stopTyping", selectId)
    if (selectId && conversationId && translateText) {
      try {

        const {data} = await axios.post(`${DOMAIN.BACKEND_DEPLOY_URL}/api/v1/messages`, {
             from: user?._id,
             to: selectId, 
             targetLanguage: language,
             message: translateText.text,
             voiceTargetLanguage: voiceCode,
             voiceToVoice: true
         },
         {
             headers: {
               Authorization: `Bearer ${token}`
             }
           }
         )

         const {message} = data
         setMessages((prev) => [
          ...prev,
          {
            createdAt: message.createdAt,
            voiceNote: {
              url: message.voiceNote.url,
            },
            sender: user?._id,
            _id: message._id,
          },
        ]);

        socket.current.emit("sendMessage", {
          createdAt: message.createdAt,
          voiceNote: {
            url: message.voiceNote.url,
          },
          from: user?._id,
          to: selectId,
        });
        
   
    
     } catch (err) {
         toast.error("Error sending messages, please try again");
     }
  }}


  return (
    <>
      <div
        className={`flex flex-grow flex-col shadow  ${
          isDarkMode ? "bg-slate-800" : "bg-slate-200"
        }`}
      >
        <div
          className={`w-full h-14 text-black pt-4 cursor-pointer rounded-tl-lg shadow text-center font-medium border-b-2 ${
            isDarkMode ? "bg-gray-800 text-white border-slate-700" : "bg-slate-200 border-slate-300"
          }`}
        >
          <div className="flex flex-row mx-2 px-2 gap-2">
              <p>{recipient}</p>
              {language ? 
                    (
                    <>
                    <HiOutlineLanguage />
                    <span>  {language} / {fullLanguage} </span>
                    </>
                    )
                    :  (
                      <>
                      <HiOutlineLanguage />
                      <span> en / English </span>
                      </>
                      )
              }
          </div>
        </div>
        <div
          className={`w-full flex-grow flex flex-col ${
            isDarkMode ? "bg-gray-800" : "bg-slate-200"
          }`}
        >
                <div className="relative h-full">
                <div className="overflow-y-auto absolute top-0 left-0 right-0 bottom-0"> 
                {!!selectId && !!conversationId ? (
                
                    <div className='m-2 p-2'>
                    {messages ? messages.map((msg) => (
        
                        <div 
                        className={('text-left ' +
                        (msg.sender === user?._id ? 'text-right '  : '') +
                        (msg.sender == import.meta.env.VITE_AI_ASSISTANT_ID ?  'text-center' : '') 
                      )}
                        key={msg._id}
                        >
                        <div 
                      className={('max-w-md inline-block  rounded-lg m-2 p-2 ' +
                      (msg.sender === user?._id ? 'bg-[#f8fafc] text-left ' : '') +
                      (msg.sender == import.meta.env.VITE_AI_ASSISTANT_ID ?  'bg-amber-100 text-center' : 'bg-[#94a3b8]') 
                      
                    )}
                        >
                       {msg.sender !== import.meta.env.VITE_AI_ASSISTANT_ID && msg.message && msg.message.includes("\n") ? (
                        msg.message.split("\n").map((line, index, lines) => {
                          const prevLine = index > 0 ? lines[index - 1] : null;
                          const isFirstLine = index === 0 || line !== prevLine;
                          
                          return (
                            <React.Fragment key={index}>
                              {isFirstLine && line}
                              {isFirstLine && index !== lines.length - 1 && line !== lines[index + 1] && (
                                <>
                                  <br />
                                  <img width="15" height="15" src="https://img.icons8.com/ios-glyphs/30/right3.png" alt="right3" />                         
                                </>
                              )}
                            </React.Fragment>
                          );
                        })
                      ) : (
                        <>{msg.message}</>
                      )}

                        <div className="flex flex-row gap-2">  
                        <div className='w-1/3 text-xxs text-gray-600 items-end'>
                          {getTime(msg.createdAt)}
                        </div>
                       
                        <TextToSpeech convertedText={msg.message} />
                       
                        </div>
                       {msg.voiceNote && (
                        <audio className="w-60 h-15" controls>
                        <source src={msg.voiceNote?.url} type="audio/mpeg" />
                        </audio>)
                        }
                        </div>
                        <div ref={scrollRef}></div>
                        </div>
                    )) : null}
                 
                </div>
              ) : (
                <ChatWelcome />
              )}
            </div>
          </div>
        </div>
        <hr className={`mb-3 ${isDarkMode ? "border-slate-700" : "border-slate-300"}`} />
        {selectedTyping?.to === user?._id 
        && selectedTyping?.from === selectId 
        && isTyping ? <JumpingDotsAnimation /> : null}
                <div
          className={`w-full h-30 py-2 ${
            isDarkMode ? "bg-gray-800" : "bg-slate-200"
          }`}
        >
       
            {selectId ? (
                <>
                <ChatInput 
                onHandleSendMessage={sendMessage} 
                onHandleSendAIMessage={sendAIMessage}
                socket={socket}
                typing={typing}
                setTyping={setTyping}
                isTyping={isTyping}
                setIsTyping={setIsTyping}
                onHandleTranslateText={onHandleTranslateText}
                />
                </>
            ) : null}
                </div>

           
            </div>
        </>
    )
}

export default ChatContainer


