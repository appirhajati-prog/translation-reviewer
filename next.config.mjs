/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";
const nextConfig = {
  output: "export",
  basePath: isProd ? "/translation-reviewer" : "",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;