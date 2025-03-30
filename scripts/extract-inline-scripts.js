const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

// Directory to scan for HTML files
const outDir = path.join(__dirname, "../out");

// Function to extract inline scripts from HTML files
const extractInlineScripts = (htmlFilePath) => {
	console.log(`Processing ${htmlFilePath}`);
	let htmlContent = fs.readFileSync(htmlFilePath, "utf8");

	// Create a directory for extracted scripts if it doesn't exist
	const extractedScriptsDir = path.join(
		path.dirname(htmlFilePath),
		"extracted-scripts",
	);
	if (!fs.existsSync(extractedScriptsDir)) {
		fs.mkdirSync(extractedScriptsDir);
	}

	// Use a DOM parser approach or a more robust regex
	let scriptCount = 0;
	// This finds opening and closing script tags and captures everything between
	const pattern = /<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi;

	htmlContent = htmlContent.replace(pattern, (match, scriptContent) => {
		if (!scriptContent.trim()) return match;

		// Generate a unique filename based on content hash
		const hash = crypto.createHash("md5").update(scriptContent).digest("hex");
		const scriptFileName = `script-${hash}.js`;
		const scriptFilePath = path.join(extractedScriptsDir, scriptFileName);

		// Write script content to file
		fs.writeFileSync(scriptFilePath, scriptContent);

		// Create relative path for the script reference
		const relativePath = path
			.relative(path.dirname(htmlFilePath), scriptFilePath)
			.replace(/\\/g, "/");

		console.log(`  Extracted script ${scriptCount++} to ${scriptFileName}`);

		return `<script src="${relativePath}"></script>`;
	});

	// Write modified HTML back to file
	fs.writeFileSync(htmlFilePath, htmlContent);
};

// Function to recursively scan directories for HTML files
function scanDirectory(dir) {
	const files = fs.readdirSync(dir);

	for (const file of files) {
		const filePath = path.join(dir, file);
		const stat = fs.statSync(filePath);

		if (stat.isDirectory()) {
			scanDirectory(filePath);
		} else if (file.endsWith(".html")) {
			extractInlineScripts(filePath);
		}
	}
}

console.log("Starting extraction of inline scripts...");
scanDirectory(outDir);
console.log("Completed extraction of inline scripts.");
