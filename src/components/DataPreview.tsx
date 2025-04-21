
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TableData } from "@/types/database";

interface DataPreviewProps {
  data: TableData;
  title: string;
  primaryColor: string;
}

export const DataPreview: React.FC<DataPreviewProps> = ({ 
  data, 
  title,
  primaryColor
}) => {
  const { columns, rows, loading, error } = data;

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader>
        <CardTitle className={`text-${primaryColor}-600`}>{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {error ? (
          <div className="p-4 text-red-500">{error}</div>
        ) : loading ? (
          <div className="p-4 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        ) : columns.length > 0 ? (
          <div className="overflow-x-auto max-h-64">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead key={column}>{column}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {columns.map((column) => (
                      <TableCell key={`${rowIndex}-${column}`}>
                        {String(row[column] ?? "")}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="p-4 text-gray-500">No data available</div>
        )}
      </CardContent>
    </Card>
  );
};
