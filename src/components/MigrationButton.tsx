
import { Button } from "@/components/ui/button";
import { MigrationState } from "@/types/database";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowRight } from "lucide-react";

interface MigrationButtonProps {
  onMigrate: () => Promise<void>;
  disabled: boolean;
  state: MigrationState;
}

export const MigrationButton: React.FC<MigrationButtonProps> = ({
  onMigrate,
  disabled,
  state,
}) => {
  const { inProgress, completed, error, rowsMigrated } = state;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-gray-700">Migration</CardTitle>
      </CardHeader>
      <CardContent>
        {inProgress && (
          <div className="space-y-2">
            <div className="text-sm">Migrating data...</div>
            <Progress value={30} className="w-full" />
          </div>
        )}
        
        {completed && !error && (
          <div className="text-green-600">
            Successfully migrated {rowsMigrated} rows.
          </div>
        )}
        
        {error && <div className="text-red-500">{error}</div>}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={onMigrate}
          disabled={disabled || inProgress}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full"
        >
          {inProgress ? "Migrating..." : "Migrate Data"}
          {!inProgress && <ArrowRight className="ml-2 h-4 w-4" />}
        </Button>
      </CardFooter>
    </Card>
  );
};
