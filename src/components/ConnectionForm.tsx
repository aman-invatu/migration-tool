
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Check, Database, AlertCircle } from "lucide-react";

interface ConnectionFormProps {
  title: string;
  onConnect: (connectionString: string) => Promise<void>;
  onDisconnect: () => void;
  isConnected: boolean;
  loading: boolean;
  error: string | null;
  primaryColor: string;
}

const gradientMap: Record<string, string> = {
  blue: "bg-gradient-to-r from-blue-600 to-blue-400",
  purple: "bg-gradient-to-r from-green-400 to-teal-400",
};

const bgMap: Record<string, string> = {
  blue: "bg-blue-700",
  purple: "bg-teal-500",
};

const iconColor: Record<string, string> = {
  blue: "text-white",
  purple: "text-white",
};

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

  // Allow showing the existing value only if not connected,
  // when connected, show the existing value as readOnly like in the image.
  const handleConnect = async () => {
    if (!connectionString.trim()) return;
    await onConnect(connectionString);
  };

  const handleDisconnect = () => {
    onDisconnect();
    setConnectionString("");
  };

  // Fix header and main card structure to reflect visual hierarchy (icon, bg, tick, etc)
  return (
    <Card className="w-full border border-gray-200 shadow-none rounded-xl overflow-hidden">
      {/* Colored Card Header */}
      <div className={`flex items-center justify-between px-6 py-4 ${gradientMap[primaryColor]} rounded-t-lg`}>
        <div className="flex items-center gap-2">
          <Database className={`h-6 w-6 ${iconColor[primaryColor]}`} />
          <span className={`text-lg font-semibold ${iconColor[primaryColor]}`}>{title}</span>
        </div>
        {/* Right-aligned check icon if connected */}
        {isConnected && <Check className="h-6 w-6 text-white" />}
      </div>

      {/* Card Content */}
      <CardContent className="pt-6 pb-0">
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="connection-string" className="text-sm font-medium text-gray-700">
              Connection String
            </label>
            <Input
              id="connection-string"
              placeholder="Enter connection string..."
              value={connectionString}
              onChange={(e) => setConnectionString(e.target.value)}
              disabled={isConnected || loading}
              className={`w-full ${isConnected ? "bg-gray-100" : ""}`}
              type="text"
              readOnly={isConnected}
            />
          </div>
          {/* Show error */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-300 text-red-600 rounded px-3 py-2 text-sm">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </CardContent>

      {/* Card Footer - Buttons */}
      <CardFooter className="pt-6">
        {!isConnected ? (
          <Button
            onClick={handleConnect}
            disabled={!connectionString.trim() || loading}
            className={`w-full text-base font-semibold rounded-md py-2 mt-0 ${primaryColor === 'blue'
              ? 'bg-blue-900 hover:bg-blue-800'
              : 'bg-teal-600 hover:bg-teal-500'
            }`}
          >
            {loading ? "Connecting..." : "Connect"}
          </Button>
        ) : (
          <Button
            className="w-full text-base font-semibold rounded-md py-2 mt-0 bg-gray-300 text-gray-500 cursor-default"
            disabled
          >
            Connected
          </Button>
        )}
        {isConnected && (
          <Button
            onClick={handleDisconnect}
            type="button"
            variant="destructive"
            className="w-full mt-2"
          >
            Disconnect
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
