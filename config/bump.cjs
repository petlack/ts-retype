const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const packageJson = require('../package.json');
const readline = require('readline');

function parse(version) {
  const [main, rcFull] = version.split('-');
  const [major, minor, patch] = main.split('.').map(x => +x);
  let rc = null;
  if (rcFull) {
    rc = +rcFull.split('.')[1];
  }
  return { major, minor, patch, rc };
}

function format({ major, minor, patch, rc }) {
  return `${major}.${minor}.${patch}${rc ? `-rc.${rc}` : ''}`;
}

function bump(version, levelExpr) {
  const { major, minor, patch, rc } = parse(version);
  
  const level = levelExpr[0] === '-' || levelExpr[0] === '+' ? levelExpr.slice(1) : levelExpr;
  const inc = levelExpr[0] === '-' ? -1 : 1;
  
  let newVersion = null;
  switch(level) {
  case 'rc':
    newVersion = { major, minor, patch, rc: (rc || 0) + inc };
    break;
  case 'patch':
    newVersion = { major, minor, patch: patch + inc, rc: null };
    break;
  case 'minor':
    newVersion = { major, minor: minor + inc, patch: 0, rc: null };
    break;
  case 'major':
    newVersion = { major: major + inc, minor: 0, patch: 0, rc: null };
    break;
  case 'release':
    newVersion = { major, minor, patch, rc: null };
    break;
  default:
    newVersion = version;
  }

  return format(newVersion);
}

function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => rl.question(query, ans => {
    rl.close();
    resolve(ans);
  }));
}

async function userConfirm(query) {
  const answer = await askQuestion(`${query}  `);

  if (answer !== 'Y'){
    throw new Error('abort');
  }
}

function execAsync(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject(error.message);
        return;
      }
      if (stderr) {
        reject(stderr);
        return;
      }
      resolve(stdout);
    });
  });
}

async function checkGit() {
  const res = await execAsync('git diff-index HEAD');
  const lines = res.split('\n').map(line => line.trim()).filter(x => x.length);
  return lines;
}

async function run() {
  const modified = await checkGit();
  if (modified.length > 0) {
    console.error('There are currently unstaged changes.');
    console.error(modified.join('\n'));
    return; 
  }

  const distRoot = path.join(__dirname, '..');

  const level = process.argv[2] || 'info';
  const version = packageJson.version;

  if (level === 'info') {
    console.log(`current version v${version}`);
    return;
  }

  const oldVersion = version;
  const newVersion = bump(version, level);

  console.log(`${oldVersion} - [${level}] -> ${newVersion} `);

  await userConfirm(`bump to ${newVersion} ? Y/n`);

  packageJson.version = newVersion;

  const distPackageJson = JSON.stringify(packageJson, null, 2) + '\n';

  console.log(`writing ${distRoot}/package.json`);
  fs.writeFileSync(`${distRoot}/package.json`, distPackageJson);

  await userConfirm('run npm i ?');

  await execAsync('npm i');

  const commitMsg = `chore: bump v${oldVersion} -> v${newVersion}`;
  await userConfirm(`run git commit -m "${commitMsg}" ?`);

  await execAsync('git add package.json package-lock.json');
  await execAsync(`git commit -m "${commitMsg}"`);

  await userConfirm('run git tag ?');
  await execAsync(`git tag -a v${newVersion} -m "v${newVersion}"`);
}

run().then(() => process.exit(1)).catch(err => console.log(err));