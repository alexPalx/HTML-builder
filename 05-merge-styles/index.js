const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');

const folderPath = path.join(__dirname, 'styles');
const outputPath = path.join(__dirname, 'project-dist', 'bundle.css');

const streams = [];

(async () => {
  try {
    await fsPromises.writeFile(outputPath, '');
    const files = await fsPromises.readdir(folderPath, { withFileTypes: true });
    for await (const file of files) {
      if (file.isFile() && file.name.endsWith('.css')) {
        const filePath = path.join(folderPath, file.name);
        const readStream = fs.createReadStream(filePath, 'utf-8');
        streams.push(readStream);
      }
    }
  }
  catch (err) {
    console.error(err);
  }
})().then(() => {
  const writeStream = fs.createWriteStream(outputPath, 'utf-8');
  streams.forEach((stream) => stream.pipe(writeStream));
});
