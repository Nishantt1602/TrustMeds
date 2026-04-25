import { useState, useRef, useEffect } from 'react';
import API from '../../services/api';
import { 
  Bot, 
  Send, 
  User, 
  AlertTriangle, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Trash2, 
  Copy, 
  Sparkles,
  RefreshCcw
} from 'lucide-react';
import toast from 'react-hot-toast';

const ChatbotPage = () => {
  const [messages, setMessages] = useState([
    { 
      role: 'ai', 
      text: "Hello! I'm your TrustMeds AI Assistant. I can help you understand symptoms, provide information about medicines, or guide you through the platform.\n\nHow can I help you today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(true);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const suggestedQueries = [
    "What are the uses of Paracetamol?",
    "I have a mild headache and fever",
    "How to use TrustMeds for ordering?",
    "Common side effects of Aspirin"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
      } else {
        toast.error('Speech recognition not supported in this browser.');
      }
    }
  };

  const speak = (text) => {
    if (!isSpeaking) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const clearChat = () => {
    setMessages([{ 
      role: 'ai', 
      text: "Chat cleared. How can I assist you further?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  const handleSend = async (textToSend) => {
    const text = typeof textToSend === 'string' ? textToSend : input;
    if (!text.trim()) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages((prev) => [...prev, { role: 'user', text, time }]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await API.post('/chat/ai', { prompt: text });
      const aiReply = data.reply;
      const aiTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages((prev) => [...prev, { role: 'ai', text: aiReply, time: aiTime }]);
      speak(aiReply);
    } catch (error) {
      const errorMsg = "I'm currently undergoing maintenance. Please try again in 1 minute.";
      setMessages((prev) => [...prev, { role: 'ai', text: errorMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      speak(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 h-[calc(100vh-100px)] flex flex-col font-sans">
      
      {/* Header */}
      <div className="bg-white border border-gray-100 rounded-t-[32px] p-6 flex items-center gap-4 shadow-sm relative z-10">
        <div className="w-14 h-14 bg-teal-500 rounded-2xl flex items-center justify-center shadow-lg shadow-teal-200">
          <Bot className="w-8 h-8 text-white" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">TrustMeds AI</h1>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Active Assistant</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={clearChat}
            className="p-3 rounded-2xl text-gray-400 hover:bg-gray-50 hover:text-red-500 transition-all"
            title="Clear Chat"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setIsSpeaking(!isSpeaking)}
            className={`p-3 rounded-2xl transition-all ${isSpeaking ? 'bg-teal-50 text-teal-600' : 'bg-gray-50 text-gray-400'}`}
          >
            {isSpeaking ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Warning Bar */}
      <div className="bg-orange-50 border-x border-orange-100 px-6 py-2 flex items-center gap-2 text-[10px] font-black text-orange-600 uppercase tracking-widest">
        <AlertTriangle className="w-3 h-3" /> Important: Always consult a professional for medical emergencies.
      </div>

      {/* Messages */}
      <div className="flex-1 bg-white border-x border-gray-100 p-8 overflow-y-auto space-y-8 scroll-smooth custom-scrollbar">
        {messages.map((msg, index) => (
          <div key={index} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
              msg.role === 'user' ? 'bg-gray-900 text-white' : 'bg-teal-50 text-teal-600'
            }`}>
              {msg.role === 'user' ? <User className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
            </div>
            
            <div className={`group relative max-w-[75%] space-y-1`}>
              <div className={`p-5 rounded-[24px] text-[15px] leading-relaxed shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-green-600 text-white rounded-tr-none font-medium' 
                  : 'bg-gray-50 text-gray-800 rounded-tl-none font-medium'
              }`}>
                {msg.text}
              </div>
              <div className={`flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-400 px-1 ${
                msg.role === 'user' ? 'flex-row-reverse' : ''
              }`}>
                <span>{msg.time}</span>
                {msg.role === 'ai' && (
                  <button 
                    onClick={() => copyToClipboard(msg.text)}
                    className="opacity-0 group-hover:opacity-100 transition hover:text-teal-600"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex gap-4 animate-in fade-in">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <Bot className="w-5 h-5 animate-bounce" />
            </div>
            <div className="bg-gray-50 p-6 rounded-[24px] rounded-tl-none flex gap-1">
              <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce delay-100"></span>
              <span className="w-2 h-2 bg-teal-400 rounded-full animate-bounce delay-200"></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Area */}
      <div className="bg-white border border-gray-100 rounded-b-[32px] p-6 space-y-6 shadow-sm relative z-10">
        
        {/* Suggested Queries */}
        <div className="flex flex-wrap gap-2">
          {suggestedQueries.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="px-4 py-2 bg-teal-50 text-teal-700 text-xs font-black rounded-full border border-teal-100 hover:bg-teal-100 hover:border-teal-200 transition uppercase tracking-wider"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input */}
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
          className="relative flex items-center gap-3"
        >
          <div className="relative flex-1 group">
            <input 
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? "Listening effectively..." : "Message TrustMeds AI..."} 
              className={`w-full pl-6 pr-16 py-5 bg-gray-50 border-2 rounded-[24px] font-bold text-gray-800 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-8 focus:ring-teal-500/5 transition-all ${
                isListening ? 'border-teal-400 animate-pulse' : 'border-gray-50 focus:border-teal-500'
              }`}
              disabled={loading}
            />
            <button 
              type="button"
              onClick={toggleListening}
              className={`absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-xl transition-all ${
                isListening ? 'bg-red-500 text-white shadow-lg' : 'text-gray-400 hover:text-teal-600 hover:bg-teal-50'
              }`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          </div>
          
          <button 
            type="submit" 
            disabled={loading || !input.trim()} 
            className="w-16 h-16 bg-gray-900 text-white rounded-[24px] flex items-center justify-center shadow-xl shadow-gray-200 hover:bg-teal-600 hover:shadow-teal-100 transition-all active:scale-95 disabled:bg-gray-100 disabled:shadow-none disabled:text-gray-300"
          >
            <Send className="w-6 h-6" />
          </button>
        </form>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
      `}</style>
    </div>
  );
};

export default ChatbotPage;