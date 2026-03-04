const fs = require('fs');
const path = require('path');

const root = process.cwd();

function shouldProcessAgentFile(fullPath) {
	const relativePath = path.relative(root, fullPath);
	if (!relativePath || relativePath.startsWith('..')) return false;

	const parts = relativePath.split(path.sep);
	const githubIndex = parts.indexOf('.github');

	if (githubIndex <= 0) return false;
	if (!parts.includes('agents')) return false;

	return parts[parts.length - 1].endsWith('.md');
}

function updateAgent(filePath) {
	let content = fs.readFileSync(filePath, 'utf8');
	console.log('Processing agent:', filePath);
	console.log('Content present?:', content.includes('user-invokable'));
	if (!content.includes('user-invokable')) return;

	const updated = content.replace(
		/user-invokable:\s*(true|false)/g,
		'user-invokable: false',
	);

	fs.writeFileSync(filePath, updated);
	console.log('Disabled agent:', filePath);
}

function scan(dir) {
	const entries = fs.readdirSync(dir, { withFileTypes: true });

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);

		if (entry.isDirectory()) {
			if (dir === root && entry.name === '.github') {
				continue;
			}

			scan(fullPath);
		}

		if (entry.isFile() && shouldProcessAgentFile(fullPath)) {
			updateAgent(fullPath);
		}
	}
}

scan(root);

console.log('All agents disabled.');
