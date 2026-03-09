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
	const hasUserInvokable = /(^|\n)user-invokable:\s*(true|false)\s*(\n|$)/.test(content);
	console.log('Content present?:', hasUserInvokable);

	const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
	if (!frontmatterMatch) {
		console.log('Skipped (no frontmatter):', filePath);
		return;
	}

	let updated = content;

	if (hasUserInvokable) {
		updated = content.replace(
			/(^|\n)user-invokable:\s*(true|false)\s*(\n|$)/g,
			'$1user-invokable: false$3',
		);
	} else {
		updated = content.replace(
			/^---\n([\s\S]*?)\n---/,
			(_match, body) => `---\n${body}\nuser-invokable: false\n---`,
		);
	}

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
