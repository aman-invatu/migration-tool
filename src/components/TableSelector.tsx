
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TableSelectorProps {
  tables: string[];
  selectedTable: string | null;
  onSelectTable: (tableName: string) => void;
  disabled: boolean;
  title: string;
  primaryColor: string;
}

export const TableSelector: React.FC<TableSelectorProps> = ({
  tables,
  selectedTable,
  onSelectTable,
  disabled,
  title,
  primaryColor,
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className={`text-${primaryColor}-600`}>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Select
          value={selectedTable || ""}
          onValueChange={onSelectTable}
          disabled={disabled}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a table" />
          </SelectTrigger>
          <SelectContent>
            {tables.map((table) => (
              <SelectItem key={table} value={table}>
                {table}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};
