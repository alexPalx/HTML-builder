const path = require('path');
const fs = require('fs/promises');

const baseDir = path.join(__dirname, 'files');
const copyDir = path.join(__dirname, 'files-copy');

async function copy(from, to) {
  try {
    const files = await fs.readdir(from, { withFileTypes: true });
    for (const file of files) {
      if (file.isDirectory()) {
        fs.mkdir(path.join(to, file.name), { recursive: true });
        await copy(path.join(from, file.name), path.join(to, file.name));
      }
      else {
        await fs.copyFile(path.join(from, file.name), path.join(to, file.name));
      }
    }
  }
  catch (err) {
    console.error(err);
  }
}

fs.rm(copyDir, { recursive: true, force: true })
  .then(() => fs.mkdir(copyDir, { recursive: true }))
  .then(() => copy(baseDir, copyDir));
