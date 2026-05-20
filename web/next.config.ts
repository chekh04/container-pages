import type { NextConfig } from "next";

function strapiUploadPatterns(): NonNullable<
  NonNullable<NextConfig["images"]>["remotePatterns"]
> {
  const base: NonNullable<
    NonNullable<NextConfig["images"]>["remotePatterns"]
  > = [
    {
      protocol: "http",
      hostname: "localhost",
      port: "1337",
      pathname: "/uploads/**",
    },
    {
      protocol: "https",
      hostname: "localhost",
      port: "1337",
      pathname: "/uploads/**",
    },
  ];

  const raw = process.env.NEXT_PUBLIC_STRAPI_URL;
  if (!raw) return base;

  try {
    const u = new URL(raw);
    const protocol = u.protocol.replace(":", "") as "http" | "https";
    if (u.hostname) {
      base.push({
        protocol,
        hostname: u.hostname,
        ...(u.port ? { port: u.port } : {}),
        pathname: "/uploads/**",
      });
    }
  } catch {
    /* ignore invalid URL */
  }

  return base;
}

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: strapiUploadPatterns(),
  },
};

export default nextConfig;
