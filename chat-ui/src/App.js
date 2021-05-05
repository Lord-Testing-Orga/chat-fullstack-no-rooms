import './App.css';
import socketIo from 'socket.io-client'
import { useEffect, useRef, useState } from 'react';
import faker from 'faker'

const MESSAGE_SERVER_URL = process.env.MESSAGE_SERVER_URL || "http://localhost:5000/"

function App() {

  const [socket, setSocket] = useState()
  const [userName, setUserName] = useState(faker.name.firstName())

  const [chatHistory, setChatHistory] = useState([
    { text: "Hey there", user: "Rob" },
    { text: "Hi Rob", user: "Raquel" },
  ])

  const msgRef = useRef() // store fresh message

  // initialize connection on load
  useEffect(() => {
    const socket = socketIo(MESSAGE_SERVER_URL) // connect to API
    setSocket(socket)

    // CLEAN UP THE EFFECT
    return () => {
      if(socket) socket.disconnect();
    }
  }, [])
  

  // define listeners AFTER connection is setup
  useEffect(() => {

    if(socket) {
      console.log("Registering chat message listener...")
      socket.on("message", (chatMsg) => {
        console.log("Received message from server: ", chatMsg)
        setChatHistory([...chatHistory, chatMsg])
      })
    }

    return () => {
      if(socket) socket.off('message')
    }

  }, [socket, chatHistory]) // this effect will FIRE when the socket was set!

  const addChatMessageToHistory = (e) => {
    e.preventDefault()

    let chatMsg = { text: msgRef.current.value, user: userName }
    msgRef.current.value = "" // clear input box

    socket.emit('message', chatMsg) // send an EVENT to server! (to a hotline channel)
    setChatHistory([ ...chatHistory, chatMsg ])    
  }
 
  // create JSX list from chat history entries
  let jsxChatHistory = chatHistory.map((chatMsg, i) => (
    <div className="chat-msg" key={i}>
      <label>{chatMsg.user}:</label>
      <span>{chatMsg.text}</span>
    </div>
  ))

  return (
    <div className="App">
      <header className="App-header">
        <h2>Chat</h2>
        <div id="chat-area">{jsxChatHistory}</div>
        <form id="message-send" onSubmit={addChatMessageToHistory}>
          <input 
            autoComplete="off"
            ref={msgRef}
            name="message-new" 
            placeholder={`Type your message, ${userName}...`} />
          <button type="submit" >Send</button>
        </form>
      </header>
    </div>
  );
}

export default App;
