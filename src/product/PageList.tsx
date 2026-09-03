import { getPages, sortPages } from "@/app/utils/utils";
import { Card, Column, Icon, Row, Media, Text } from "@once-ui-system/core";
import { basePath } from "@/resources";
import React from "react";

interface props extends Omit<React.ComponentProps<typeof Card>, "onClick"> {
  range?: [number] | [number, number];
  thumbnail?: boolean;
  path?: string[];
  description?: boolean;
  sortType?: "order" | "alphabetical" | "date" | "section";
  depth?: number;
}

const assetPath = (src: string) => {
  if (!src || /^https?:\/\//i.test(src) || src.startsWith("data:")) return src;
  return src.startsWith("/") ? `${basePath}${src}` : src;
};

const pagePath = (slug: string) => `${basePath}/${slug.replace(/^\//, "")}`;

function formatSlug(slug: string): React.JSX.Element {
  const parts = slug.split("/");
  const pathParts = parts.slice(0, -1);
  if (pathParts.length === 0) return <></>;

  return (
    <Row vertical="center" gap="4">
      {pathParts.map((part, index) => {
        const formattedPart = part
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
        return (
          <React.Fragment key={`${part}-${index}`}>
            {index > 0 && <Icon name="chevronRight" size="xs" />}
            <Text>{formattedPart}</Text>
          </React.Fragment>
        );
      })}
    </Row>
  );
}

export function PageList({
  range,
  thumbnail = false,
  path = [],
  sortType = "order",
  depth,
  description = true,
  ...rest
}: props) {
  const fullPath = ["src", "content", ...path];
  let pages = getPages(fullPath);

  if (depth !== undefined) {
    pages = pages.filter((page) => {
      const prefix = path.join("/");
      const relativePath = prefix ? page.slug.replace(`${prefix}/`, "") : page.slug;
      const slashCount = (relativePath.match(/\//g) || []).length;
      return slashCount < depth;
    });
  }

  const sortedPages = sortPages(pages, sortType);
  const displayedPages = range
    ? range.length === 1
      ? sortedPages.slice(range[0] - 1)
      : sortedPages.slice(range[0] - 1, range[1])
    : sortedPages;

  return (
    <>
      {displayedPages.map((page) => (
        <Card
          href={pagePath(page.slug)}
          key={page.slug}
          radius="l"
          padding="2"
          gap="16"
          s={{ direction: "column" }}
          border="neutral-alpha-weak"
          fillWidth
          {...rest}
        >
          {page.metadata.image && thumbnail && (
            <Media
              priority
              sizes="480px"
              border="neutral-alpha-weak"
              cursor="interactive"
              radius="m"
              src={assetPath(page.metadata.image)}
              alt={`Thumbnail of ${page.metadata.title}`}
              aspectRatio="16 / 9"
            />
          )}
          <Column fillWidth gap="4" vertical="center" paddingX="16" paddingY="12">
            <Text variant="label-default-s" onBackground="neutral-weak">
              {formatSlug(page.slug)}
            </Text>
            <Text variant="heading-strong-l" wrap="balance" onBackground="neutral-strong">
              {page.metadata.title}
            </Text>
            {description && page.metadata.summary && (
              <Text variant="body-default-s" onBackground="neutral-medium" marginTop="12" wrap="balance">
                {page.metadata.summary}
              </Text>
            )}
          </Column>
        </Card>
      ))}
    </>
  );
}
