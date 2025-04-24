import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { databaseApi, ConnectionResponse, TablesResponse, TablePreviewResponse, MigrationResponse } from '../services/api';

interface DatabaseContextType {
  // Connection states
  retoolConnected: boolean;
  supabaseConnected: boolean;
  retoolConnectionError: string | null;
  supabaseConnectionError: string | null;
  
  // Tables
  retoolTables: string[];
  supabaseTables: string[];
  
  // Selected tables
  selectedRetoolTable: string | null;
  selectedSupabaseTable: string | null;
  
  // Table preview data
  retoolTableData: any[];
  supabaseTableData: any[];
  
  // Loading states
  isLoading: boolean;
  
  // Actions
  connectRetool: (connectionString: string) => Promise<ConnectionResponse>;
  connectSupabase: (connectionString: string) => Promise<ConnectionResponse>;
  disconnectRetool: () => void;
  disconnectSupabase: () => void;
  getRetoolTables: () => Promise<void>;
  getSupabaseTables: () => Promise<void>;
  selectRetoolTable: (tableName: string) => Promise<void>;
  selectSupabaseTable: (tableName: string) => Promise<void>;
  migrateData: () => Promise<MigrationResponse>;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};

interface DatabaseProviderProps {
  children: ReactNode;
}

export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({ children }) => {
  // Connection states
  const [retoolConnected, setRetoolConnected] = useState(false);
  const [supabaseConnected, setSupabaseConnected] = useState(false);
  const [retoolConnectionError, setRetoolConnectionError] = useState<string | null>(null);
  const [supabaseConnectionError, setSupabaseConnectionError] = useState<string | null>(null);
  
  // Tables
  const [retoolTables, setRetoolTables] = useState<string[]>([]);
  const [supabaseTables, setSupabaseTables] = useState<string[]>([]);
  
  // Selected tables
  const [selectedRetoolTable, setSelectedRetoolTable] = useState<string | null>(null);
  const [selectedSupabaseTable, setSelectedSupabaseTable] = useState<string | null>(null);
  
  // Table preview data
  const [retoolTableData, setRetoolTableData] = useState<any[]>([]);
  const [supabaseTableData, setSupabaseTableData] = useState<any[]>([]);
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Load saved connections on mount
  useEffect(() => {
    const initializeConnections = async () => {
      const retoolString = localStorage.getItem('retoolConnectionString');
      const supabaseString = localStorage.getItem('supabaseConnectionString');

      if (retoolString) {
        await connectRetool(retoolString);
      }
      if (supabaseString) {
        await connectSupabase(supabaseString);
      }
    };

    initializeConnections();
  }, []);

  // Connect to Retool database
  const connectRetool = async (connectionString: string): Promise<ConnectionResponse> => {
    setIsLoading(true);
    setRetoolConnectionError(null);
    try {
      const response = await databaseApi.connectRetool(connectionString);
      if (response.success) {
        setRetoolConnected(true);
        localStorage.setItem('retoolConnectionString', connectionString);
      } else {
        setRetoolConnectionError(response.message);
      }
      return response;
    } catch (error) {
      const errorResponse = { 
        success: false, 
        message: 'Failed to connect to Retool database' 
      };
      setRetoolConnectionError(errorResponse.message);
      return errorResponse;
    } finally {
      setIsLoading(false);
    }
  };

  // Disconnect Retool
  const disconnectRetool = () => {
    setRetoolConnected(false);
    setRetoolTables([]);
    setSelectedRetoolTable(null);
    setRetoolTableData([]);
    localStorage.removeItem('retoolConnectionString');
  };
  
  // Connect to Supabase database
  const connectSupabase = async (connectionString: string): Promise<ConnectionResponse> => {
    setIsLoading(true);
    setSupabaseConnectionError(null);
    try {
      const response = await databaseApi.connectSupabase(connectionString);
      if (response.success) {
        setSupabaseConnected(true);
        localStorage.setItem('supabaseConnectionString', connectionString);
      } else {
        setSupabaseConnectionError(response.message);
      }
      return response;
    } catch (error) {
      const errorResponse = { 
        success: false, 
        message: 'Failed to connect to Supabase database' 
      };
      setSupabaseConnectionError(errorResponse.message);
      return errorResponse;
    } finally {
      setIsLoading(false);
    }
  };

  // Disconnect Supabase
  const disconnectSupabase = () => {
    setSupabaseConnected(false);
    setSupabaseTables([]);
    setSelectedSupabaseTable(null);
    setSupabaseTableData([]);
    localStorage.removeItem('supabaseConnectionString');
  };
  
  // Get Retool tables
  const getRetoolTables = async () => {
    if (!retoolConnected) return;
    
    setIsLoading(true);
    try {
      const response = await databaseApi.getRetoolTables();
      if (response.success) {
        setRetoolTables(response.tables);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get Supabase tables
  const getSupabaseTables = async () => {
    if (!supabaseConnected) return;
    
    setIsLoading(true);
    try {
      const response = await databaseApi.getSupabaseTables();
      if (response.success) {
        setSupabaseTables(response.tables);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Select Retool table and get preview
  const selectRetoolTable = async (tableName: string) => {
    if (!retoolConnected) return;
    
    setIsLoading(true);
    setSelectedRetoolTable(tableName);
    try {
      const response = await databaseApi.getRetoolTablePreview(tableName);
      if (response.success) {
        setRetoolTableData(response.data);
        console.log(`Selected Retool table: ${tableName}`);
        console.log(`Total records in preview: ${response.data.length}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Select Supabase table and get preview
  const selectSupabaseTable = async (tableName: string) => {
    if (!supabaseConnected) return;
    
    setIsLoading(true);
    setSelectedSupabaseTable(tableName);
    try {
      const response = await databaseApi.getSupabaseTablePreview(tableName);
      if (response.success) {
        setSupabaseTableData(response.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Migrate data
  const migrateData = async (): Promise<MigrationResponse> => {
    if (!retoolConnected || !supabaseConnected || !selectedRetoolTable || !selectedSupabaseTable) {
      return { success: false, message: 'Both databases must be connected and tables selected' };
    }
    
    setIsLoading(true);
    try {
      const response = await databaseApi.migrateData(selectedRetoolTable, selectedSupabaseTable);
      return response;
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Migration failed' };
    } finally {
      setIsLoading(false);
    }
  };
  
  const value = {
    retoolConnected,
    supabaseConnected,
    retoolConnectionError,
    supabaseConnectionError,
    retoolTables,
    supabaseTables,
    selectedRetoolTable,
    selectedSupabaseTable,
    retoolTableData,
    supabaseTableData,
    isLoading,
    connectRetool,
    connectSupabase,
    disconnectRetool,
    disconnectSupabase,
    getRetoolTables,
    getSupabaseTables,
    selectRetoolTable,
    selectSupabaseTable,
    migrateData,
  };
  
  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};

export default DatabaseContext; 