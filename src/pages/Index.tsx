import { useState } from "react";
import { ConnectionForm } from "@/components/ConnectionForm";
import { TableSelector } from "@/components/TableSelector";
import { DataPreview } from "@/components/DataPreview";
import { MigrationButton } from "@/components/MigrationButton";
import { connectToRetool, connectToSupabase, getTableData, migrateData } from "@/utils/databaseUtils";
import { ConnectionConfig, TableData, MigrationState } from "@/types/database";
import { Separator } from "@/components/ui/separator";

const Index = () => {
  // Retool state
  const [retool, setRetool] = useState<ConnectionConfig>({
    connectionString: "",
    isConnected: false,
    tables: [],
    selectedTable: null,
    loading: false,
    error: null,
  });

  // Supabase state
  const [supabase, setSupabase] = useState<ConnectionConfig>({
    connectionString: "",
    isConnected: false,
    tables: [],
    selectedTable: null,
    loading: false,
    error: null,
  });

  // Table data state
  const [retoolData, setRetoolData] = useState<TableData>({
    columns: [],
    rows: [],
    loading: false,
    error: null,
  });

  const [supabaseData, setSupabaseData] = useState<TableData>({
    columns: [],
    rows: [],
    loading: false,
    error: null,
  });

  // Migration state
  const [migration, setMigration] = useState<MigrationState>({
    inProgress: false,
    completed: false,
    error: null,
    rowsMigrated: 0,
  });

  // Connect to Retool
  const handleRetoolConnect = async (connectionString: string) => {
    setRetool(prev => ({ ...prev, loading: true, error: null }));
    try {
      const tables = await connectToRetool(connectionString);
      setRetool({
        connectionString,
        isConnected: true,
        tables,
        selectedTable: null,
        loading: false,
        error: null,
      });
    } catch (error) {
      setRetool(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : "Failed to connect to Retool" 
      }));
    }
  };

  // Disconnect from Retool
  const handleRetoolDisconnect = () => {
    setRetool({
      connectionString: "",
      isConnected: false,
      tables: [],
      selectedTable: null,
      loading: false,
      error: null,
    });
    setRetoolData({
      columns: [],
      rows: [],
      loading: false,
      error: null,
    });
  };

  // Connect to Supabase
  const handleSupabaseConnect = async (connectionString: string) => {
    setSupabase(prev => ({ ...prev, loading: true, error: null }));
    try {
      const tables = await connectToSupabase(connectionString);
      setSupabase({
        connectionString,
        isConnected: true,
        tables,
        selectedTable: null,
        loading: false,
        error: null,
      });
    } catch (error) {
      setSupabase(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : "Failed to connect to Supabase" 
      }));
    }
  };

  // Disconnect from Supabase
  const handleSupabaseDisconnect = () => {
    setSupabase({
      connectionString: "",
      isConnected: false,
      tables: [],
      selectedTable: null,
      loading: false,
      error: null,
    });
    setSupabaseData({
      columns: [],
      rows: [],
      loading: false,
      error: null,
    });
  };

  // Select Retool table
  const handleRetoolTableSelect = async (tableName: string) => {
    setRetool(prev => ({ ...prev, selectedTable: tableName }));
    setRetoolData(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await getTableData('retool', retool.connectionString, tableName);
      setRetoolData({
        columns: data.columns,
        rows: data.rows,
        loading: false,
        error: null,
      });
    } catch (error) {
      setRetoolData(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Failed to load table data",
      }));
    }
  };

  // Select Supabase table
  const handleSupabaseTableSelect = async (tableName: string) => {
    setSupabase(prev => ({ ...prev, selectedTable: tableName }));
    setSupabaseData(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const data = await getTableData('supabase', supabase.connectionString, tableName);
      setSupabaseData({
        columns: data.columns,
        rows: data.rows,
        loading: false,
        error: null,
      });
    } catch (error) {
      setSupabaseData(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Failed to load table data",
      }));
    }
  };

  // Migrate data
  const handleMigration = async () => {
    if (!retool.selectedTable || !supabase.selectedTable) return;
    
    setMigration(prev => ({ ...prev, inProgress: true, completed: false, error: null }));
    
    try {
      const rowsMigrated = await migrateData(
        retool.connectionString,
        retool.selectedTable,
        supabase.connectionString,
        supabase.selectedTable
      );
      
      setMigration({
        inProgress: false,
        completed: true,
        error: null,
        rowsMigrated,
      });
    } catch (error) {
      setMigration(prev => ({
        ...prev,
        inProgress: false,
        completed: true,
        error: error instanceof Error ? error.message : "Failed to migrate data",
        rowsMigrated: 0,
      }));
    }
  };

  // Check if migration is ready
  const isMigrationReady = retool.isConnected && 
                           supabase.isConnected && 
                           retool.selectedTable && 
                           supabase.selectedTable;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          Database Migration Tool
        </h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left Side - Retool */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-blue-600">Source: Retool</h2>
            <ConnectionForm 
              title="Retool Connection"
              onConnect={handleRetoolConnect}
              onDisconnect={handleRetoolDisconnect}
              isConnected={retool.isConnected}
              loading={retool.loading}
              error={retool.error}
              primaryColor="blue"
            />
            
            {retool.isConnected && (
              <TableSelector
                title="Select Retool Table"
                tables={retool.tables}
                selectedTable={retool.selectedTable}
                onSelectTable={handleRetoolTableSelect}
                disabled={!retool.isConnected}
                primaryColor="blue"
              />
            )}
            
            {retool.selectedTable && (
              <DataPreview
                title={`Retool Data: ${retool.selectedTable}`}
                data={retoolData}
                primaryColor="blue"
              />
            )}
          </div>
          
          {/* Right Side - Supabase */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-purple-600">Target: Supabase</h2>
            <ConnectionForm
              title="Supabase Connection"
              onConnect={handleSupabaseConnect}
              onDisconnect={handleSupabaseDisconnect}
              isConnected={supabase.isConnected}
              loading={supabase.loading}
              error={supabase.error}
              primaryColor="purple"
            />
            
            {supabase.isConnected && (
              <TableSelector
                title="Select Supabase Table"
                tables={supabase.tables}
                selectedTable={supabase.selectedTable}
                onSelectTable={handleSupabaseTableSelect}
                disabled={!supabase.isConnected}
                primaryColor="purple"
              />
            )}
            
            {supabase.selectedTable && (
              <DataPreview
                title={`Supabase Data: ${supabase.selectedTable}`}
                data={supabaseData}
                primaryColor="purple"
              />
            )}
          </div>
        </div>
        
        {/* Migration Section */}
        {(retool.isConnected || supabase.isConnected) && (
          <div className="mt-8 max-w-md mx-auto">
            <MigrationButton
              onMigrate={handleMigration}
              disabled={!isMigrationReady}
              state={migration}
            />
          </div>
        )}

        {/* Help Text */}
        <div className="mt-8 text-sm text-gray-500 max-w-2xl mx-auto text-center">
          <p className="mb-2"><strong>How to use:</strong></p>
          <p>1. Enter your Retool connection string (hint: include "retool" in the string for this demo)</p>
          <p>2. Select a source table from Retool</p>
          <p>3. Enter your Supabase connection string (hint: include "supabase" in the string for this demo)</p>
          <p>4. Select a target table in Supabase</p>
          <p>5. Click "Migrate Data" to transfer the data</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
