/** @type {import('next').NextConfig} */
const nextConfig = {
	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/,
			use: ["@svgr/webpack"]
		});

		return config;
	},
	images: {
		domains: ["blockchain-rdata.s3.amazonaws.com", "static.alchemyapi.io"]
	},
	// experimental: {
	// 	// appDir: true
	// },
	swcMinify: true,
	reactStrictMode: true
};

module.exports = nextConfig;
