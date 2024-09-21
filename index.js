#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const runCommand = (command) => {
  try {
    execSync(`${command}`, { stdio: 'inherit' });
  } catch (e) {
    console.error(`Failed to execute ${command}`, e);
    return false;
  }
  return true;
};

const projectName = process.argv[2];

if (!projectName) {
  console.log("Please specify the project name:");
  console.log("npx react-quickstart-cli my-app");
  process.exit(1);
}

const currentPath = process.cwd();
const projectPath = path.join(currentPath, projectName);
const git_repo = "https://github.com/vitejs/vite.git";

try {
  fs.mkdirSync(projectPath);
} catch (err) {
  if (err.code === 'EEXIST') {
    console.log(`The file ${projectName} already exist in the current directory, please give it another name.`);
  } else {
    console.log(err);
  }
  process.exit(1);
}

console.log(`Creating a new React app in ${projectPath}.`);

const createReactApp = `npx create-vite@latest ${projectName} -- --template react`;
const installDeps = `cd ${projectName} && npm install`;

console.log("Creating React app with Vite...");
const createdViteApp = runCommand(createReactApp);
if (!createdViteApp) process.exit(1);

console.log("Installing dependencies...");
const installedDeps = runCommand(installDeps);
if (!installedDeps) process.exit(1);

console.log("Installing Tailwind CSS...");
runCommand(`cd ${projectName} && npm install -D tailwindcss@latest postcss@latest autoprefixer@latest`);
runCommand(`cd ${projectName} && npx tailwindcss init -p`);

console.log("Installing additional React libraries...");
runCommand(`cd ${projectName} && npm install axios react-router-dom @reduxjs/toolkit react-redux @mui/material @emotion/react @emotion/styled`);

console.log("Updating configuration files...");

// Update tailwind.config.js
const tailwindConfig = `
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`;

fs.writeFileSync(
  path.join(projectPath, 'tailwind.config.js'),
  tailwindConfig
);

// Update src/index.css
const indexCSS = `
@tailwind base;
@tailwind components;
@tailwind utilities;
`;

fs.writeFileSync(
  path.join(projectPath, 'src', 'index.css'),
  indexCSS
);

console.log("All done! Your new React project is ready.");
console.log(`Created ${projectName} at ${projectPath}`);
console.log("Inside that directory, you can run several commands:");
console.log();
console.log("  npm run dev");
console.log("    Starts the development server.");
console.log();
console.log("  npm run build");
console.log("    Bundles the app into static files for production.");
console.log();
console.log("We suggest that you begin by typing:");
console.log();
console.log(`  cd ${projectName}`);
console.log("  npm run dev");
console.log();
console.log("Happy hacking!");