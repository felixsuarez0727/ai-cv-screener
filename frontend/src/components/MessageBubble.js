import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Bot, AlertCircle, FileText, Copy, Check, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { cn } from '../utils/cn';

const MessageBubble = ({ message }) => {
  const { type, content, sources, timestamp } = message;
  const [copied, setCopied] = useState(false);
  const [sourcesExpanded, setSourcesExpanded] = useState(false);

  const getIcon = () => {
    switch (type) {
      case 'user':
        return <User className="h-5 w-5 text-white" />;
      case 'ai':
        return <Bot className="h-5 w-5 text-white" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-white" />;
      default:
        return <User className="h-5 w-5 text-white" />;
    }
  };

  const getBubbleStyles = () => {
    switch (type) {
      case 'user':
        return 'bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-glow';
      case 'ai':
        return 'bg-white text-secondary-900 shadow-soft border border-secondary-100';
      case 'error':
        return 'bg-error-50 text-error-900 border border-error-200 shadow-soft';
      default:
        return 'bg-white text-secondary-900 shadow-soft';
    }
  };

  const getIconContainerStyles = () => {
    switch (type) {
      case 'user':
        return 'bg-primary-600 shadow-glow';
      case 'ai':
        return 'bg-gradient-to-br from-primary-500 to-primary-700 shadow-glow';
      case 'error':
        return 'bg-error-600';
      default:
        return 'bg-secondary-600';
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const markdownComponents = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <div className="relative group">
          <SyntaxHighlighter
            style={tomorrow}
            language={match[1]}
            PreTag="div"
            className="rounded-lg text-sm"
            {...props}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
          <button
            onClick={() => copyToClipboard(String(children))}
            className="absolute top-2 right-2 p-1 bg-secondary-800/50 hover:bg-secondary-700/70 rounded opacity-0 group-hover:opacity-100 transition-opacity"
          >
            {copied ? <Check className="h-4 w-4 text-success-400" /> : <Copy className="h-4 w-4 text-secondary-300" />}
          </button>
        </div>
      ) : (
        <code className="bg-secondary-100 text-secondary-800 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
          {children}
        </code>
      );
    },
    p: ({ children }) => <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>,
    h1: ({ children }) => <h1 className="text-2xl font-bold mb-4 text-secondary-900">{children}</h1>,
    h2: ({ children }) => <h2 className="text-xl font-semibold mb-3 text-secondary-900">{children}</h2>,
    h3: ({ children }) => <h3 className="text-lg font-medium mb-2 text-secondary-900">{children}</h3>,
    ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>,
    li: ({ children }) => <li className="text-secondary-700">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary-500 pl-4 italic text-secondary-600 bg-primary-50 py-2 rounded-r-lg">
        {children}
      </blockquote>
    ),
    a: ({ href, children }) => (
      <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-primary-600 hover:text-primary-700 underline inline-flex items-center gap-1"
      >
        {children}
        <ExternalLink className="h-3 w-3" />
      </a>
    ),
  };

  return (
    <motion.div 
      className={`flex ${type === 'user' ? 'justify-end' : 'justify-start'}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className={`flex max-w-4xl ${type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <motion.div 
          className={cn(
            "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
            getIconContainerStyles()
          )}
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {getIcon()}
        </motion.div>
        
        {/* Message Content */}
        <div className={`mx-4 ${type === 'user' ? 'text-right' : 'text-left'}`}>
          <motion.div 
            className={cn(
              "rounded-2xl px-6 py-4 max-w-3xl",
              getBubbleStyles()
            )}
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {type === 'ai' ? (
              <ReactMarkdown components={markdownComponents} className="prose prose-sm max-w-none">
                {content}
              </ReactMarkdown>
            ) : (
              <div className="whitespace-pre-wrap leading-relaxed">{content}</div>
            )}
          </motion.div>
          
          {/* Sources for AI messages */}
          {type === 'ai' && sources && sources.length > 0 && (
            <motion.div 
              className="mt-3"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ delay: 0.2 }}
            >
              <button
                onClick={() => setSourcesExpanded(!sourcesExpanded)}
                className="flex items-center space-x-2 text-xs text-secondary-500 hover:text-secondary-700 transition-colors"
              >
                <FileText className="h-3 w-3" />
                <span>Fuentes utilizadas ({sources.length})</span>
                {sourcesExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              </button>
              
              <AnimatePresence>
                {sourcesExpanded && (
                  <motion.div 
                    className="mt-2 space-y-2"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {sources.map((source, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center justify-between p-2 bg-secondary-50 rounded-lg border border-secondary-200"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <span className="text-xs font-medium text-secondary-700">
                          {source.cvName}
                        </span>
                        <span className="text-xs text-secondary-500">
                          {Math.round(source.relevance * 100)}% relevancia
                        </span>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
          
          {/* Timestamp */}
          <motion.div 
            className={`text-xs text-secondary-400 mt-2 ${type === 'user' ? 'text-right' : 'text-left'}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {formatTime(timestamp)}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble; 