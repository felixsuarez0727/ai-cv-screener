import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Wifi, WifiOff, Sparkles, Settings, Bell } from 'lucide-react';
import { cn } from '../utils/cn';

const Header = ({ isConnected }) => {
  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 glass-effect border-b border-white/20 shadow-soft"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <motion.div 
            className="flex items-center space-x-4"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="relative">
              <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-3 rounded-xl shadow-glow">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <motion.div
                className="absolute -top-1 -right-1 bg-success-500 rounded-full p-1"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="h-3 w-3 text-white" />
              </motion.div>
            </div>
            
            <div>
              <motion.h1 
                className="text-2xl font-bold gradient-text"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                AI CV Screener
              </motion.h1>
              <motion.p 
                className="text-sm text-secondary-600 font-medium"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Intelligent CV Screening System
              </motion.p>
            </div>
          </motion.div>
          
          {/* Status and Actions */}
          <div className="flex items-center space-x-4">
            {/* Connection Status */}
            <motion.div 
              className={cn(
                "flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300",
                isConnected 
                  ? "bg-success-100 text-success-800 border border-success-200" 
                  : "bg-error-100 text-error-800 border border-error-200"
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={isConnected ? { rotate: 360 } : {}}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                {isConnected ? (
                  <Wifi className="h-4 w-4" />
                ) : (
                  <WifiOff className="h-4 w-4" />
                )}
              </motion.div>
              <span className="hidden sm:inline">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </motion.div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              >
                <Bell className="h-5 w-5" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 text-secondary-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              >
                <Settings className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header; 