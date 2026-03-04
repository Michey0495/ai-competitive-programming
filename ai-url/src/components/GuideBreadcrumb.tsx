"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { SITE_URL } from "@/lib/constants";

interface Guide {
  href: string;
  label: string;
}

export function GuideBreadcrumb({ guides }: { guides: Guide[] }) {
  const pathname = usePathname();
  const currentGuide = guides.find((g) => g.href === pathname);

  if (!currentGuide) return null;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "AEO Checker",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "ガイド",
        item: `${SITE_URL}/guides`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: currentGuide.label,
        item: `${SITE_URL}${currentGuide.href}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <nav aria-label="パンくずリスト" className="mb-6">
        <ol className="flex items-center gap-1 text-sm text-white/40">
          <li>
            <Link href="/" className="hover:text-white transition-colors">
              AEO Checker
            </Link>
          </li>
          <li>/</li>
          <li>
            <span>ガイド</span>
          </li>
          <li>/</li>
          <li className="text-white/70">{currentGuide.label}</li>
        </ol>
      </nav>
    </>
  );
}
