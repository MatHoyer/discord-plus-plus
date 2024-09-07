/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [{ protocol: 'https', hostname: '**' }],
	},
	async headers() {
		return [
			{
				source: "/uploads/:path",
				headers: [
					{
						key: "Cache-Control",
						value: "no-store"
					}
				]
			}
		]
	}
};

export default nextConfig;
