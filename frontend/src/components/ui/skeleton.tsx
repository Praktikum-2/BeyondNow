import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "bg-gray-200 animate-pulse rounded-md",
        "animation-duration-[3000ms]",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
