/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "ntiaosvuiauxykortlzz.supabase.co",
				port: "",
				// pathname: '/account123/**',
			},
		],
	},
};

module.exports = nextConfig;
