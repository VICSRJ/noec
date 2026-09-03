"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { Button, Flex, Logo, NavIcon, Row, Kbar, useTheme, Animation } from "@once-ui-system/core";
import { layout, routes } from "@/resources/once-ui.config";
import { Sidebar, NavigationItem } from "./Sidebar";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export function Header() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [isMac, setIsMac] = useState(false);
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([]);
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  useEffect(() => setSidebarVisible(false), [pathname]);

  useEffect(() => {
    setIsMac(navigator.userAgent.toLowerCase().includes("mac"));
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${BASE_PATH}/api/navigation`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Navigation request failed: ${response.status}`);
        return response.json();
      })
      .then((data: NavigationItem[]) => setNavigationItems(Array.isArray(data) ? data : []))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        console.error("Navigation fetch failed", error);
      });

    return () => controller.abort();
  }, []);

  const docsItems = useMemo(() => {
    const convert = (items: NavigationItem[]): any[] => items.flatMap((item) => {
      if (item.children?.length) {
        return convert(item.children).map((child) => ({ ...child, section: item.title }));
      }

      const slug = item.slug.replace(/^src[\\/]content[\\/]/, "").replace(/\\/g, "/");
      return [{
        id: slug,
        name: item.label || item.title,
        section: "Documentation",
        shortcut: [],
        keywords: item.keywords || `${item.title.toLowerCase()}, docs, documentation`,
        href: `${BASE_PATH}/${slug}`,
        icon: item.navIcon || "document",
      }];
    });

    return convert(navigationItems);
  }, [navigationItems]);

  const kbar = useMemo(() => [
    {
      id: "home",
      name: "Home",
      section: "Navigation",
      shortcut: [],
      keywords: "home, landing page",
      href: `${BASE_PATH}/`,
      icon: "home",
    },
    ...(routes["/changelog"] ? [{ id: "changelog", name: "Changelog", section: "Navigation", shortcut: [], keywords: "changelog", href: `${BASE_PATH}/changelog`, icon: "changelog" }] : []),
    ...(routes["/roadmap"] ? [{ id: "roadmap", name: "Roadmap", section: "Navigation", shortcut: [], keywords: "roadmap", href: `${BASE_PATH}/roadmap`, icon: "roadmap" }] : []),
    ...docsItems,
    {
      id: "theme-toggle",
      name: theme === "dark" ? "Light mode" : "Dark mode",
      section: "Theme",
      shortcut: [],
      keywords: "light mode, dark mode, theme, toggle",
      perform: () => setTheme(theme === "dark" ? "light" : "dark"),
      icon: theme === "dark" ? "light" : "dark",
    },
  ], [docsItems, theme, setTheme]);

  useEffect(() => {
    if (!sidebarVisible) return;
    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollY);
    };
  }, [sidebarVisible]);

  return (
    <Flex as="header" background="page" horizontal="center" position="sticky" zIndex={9} fillWidth vertical="center" paddingY="12" paddingRight="16" paddingLeft="12" borderBottom="neutral-alpha-medium">
      <Row maxWidth={layout.header.width} vertical="center" horizontal="between" gap="l">
        <Row fillWidth vertical="center" gap="8">
          <Animation
            triggerType="click"
            active={sidebarVisible}
            slideDown={1}
            scale={0.9}
            blur={0.5}
            duration={200}
            trigger={<NavIcon hide m={{ hide: false }} onClick={() => setSidebarVisible((value) => !value)} isActive={sidebarVisible} />}
          >
            <Row width={24} style={{ height: "calc(100vh - var(--static-space-64))", top: "3.25rem", left: "-1.5rem" }} background="page" position="fixed" borderTop="neutral-alpha-medium" borderRight="neutral-alpha-medium" zIndex={9}>
              <Sidebar data-scaling="110" fillWidth width={undefined} padding="8" />
            </Row>
          </Animation>
          <Logo dark wordmark="/trademarks/type-dark.svg" size="s" href={`${BASE_PATH}/`} />
          <Logo light wordmark="/trademarks/type-light.svg" size="s" href={`${BASE_PATH}/`} />
        </Row>

        <Kbar s={{ hide: true }} items={kbar} radius="full" background="neutral-alpha-weak">
          <Button data-border="rounded" size="s" variant="tertiary" weight="default">
            <Row vertical="center" gap="16" style={{ marginLeft: "-0.5rem" }} paddingRight="8">
              <Row background="neutral-alpha-medium" paddingX="8" paddingY="4" radius="full" data-scaling="90" textVariant="body-default-xs" onBackground="neutral-medium">{isMac ? "Cmd" : "Ctrl"} k</Row>
              Search docs...
            </Row>
          </Button>
        </Kbar>

        <Row fillWidth horizontal="end" gap="8" data-border="rounded">
          <Row s={{ hide: true }}><Button size="s" variant="secondary" href="https://once-ui.com/products">Start building</Button></Row>
          <Button href="https://once-ui.com/auth" size="s">Sign up</Button>
        </Row>
      </Row>
    </Flex>
  );
}
