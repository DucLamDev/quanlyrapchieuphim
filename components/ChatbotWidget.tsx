'use client';

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User, AlertCircle } from 'lucide-react';
import axios from 'axios';

interface MovieCard {
  _id: string;
  title: string;
  poster?: string;
  rating: number;
  ratingCount?: number;
  genres: string[];
  duration?: number;
  status?: string;
  ageRating?: string;
}

interface Message {
  role: 'user' | 'assistant' | 'system';
  message: string;
  timestamp: number;
  suggestions?: string[];
  movieCards?: MovieCard[];
  bookingFlow?: boolean;
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random()}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        role: 'assistant',
        message: 'Xin chào! Tôi là trợ lý ảo của Cinema. Tôi có thể giúp bạn:\n\n🎬 Tìm phim và đặt vé\n🎫 Xem lịch chiếu\n👥 Tìm suất ít đông\n🎁 Kiểm tra ưu đãi\n\nBạn cần tôi hỗ trợ gì?',
        timestamp: Date.now(),
        suggestions: ['Đặt vé', 'Tìm phim', 'Suất yên tĩnh', 'Khuyến mãi']
      }]);
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      role: 'user',
      message: text,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('/api/chatbot/message', {
        message: text,
        sessionId
      });

      const botMessage: Message = {
        role: response.data.needsHumanSupport ? 'system' : 'assistant',
        message: response.data.message,
        timestamp: Date.now(),
        suggestions: response.data.suggestions,
        movieCards: response.data.movieCards,
        bookingFlow: response.data.bookingFlow
      };

      setMessages(prev => [...prev, botMessage]);

      // Handle escalation
      if (response.data.needsHumanSupport) {
        setTimeout(() => {
          setMessages(prev => [...prev, {
            role: 'system',
            message: '🔔 Đã thông báo cho nhân viên hỗ trợ. Bạn sẽ được kết nối trong giây lát.',
            timestamp: Date.now()
          }]);
        }, 1000);
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      setMessages(prev => [...prev, {
        role: 'system',
        message: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.',
        timestamp: Date.now()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg transition-all z-50 ${
          isOpen ? 'bg-red-600' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-gray-900 rounded-lg shadow-2xl flex flex-col z-50 border border-gray-700">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-full">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white">Cinema AI Assistant</h3>
                <p className="text-xs text-blue-100">Trợ lý ảo thông minh</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, index) => (
              <div key={index}>
                <div
                  className={`flex gap-3 ${
                    msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      msg.role === 'user'
                        ? 'bg-blue-600'
                        : msg.role === 'system'
                        ? 'bg-orange-600'
                        : 'bg-purple-600'
                    }`}
                  >
                    {msg.role === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : msg.role === 'system' ? (
                      <AlertCircle className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>

                  <div
                    className={`max-w-[75%] p-3 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : msg.role === 'system'
                        ? 'bg-orange-600/20 text-orange-200 border border-orange-600/50'
                        : 'bg-gray-800 text-gray-100'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                    <span className="text-xs opacity-60 mt-1 block">
                      {new Date(msg.timestamp).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>

                {/* Suggestions */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2 ml-11">
                    {msg.suggestions.map((suggestion, i) => (
                      <button
                        key={i}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-sm text-gray-300 rounded-full border border-gray-700 transition"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}

                {/* Movie Cards with Booking Button */}
                {msg.movieCards && msg.movieCards.length > 0 && (
                  <div className="mt-3 ml-11 space-y-3">
                    {msg.bookingFlow && (
                      <div className="bg-blue-900/30 border border-blue-600/50 rounded-lg p-3 mb-2">
                        <p className="text-xs text-blue-300 mb-1">📋 Quy trình đặt vé:</p>
                        <p className="text-xs text-gray-400">1. Chọn phim → 2. Chọn rạp & suất → 3. Chọn ghế → 4. Thanh toán</p>
                      </div>
                    )}
                    {msg.movieCards.slice(0, 3).map((movie) => (
                      <div
                        key={movie._id}
                        className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden hover:border-blue-500 transition-colors"
                      >
                        <div className="flex gap-3 p-3">
                          {/* Poster */}
                          <div className="flex-shrink-0 w-20 h-28 bg-gray-700 rounded overflow-hidden">
                            {movie.poster ? (
                              <img 
                                src={movie.poster} 
                                alt={movie.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-500">
                                🎬
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-white text-sm mb-1 truncate">
                              {movie.title}
                            </h4>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-yellow-400 text-xs">⭐ {movie.rating.toFixed(1)}</span>
                              {movie.ratingCount && (
                                <span className="text-gray-500 text-xs">({movie.ratingCount})</span>
                              )}
                              {movie.ageRating && (
                                <span className="text-xs px-1.5 py-0.5 bg-red-600 rounded text-white">
                                  {movie.ageRating}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-400 mb-2">
                              {movie.genres.join(', ')} {movie.duration && `• ${movie.duration}p`}
                            </p>
                            <button
                              onClick={() => window.location.href = `/movies/${movie._id}`}
                              className="w-full px-3 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs font-medium rounded transition-all"
                            >
                              🎟️ Đặt vé ngay
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {msg.movieCards.length > 3 && (
                      <button
                        onClick={() => window.location.href = '/movies'}
                        className="w-full text-center text-xs text-blue-400 hover:text-blue-300 py-2"
                      >
                        Xem thêm {msg.movieCards.length - 3} phim khác →
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-800 p-3 rounded-lg">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-700">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Nhập tin nhắn..."
                className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition"
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
