#!/usr/bin/env node
const { spawn } = require('child_process');

const ftp = spawn('bash');
//const ftp = spawn('ftp', ['172.17.0.34']);

ftp.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ftp.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`);
});

ftp.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});

ftp.stdin.write(`ftp 172.17.0.34\n`);

ftp.stdin.write(`mapa\n`);
ftp.stdin.write(`dearea\n`);
ftp.stdin.write(`put ./backup1.zip ./backup${new Date().getTime()}.zip\n`);
ftp.stdin.write(`ls`);
ftp.stdin.end();
