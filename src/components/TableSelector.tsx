import React from 'react';
import { useDatabase } from '../context/DatabaseContext';

interface TableSelectorProps {
  type: 'retool' | 'supabase';
}

const TableSelector: React.FC<TableSelectorProps> = ({ type }) => {
  const {
    retoolTables,
    supabaseTables,
    selectedRetoolTable,
    selectedSupabaseTable,
    retoolTableData,
    supabaseTableData,
    selectRetoolTable,
    selectSupabaseTable,
    retoolConnected,
    supabaseConnected
  } = useDatabase();
  
  const tables = type === 'retool' ? retoolTables : supabaseTables;
  const selectedTable = type === 'retool' ? selectedRetoolTable : selectedSupabaseTable;
  const tableData = type === 'retool' ? retoolTableData : supabaseTableData;
  const handleSelectTable = type === 'retool' ? selectRetoolTable : selectSupabaseTable;
  const isConnected = type === 'retool' ? retoolConnected : supabaseConnected;
  
  if (!isConnected) {
    return null;
  }
  
  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Table
          </label>
          <select
            value={selectedTable || ''}
            onChange={(e) => handleSelectTable(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Choose a table</option>
            {tables.map((table) => (
              <option key={table} value={table}>
                {table}
              </option>
            ))}
          </select>
        </div>
        
        {selectedTable && tableData.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">
              Preview: {selectedTable}
            </h4>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {Object.keys(tableData[0]).map((key) => (
                      <th
                        key={key}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tableData.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-gray-50">
                      {Object.values(row).map((value, colIndex) => (
                        <td
                          key={colIndex}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                        >
                          {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableSelector;
