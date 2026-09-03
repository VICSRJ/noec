import { MDXRemote, MDXRemoteProps } from "next-mdx-remote/rsc";
import React, { ReactNode } from "react";
import {
  Heading,
  Row,
  Column,
  Table,
  Media,
  SmartLink,
  Text,
  InlineCode,
  Accordion,
  AccordionGroup,
  CodeBlock,
  TextProps,
  HeadingLink,
  MediaProps,
  Card,
  Grid,
  Feedback,
  Button,
  Icon,
  List,
  ListItem,
  Line,
} from "@once-ui-system/core";
import { basePath } from "@/resources";
import { PageList } from "./PageList";

const onceUIComponents = {
  Table,
  Heading,
  Text,
  Row,
  Media,
  SmartLink,
  InlineCode,
  Accordion,
  AccordionGroup,
  CodeBlock,
  Grid,
  HeadingLink,
  Feedback,
  Button,
  Icon,
  Card,
  Column,
};

type CustomLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
};

const assetPath = (src: string) => {
  if (!src || /^https?:\/\//i.test(src) || src.startsWith("data:")) return src;
  return src.startsWith("/") ? `${basePath}${src}` : src;
};

const internalPath = (href: string) => {
  if (!href || /^(?:https?:|mailto:|tel:|#)/i.test(href)) return href;
  return href.startsWith("/") ? `${basePath}${href}` : href;
};

function CustomLink({ href, children, ...props }: CustomLinkProps) {
  return <SmartLink href={internalPath(href)} {...props}>{children}</SmartLink>;
}

function createImage({ alt, src, ...props }: MediaProps & { src: string }) {
  if (!src) {
    console.error("Media requires a valid 'src' property.");
    return null;
  }

  return (
    <Media
      marginTop="8"
      marginBottom="16"
      enlarge
      radius="m"
      aspectRatio="16 / 9"
      sizes="(max-width: 960px) 100vw, 960px"
      alt={alt}
      src={assetPath(src)}
      {...props}
    />
  );
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/&/g, "-and-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

function createList({ children }: { children: ReactNode }) {
  return <List>{children}</List>;
}

function createListItem({ children }: { children: ReactNode }) {
  return <ListItem marginTop="4" marginBottom="8">{children}</ListItem>;
}

function createHeading(as: "h1" | "h2" | "h3" | "h4" | "h5" | "h6") {
  const CustomHeading = ({ children, ...props }: Omit<React.ComponentProps<typeof HeadingLink>, "as" | "id">) => {
    const text = typeof children === "string" ? children : String(children ?? "");
    return (
      <HeadingLink marginTop="24" marginBottom="12" as={as} id={slugify(text)} {...props}>
        {children}
      </HeadingLink>
    );
  };

  CustomHeading.displayName = as;
  return CustomHeading;
}

function createParagraph({ children }: TextProps) {
  return (
    <Text style={{ lineHeight: "175%" }} variant="body-default-m" onBackground="neutral-medium" marginTop="8" marginBottom="12">
      {children}
    </Text>
  );
}

function createInlineCode({ children }: { children: ReactNode }) {
  return <InlineCode>{children}</InlineCode>;
}

function createCodeBlock(props: React.ComponentProps<"pre">) {
  const child = props.children as React.ReactElement<{ className?: string; children?: ReactNode }> | undefined;
  const className = child?.props?.className;

  if (child && typeof child === "object" && className?.startsWith("language-")) {
    const language = className.slice("language-".length) || "text";
    const label = language.charAt(0).toUpperCase() + language.slice(1);
    return (
      <CodeBlock
        marginTop="8"
        marginBottom="16"
        codes={[{ code: String(child.props.children ?? ""), language, label }]}
        copyButton
      />
    );
  }

  return <pre {...props} />;
}

function createHR() {
  return <Line />;
}

const components = {
  p: createParagraph as any,
  h1: createHeading("h1") as any,
  h2: createHeading("h2") as any,
  h3: createHeading("h3") as any,
  h4: createHeading("h4") as any,
  h5: createHeading("h5") as any,
  h6: createHeading("h6") as any,
  img: createImage as any,
  a: CustomLink as any,
  code: createInlineCode as any,
  pre: createCodeBlock as any,
  ul: createList as any,
  ol: createList as any,
  li: createListItem as any,
  hr: createHR as any,
  PageList,
  ...onceUIComponents,
};

type CustomMDXProps = MDXRemoteProps & {
  components?: typeof components;
};

export function CustomMDX(props: CustomMDXProps) {
  return (
    <MDXRemote
      {...props}
      options={{ blockJS: false }}
      components={{ ...components, ...(props.components || {}) }}
    />
  );
}
