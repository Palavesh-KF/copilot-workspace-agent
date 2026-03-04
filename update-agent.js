const fs = require('fs');
const path = require('path');

const root = process.cwd();

function updateAgent(filePath) {
	let content = fs.readFileSync(filePath, 'utf8');

	if (!content.includes('user_invokable')) return;

	const updated = content.replace(
		/user_invokable:\s*(true|false)/g,
		'user_invokable: false',
	);

	fs.writeFileSync(filePath, updated);
	console.log('Disabled agent:', filePath);
}

function scan(dir) {
	const entries = fs.readdirSync(dir, { withFileTypes: true });

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);

		if (entry.isDirectory()) {
			scan(fullPath);
		}

		if (
			entry.isFile() &&
			entry.name.endsWith('.md') &&
			fullPath.includes('.github') &&
			fullPath.includes('agents')
		) {
			updateAgent(fullPath);
		}
	}
}

scan(root);

console.log('All agents disabled.');
