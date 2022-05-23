const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');
let output = '';

const readStream = fs.createReadStream(filePath, 'utf-8');

readStream.on('data', (chunk) => output += chunk);
readStream.on('close', () => console.log(output));
