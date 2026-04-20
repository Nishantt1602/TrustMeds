import { useState, useRef, useEffect } from 'react';
import API from '../../services/api';
import { Bot, Send, User, AlertTriangle } from 'lucide-react';

const ChatbotPage = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "Hello! I'm your TrustMeds AI Assistant. Tell me your symptoms or ask me about any medicine." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    setMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await API.post('/chat', { prompt: userText });
      setMessages((prev) => [...prev, { role: 'ai', text: data.reply }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: 'ai', text: "Sorry, I'm having trouble connecting right now. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 h-[calc(100vh-80px)] flex flex-col">
      <div className="bg-teal-50 border border-teal-200 rounded-t-xl p-4 flex items-center gap-3">
        <Bot className="w-8 h-8 text-teal-600" />
        <div>
          <h1 className="text-xl font-bold text-gray-900">TrustMeds AI Assistant</h1>
          <p className="text-sm text-teal-700 flex items-center gap-1">
            <AlertTriangle className="w-4 h-4" /> Not a substitute for professional medical advice.
          </p>
        </div>
      </div>

      <div className="flex-1 bg-white border-x border-gray-200 p-6 overflow-y-auto flex flex-col gap-6">
        {messages.map((msg, index) => (
          <div key={index} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-green-100 text-green-600' : 'bg-teal-100 text-teal-600'}`}>
              {msg.role === 'user' ? <User className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
            </div>
            <div className={`p-4 rounded-2xl max-w-[80%] whitespace-pre-wrap ${msg.role === 'user' ? 'bg-green-600 text-white rounded-tr-none' : 'bg-gray-100 text-gray-800 rounded-tl-none'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center shrink-0">
              <Bot className="w-6 h-6" />
            </div>
            <div className="p-4 rounded-2xl bg-gray-100 text-gray-500 rounded-tl-none animate-pulse">
              Typing...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="bg-white border border-gray-200 rounded-b-xl p-4 flex gap-2">
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your symptoms (e.g., I have a mild headache)..." 
          className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-3 focus:ring-teal-500"
          disabled={loading}
        />
        <button type="submit" disabled={loading} className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 transition flex items-center justify-center">
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default ChatbotPage;