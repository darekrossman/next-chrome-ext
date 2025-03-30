/** @type {import('next').NextConfig} */
const nextConfig = {
	// reactStrictMode: true,
	// output: "export", // Use static export for Chrome extension
	// distDir: "chrome/next", // Output to chrome directory
	// images: {
	// 	unoptimized: true, // Required for static export
	// },
	// // Handle base path for Chrome extension context
	// basePath: process.env.NODE_ENV === "production" ? "" : "",
	// assetPrefix: process.env.NODE_ENV === "production" ? "" : "",
};

module.exports = nextConfig;
