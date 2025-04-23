import React, { useState, useEffect } from 'react';
import { useDatabase } from '../context/DatabaseContext';

interface DatabaseConnectionProps {
  type: 'retool' | 'supabase';
}

const DatabaseConnection: React.FC<DatabaseConnectionProps> = ({ type }) => {
  const { 
    retoolConnected, 
    supabaseConnected, 
    retoolConnectionError, 
    supabaseConnectionError,
    connectRetool,
    connectSupabase,
    disconnectRetool,
    disconnectSupabase,
    getRetoolTables,
    getSupabaseTables
  } = useDatabase();
  
  const [connectionString, setConnectionString] = useState('');
  
  const isConnected = type === 'retool' ? retoolConnected : supabaseConnected;
  const connectionError = type === 'retool' ? retoolConnectionError : supabaseConnectionError;
  
  const handleConnect = async (connectionString: string) => {
    if (type === 'retool') {
      const result = await connectRetool(connectionString);
      if (result?.success) {
        await getRetoolTables();
      }
    } else {
      const result = await connectSupabase(connectionString);
      if (result?.success) {
        await getSupabaseTables();
      }
    }
  };
  
  const handleDisconnect = () => {
    if (type === 'retool') {
      disconnectRetool();
    } else {
      disconnectSupabase();
    }
    setConnectionString('');
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleConnect(connectionString);
  };

  useEffect(() => {
    if (isConnected) {
      if (type === 'retool') {
        getRetoolTables();
      } else {
        getSupabaseTables();
      }
    }
  }, [isConnected]);
  
  const gradientClass = type === 'retool' 
    ? 'from-blue-500 to-blue-400'
    : 'from-emerald-500 to-emerald-400';
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className={`bg-gradient-to-r ${gradientClass} p-4`}>
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center">
            <svg 
              className="w-6 h-6 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" 
              />
            </svg>
            <h3 className="text-xl font-semibold">
              {type === 'retool' ? 'Retool Database' : 'Supabase Database'}
            </h3>
          </div>
          {isConnected && (
            <button
              onClick={handleDisconnect}
              className="px-3 py-1 text-sm bg-white/20 hover:bg-white/30 rounded-md transition-colors duration-200"
            >
              Disconnect
            </button>
          )}
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Connection String
          </label>
          <input
            type="text"
            value={connectionString}
            onChange={(e) => setConnectionString(e.target.value)}
            placeholder="postgres://username:password@hostname:port/database"
            className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isConnected}
          />
        </div>
        
        {connectionError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
            {connectionError}
          </div>
        )}
        
        <button
          onClick={handleSubmit}
          disabled={isConnected || !connectionString}
          className={`w-full py-2 px-4 rounded-md text-white font-medium transition-colors duration-200 ${
            isConnected 
              ? 'bg-gray-400 cursor-not-allowed'
              : type === 'retool'
                ? 'bg-blue-500 hover:bg-blue-600'
                : 'bg-emerald-500 hover:bg-emerald-600'
          }`}
        >
          {isConnected ? 'Connected' : 'Connect'}
        </button>
      </div>
    </div>
  );
};

export default DatabaseConnection;
