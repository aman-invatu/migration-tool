
export interface ConnectionConfig {
  connectionString: string;
  isConnected: boolean;
  tables: string[];
  selectedTable: string | null;
  loading: boolean;
  error: string | null;
}

export interface TableData {
  columns: string[];
  rows: Record<string, any>[];
  loading: boolean;
  error: string | null;
}

export interface MigrationState {
  inProgress: boolean;
  completed: boolean;
  error: string | null;
  rowsMigrated: number;
}
