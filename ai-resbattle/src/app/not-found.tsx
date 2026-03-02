import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center">
      <h2 className="text-2xl font-bold">ページが見つかりません</h2>
      <p className="text-muted-foreground">
        お探しのバトルは存在しないか、期限切れです。
      </p>
      <Button asChild>
        <Link href="/">ホームに戻る</Link>
      </Button>
    </div>
  );
}
