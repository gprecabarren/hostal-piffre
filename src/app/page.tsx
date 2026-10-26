import Landing from "@/components/public/Landing";
import { getContent } from "@/lib/content";
import { homeSchema, publicContent } from "@/lib/seo";

export default async function HomePage() {
  const content = await getContent();
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(homeSchema(content)).replace(/</g,'\\u003c')}}/><Landing content={publicContent(content)} /></>;
}
