export default function Loading() {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-bg">
      <div className="text-4xl font-black uppercase animate-pulse flex flex-col items-center gap-4">
        <div className="w-16 h-16 border-brut border-main bg-accent animate-spin" />
        Loading...
      </div>
    </div>
  );
}
