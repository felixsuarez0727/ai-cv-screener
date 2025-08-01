import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import ChatInterface from './components/ChatInterface';
import Header from './components/Header';
import { apiService } from './services/api';
import { WifiOff, RefreshCw } from 'lucide-react';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [lastConnectionCheck, setLastConnectionCheck] = useState(null);

  const checkConnection = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await apiService.healthCheck();
      const isHealthy = response.status === 'OK';
      
      if (isHealthy && !isConnected) {
        toast.success('¡Conectado al servidor!', {
          icon: '✅',
          duration: 3000,
        });
      }
      
      setIsConnected(isHealthy);
      setConnectionAttempts(0);
      setLastConnectionCheck(new Date());
    } catch (error) {
      console.error('Connection check failed:', error);
      const wasConnected = isConnected;
      setIsConnected(false);
      setConnectionAttempts(prev => prev + 1);
      setLastConnectionCheck(new Date());
      
      if (wasConnected) {
        toast.error('Conexión perdida con el servidor', {
          icon: '❌',
          duration: 5000,
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [isConnected]);

  useEffect(() => {
    checkConnection();
    
    // Set up periodic connection checks
    const interval = setInterval(() => {
      if (!isConnected) {
        checkConnection();
      }
    }, 10000); // Check every 10 seconds if disconnected

    return () => clearInterval(interval);
  }, [isConnected, checkConnection]);

  const LoadingScreen = () => (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="text-center">
        <motion.div
          className="mb-8"
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-6 rounded-3xl shadow-glow-lg">
            <RefreshCw className="h-12 w-12 text-white" />
          </div>
        </motion.div>
        
        <motion.h2 
          className="text-2xl font-bold text-secondary-900 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Conectando con el servidor...
        </motion.h2>
        
        <motion.p 
          className="text-secondary-600 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          Verificando la conexión con el backend
        </motion.p>
        
        <motion.div
          className="flex justify-center space-x-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <motion.div
            className="w-3 h-3 bg-primary-500 rounded-full"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
          />
          <motion.div
            className="w-3 h-3 bg-primary-500 rounded-full"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
          />
          <motion.div
            className="w-3 h-3 bg-primary-500 rounded-full"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
          />
        </motion.div>
      </div>
    </motion.div>
  );

  const ErrorScreen = () => (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-error-50 via-white to-secondary-50 flex items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="max-w-md w-full">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="mb-8"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              scale: { duration: 2, repeat: Infinity },
              rotate: { duration: 3, repeat: Infinity }
            }}
          >
            <div className="bg-gradient-to-br from-error-500 to-error-700 p-6 rounded-3xl shadow-glow-lg">
              <WifiOff className="h-12 w-12 text-white" />
            </div>
          </motion.div>
          
          <h2 className="text-2xl font-bold text-error-900 mb-4">
            Error de Conexión
          </h2>
          
          <p className="text-error-700 mb-6 leading-relaxed">
            No se pudo conectar con el servidor backend. Asegúrate de que el servidor esté ejecutándose en el puerto 3001.
          </p>
          
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-4 shadow-soft border border-error-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-secondary-600">Intentos de conexión:</span>
                <span className="font-semibold text-error-600">{connectionAttempts}</span>
              </div>
              {lastConnectionCheck && (
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-secondary-600">Último intento:</span>
                  <span className="text-secondary-500">
                    {lastConnectionCheck.toLocaleTimeString()}
                  </span>
                </div>
              )}
            </div>
            
            <motion.button
              onClick={checkConnection}
              className="w-full bg-gradient-to-r from-primary-500 to-primary-700 text-white px-6 py-3 rounded-2xl font-medium shadow-glow hover:shadow-glow-lg transition-all duration-200 flex items-center justify-center space-x-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RefreshCw className="h-5 w-5" />
              <span>Reintentar Conexión</span>
            </motion.button>
            
            <div className="text-xs text-secondary-500 space-y-1">
              <p>• Verifica que el servidor backend esté ejecutándose</p>
              <p>• Comprueba que el puerto 3001 esté disponible</p>
              <p>• Revisa los logs del servidor para más detalles</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#374151',
            borderRadius: '12px',
            boxShadow: '0 10px 40px -10px rgba(0, 0, 0, 0.15)',
            border: '1px solid #e5e7eb',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingScreen key="loading" />
        ) : !isConnected ? (
          <ErrorScreen key="error" />
        ) : (
          <motion.div
            key="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Header isConnected={isConnected} />
            <main className="container mx-auto px-4 py-8">
              <ChatInterface />
            </main>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App; 