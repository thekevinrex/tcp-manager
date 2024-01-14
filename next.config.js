const withNextIntl = require("next-intl/plugin")();

/** @type {import('next').NextConfig} */
const nextConfig = withNextIntl({
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "ntiaosvuiauxykortlzz.supabase.co",
				port: "",
			},
			{
				protocol: "https",
				hostname: "img.clerk.com",
				port: "",
			},
		],
	},
});

module.exports = nextConfig;
