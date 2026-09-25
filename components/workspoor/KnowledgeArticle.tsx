import type { ReactNode } from "react";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import WorkspoorShell from "@/components/workspoor/WorkspoorShell";
import { KNOWLEDGE_ARTICLES, KNOWLEDGE_REVIEW_DATE } from "@/lib/knowledge";
import { PERSON_ID, SITE_URL } from "@/lib/seo";

type Props = { slug: string; intro: string; sections: { id: string; title: string; content: ReactNode }[] };

export default function KnowledgeArticle({ slug, intro, sections }: Props) {
  const article = KNOWLEDGE_ARTICLES.find(item => item.slug === slug)!;
  const url = new URL(`/kennis/${slug}`, SITE_URL).toString();
  return <WorkspoorShell activePath={`/kennis/${slug}`}>
    <JsonLd data={{ "@context": "https://schema.org", "@graph": [
      { "@type": "Article", "@id": `${url}#article`, headline: article.title, description: article.description, mainEntityOfPage: url, datePublished: KNOWLEDGE_REVIEW_DATE, dateModified: KNOWLEDGE_REVIEW_DATE, inLanguage: "nl-NL", image: new URL("/opengraph-image", SITE_URL).toString(), author: { "@id": PERSON_ID }, publisher: { "@id": `${SITE_URL}#organization` } },
      { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: SITE_URL.toString() }, { "@type": "ListItem", position: 2, name: "Kennis", item: new URL("/kennis", SITE_URL).toString() }, { "@type": "ListItem", position: 3, name: article.title, item: url }] },
    ] }} />
    <article>
      <header className="ws-page-hero ws-literacy-article-hero"><div className="ws-frame"><nav className="ws-breadcrumb" aria-label="Broodkruimel"><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/kennis">Kennis</Link><span aria-hidden="true">/</span><span>{article.label}</span></nav><p className="ws-context">{article.label}</p><h1>{article.title}</h1><p className="ws-lead">{intro}</p><p className="ws-legal-updated">Door <Link href="/over">Nathan Sudmeier</Link> · <time dateTime={KNOWLEDGE_REVIEW_DATE}>25 september 2026</time></p></div></header>
      <div className="ws-legal-section"><div className="ws-frame ws-legal-layout"><aside className="ws-legal-summary"><h2>In dit artikel</h2><ul>{sections.map(section => <li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>)}</ul></aside><div className="ws-legal-content">{sections.map(section => <section key={section.id} id={section.id}><h2>{section.title}</h2>{section.content}</section>)}<section><h2>Verder lezen</h2><ul>{KNOWLEDGE_ARTICLES.filter(item => item.slug !== slug).map(item => <li key={item.slug}><Link href={`/kennis/${item.slug}`}>{item.title}</Link></li>)}</ul><p>Deze gids beschrijft de werkwijze van Setpiece. Voor een passende toepassing onderzoeken we altijd het werk, de gegevens en de verantwoordelijkheden binnen jouw organisatie.</p></section></div></div></div>
    </article>
  </WorkspoorShell>;
}
