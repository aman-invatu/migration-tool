import React from 'react';
import DatabaseConnection from '../components/DatabaseConnection';
import TableSelector from '../components/TableSelector';
import MigrationPanel from '../components/MigrationPanel';
import { useDatabase } from '../context/DatabaseContext';

const DataMigration: React.FC = () => {
  const { isLoading } = useDatabase();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">Data Migration Tool</h1>
          <p className="text-gray-600">
            Connect to source and target databases, select tables, and migrate data seamlessly
          </p>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Source Database */}
          <div>
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <h2 className="text-xl font-semibold text-gray-800">Source Database (Retool)</h2>
            </div>
            <DatabaseConnection type="retool" />
            <div className="mt-6">
              <TableSelector type="retool" />
            </div>
          </div>
          
          {/* Target Database */}
          <div>
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
              <h2 className="text-xl font-semibold text-gray-800">Target Database (Supabase)</h2>
            </div>
            <DatabaseConnection type="supabase" />
            <div className="mt-6">
              <TableSelector type="supabase" />
            </div>
          </div>
        </div>
        
        {/* Migration Panel */}
        <div className="mt-8">
          <MigrationPanel />
        </div>
      </div>
      
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl flex items-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-lg font-medium text-gray-700">Processing...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataMigration; 