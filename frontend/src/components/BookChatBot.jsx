import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, User, Bot, Loader, BookOpen, Sparkles } from 'lucide-react';

const BookChatBot = ({ book, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!currentQuestion.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: currentQuestion.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setError('');
    setCurrentQuestion('');

    try {
      const response = await fetch('http://localhost:8000/book_bot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          book_name: book.book_name,
          summary: book.summary,
          question: currentQuestion.trim()
        }),
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('No answer found for this question. Try asking something different.');
        }
        throw new Error(`Failed to get answer: ${response.status}`);
      }

      const data = await response.json();
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: data.answer,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    "What makes this book still relevant today?",
    "What are the main themes explored in this book?",
    "Who would you recommend this book to?",
    "What impact did this book have on literature?",
    "How does this book compare to similar works?"
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 w-full max-w-2xl h-[700px] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header with glassmorphism effect */}
        <div className="relative bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 p-6">
          <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-2 bg-white/20 rounded-2xl backdrop-blur-sm">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-bold text-white">Literary Expert</h2>
                  <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse" />
                </div>
                <p className="text-violet-100 text-sm font-medium">
                  Discussing "{book.book_name}"
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition-all duration-200 hover:scale-110 group"
            >
              <X className="h-5 w-5 text-white group-hover:rotate-90 transition-transform duration-200" />
            </button>
          </div>
        </div>

        {/* Chat Messages with custom scrollbar */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-slate-50/50 to-white/80 scrollbar-thin scrollbar-thumb-violet-200 scrollbar-track-transparent">
          {messages.length === 0 ? (
            <div className="text-center py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-purple-400 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                <div className="relative p-4 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl w-fit mx-auto">
                  <Bot className="h-12 w-12 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                Ready to explore this book together?
              </h3>
              <p className="text-slate-600 mb-8">
                Ask me anything about themes, characters, analysis, or historical context
              </p>
              
              <div className="space-y-3">
                <p className="text-sm font-semibold text-slate-700 mb-4 flex items-center justify-center space-x-2">
                  <Sparkles className="h-4 w-4 text-violet-500" />
                  <span>Try these questions:</span>
                </p>
                {suggestedQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestion(question)}
                    className="block w-full text-left p-4 bg-white/60 hover:bg-violet-50 border border-violet-100 hover:border-violet-200 rounded-xl text-sm text-slate-700 transition-all duration-200 hover:scale-[1.02] hover:shadow-md backdrop-blur-sm group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <span className="group-hover:text-violet-700 transition-colors">{question}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div
                    className={`max-w-[85%] p-4 rounded-2xl backdrop-blur-sm shadow-lg ${
                      message.type === 'user'
                        ? 'bg-gradient-to-br from-violet-600 to-purple-600 text-white shadow-violet-200'
                        : 'bg-white/80 text-slate-800 border border-white/50 shadow-slate-200'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-1 rounded-lg ${
                        message.type === 'user' 
                          ? 'bg-white/20' 
                          : 'bg-gradient-to-br from-violet-500 to-purple-600'
                      }`}>
                        {message.type === 'bot' ? (
                          <Bot className="h-4 w-4 text-white" />
                        ) : (
                          <User className="h-4 w-4 text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="whitespace-pre-wrap leading-relaxed text-sm">
                          {message.content}
                        </p>
                        <p className={`text-xs mt-2 ${
                          message.type === 'user' ? 'text-violet-200' : 'text-slate-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex justify-start animate-in slide-in-from-bottom-2 duration-300">
                  <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-white/50 shadow-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-1 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-slate-600 text-sm">Analyzing your question...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Error Message with enhanced styling */}
        {error && (
          <div className="mx-6 mb-4 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-xl animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Enhanced Input Area */}
        <div className="p-6 bg-white/80 backdrop-blur-xl border-t border-white/50">
          <div className="flex space-x-3">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={currentQuestion}
                onChange={(e) => setCurrentQuestion(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about this book..."
                className="w-full p-4 pr-12 border-2 border-violet-200 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 resize-none bg-white/80 backdrop-blur-sm placeholder-slate-400 text-slate-800 transition-all duration-200 hover:border-violet-300"
                rows="2"
                disabled={loading}
              />
              <div className="absolute right-3 bottom-3 text-xs text-slate-400">
                Press Enter to send
              </div>
            </div>
            <button
              onClick={handleSendMessage}
              disabled={loading || !currentQuestion.trim()}
              className="px-6 py-4 bg-gradient-to-br from-violet-600 to-purple-600 text-white rounded-2xl hover:from-violet-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 hover:shadow-xl disabled:hover:scale-100 group shadow-lg"
            >
              <Send className="h-5 w-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookChatBot;