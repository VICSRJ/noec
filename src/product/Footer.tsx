import { basePath, layout, social } from "@/resources/once-ui.config";
import {
  Button,
  Column,
  Icon,
  Logo,
  Row,
  SmartLink,
  ThemeSwitcher,
} from "@once-ui-system/core";

const homePath = `${basePath}/`;
const assetPath = (path: string) => `${basePath}${path}`;

export const Footer = () => {
  return (
    <Column gap="40" fillWidth paddingY="xl" paddingX="l" horizontal="center" borderTop="neutral-alpha-medium">
      <Row gap="12" textVariant="label-default-m" maxWidth={layout.footer.width} vertical="center">
        <Logo dark href={homePath} icon={assetPath("/trademarks/icon-dark.svg")} size="m" />
        <Logo light href={homePath} icon={assetPath("/trademarks/icon-light.svg")} size="m" />
        <Button data-border="rounded" size="s" weight="default" variant="tertiary" href="https://once-ui.com/products/magic-docs">
          <Row gap="12" vertical="center">
            Launch your docs with Once UI
            <Icon size="xs" name="arrowUpRight" onBackground="brand-medium" />
          </Row>
        </Button>
      </Row>

      <Row maxWidth={layout.footer.width} horizontal="between" gap="40" wrap paddingX="2">
        <Column gap="12" textVariant="label-default-m">
          <Row paddingX="2" marginBottom="8">Products</Row>
          <Row><SmartLink href="https://once-ui.com/products/once-ui-core">Once UI</SmartLink></Row>
          <Row><SmartLink href="https://once-ui.com/products/magic-portfolio">Magic Portfolio</SmartLink></Row>
          <Row><SmartLink href="https://once-ui.com/products/magic-store">Magic Store</SmartLink></Row>
          <Row><SmartLink href="https://once-ui.com/products/magic-docs">Magic Docs</SmartLink></Row>
          <Row><SmartLink href="https://once-ui.com/products/magic-bio">Magic Bio</SmartLink></Row>
        </Column>

        <Column gap="12" textVariant="label-default-m">
          <Row paddingX="2" marginBottom="8">Resources</Row>
          <Row><SmartLink href="https://once-ui.com/about">About us</SmartLink></Row>
          <Row><SmartLink href="https://once-ui.com/terms-of-use">Terms of Use</SmartLink></Row>
          <Row><SmartLink href="https://once-ui.com/privacy-policy">Privacy Policy</SmartLink></Row>
          <Row><SmartLink href="https://once-ui.com/license-agreement">License Agreement</SmartLink></Row>
        </Column>

        <Column data-border="rounded" gap="12" textVariant="label-default-m">
          <Row paddingX="2" marginBottom="8">Social</Row>
          {social.map((link) => (
            <Button key={link.link} href={link.link} weight="default" prefixIcon={link.icon} label={link.name} size="s" variant="secondary" />
          ))}
        </Column>
      </Row>

      <Row maxWidth={layout.footer.width}>
        <ThemeSwitcher />
      </Row>
    </Column>
  );
};
