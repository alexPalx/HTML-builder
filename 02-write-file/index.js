const readline = require('readline');
const path = require('path');
const fs = require('fs');
const { stdin: input, stdout: output } = process;

const rl = readline.createInterface({ input, output });

const fileName = 'text.txt';
const filePath = path.join(__dirname, fileName);

fs.writeFile(filePath, '', (err) => {
  if (err) return console.log(err);
  console.log(`Hello. Please enter your own text, which will be written to the file "${fileName}".
To exit, enter "exit" or press the key combination Ctrl + C (may not work in VS Code, but works in Git Bash).`);
});

rl.on('line', (input) => {
  if (input === 'exit') process.exit();
  fs.writeFile(filePath, input + '\n', { flag: 'a' }, (err) => {
    if (err) return console.log(err);
  });
});

process.on('exit', () => console.log('Bye!'));
process.on('SIGINT', () => console.log('Bye!'));
