import { getPages } from "@/app/utils/utils";
import { baseURL } from "@/resources";

export const dynamic = "force-static";
export const revalidate = false;

export default function sitemap() {
  const docs = getPages(["src", "content"]).map((post) => ({
    url: new URL(`/${post.slug}`, baseURL).toString(),
    lastModified: post.metadata.updatedAt || undefined,
  }));

  const siteRoutes = ["/", "/roadmap", "/changelog"]
    .filter((route) => route === "/" || route === "/roadmap" || route === "/changelog")
    .map((route) => ({
      url: new URL(route, baseURL).toString(),
    }));

  return [...siteRoutes, ...docs];
}
