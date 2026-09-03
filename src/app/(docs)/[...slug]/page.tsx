import { notFound } from "next/navigation";
import { getPages, getAdjacentPages } from "@/app/utils/utils";
import { formatDate } from "@/app/utils/formatDate";
import { Column, Heading, Icon, Row, Media, Text, Card, HeadingNav, Meta, Schema, Button } from "@once-ui-system/core";
import { basePath, baseURL, schema } from "@/resources";
import { CustomMDX } from "@/product/mdx";
import { Metadata } from "next";
import React from "react";

const pagePath = (slug: string) => `${basePath}/${slug.replace(/^\//, "")}`;
const assetPath = (src: string) => {
  if (!src || /^https?:\/\//i.test(src) || src.startsWith("data:")) return src;
  return src.startsWith("/") ? `${basePath}${src}` : src;
};

export function generateStaticParams(): { slug: string[] }[] {
  return getPages().map((doc) => ({ slug: doc.slug.split("/").filter(Boolean) }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const routeParams = await params;
  const slugPath = routeParams.slug.join("/");
  const doc = getPages().find((item) => item.slug === slugPath);

  if (!doc) return {};

  return Meta.generate({
    title: `${doc.metadata.title} – ${schema.name}`,
    description: doc.metadata.summary,
    baseURL,
    path: `/${doc.slug}`,
    type: "article",
    publishedTime: doc.metadata.updatedAt,
    image: doc.metadata.image ? assetPath(doc.metadata.image) : undefined,
  });
}

export default async function Docs({ params }: { params: Promise<{ slug: string[] }> }) {
  const routeParams = await params;
  const slugPath = routeParams.slug.join("/");
  const doc = getPages().find((item) => item.slug === slugPath);

  if (!doc) notFound();

  const { prevPage, nextPage } = getAdjacentPages(slugPath, "section");
  const sectionTitle = routeParams.slug.length === 1
    ? "Docs"
    : routeParams.slug[0]?.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

  return (
    <>
      <Row fillWidth horizontal="center">
        <Column as="main" maxWidth={44} gap="l" paddingBottom="xl">
          <Schema
            as="techArticle"
            title={`${doc.metadata.title} – ${schema.name}`}
            description={doc.metadata.summary}
            baseURL={baseURL}
            path={`/${doc.slug}`}
            datePublished={doc.metadata.updatedAt}
            dateModified={doc.metadata.updatedAt}
            image={doc.metadata.image ? assetPath(doc.metadata.image) : undefined}
            author={{ name: schema.name }}
          />

          <Column fillWidth gap="8" vertical="center" paddingTop="40">
            <Text variant="label-default-l" onBackground="neutral-medium">{sectionTitle}</Text>
            <Heading variant="display-strong-s">{doc.metadata.title}</Heading>
            <Text variant="body-default-s" onBackground="neutral-weak">Last update: {formatDate(doc.metadata.updatedAt)}</Text>
            {doc.metadata.github && (
              <Button
                className="mt-20"
                href={`https://github.com/once-ui-system/core/blob/main/packages/core/src/${doc.metadata.github}`}
                size="s"
                variant="secondary"
                prefixIcon="github"
                weight="default"
                data-border="rounded"
              >
                View on GitHub
              </Button>
            )}
          </Column>

          {doc.metadata.image && (
            <Media
              border="neutral-alpha-medium"
              enlarge
              src={assetPath(doc.metadata.image)}
              alt={`Thumbnail of ${doc.metadata.title}`}
              aspectRatio="16 / 9"
              radius="m"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          )}

          <Column as="article" fillWidth>
            <CustomMDX source={doc.content} />
          </Column>

          <Row gap="16" fillWidth horizontal="between" s={{ direction: "column" }}>
            {prevPage ? (
              <Row fillWidth>
                <Row maxWidth={20}>
                  <Card fillWidth border="neutral-alpha-medium" vertical="center" gap="4" href={pagePath(prevPage.slug)} radius="l" paddingX="16">
                    <Icon name="chevronLeft" size="s" onBackground="neutral-weak" />
                    <Column gap="4" vertical="center" paddingX="16" paddingY="12">
                      <Text variant="label-default-s" onBackground="neutral-weak">
                        {prevPage.slug.includes("/") ? prevPage.slug.split("/")[0].split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ") : "page"}
                      </Text>
                      <Text onBackground="neutral-strong" variant="heading-strong-m" wrap="balance">{prevPage.metadata.title}</Text>
                    </Column>
                  </Card>
                </Row>
              </Row>
            ) : <Row />}

            {nextPage ? (
              <Row fillWidth horizontal="end">
                <Row maxWidth={20}>
                  <Card fillWidth border="neutral-alpha-medium" horizontal="end" vertical="center" gap="4" href={pagePath(nextPage.slug)} radius="l" paddingX="16">
                    <Column horizontal="end" gap="4" vertical="center" paddingX="16" paddingY="12">
                      <Text variant="label-default-s" onBackground="neutral-weak">
                        {nextPage.slug.includes("/") ? nextPage.slug.split("/")[0].split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ") : "page"}
                      </Text>
                      <Text onBackground="neutral-strong" variant="heading-strong-m" wrap="balance">{nextPage.metadata.title}</Text>
                    </Column>
                    <Icon name="chevronRight" size="s" onBackground="neutral-weak" />
                  </Card>
                </Row>
              </Row>
            ) : <Row />}
          </Row>
        </Column>
      </Row>

      <Column gap="16" maxWidth={17} s={{ hide: true }} fillHeight paddingLeft="24" borderLeft="neutral-alpha-medium">
        <HeadingNav position="sticky" top="80" fitHeight />
      </Column>
    </>
  );
}
