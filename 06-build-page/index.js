const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');

const assetsDir = path.join(__dirname, 'assets');
const projectDir = path.join(__dirname, 'project-dist');
const stylesFolderPath = path.join(__dirname, 'styles');
const componentsPath = path.join(__dirname, 'components');
const cssBundlePath = path.join(__dirname, 'project-dist', 'style.css');
const mainFilePath = path.join(projectDir, 'index.html');
const streams = [];

async function copy(from, to) {
  try {
    const files = await fsPromises.readdir(from, { withFileTypes: true });
    for (const file of files) {
      if (file.isDirectory()) {
        fsPromises.mkdir(path.join(to, file.name), { recursive: true });
        await copy(path.join(from, file.name), path.join(to, file.name));
      }
      else {
        await fsPromises.copyFile(path.join(from, file.name), path.join(to, file.name));
      }
    }
  }
  catch (err) {
    console.error(err);
  }
}

async function createBundle() {
  try {
    await fsPromises.writeFile(cssBundlePath, '');
    const files = await fsPromises.readdir(stylesFolderPath, { withFileTypes: true });
    for await (const file of files) {
      if (file.isFile() && file.name.endsWith('.css')) {
        const filePath = path.join(stylesFolderPath, file.name);
        const readStream = fs.createReadStream(filePath, 'utf-8');
        streams.push(readStream);
      }
    }
  }
  catch (err) {
    console.error(err);
  }
}

async function replaceTemplateTags() {
  const components = [];
  const files = await fsPromises.readdir(componentsPath, { withFileTypes: true });
  for (const file of files) {
    if (file.isFile() && file.name.endsWith('.html')) {
      components.push(path.join(componentsPath, file.name));
    }
  }
  let mainFileContent = await fsPromises.readFile(mainFilePath);
  for (const component of components) {
    const componentContent = await fsPromises.readFile(component);
    const componentName = path.basename(component).replace(/\..+/, '');
    mainFileContent = mainFileContent.toString().replace(new RegExp(`{{${componentName}}}`, 'g'), componentContent);
    await fsPromises.writeFile(mainFilePath, mainFileContent);
  }
}

fsPromises.rm(projectDir, { recursive: true, force: true })
  .then(() => fsPromises.mkdir(projectDir, { recursive: true }))
  .then(() => copy(assetsDir, path.join(projectDir, 'assets')))
  .then(() => fsPromises.copyFile(path.join(__dirname, 'template.html'), path.join(projectDir, 'index.html')))
  .then(() => createBundle())
  .then(() => {
    const writeStream = fs.createWriteStream(cssBundlePath, 'utf-8');
    streams.forEach((stream) => stream.pipe(writeStream));
  })
  .then(() => replaceTemplateTags());
