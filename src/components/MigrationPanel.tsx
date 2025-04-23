import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';

const MigrationPanel: React.FC = () => {
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
  
  const handleMigrate = async () => {
    setMigrationResult(null);
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
      
      {migrationResult && (
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