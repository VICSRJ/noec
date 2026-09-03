import { baseURL } from "@/resources";

export const dynamic = "force-static";
export const revalidate = false;

export default function robots() {
  return {
    rules: [{ userAgent: "*" }],
    sitemap: `${baseURL}/sitemap.xml`,
  };
}
