import React, { useState, useEffect, useRef } from 'react';
import {
  Bot,
  Send,
  User,
  Sparkles,
  RefreshCw,
  Globe,
  Mic,
  MicOff,
  HelpCircle,
  CheckCircle2,
  Info
} from 'lucide-react';
import { aiService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const AIAssistantPage = () => {
  const { user } = useAuth();
  const { language, setLanguage } = useLanguage();

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: language === 'hi'
        ? "नमस्ते किसान भाई! मैं आपका किसान एआई सहायक हूँ। आप मुझसे फसल बुवाई, खाद की मात्रा, कीट-रोग नियंत्रण या सरकारी योजनाओं से जुड़ा कोई भी सवाल पूछ सकते हैं।"
        : language === 'mr'
        ? "नमस्कार शेतकरी बंधूंनो! मी तुमचा किसान AI सहाय्यक आहे. तुम्ही मला पिकांची पेरणी, खते, कीड नियंत्रण किंवा शासकीय योजनांबद्दल विचारू शकता."
        : "Hello Farmer Friend! I am your Kisan AI Assistant. Ask me anything regarding crop sowing dates, fertilizer dosing, pest & disease remedies, weather guidance, or government schemes.",
      suggestions: [
        "Which crop is suitable for black soil?",
        "When should I sow wheat?",
        "Why are my tomato leaves turning yellow?",
        "What fertilizer is generally used for rice?"
      ]
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState('');
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (msgToSend = inputMessage) => {
    const text = msgToSend.trim();
    if (!text || loading) return;

    // Add user message
    const userMsg = { role: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await aiService.chat({
        message: text,
        language: language,
        conversation_id: conversationId || undefined,
      });

      if (res.data.conversation_id) {
        setConversationId(res.data.conversation_id);
      }

      const botMsg = {
        role: 'assistant',
        text: res.data.response,
        suggestions: res.data.suggestions || [],
        source: res.data.source,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("AI chat failed:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: "I am having difficulty processing your request right now. Please try asking again in simple words or switch language.",
          suggestions: ["Which crop for black soil?", "Wheat sowing time"],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePresetClick = (presetText) => {
    handleSendMessage(presetText);
  };

  const toggleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert("Speech recognition is not supported on this browser. Please type your question.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    if (!isListening) {
      setIsListening(true);
      recognition.start();

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    } else {
      recognition.stop();
      setIsListening(false);
    }
  };

  const resetChat = () => {
    setMessages([
      {
        role: 'assistant',
        text: "Conversation reset. How may I help you with your farming today?",
        suggestions: [
          "Which crop is suitable for black soil?",
          "When should I sow wheat?",
          "Why are my tomato leaves turning yellow?"
        ]
      }
    ]);
    setConversationId('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-forest-700 to-forest-500 text-white flex items-center justify-center shadow-md shadow-forest-600/20">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-gray-900">Kisan AI Assistant</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-forest-100 text-forest-900 text-xs font-black">
                Online
              </span>
            </div>
            <p className="text-xs font-semibold text-gray-700">
              Multilingual agricultural advisor (English, हिन्दी, मराठी)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div className="flex bg-gray-200/80 p-1 rounded-xl border border-gray-300 text-xs font-bold">
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 py-1 rounded-lg transition ${
                language === 'en' ? 'bg-forest-800 text-white shadow-sm font-black' : 'text-gray-800 hover:text-gray-950'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-3 py-1 rounded-lg transition ${
                language === 'hi' ? 'bg-forest-800 text-white shadow-sm font-black' : 'text-gray-800 hover:text-gray-950'
              }`}
            >
              हिन्दी
            </button>
            <button
              onClick={() => setLanguage('mr')}
              className={`px-3 py-1 rounded-lg transition ${
                language === 'mr' ? 'bg-forest-800 text-white shadow-sm font-black' : 'text-gray-800 hover:text-gray-950'
              }`}
            >
              मराठी
            </button>
          </div>

          <button
            onClick={resetChat}
            title="Reset Chat"
            className="p-2 text-gray-700 hover:text-gray-950 hover:bg-gray-200 rounded-xl transition border border-gray-200"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-soft p-4 sm:p-6 min-h-[480px] max-h-[600px] overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-forest-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div className={`max-w-[85%] space-y-2`}>
              <div
                className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-forest-800 text-white rounded-tr-none font-semibold shadow-xs'
                    : 'bg-forest-50/90 text-gray-950 font-medium border border-forest-200 rounded-tl-none whitespace-pre-line'
                }`}
              >
                {msg.text}
              </div>

              {/* Suggestions chips */}
              {msg.suggestions && msg.suggestions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {msg.suggestions.map((sug, i) => (
                    <button
                      key={i}
                      onClick={() => handlePresetClick(sug)}
                      className="text-xs px-3.5 py-1.5 rounded-full bg-white border-2 border-forest-300 text-forest-900 hover:bg-forest-100 font-bold transition shadow-xs"
                    >
                      {sug} →
                    </button>
                  ))}
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-900 flex items-center justify-center shrink-0 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 items-center text-gray-800 text-xs font-bold">
            <div className="w-8 h-8 rounded-full bg-forest-700 text-white flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3 bg-gray-100 rounded-2xl border border-gray-200 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-forest-700 animate-spin" />
              <span>Kisan AI is analyzing your query...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Message Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="relative flex items-center gap-2 bg-white p-2.5 rounded-2xl border-2 border-gray-300 shadow-soft focus-within:border-forest-600"
      >
        <button
          type="button"
          onClick={toggleVoiceInput}
          className={`p-2.5 rounded-xl transition ${
            isListening
              ? 'bg-red-600 text-white animate-pulse'
              : 'text-gray-700 hover:text-forest-800 hover:bg-forest-50'
          }`}
          title="Voice input"
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={
            language === 'hi'
              ? "फसल, खाद या कीट संबंधित प्रश्न पूछें..."
              : language === 'mr'
              ? "पीक, खत किंवा रोग याविषयी विचारा..."
              : "Ask a question about crops, fertilizers, pests, or schemes..."
          }
          className="flex-1 px-3 py-2 text-sm font-semibold text-gray-900 placeholder:text-gray-500 focus:outline-none"
        />

        <button
          type="submit"
          disabled={!inputMessage.trim() || loading}
          className="px-5 py-2.5 bg-forest-700 hover:bg-forest-800 disabled:opacity-50 text-white font-black rounded-xl transition flex items-center gap-1.5 text-xs shadow-sm"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};

export default AIAssistantPage;
