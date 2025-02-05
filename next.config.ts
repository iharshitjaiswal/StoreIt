import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental:{
    serverActions:{
      bodySizeLimit:"1000MB"
    }

  },    reactStrictMode: true,

  images:{
    domains: ["img.freepik.com"], // Add the external hostname here

    remotePatterns:[{
      protocol:'https',
      hostname:'cdn.pixabay.com'
    },{
      protocol:'https',
      hostname:'cloud.appwrite.io'
    }]
  }
};

export default nextConfig;
