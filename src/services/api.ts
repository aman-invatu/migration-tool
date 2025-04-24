import axios from 'axios';

// const API_BASE_URL = 'http://localhost:5000/api';
const API_BASE_URL = 'https://backend-x7xt.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface ConnectionResponse {
  success: boolean;
  message: string;
}

export interface TablesResponse {
  success: boolean;
  tables: string[];
}

export interface TablePreviewResponse {
  success: boolean;
  data: any[];
}

export interface MigrationResponse {
  success: boolean;
  message: string;
  migratedCount?: number;
  totalCount?: number;
  hasMoreData?: boolean;
}

export const databaseApi = {
  // Retool Database
  connectRetool: async (connectionString: string): Promise<ConnectionResponse> => {
    const response = await api.post('/database/connect/retool', { connectionString });
    return response.data;
  },
  
  getRetoolTables: async (): Promise<TablesResponse> => {
    const response = await api.get('/database/tables/retool');
    return response.data;
  },
  
  getRetoolTablePreview: async (tableName: string): Promise<TablePreviewResponse> => {
    const response = await api.get(`/database/preview/retool/${tableName}`);
    return response.data;
  },
  
  // Supabase Database
  connectSupabase: async (connectionString: string): Promise<ConnectionResponse> => {
    const response = await api.post('/database/connect/supabase', { connectionString });
    return response.data;
  },
  
  getSupabaseTables: async (): Promise<TablesResponse> => {
    const response = await api.get('/database/tables/supabase');
    return response.data;
  },
  
  getSupabaseTablePreview: async (tableName: string): Promise<TablePreviewResponse> => {
    const response = await api.get(`/database/preview/supabase/${tableName}`);
    return response.data;
  },
  
  // Migration
  migrateData: async (sourceTable: string, targetTable: string): Promise<MigrationResponse> => {
    const response = await api.post('/database/migrate', { sourceTable, targetTable });
    return response.data;
  },

  getMigrationProgress: async () => {
    const response = await api.get('/database/migration-progress');
    return response.data;
  }
};

export default api; 