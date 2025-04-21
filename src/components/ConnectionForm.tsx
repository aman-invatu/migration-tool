
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Check } from "lucide-react";

interface ConnectionFormProps {
  title: string;
  onConnect: (connectionString: string) => Promise<void>;
  onDisconnect: () => void;
  isConnected: boolean;
  loading: boolean;
  error: string | null;
  primaryColor: string;
}

export const ConnectionForm: React.FC<ConnectionFormProps> = ({
  title,
  onConnect,
  onDisconnect,
  isConnected,
  loading,
  error,
  primaryColor
}) => {
  const [connectionString, setConnectionString] = useState("");
  
  const handleConnect = async () => {
    if (!connectionString.trim()) return;
    await onConnect(connectionString);
  };

  const handleDisconnect = () => {
    onDisconnect();
    setConnectionString("");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className={`text-${primaryColor}-600`}>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="connection-string" className="text-sm font-medium">
              Connection String
            </label>
            <Input
              id="connection-string"
              placeholder="Enter connection string..."
              value={connectionString}
              onChange={(e) => setConnectionString(e.target.value)}
              disabled={isConnected || loading}
              className="w-full"
              type="password"
            />
          </div>
          {error && <div className="text-sm text-red-500">{error}</div>}
          {isConnected && (
            <div className="text-sm text-green-600 flex items-center gap-2">
              <Check className="h-4 w-4 text-green-600" />
              Connection established
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        {!isConnected ? (
          <Button
            onClick={handleConnect}
            disabled={!connectionString.trim() || loading}
            className={`bg-${primaryColor}-600 hover:bg-${primaryColor}-700 w-full`}
          >
            {loading ? "Connecting..." : "Connect"}
            {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        ) : (
          <Button
            onClick={handleDisconnect}
            variant="destructive"
            className="w-full"
          >
            Disconnect
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

