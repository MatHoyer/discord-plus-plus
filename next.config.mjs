/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		serverActions: {
			allowedOrigins: ["discord.sebastienvanvreckem.be", "localhost:3000"]
		}
	},
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
