import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MessageBubble from './MessageBubble';
import InputForm from './InputForm';
import { apiService } from '../services/api';
import { MessageCircle, Trash2, FileText, Download, Bot, Users, TrendingUp } from 'lucide-react';
import { cn } from '../utils/cn';

const ChatInterface = ({ theme }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [stats, setStats] = useState({
    totalMessages: 0,
    totalSources: 0,
    averageResponseTime: 0
  });
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0) {
      setShowWelcome(false);
    }
  }, [messages]);

  const handleSendMessage = async (message) => {
    if (!message.trim()) return;

    const startTime = Date.now();

    // Add user message
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Send message to API
      const response = await apiService.sendMessage(message);
      
      const responseTime = Date.now() - startTime;
      
      // Add AI response
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: response.response,
        sources: response.sources || [],
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);
      
      // Update stats
      setStats(prev => ({
        totalMessages: prev.totalMessages + 2,
        totalSources: prev.totalSources + (response.sources?.length || 0),
        averageResponseTime: (prev.averageResponseTime + responseTime) / 2
      }));
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage = {
        id: Date.now() + 1,
        type: 'error',
        content: 'Sorry, there was an error processing your message. Please try again.',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setShowWelcome(true);
    setStats({
      totalMessages: 0,
      totalSources: 0,
      averageResponseTime: 0
    });
  };

  const exportChat = () => {
    const chatData = {
      messages,
      exportDate: new Date().toISOString(),
      stats
    };
    
    const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exampleQuestions = [
    {
      question: "Who has experience with Python programming?",
      icon: "🐍",
      category: "Programming Languages"
    },
    {
      question: "Which candidates have worked as Software Engineers?",
      icon: "💻",
      category: "Job Titles"
    },
    {
      question: "Who has experience with React or JavaScript frameworks?",
      icon: "⚛️",
      category: "Frontend Technologies"
    },
    {
      question: "Find candidates with database experience (SQL, MongoDB, etc.)",
      icon: "🗄️",
      category: "Databases"
    },
    {
      question: "Who has worked with cloud platforms (AWS, Azure, GCP)?",
      icon: "☁️",
      category: "Cloud Platforms"
    },
    {
      question: "Which candidates have machine learning or AI experience?",
      icon: "🤖",
      category: "AI/ML"
    },
    {
      question: "Find candidates with project management experience",
      icon: "📊",
      category: "Management"
    },
    {
      question: "Who has experience with DevOps or CI/CD tools?",
      icon: "🔧",
      category: "DevOps"
    },
    {
      question: "Which candidates speak multiple languages?",
      icon: "🌍",
      category: "Languages"
    },
    {
      question: "Find candidates with mobile development experience",
      icon: "📱",
      category: "Mobile Development"
    },
    {
      question: "Who has worked in fintech or financial services?",
      icon: "💰",
      category: "Industry Experience"
    },
    {
      question: "Which candidates have startup experience?",
      icon: "🚀",
      category: "Company Types"
    }
  ];

  const groupedQuestions = exampleQuestions.reduce((acc, question) => {
    if (!acc[question.category]) {
      acc[question.category] = [];
    }
    acc[question.category].push(question);
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div 
        className={cn(
          "rounded-3xl shadow-large overflow-hidden border",
          theme === 'light' 
            ? "bg-white border-secondary-100" 
            : "bg-secondary-800 border-secondary-700"
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Enhanced Chat Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <motion.div
                className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <MessageCircle className="h-6 w-6" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold">AI CV Screener</h2>
                <p className="text-primary-100 text-sm">Intelligent CV screening system</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Stats */}
              <div className="hidden md:flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{stats.totalMessages}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <FileText className="h-4 w-4" />
                  <span>{stats.totalSources}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4" />
                  <span>{Math.round(stats.averageResponseTime)}ms</span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <motion.button
                onClick={exportChat}
                className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export</span>
              </motion.button>
              
              <motion.button
                onClick={clearChat}
                className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl transition-colors backdrop-blur-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline">Clear</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Messages Area - Significantly Increased Height */}
        <div className={cn(
          "h-[800px] overflow-y-auto p-8",
          theme === 'light' 
            ? "bg-gradient-to-b from-secondary-50 to-white"
            : "bg-gradient-to-b from-secondary-900 to-secondary-800"
        )}>
          <AnimatePresence>
            {showWelcome && messages.length === 0 ? (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  className="mb-8"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-6 rounded-3xl inline-block shadow-glow">
                    <Bot className="h-16 w-16 text-white" />
                  </div>
                </motion.div>
                
                <h3 className={cn(
                  "text-3xl font-bold mb-4",
                  theme === 'light' ? "text-secondary-900" : "text-white"
                )}>
                  Welcome to AI CV Screener!
                </h3>
                <p className={cn(
                  "text-lg mb-8 max-w-3xl mx-auto",
                  theme === 'light' ? "text-secondary-600" : "text-secondary-300"
                )}>
                  Ask questions about CVs and get intelligent answers based on available information.
                  Our AI system will help you find the perfect candidates with detailed analysis.
                </p>
                
                {/* Enhanced Categorized Example Questions */}
                <div className="space-y-6">
                  <p className={cn(
                    "text-sm font-medium",
                    theme === 'light' ? "text-secondary-700" : "text-secondary-300"
                  )}>
                    Example questions by category:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {Object.entries(groupedQuestions).map(([category, questions]) => (
                      <motion.div
                        key={category}
                        className={cn(
                          "rounded-2xl p-4 shadow-soft border",
                          theme === 'light' 
                            ? "bg-white border-secondary-100" 
                            : "bg-secondary-700 border-secondary-600"
                        )}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <h4 className={cn(
                          "font-semibold mb-3 flex items-center gap-2",
                          theme === 'light' ? "text-secondary-900" : "text-white"
                        )}>
                          <span className="text-lg">{questions[0].icon}</span>
                          {category}
                        </h4>
                        <div className="space-y-2">
                          {questions.map((item, index) => (
                            <motion.button
                              key={index}
                              onClick={() => handleSendMessage(item.question)}
                              className={cn(
                                "w-full text-left p-3 rounded-xl text-sm transition-all duration-200 border",
                                theme === 'light'
                                  ? "bg-secondary-50 hover:bg-primary-50 text-secondary-700 hover:text-primary-700 border-transparent hover:border-primary-200"
                                  : "bg-secondary-600 hover:bg-primary-900/20 text-secondary-200 hover:text-primary-300 border-transparent hover:border-primary-600"
                              )}
                              whileHover={{ scale: 1.02, x: 5 }}
                              whileTap={{ scale: 0.98 }}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              {item.question}
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="space-y-6">
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <MessageBubble message={message} theme={theme} />
                  </motion.div>
                ))}
                
                {isLoading && (
                  <motion.div 
                    className={cn(
                      "flex items-center space-x-3",
                      theme === 'light' ? "text-secondary-500" : "text-secondary-400"
                    )}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div
                      className="bg-gradient-to-br from-primary-500 to-primary-700 p-3 rounded-2xl"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <Bot className="h-5 w-5 text-white" />
                    </motion.div>
                    <div className="flex items-center space-x-2">
                      <motion.div
                        className="w-2 h-2 bg-primary-500 rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-primary-500 rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-primary-500 rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                      />
                    </div>
                    <span className="text-sm font-medium">AI is analyzing CVs...</span>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Enhanced Input Area */}
        <div className={cn(
          "border-t p-6",
          theme === 'light' 
            ? "border-secondary-200 bg-white" 
            : "border-secondary-700 bg-secondary-800"
        )}>
          <InputForm onSendMessage={handleSendMessage} isLoading={isLoading} theme={theme} />
        </div>
      </motion.div>
    </div>
  );
};

export default ChatInterface; 