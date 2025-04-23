
// This is a mock service for simulating database operations
// In a real application, you would use actual database connections

// Simulate connection delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const databaseService = {
  // Connect to database 
  connectToDatabase: async (type: 'retool' | 'supabase', connectionString: string): Promise<string[] | false> => {
    // Basic validation for connection string
    if (!connectionString.trim()) {
      throw new Error('Connection string cannot be empty');
    }
    
    // More comprehensive validation for postgres connection string
    const postgresRegex = /^postgres(ql)?:\/\/[^:]+:[^@]+@[^:]+:\d+\/\w+(\?.*)?$/;
    
    if (!postgresRegex.test(connectionString.toLowerCase())) {
      console.log('Invalid connection string format:', connectionString);
      throw new Error('Invalid PostgreSQL connection string format. Expected: postgres://username:password@hostname:port/database');
    }
    
    // Simulate connection delay
    await delay(1500);
    
    try {
      // In a real app, we would actually try to connect to the database here
      // For this mock service, we'll simulate a successful connection if the string has correct format
      // and contains specific keywords for demo purposes
      
      if (type === 'retool' && !connectionString.includes('retooldb.com') && !connectionString.includes('retool')) {
        console.log('Failed to connect to Retool database, missing retooldb.com or retool in the connection string');
        return false; // Connection failed
      }
      
      if (type === 'supabase' && !connectionString.includes('supabase') && !connectionString.includes('db.io')) {
        console.log('Failed to connect to Supabase database, missing supabase or db.io in the connection string');
        return false; // Connection failed
      }
      
      // Dynamic tables based on connection string
      // In a real app, we would fetch the actual tables from the database
      const dbName = connectionString.split('/').pop()?.split('?')[0];
      
      // Generate some dynamic table names based on the database name
      const tables = [
        `${dbName}_users`, 
        `${dbName}_products`, 
        `${dbName}_orders`,
        `${dbName}_customers`, 
        `${dbName}_transactions`
      ];
      
      return tables;
    } catch (error) {
      console.error('Connection error:', error);
      return false; // Connection failed
    }
  },

  // Get table data
  getTableData: async (type: 'retool' | 'supabase', tableName: string) => {
    // Simulate database query delay
    await delay(1000);
    
    // Generate dynamic mock data based on the table name
    const mockData = [];
    const recordCount = Math.floor(Math.random() * 10) + 5; // 5-15 records
    
    for (let i = 1; i <= recordCount; i++) {
      if (tableName.includes('user')) {
        mockData.push({
          id: i,
          username: `user${i}`,
          email: `user${i}@example.com`,
          created_at: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        });
      } else if (tableName.includes('product')) {
        mockData.push({
          id: i,
          name: `Product ${i}`,
          price: Math.floor(Math.random() * 1000) + 10,
          category: ['Electronics', 'Clothing', 'Food', 'Books'][Math.floor(Math.random() * 4)]
        });
      } else if (tableName.includes('order')) {
        mockData.push({
          id: i,
          customer_id: Math.floor(Math.random() * 100) + 1,
          total_amount: Math.floor(Math.random() * 500) + 50,
          order_date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        });
      } else if (tableName.includes('customer')) {
        mockData.push({
          id: i,
          name: `Customer ${i}`,
          email: `customer${i}@example.com`,
          location: ['New York', 'London', 'Tokyo', 'Sydney'][Math.floor(Math.random() * 4)]
        });
      } else if (tableName.includes('transaction')) {
        mockData.push({
          id: i,
          order_id: Math.floor(Math.random() * 100) + 1,
          amount: Math.floor(Math.random() * 300) + 20,
          payment_method: ['Credit Card', 'PayPal', 'Bank Transfer', 'Cash'][Math.floor(Math.random() * 4)]
        });
      } else {
        // Generic data for other tables
        mockData.push({
          id: i,
          name: `Item ${i}`,
          value: Math.floor(Math.random() * 1000)
        });
      }
    }
    
    return mockData;
  },

  // Migrate data
  migrateData: async (
    sourceTable: string, 
    targetTable: string, 
    onProgressUpdate: (progress: number) => void
  ) => {
    // Estimate the number of records to migrate
    const recordsCount = Math.floor(Math.random() * 100) + 20; // 20-120 records for demo
    
    // Simulate migration process with progress updates
    for (let i = 0; i < 10; i++) {
      await delay(500);
      const progress = Math.round(((i + 1) / 10) * 100);
      onProgressUpdate(progress);
    }
    
    return {
      success: true,
      recordsCount
    };
  }
};
