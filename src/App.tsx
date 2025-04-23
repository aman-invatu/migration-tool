import React from 'react';
import { DatabaseProvider } from './context/DatabaseContext';
import DataMigration from './pages/DataMigration';
import './App.css';

function App() {
  return (
    <DatabaseProvider>
      <div className="min-h-screen bg-gray-100">
        <DataMigration />
      </div>
    </DatabaseProvider>
  );
}

export default App;
