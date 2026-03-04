import Link from "next/link";
import { GuideBreadcrumb } from "@/components/GuideBreadcrumb";

const GUIDES = [
  { href: "/guides/llms-txt", label: "llms.txt" },
  { href: "/guides/robots-txt-ai", label: "robots.txt" },
  { href: "/guides/structured-data", label: "構造化データ" },
  { href: "/guides/meta-tags", label: "メタタグ" },
  { href: "/guides/content-structure", label: "コンテンツ構造" },
  { href: "/guides/sitemap", label: "サイトマップ" },
  { href: "/guides/technical", label: "技術的要素" },
];

export default function GuidesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <GuideBreadcrumb guides={GUIDES} />
      <nav className="flex flex-wrap gap-2 mb-10">
        {GUIDES.map((g) => (
          <Link
            key={g.href}
            href={g.href}
            className="text-white/40 hover:text-white text-sm px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg transition-all duration-200 cursor-pointer"
          >
            {g.label}
          </Link>
        ))}
      </nav>
      <article className="prose prose-invert max-w-none [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-white [&_h1]:mb-6 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-white [&_h2]:mt-10 [&_h2]:mb-4 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-white [&_h3]:mt-6 [&_h3]:mb-3 [&_p]:text-white/70 [&_p]:leading-relaxed [&_p]:mb-4 [&_pre]:bg-white/5 [&_pre]:border [&_pre]:border-white/10 [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:text-emerald-300 [&_pre]:text-sm [&_pre]:overflow-x-auto [&_code]:text-emerald-400 [&_ul]:text-white/70 [&_li]:mb-2">
        {children}
      </article>
    </div>
  );
}
