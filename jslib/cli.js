const { exec } = require('child_process');

async function runCli(command) {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        // node couldn't execute the command
        reject(err);
      }
      if(stdout)
        console.log(`stdout: ${stdout}`);
      if(stderr)
        console.log(`stderr: ${stderr}`);
      resolve(stdout);
    });
  });
}

exports.runCli = runCli;