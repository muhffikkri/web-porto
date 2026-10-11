const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Read the notes file
const notes = fs.readFileSync('resources/NOTES.md', 'utf8');
// Split by newline and filter out empty lines and the lines that are just 'Kaggle' and 'other'
const repoNames = notes.split('\n')
    .map(line => line.trim())
    .filter(line => line && !['Kaggle', 'other'].includes(line));

// Get the list of all repos for the user muhffikkri
const output = execSync('gh repo list muhffikkri --limit 100 --json name,description,url', { encoding: 'utf8' });
const repos = JSON.parse(output);

const screenshotDir = 'resources/project_screenshot';

const projects = repoNames.map(name => {
    const repo = repos.find(r => r.name === name);
    if (!repo) {
        console.warn(`Repo not found: ${name}`);
        return null;
    }
    const screenshot = fs.existsSync(path.join(screenshotDir, name + '.png')) ? `${name}.png` : undefined;
    return {
        id: name,
        title: name.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
        description: repo.description || '',
        tags: [],
        github: repo.url,
        demo: undefined,
        image: screenshot
    };
}).filter(Boolean);

// Now, we want to write the projects array to src/data/projects.ts
const content = `export type Project = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  github?: string;
  demo?: string;
  image?: string;
};

export const PROJECTS: Project[] = ${JSON.stringify(projects, null, 2)};

`;

fs.writeFileSync('src/data/projects.ts', content, 'utf8');
console.log('Updated src/data/projects.ts');