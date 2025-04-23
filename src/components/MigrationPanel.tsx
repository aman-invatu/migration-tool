import React, { useState, useEffect, useRef } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { databaseApi } from '../services/api';

const MigrationPanel: React.FC = () => {
  const intervalRef = useRef<NodeJS.Timeout>();
  const {
    retoolConnected,
    supabaseConnected,
    selectedRetoolTable,
    selectedSupabaseTable,
    migrateData,
    isLoading
  } = useDatabase();
  
  const [migrationResult, setMigrationResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const [progress, setProgress] = useState<{
    totalRecords: number;
    migratedRecords: number;
    percentage: number;
    isComplete: boolean;
  } | null>(null);

  useEffect(() => {
    if (isLoading) {
      // Initial fetch
      fetchProgress();
      
      // Poll for progress every 20 seconds
      intervalRef.current = setInterval(fetchProgress, 20000);
    } else {
      // Clear progress when not loading
      setProgress(null);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
    };
  }, [isLoading]);

  const fetchProgress = async () => {
    try {
      const response = await databaseApi.getMigrationProgress();
      setProgress(response);
      if (response.isComplete && intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };
  
  const handleMigrate = async () => {
    setMigrationResult(null);
    setProgress(null);
    const result = await migrateData();
    setMigrationResult(result);
  };
  
  const canMigrate = retoolConnected && supabaseConnected && selectedRetoolTable && selectedSupabaseTable;
  
  return (
    <div className="border rounded-lg p-4 mb-4 bg-white shadow-sm">
      <h3 className="text-lg font-medium mb-4">Data Migration</h3>
      
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <div className={`w-3 h-3 rounded-full mr-2 ${retoolConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm">
            {retoolConnected 
              ? `Source: ${selectedRetoolTable || 'No table selected'}` 
              : 'Retool database not connected'}
          </span>
        </div>
        
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${supabaseConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm">
            {supabaseConnected 
              ? `Target: ${selectedSupabaseTable || 'No table selected'}` 
              : 'Supabase database not connected'}
          </span>
        </div>
      </div>
      
      <button
        onClick={handleMigrate}
        disabled={!canMigrate || isLoading}
        className={`w-full py-2 px-4 rounded-md text-white ${
          !canMigrate || isLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isLoading ? 'Migrating...' : 'Migrate Data'}
      </button>

      {(isLoading || progress) && (
        <div className="mt-4">
          <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
            <span>Migration Progress</span>
            <span className="font-medium">
              {progress ? `${progress.percentage}%` : 'Starting...'}
            </span>
          </div>
          <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="absolute left-0 top-0 h-full bg-blue-500 transition-all duration-500 ease-out"
              style={{ 
                width: `${progress?.percentage || 0}%`,
                transition: 'width 0.5s ease-out'
              }}
            />
          </div>
          {progress && (
            <div className="text-xs text-gray-500 mt-1">
              {progress.migratedRecords.toLocaleString()} of {progress.totalRecords.toLocaleString()} records
            </div>
          )}
        </div>
      )}
      
      {migrationResult && !isLoading && (
        <div className={`mt-4 p-3 rounded-md ${
          migrationResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {migrationResult.message}
        </div>
      )}
    </div>
  );
};

export default MigrationPanel; 