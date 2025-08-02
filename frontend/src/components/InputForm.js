import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Paperclip, X, Sparkles } from 'lucide-react';
import { cn } from '../utils/cn';

const InputForm = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const textareaRef = useRef(null);

  const suggestions = [
    "Who has experience with Python programming?",
    "Which candidates have worked as Software Engineers?",
    "Who has experience with React or JavaScript frameworks?",
    "Find candidates with database experience (SQL, MongoDB, etc.)",
    "Who has worked with cloud platforms (AWS, Azure, GCP)?",
    "Which candidates have machine learning or AI experience?",
    "Find candidates with project management experience",
    "Who has experience with DevOps or CI/CD tools?",
    "Which candidates speak multiple languages?",
    "Find candidates with mobile development experience",
    "Who has worked in fintech or financial services?",
    "Which candidates have startup experience?"
  ];

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
      setShowSuggestions(false);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setMessage(suggestion);
    setShowSuggestions(false);
    textareaRef.current?.focus();
  };

  const clearMessage = () => {
    setMessage('');
    setShowSuggestions(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    textareaRef.current?.focus();
  };

  return (
    <div className="relative">
      {/* Suggestions Panel */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full left-0 right-0 mb-4 bg-white rounded-2xl shadow-large border border-secondary-200 p-4 z-10"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-secondary-900 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary-500" />
                CV Screening Questions
              </h3>
              <button
                onClick={() => setShowSuggestions(false)}
                className="p-1 hover:bg-secondary-100 rounded-lg transition-colors"
              >
                <X className="h-4 w-4 text-secondary-500" />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-left p-3 bg-secondary-50 hover:bg-primary-50 rounded-lg text-sm text-secondary-700 hover:text-primary-700 transition-all duration-200 border border-transparent hover:border-primary-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {suggestion}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Form */}
      <motion.form 
        onSubmit={handleSubmit} 
        className="flex items-end space-x-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Action Buttons */}
        <div className="flex flex-col space-y-2">
          <motion.button
            type="button"
            onClick={() => setShowSuggestions(!showSuggestions)}
            className={cn(
              "p-2 rounded-lg transition-all duration-200",
              showSuggestions 
                ? "bg-primary-100 text-primary-600 shadow-glow" 
                : "bg-secondary-100 text-secondary-600 hover:bg-primary-100 hover:text-primary-600"
            )}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Sparkles className="h-4 w-4" />
          </motion.button>
          
          <motion.button
            type="button"
            className="p-2 bg-secondary-100 text-secondary-600 hover:bg-primary-100 hover:text-primary-600 rounded-lg transition-all duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Paperclip className="h-4 w-4" />
          </motion.button>
        </div>

        {/* Text Input */}
        <div className="flex-1 relative">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => setIsTyping(true)}
              onBlur={() => setIsTyping(false)}
              placeholder="Ask about candidates' skills, experience, or background..."
              className={cn(
                "w-full px-4 py-3 pr-12 border rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none transition-all duration-200",
                "bg-white shadow-soft border-secondary-200",
                isTyping && "border-primary-300 shadow-glow",
                isLoading && "opacity-50 cursor-not-allowed"
              )}
              rows="1"
              disabled={isLoading}
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
            
            {/* Clear Button */}
            {message && (
              <motion.button
                type="button"
                onClick={clearMessage}
                className="absolute right-12 top-1/2 transform -translate-y-1/2 p-1 text-secondary-400 hover:text-secondary-600 transition-colors"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="h-4 w-4" />
              </motion.button>
            )}
          </div>
        </div>
        
        {/* Send Button */}
        <motion.button
          type="submit"
          disabled={!message.trim() || isLoading}
          className={cn(
            "px-6 py-3 rounded-2xl font-medium transition-all duration-200 flex items-center gap-2",
            message.trim() && !isLoading
              ? "bg-gradient-to-r from-primary-500 to-primary-700 text-white shadow-glow hover:shadow-glow-lg hover:scale-105"
              : "bg-secondary-200 text-secondary-400 cursor-not-allowed"
          )}
          whileHover={message.trim() && !isLoading ? { scale: 1.05 } : {}}
          whileTap={message.trim() && !isLoading ? { scale: 0.95 } : {}}
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
            </motion.div>
          ) : (
            <Send className="h-5 w-5" />
          )}
          <span className="hidden sm:inline">Send</span>
        </motion.button>
      </motion.form>

      {/* Typing Indicator */}
      <AnimatePresence>
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute -top-8 left-0 text-xs text-secondary-500 flex items-center gap-2"
          >
            <div className="flex space-x-1">
              <motion.div
                className="w-1 h-1 bg-secondary-400 rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
              />
              <motion.div
                className="w-1 h-1 bg-secondary-400 rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
              />
              <motion.div
                className="w-1 h-1 bg-secondary-400 rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
              />
            </div>
            <span>Typing...</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InputForm; 