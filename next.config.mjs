/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: "https", // Cloudinary uses HTTPS protocol
          hostname: "res.cloudinary.com", // Cloudinary hostname
        },
        {
          protocol: "https",
          hostname: "via.placeholder.com",
        },
      ],
    },
  };

export default nextConfig;
