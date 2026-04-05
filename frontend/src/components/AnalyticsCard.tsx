import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import {
  Card,
  CardHeader,
  CardTitle
} from "../components/ui/card";
import { DollarSign } from "lucide-react";

interface AnalyticsCardProps {
  title: string;
  value: string;
  variant?: "up" | "down";
  increaseValue: number;
}
export const AnalyticsCard = ({
  title,
  value,
  variant,
  increaseValue,
}: AnalyticsCardProps) => {
  const iconColor =
    variant === "up" ? "text-emerald-500" : "text-red-500";
  const increaseValueColor =
    variant === "up" ? "text-emerald-500" : "text-red-500";
  const Icon = variant === "up" ? FaCaretUp : FaCaretDown;

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Net Balance
        </CardTitle>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          ${balance.toLocaleString()}
        </div>
      </CardContent>
    </Card>
  );
};
