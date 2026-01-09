
const fs = require('fs');

// Read version.txt
const versionContent = fs.readFileSync('version.txt', 'utf8');
const lines = versionContent.split('\n');
const version = lines[0].split('=')[1];
const hostVersion = lines[1].split('=')[1];

// Read template
const template = fs.readFileSync('CSXS/manifest.template.xml', 'utf8');

// Replace placeholders
const manifest = template
  .replace(/{{VERSION}}/g, version)
  .replace(/{{HOST_VERSION}}/g, hostVersion);

// Write final manifest
fs.writeFileSync('CSXS/manifest.xml', manifest);
console.log(`Generated manifest with version ${version}`);