import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <p className="text-4xl font-bold text-white/40">404</p>
      <h2 className="text-2xl font-bold text-white">ページが見つかりません</h2>
      <p className="text-white/60">
        お探しのバトルは存在しないか、期限切れです。
      </p>
      <Button asChild className="bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200">
        <Link href="/">
          ホームに戻る
        </Link>
      </Button>
    </div>
  );
}
