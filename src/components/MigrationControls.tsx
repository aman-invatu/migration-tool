
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Loader2, Database } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface MigrationControlsProps {
  onMigrate: () => void;
  isMigrating: boolean;
  sourceTable: string | null;
  targetTable: string | null;
  progress: number | null;
}

const MigrationControls = ({
  onMigrate,
  isMigrating,
  sourceTable,
  targetTable,
  progress
}: MigrationControlsProps) => {
  const canMigrate = sourceTable && targetTable;

  return (
    <Card className="w-full border border-gray-200 shadow-md overflow-hidden">
      <CardContent className="p-6 space-y-5">
        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-md">
            <Database className="h-4 w-4 text-retool" />
            <div className={`text-sm ${sourceTable ? 'font-medium' : 'text-muted-foreground'}`}>
              {sourceTable || 'Select Source'}
            </div>
          </div>
          <ArrowRight className={`h-5 w-5 ${canMigrate ? 'text-primary' : 'text-muted-foreground'}`} />
          <div className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-md">
            <Database className="h-4 w-4 text-supabase" />
            <div className={`text-sm ${targetTable ? 'font-medium' : 'text-muted-foreground'}`}>
              {targetTable || 'Select Target'}
            </div>
          </div>
        </div>

        {isMigrating && progress !== null && (
          <div className="space-y-2">
            <Progress value={progress} className="h-2 bg-gray-200" />
            <p className="text-center text-sm text-muted-foreground">
              {progress}% Complete
            </p>
          </div>
        )}

        <Button 
          onClick={onMigrate}
          disabled={!canMigrate || isMigrating} 
          className="w-full bg-gradient-to-r from-retool to-supabase text-white hover:opacity-90 transition-all py-6 relative overflow-hidden"
        >
          {isMigrating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Migrating Data...
            </>
          ) : (
            <>
              {!canMigrate ? "Select Source & Target Tables" : "Migrate Data"}
            </>
          )}
          {canMigrate && !isMigrating && (
            <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity"></div>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default MigrationControls;
