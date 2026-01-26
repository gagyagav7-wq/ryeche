import Link from "next/link";
import BrutCard from "@/components/BrutCard";
import BrutButton from "@/components/BrutButton";

export default function DownloaderPage() {
  return (
    <main className="min-h-dvh flex items-center justify-center p-4 bg-bg">
      <BrutCard title="DOWNLOADER" className="text-center max-w-lg bg-accent-2">
        <div className="text-6xl mb-4">🚧</div>
        <h1 className="text-3xl font-black uppercase mb-4">COMING SOON</h1>
        <p className="font-bold mb-8">
          Fitur download TikTok/IG tanpa watermark lagi dimasak. Tunggu tanggal mainnya, Bre.
        </p>
        <Link href="/dashboard">
          <BrutButton fullWidth>BALIK KE DASHBOARD</BrutButton>
        </Link>
      </BrutCard>
    </main>
  );
}
