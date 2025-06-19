/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['cdn.zeptonow.com', '5.imimg.com', 'm.media-amazon.com'], // NO https:// here
    },
    reactStrictMode: true,
    swcMinify: true,
  };
  
  export default nextConfig;
  

