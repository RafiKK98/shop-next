import { User } from "lucide-react";
import { formatDate } from "@/utils/format";

interface WelcomeSectionProps {
  name: string | null | undefined;
  email: string | null | undefined;
  image: string | null | undefined;
  createdAt: Date | string | null | undefined;
  totalOrders: number;
}

export function WelcomeSection({
  name,
  email,
  image,
  createdAt,
  totalOrders,
}: WelcomeSectionProps) {
  return (
    <div className="flex flex-col items-start gap-4 rounded-xl border border-base-200 bg-base-100 p-6 sm:flex-row sm:items-center sm:gap-5">
      <div className="flex size-16 items-center justify-center overflow-hidden rounded-full bg-base-200">
        {image ? (
          <img src={image} alt={name || "Avatar"} className="size-full object-cover" />
        ) : (
          <User className="size-7 text-base-content/30" />
        )}
      </div>

      <div className="flex-1">
        <h1 className="text-xl font-bold md:text-2xl">
          Welcome back, {name || "there"}
        </h1>
        <p className="text-sm text-base-content/50">{email}</p>
        <p className="mt-1 text-xs text-base-content/40">
          Member since {createdAt ? formatDate(createdAt) : "N/A"}
        </p>
      </div>

      <div className="hidden text-right sm:block">
        <p className="text-2xl font-bold">{totalOrders}</p>
        <p className="text-xs text-base-content/50">Total Orders</p>
      </div>
    </div>
  );
}
