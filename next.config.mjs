/** @type {import('next').NextConfig} */
import withMDX from '@next/mdx'

const withMDXConfig = withMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

const nextConfig = {
  sassOptions: {
    compiler: "modern",
    silenceDeprecations: ["legacy-js-api"],
  },
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  transpilePackages: ["next-mdx-remote"],
  output: 'export',
  experimental: {
    serverMinification: true,
    serverActions: {
      bodySizeLimit: '2mb',
    },
    optimizePackageImports: ['react-icons'],
  },
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    localPatterns: [
      {
        pathname: '/**',
      },
      {
        pathname: '/api/og/proxy',
        search: '?url=*',
      },
    ],
  },
  webpack: (config, { dev }) => {
    if (!dev) {
      config.devtool = false;
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
      };
      config.cache = false;
    }
    return config;
  },
};

export default withMDXConfig(nextConfig);
