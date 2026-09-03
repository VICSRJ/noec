"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Schemes, Accordion, Column, Flex, Icon, Row, Tag, ToggleButton } from "@once-ui-system/core";
import { usePathname } from "next/navigation";
import { routes, layout } from "@/resources";
import styles from "./Sidebar.module.scss";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
let globalNavigationCache: NavigationItem[] | null = null;

export interface NavigationItem extends Omit<React.ComponentProps<typeof Flex>, "title" | "label" | "children"> {
  slug: string;
  title: string;
  label?: string;
  order?: number;
  children?: NavigationItem[];
  schemes?: Schemes;
  keywords?: string;
  navIcon?: string;
  navTag?: string;
  navLabel?: string;
  navTagVariant?: Schemes;
}

interface SidebarProps extends Omit<React.ComponentProps<typeof Flex>, "children"> {
  initialNavigation?: NavigationItem[];
}

function normalizeSlug(slug: string) {
  return slug.replace(/^src[\\/]content[\\/]/, "").replace(/\\/g, "/").replace(/^\/+/, "");
}

function NavigationItemView({ item, depth, pathname, renderNavigation }: { item: NavigationItem; depth: number; pathname: string; renderNavigation: (items: NavigationItem[], depth: number) => React.ReactNode; }) {
  const slug = normalizeSlug(item.slug);
  const current = pathname.replace(new RegExp(`^${BASE_PATH}`), "").replace(/^\/+|\/+$/g, "");
  const isSelected = current === slug;
  const isParent = current.startsWith(`${slug}/`);
  const hasActiveChild = item.children?.some((child) => {
    const childSlug = normalizeSlug(child.slug);
    return current === childSlug || current.startsWith(`${childSlug}/`);
  }) ?? false;
  const open = isSelected || isParent || hasActiveChild;

  if (item.children?.length) return (
    <Row fillWidth style={{ paddingLeft: `calc(${depth} * var(--static-space-8))` }}>
      <Column fillWidth marginTop="2">
        {layout.sidebar.collapsible ? (
          <Accordion gap="2" icon="chevronRight" iconRotation={90} size="s" radius="s" paddingLeft="4" paddingTop="4" open={open} title={<Row textVariant="label-strong-s" onBackground="brand-strong">{item.title}</Row>}>
            {renderNavigation(item.children, depth + 1)}
          </Accordion>
        ) : (
          <Column gap="2" paddingLeft="4" paddingTop="4"><Row paddingY="12" paddingLeft="8" textVariant="label-strong-s" onBackground="brand-strong">{item.title}</Row>{renderNavigation(item.children, depth + 1)}</Column>
        )}
      </Column>
    </Row>
  );

  return <ToggleButton fillWidth horizontal="between" selected={isSelected} className={depth === 0 ? styles.navigation : undefined} href={`${BASE_PATH}/${slug}`}>
    <Row fillWidth horizontal="between" vertical="center">
      <Row overflow="hidden" gap="8" onBackground={isSelected ? "neutral-strong" : "neutral-weak"} textVariant={isSelected ? "label-strong-s" : "label-default-s"} style={{ textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {item.navIcon && <Icon size="xs" name={item.navIcon} />}{item.label || item.title}
      </Row>
      {item.navTag && <Tag data-theme="dark" data-brand={item.navTagVariant} style={{ marginRight: "-0.5rem", transform: "scale(0.8)", transformOrigin: "right center" }} variant="brand" size="s">{item.navTag}</Tag>}
    </Row>
  </ToggleButton>;
}

const NavigationItemMemo = React.memo(NavigationItemView);

function ResourceLink({ href, icon, label, pathname }: { href: string; icon: string; label: string; pathname: string }) {
  const selected = pathname === `${BASE_PATH}${href}` || pathname === href;
  return <ToggleButton fillWidth horizontal="between" selected={selected} className={styles.navigation} href={`${BASE_PATH}${href}`}>
    <Row gap="8" onBackground={selected ? "neutral-strong" : "neutral-weak"} textVariant={selected ? "label-strong-s" : "label-default-s"}><Icon size="xs" name={icon} />{label}</Row>
  </ToggleButton>;
}

const ResourceLinkMemo = React.memo(ResourceLink);

function SidebarContent({ navigation, pathname }: { navigation: NavigationItem[]; pathname: string }) {
  const renderNavigation = (items: NavigationItem[], depth = 0): React.ReactNode => items.map((item) => <NavigationItemMemo key={normalizeSlug(item.slug)} item={item} depth={depth} pathname={pathname} renderNavigation={renderNavigation} />);
  return <>
    {renderNavigation(navigation)}
    {(routes["/roadmap"] || routes["/changelog"]) && <Column gap="2" marginTop="32" paddingLeft="4">
      <Row textVariant="label-strong-s" onBackground="brand-strong" paddingLeft="8" paddingY="12">Resources</Row>
      {routes["/roadmap"] && <ResourceLinkMemo href="/roadmap" icon="roadmap" label="Roadmap" pathname={pathname} />}
      {routes["/changelog"] && <ResourceLinkMemo href="/changelog" icon="changelog" label="Changelog" pathname={pathname} />}
    </Column>}
  </>;
}

export function Sidebar({ initialNavigation, ...rest }: SidebarProps) {
  const initial = initialNavigation?.length ? initialNavigation : globalNavigationCache || [];
  const [navigation, setNavigation] = useState<NavigationItem[]>(initial);
  const pathname = usePathname();

  useEffect(() => {
    if (navigation.length) {
      if (initialNavigation?.length) globalNavigationCache = initialNavigation;
      return;
    }
    const controller = new AbortController();
    fetch(`${BASE_PATH}/api/navigation`, { signal: controller.signal })
      .then((response) => { if (!response.ok) throw new Error(`Navigation request failed: ${response.status}`); return response.json(); })
      .then((data: NavigationItem[]) => { const value = Array.isArray(data) ? data : []; globalNavigationCache = value; setNavigation(value); })
      .catch((error: unknown) => { if (error instanceof DOMException && error.name === "AbortError") return; console.error("Navigation fetch failed", error); });
    return () => controller.abort();
  }, [initialNavigation, navigation.length]);

  const containerStyle = useMemo(() => ({ maxHeight: "calc(100vh - var(--static-space-80))" }), []);
  return <Column width={layout.sidebar.width} minWidth={layout.sidebar.width} position="sticky" top="56" fitHeight gap="2" as="nav" overflowY="auto" paddingX="8" paddingY="16" style={containerStyle} {...rest}>
    <SidebarContent navigation={navigation} pathname={pathname || ""} />
  </Column>;
}
