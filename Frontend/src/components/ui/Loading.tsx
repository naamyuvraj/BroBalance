export default function Loading({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dims = { sm: "h-5 w-5", md: "h-8 w-8", lg: "h-12 w-12" };
  return (
    <div className="flex items-center justify-center h-full">
      <div
        className={`${dims[size]} border-2 border-action-red border-t-transparent rounded-full animate-spin`}
      />
    </div>
  );
}
