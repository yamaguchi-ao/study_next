/**
 * @type {import('next').NextConfig}
 */

const isProduction = process.env.NODE_ENV === "production";

const nextConfig = {

  async headers() {
    const allow_origin = process.env.ALLOW_ORIGIN;
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: allow_origin },
          { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ];
  },
  outputFileTracingRoot: __dirname,
  images: {
    dangerouslyAllowLocalIP: isProduction ? false : true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cpdlywcfampasjpqoopb.supabase.co",
        port: "",
        pathname: "/**"
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '54321',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '5MB'
    }
  }
}

module.exports = nextConfig