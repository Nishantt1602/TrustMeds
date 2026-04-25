import { useState, useEffect, useRef, useContext } from 'react';
import API from '../../services/api';
import { Send, User, X } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const ChatWindow = ({ otherUser, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useContext(AuthContext);

  const fetchHistory = async () => {
    try {
      const { data } = await API.get(`/chat/history/${otherUser._id}`);
      setMessages(data);
    } catch (error) {
      console.error('Failed to fetch chat history');
    }
  };

  useEffect(() => {
    fetchHistory();
    const interval = setInterval(fetchHistory, 5000); // Polling every 5s
    return () => clearInterval(interval);
  }, [otherUser._id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    try {
      const { data } = await API.post('/chat/send', {
        receiverId: otherUser._id,
        text: inputText,
      });
      setMessages([...messages, data]);
      setInputText('');
    } catch (error) {
      console.error('Failed to send message');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-white shadow-2xl rounded-2xl flex flex-col border border-gray-100 z-[200] overflow-hidden animate-in slide-in-from-bottom">
      {/* Header */}
      <div className="bg-teal-600 p-4 text-white flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center">
            <User size={16} />
          </div>
          <div>
            <p className="text-sm font-bold">{otherUser.name}</p>
            <p className="text-[10px] opacity-80 uppercase tracking-widest font-black">Online</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-teal-700 rounded-lg transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50 flex flex-col">
        {messages.map((msg, i) => {
          const isMe = msg.senderId === user?.id || msg.senderId === user?._id;
          return (
            <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-2xl text-xs font-semibold shadow-sm ${
                isMe ? 'bg-teal-600 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t bg-white flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-gray-100 border-none rounded-xl px-4 py-2 text-xs font-bold focus:ring-2 focus:ring-teal-500 focus:bg-white transition-all"
        />
        <button type="submit" className="bg-teal-600 text-white p-2 rounded-xl hover:bg-teal-700 active:scale-95 transition-all">
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
