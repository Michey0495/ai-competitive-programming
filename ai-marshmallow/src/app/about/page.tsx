import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "このサービスについて",
  description: "AIマシュマロは匿名で質問を送るとAIが個性的に回答するQ&Aサービスです。",
};

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">
      <div className="text-center space-y-3">
        <div className="flex justify-center">
          <span className="inline-block w-3 h-3 rounded-full bg-pink-400" />
        </div>
        <h1 className="text-2xl font-bold text-white">AIマシュマロとは</h1>
        <p className="text-white/60 text-sm">匿名で質問するとAIが個性的に回答するサービス</p>
      </div>

      <div className="space-y-4">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-5 space-y-2">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-pink-400" />
              匿名で質問できます
            </h2>
            <p className="text-sm text-white/60 leading-relaxed">
              アカウント登録不要。何でも気軽に聞いてみてください。
              恋愛相談・人生相談・くだらない疑問・ちょっとした悩み、何でもOKです。
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-5 space-y-2">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-pink-400" />
              マシュが回答します
            </h2>
            <p className="text-sm text-white/60 leading-relaxed">
              AIキャラクター「マシュ」がふわふわで温かみのある回答をします。
              時々ユニークな視点や思わず笑ってしまうような切り口で答えてくれます。
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white/5 border-white/10">
          <CardContent className="pt-5 space-y-2">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-pink-400" />
              SNSでシェアできます
            </h2>
            <p className="text-sm text-white/60 leading-relaxed">
              各回答には専用URLが発行されます。Twitter/XやLINEで
              友達にシェアして楽しんでください。
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="text-center pt-4">
        <Link href="/">
          <Button className="bg-pink-500 hover:bg-pink-600 text-white">
            さっそく質問してみる
          </Button>
        </Link>
      </div>

      <div className="text-center text-xs text-white/30 space-y-1">
        <p>本サービスはAnthropicのClaude APIを使用しています</p>
        <p>不適切なコンテンツはフィルタリングされます</p>
      </div>
    </div>
  );
}
