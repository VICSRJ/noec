import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const contentRoot = path.join(root, "src", "content");
const outputPath = path.join(root, "public", "sitemap.xml");
const baseUrl = "https://vicsrj.github.io/noec";

function collectMdx(directory, relative = "") {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const slugs = [];

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    const relativePath = path.join(relative, entry.name);

    if (entry.isDirectory()) {
      slugs.push(...collectMdx(absolutePath, relativePath));
      continue;
    }

    if (!entry.isFile() || !entry.name.endsWith(".mdx")) continue;

    const slug = relativePath.replace(/\\/g, "/").replace(/\.mdx$/i, "");
    if (slug) slugs.push(`/${slug}`);
  }

  return slugs;
}

const routes = ["/", "/roadmap", "/changelog", ...collectMdx(contentRoot)];
const uniqueRoutes = [...new Set(routes)].sort((a, b) => {
  if (a === "/") return -1;
  if (b === "/") return 1;
  return a.localeCompare(b);
});

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...uniqueRoutes.map((route) => {
    const loc = new URL(`${route.replace(/\/$/, "") || "/"}`, `${baseUrl}/`).toString();
    return `  <url><loc>${loc}</loc></url>`;
  }),
  "</urlset>",
  "",
].join("\n");

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, xml, "utf8");
console.log(`Generated ${outputPath} with ${uniqueRoutes.length} URLs.`);
