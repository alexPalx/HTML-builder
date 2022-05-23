const fs = require('fs/promises');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

(async () => {
  try {
    const files = await fs.readdir(folderPath, {withFileTypes: true});
    for (const file of files) {
      if (file.isFile()) {
        const filePath = path.join(folderPath, file.name);
        const fileInfo = await fs.stat(filePath);
        console.log(`${file.name.replace(/\./, ' - ')} - ${(fileInfo.size/1024).toFixed(3)}kb`);
      }
    }
  }
  catch (err) {
    console.error(err);
  }
})();
