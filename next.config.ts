import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Lets the dev server serve JS/CSS/images when opened from another device
  // on the LAN (e.g. testing on a phone at http://10.150.6.10:3000) instead
  // of blocking those requests as cross-origin.
  allowedDevOrigins: ["10.150.6.10"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "loremflickr.com",
      },
      {
        protocol: "https",
        hostname: "*.staticflickr.com",
      },
    ],
  },
};

export default nextConfig;
