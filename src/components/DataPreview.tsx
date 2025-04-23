
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DataItem {
  [key: string]: any;
}

interface DataPreviewProps {
  title: string;
  data: DataItem[];
  isLoading: boolean;
  colorClass: string;
}

const DataPreview = ({ title, data, isLoading, colorClass }: DataPreviewProps) => {
  // Extract column headers from the first data item
  const columns = data.length > 0 ? Object.keys(data[0]) : [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className={cn("py-3", colorClass)}>
        <CardTitle className="text-white text-sm">{title} Preview</CardTitle>
      </CardHeader>
      <CardContent className="p-0 overflow-auto max-h-64">
        {data.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column} className="px-2 py-1 text-xs">
                    {column}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, index) => (
                <TableRow key={index}>
                  {columns.map((column) => (
                    <TableCell key={`${index}-${column}`} className="px-2 py-1 text-xs">
                      {String(item[column])}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center p-4 text-muted-foreground">
            No data available for preview
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DataPreview;
