
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import DatabaseConnection from '@/components/DatabaseConnection';
import TableSelector from '@/components/TableSelector';
import DataPreview from '@/components/DataPreview';
import MigrationControls from '@/components/MigrationControls';
import { databaseService } from '@/services/databaseService';

interface DataItem {
  [key: string]: any;
}

const Index = () => {
  const { toast } = useToast();

  // Retool (Source) state
  const [isRetoolConnecting, setIsRetoolConnecting] = useState(false);
  const [isRetoolConnected, setIsRetoolConnected] = useState(false);
  const [retoolTables, setRetoolTables] = useState<string[]>([]);
  const [selectedRetoolTable, setSelectedRetoolTable] = useState<string | null>(null);
  const [retoolData, setRetoolData] = useState<DataItem[]>([]);
  const [isRetoolDataLoading, setIsRetoolDataLoading] = useState(false);

  // Supabase (Target) state
  const [isSupabaseConnecting, setIsSupabaseConnecting] = useState(false);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);
  const [supabaseTables, setSupabaseTables] = useState<string[]>([]);
  const [selectedSupabaseTable, setSelectedSupabaseTable] = useState<string | null>(null);
  const [supabaseData, setSupabaseData] = useState<DataItem[]>([]);
  const [isSupabaseDataLoading, setIsSupabaseDataLoading] = useState(false);

  // Migration state
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationProgress, setMigrationProgress] = useState<number | null>(null);

  // Handle Retool connection
  const handleRetoolConnect = async (connectionString: string) => {
    try {
      setIsRetoolConnecting(true);
      const tables = await databaseService.connectToDatabase('retool', connectionString);
      
      if (tables === false) {
        toast({
          title: "Connection Failed",
          description: "Failed to connect to Retool database. Please check your connection string.",
          variant: "destructive",
        });
        return false;
      }
      
      setRetoolTables(tables);
      setIsRetoolConnected(true);
      toast({
        title: "Connected to Retool Database",
        description: `Found ${tables.length} tables`,
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsRetoolConnecting(false);
    }
  };

  // Handle Supabase connection
  const handleSupabaseConnect = async (connectionString: string) => {
    try {
      setIsSupabaseConnecting(true);
      const tables = await databaseService.connectToDatabase('supabase', connectionString);
      
      if (tables === false) {
        toast({
          title: "Connection Failed",
          description: "Failed to connect to Supabase database. Please check your connection string.",
          variant: "destructive",
        });
        return false;
      }
      
      setSupabaseTables(tables);
      setIsSupabaseConnected(true);
      toast({
        title: "Connected to Supabase Database",
        description: `Found ${tables.length} tables`,
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSupabaseConnecting(false);
    }
  };

  // Handle Retool table selection
  const handleRetoolTableSelect = async (tableName: string) => {
    setSelectedRetoolTable(tableName);
    setIsRetoolDataLoading(true);
    try {
      const data = await databaseService.getTableData('retool', tableName);
      setRetoolData(data);
      toast({
        title: "Table Selected",
        description: `Loaded preview data from ${tableName}`,
      });
    } catch (error: any) {
      toast({
        title: "Failed to load table data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsRetoolDataLoading(false);
    }
  };

  // Handle Supabase table selection
  const handleSupabaseTableSelect = async (tableName: string) => {
    setSelectedSupabaseTable(tableName);
    setIsSupabaseDataLoading(true);
    try {
      const data = await databaseService.getTableData('supabase', tableName);
      setSupabaseData(data);
      toast({
        title: "Table Selected",
        description: `Loaded preview data from ${tableName}`,
      });
    } catch (error: any) {
      toast({
        title: "Failed to load table data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSupabaseDataLoading(false);
    }
  };

  // Handle migration
  const handleMigration = async () => {
    if (!selectedRetoolTable || !selectedSupabaseTable) {
      toast({
        title: "Migration Error",
        description: "Please select both source and target tables",
        variant: "destructive",
      });
      return;
    }

    setIsMigrating(true);
    setMigrationProgress(0);

    try {
      const result = await databaseService.migrateData(
        selectedRetoolTable,
        selectedSupabaseTable,
        (progress) => setMigrationProgress(progress)
      );

      if (result.success) {
        toast({
          title: "Migration Successful",
          description: `Migrated ${result.recordsCount} records to ${selectedSupabaseTable}`,
        });
        
        // Refresh Supabase data to show the migrated records
        const updatedData = await databaseService.getTableData('supabase', selectedSupabaseTable);
        setSupabaseData(updatedData);
      }
    } catch (error: any) {
      toast({
        title: "Migration Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsMigrating(false);
      setMigrationProgress(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-retool to-supabase bg-clip-text text-transparent">Data Migration Tool</h1>
          <p className="text-muted-foreground">
            Connect to source and target databases, select tables, and migrate data seamlessly
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Source (Retool) Column */}
          <div className="space-y-6 rounded-lg border border-gray-200 shadow-sm p-6 bg-white">
            <h2 className="text-xl font-semibold text-retool flex items-center">
              <span className="bg-retool rounded-full w-2 h-2 mr-2"></span>
              Source Database (Retool)
            </h2>
            <DatabaseConnection
              title="Retool Database"
              colorClass="from-retool to-retool-light"
              onConnect={handleRetoolConnect}
              isConnected={isRetoolConnected}
              isLoading={isRetoolConnecting}
            />

            {isRetoolConnected && (
              <>
                <TableSelector
                  tables={retoolTables}
                  selectedTable={selectedRetoolTable}
                  onTableSelect={handleRetoolTableSelect}
                  isLoading={isRetoolConnecting}
                  colorClass="text-retool"
                />

                {selectedRetoolTable && (
                  <DataPreview
                    title="Retool Table"
                    data={retoolData}
                    isLoading={isRetoolDataLoading}
                    colorClass="bg-retool text-white"
                  />
                )}
              </>
            )}
          </div>

          {/* Target (Supabase) Column */}
          <div className="space-y-6 rounded-lg border border-gray-200 shadow-sm p-6 bg-white">
            <h2 className="text-xl font-semibold text-supabase flex items-center">
              <span className="bg-supabase rounded-full w-2 h-2 mr-2"></span>
              Target Database (Supabase)
            </h2>
            <DatabaseConnection
              title="Supabase Database"
              colorClass="from-supabase to-supabase-light"
              onConnect={handleSupabaseConnect}
              isConnected={isSupabaseConnected}
              isLoading={isSupabaseConnecting}
            />

            {isSupabaseConnected && (
              <>
                <TableSelector
                  tables={supabaseTables}
                  selectedTable={selectedSupabaseTable}
                  onTableSelect={handleSupabaseTableSelect}
                  isLoading={isSupabaseConnecting}
                  colorClass="text-supabase"
                />

                {selectedSupabaseTable && (
                  <DataPreview
                    title="Supabase Table"
                    data={supabaseData}
                    isLoading={isSupabaseDataLoading}
                    colorClass="bg-supabase text-white"
                  />
                )}
              </>
            )}
          </div>
        </div>

        {/* Migration Controls (Bottom) */}
        {(isRetoolConnected && isSupabaseConnected) && (
          <div className="mt-8">
            <MigrationControls
              onMigrate={handleMigration}
              isMigrating={isMigrating}
              sourceTable={selectedRetoolTable}
              targetTable={selectedSupabaseTable}
              progress={migrationProgress}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
