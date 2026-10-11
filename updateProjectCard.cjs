const fs = require('fs');
const path = require('path');

const filePath = path.join('src', 'components', 'ui', 'ProjectCard.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Find the line index of the article opening tag
const lines = content.split('\n');
const articleLineIndex = lines.findIndex(line => line.includes('<article className="project-entry"'));
if (articleLineIndex === -1) {
  console.error('Article line not found');
  process.exit(1);
}

// Build the image part with proper escaping for the template literal
const imagePart = '        {project.image && (\n          <div className="project-image">\n            <img src={`/project-screenshots/${project.image}`} alt={`${project.title} screenshot`} className="project-screenshot" />\n          </div>\n        )}';
const indent = lines[articleLineIndex].match(/^\s*/)[0];
lines.splice(articleLineIndex + 1, 0, indent + imagePart);

// Join back
content = lines.join('\n');
fs.writeFileSync(filePath, content, 'utf8');
console.log('File updated successfully');