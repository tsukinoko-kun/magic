const fs = require('fs');
const path = require('path');

const dirs = {
  src: './src/index.ts',
  docs: './docs',
  dist: '../magic.wiki/',
  url: 'https://github.com/Frank-Mayer/magic/wiki',
};

const renameMap = new Map([
  ['modules', 'home'],
  ['readme', 'home'],
]);
const renameRegex = new RegExp(
  Array.from(renameMap.keys())
    .map((str) => '(?<=\\W|^)(' + str + ')(?=\\W|$)')
    .join('|'),
  'gi'
);
const ignore = new Set(['readme']);

const typedocCmd = `npx typedoc ${dirs.src}`;
console.log(typedocCmd);
require('child_process').execSync(typedocCmd, { stdio: 'inherit' });

for (const f of fs.readdirSync(dirs.dist)) {
  if (f === '.git') {
    continue;
  }

  fs.rmSync(path.join(dirs.dist, f), {
    force: true,
    recursive: true,
    maxRetries: 4,
    retryDelay: 1000,
  });
}

const dirsToTrim = new Set([dirs.docs]);
const dirsToCopy = new Set([dirs.docs]);
{
  const sourceDocsDirs = [dirs.docs];
  while (sourceDocsDirs.length !== 0) {
    const sourceDocsDir = sourceDocsDirs.pop();
    for (const f of fs.readdirSync(sourceDocsDir)) {
      const fullPath = path.join(sourceDocsDir, f);
      if (fs.statSync(fullPath).isDirectory()) {
        sourceDocsDirs.push(fullPath);
        dirsToTrim.add(f);
        dirsToCopy.add(fullPath);
      }
    }
  }
}

const trimDirsRegex = new RegExp(
  Array.from(dirsToTrim)
    .map((str) => '(?<=\\W|^)(' + str + ')(?=\\W|$)')
    .join('|'),
  'gi'
);

for (const sourceDocsDir of dirsToCopy) {
  for (const f of fs.readdirSync(sourceDocsDir)) {
    const fullPath = path.join(sourceDocsDir, f);
    const stat = fs.statSync(fullPath);
    if (stat.isFile()) {
      const extName = path.extname(f);
      if (extName !== '.md') {
        continue;
      }

      const baseName = path.basename(f, extName);

      if (ignore.has(baseName.toLowerCase())) {
        continue;
      }

      const md = fs.readFileSync(fullPath).toString();

      fs.writeFileSync(
        path.join(
          dirs.dist,
          renameMap.has(baseName) ? renameMap.get(baseName) + extName : f
        ),
        md
          .replace(/(?<=[\w\d]+)\.md(?=[\)#])/g, '')
          .replace(
            /(?<=\]\()[\.\/]+[\.\/\S]+(?=\))/g,
            (str) => './' + str.split('/').pop()
          )
          .replace(trimDirsRegex, '')
          .replace(renameRegex, (v) => renameMap.get(v) ?? v)
          .replace(/\]\(\//g, '](' + dirs.url + '/')
      );
    }
  }
}

const package = JSON.parse(fs.readFileSync('package.json').toString());

const now = new Date();
const utc = now.toUTCString();

fs.writeFileSync(
  path.join(dirs.dist, '_Footer.md'),
  `This documentation was automatically generated on ${utc} for Version \`${package.version}\`\n`
);
