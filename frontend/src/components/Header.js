import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Wifi, WifiOff, Sparkles, Settings, Sun, Moon } from 'lucide-react';
import { cn } from '../utils/cn';

const Header = ({ isConnected, theme, onThemeChange }) => {
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    onThemeChange(newTheme);
    setShowThemeMenu(false);
  };

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(
        "sticky top-0 z-50 glass-effect border-b border-white/20 shadow-soft",
        theme === 'dark' && "glass-effect-dark border-secondary-700/20"
      )}
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
                className={cn(
                  "text-sm font-medium",
                  theme === 'light' ? "text-secondary-600" : "text-secondary-400"
                )}
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
                  : "bg-error-100 text-error-800 border border-error-200",
                theme === 'dark' && isConnected && "bg-success-900/20 text-success-300 border-success-700/30",
                theme === 'dark' && !isConnected && "bg-error-900/20 text-error-300 border-error-700/30"
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

            {/* Theme Toggle Button */}
            <div className="relative">
              <motion.button
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className={cn(
                  "p-2 rounded-lg transition-all duration-200",
                  theme === 'light' 
                    ? "text-secondary-600 hover:text-primary-600 hover:bg-primary-50" 
                    : "text-secondary-400 hover:text-primary-400 hover:bg-primary-900/20"
                )}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Settings className="h-5 w-5" />
              </motion.button>

              {/* Theme Menu */}
              <AnimatePresence>
                {showThemeMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      "absolute right-0 top-full mt-2 bg-white rounded-xl shadow-large border border-secondary-200 p-2 min-w-[160px]",
                      theme === 'dark' && "bg-secondary-800 border-secondary-600"
                    )}
                  >
                    <div className="text-xs font-medium px-3 py-1 text-secondary-500 mb-2">
                      Theme
                    </div>
                    
                    <motion.button
                      onClick={toggleTheme}
                      className={cn(
                        "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                        theme === 'light'
                          ? "bg-primary-50 text-primary-700 hover:bg-primary-100"
                          : "bg-secondary-700 text-secondary-200 hover:bg-secondary-600"
                      )}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {theme === 'light' ? (
                        <>
                          <Moon className="h-4 w-4" />
                          <span>Dark Mode</span>
                        </>
                      ) : (
                        <>
                          <Sun className="h-4 w-4" />
                          <span>Light Mode</span>
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header; 