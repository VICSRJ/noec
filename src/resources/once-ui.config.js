const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const baseURL = "https://vicsrj.github.io/noec/";

const routes = {
  "/changelog": true,
  "/roadmap": true,
};

import { Geist } from "next/font/google";
import { Geist_Mono } from "next/font/google";

const heading = Geist({ variable: "--font-heading", subsets: ["latin"], display: "swap" });
const body = Geist({ variable: "--font-body", subsets: ["latin"], display: "swap" });
const label = Geist({ variable: "--font-label", subsets: ["latin"], display: "swap" });
const code = Geist_Mono({ variable: "--font-code", subsets: ["latin"], display: "swap" });

const fonts = { heading, body, label, code };

const style = {
  theme: "dark",
  neutral: "gray",
  brand: "blue",
  accent: "indigo",
  solid: "contrast",
  solidStyle: "flat",
  border: "playful",
  surface: "translucent",
  transition: "all",
  scaling: "100",
};

const dataStyle = {
  variant: "gradient",
  mode: "categorical",
  height: 24,
  axis: { stroke: "var(--neutral-alpha-weak)" },
  tick: { fill: "var(--neutral-on-background-weak)", fontSize: 11, line: false },
};

const layout = {
  header: { width: 200 },
  body: { width: 200 },
  sidebar: { width: 17, collapsible: false },
  content: { width: 44 },
  sideNav: { width: 17 },
  footer: { width: 72 },
};

const effects = {
  mask: { cursor: false, x: 50, y: 0, radius: 100 },
  gradient: { display: false, x: 50, y: 0, width: 100, height: 100, tilt: 0, colorStart: "brand-background-strong", colorEnd: "static-transparent", opacity: 50 },
  dots: { display: false, size: 2, color: "brand-on-background-weak", opacity: 20 },
  lines: { display: false, color: "neutral-alpha-weak", opacity: 100 },
  grid: { display: false, color: "neutral-alpha-weak", opacity: 100 },
};

const social = [{ name: "GitHub", icon: "github", link: "https://github.com/once-ui-system" }];

const schema = {
  logo: "",
  type: "Organization",
  name: "Magic Docs",
  description: "Magic Docs is a simple and beautiful documentation system built with Once UI.",
  email: "",
  locale: "en_US",
};

const meta = {
  home: { title: `Docs – ${schema.name}`, description: schema.description, path: "/", image: `${basePath}/images/cover.jpg` },
  roadmap: { title: `Roadmap – ${schema.name}`, description: schema.description, path: "/roadmap", image: `${basePath}/images/cover.jpg` },
  changelog: { title: `Changelog – ${schema.name}`, description: schema.description, path: "/changelog", image: `${basePath}/images/cover.jpg` },
};

export { dataStyle, effects, style, layout, basePath, baseURL, social, schema, meta, routes, fonts };
