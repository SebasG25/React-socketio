import './App.css';
import io from 'socket.io-client';
import { useState, useEffect } from 'react'

const socket = io('https://vive-fest-chat.herokuapp.com/')

function App() {

  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message) {
      socket.emit('message', message)
      setMessage('')
      const newMessage = {
        body: message,
        from: 'Me'
      }
      setMessages([newMessage, ...messages])
    }
  }

  useEffect(() => {
    const receiveMessage = message => {
      setMessages(messages => [{
        body: message.body,
        from: message.from
      }, ...messages])
    }
    socket.on('message', receiveMessage)

    return () => {
      socket.off('message', receiveMessage)
    }
  }, [message])

  return (
    <div className="h-screen bg-zinc-800 text-white flex items-center justify-center">
      <form onSubmit={handleSubmit} className='bg-zinc-900 w-80 p-10'>
        <h1 className='text-2xl font-bold my-2'>Chat React</h1>
        <input className='border-2 border-zinc-500 p-2 text-black w-full' type="text" onChange={e => setMessage(e.target.value)} value={message} />
        <ul className='h-80 overflow-y-auto'>
          {messages && messages.map((message, index) => (
            <li key={index} className={`table my-2 p-2 text-sm rounded-md ${message.from === 'Me' ? 'bg-sky-700 ml-auto' : 'bg-black'}`}>
              <p><b>{message.from}:</b> {message.body}</p>
            </li>
          ))}
        </ul>
      </form>
    </div>
  );
}

export default App;
