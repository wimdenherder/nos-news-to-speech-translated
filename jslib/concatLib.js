
const spawn = require('child_process').spawn;



// checkIt();

// async function checkIt() {
//   const data = [
//     [ 'temp/0.0-ORIGINAL.mp3', 'temp/0.1-TRANSLATED.mp3' ],
//     [ 'temp/1.0-ORIGINAL.mp3', 'temp/1.1-TRANSLATED.mp3' ],
//     [ 'temp/2.0-ORIGINAL.mp3', 'temp/2.1-TRANSLATED.mp3' ],
//     [ 'temp/3.0-ORIGINAL.mp3', 'temp/3.1-TRANSLATED.mp3' ]
//   ].flat();
//   concatWithPause(data,'test.mp3');
// }

async function concatWithPause(pathsToMp3s, outputName) {
  // var args = ["-i",outputVideoNames[0],"outputTest.mp3"];
  var message = "finished concatenating mp3s";
  var callback = () => {console.log("finished")};
  var lengthSilence = 2;

  var inputFiles = [];
  var orderFilenames = ""; // [0:a] [silence] [1:a]
  var silenceparts = "";
  for(var i=0;i<pathsToMp3s.length;i++) {
    inputFiles = inputFiles.concat(["-i",pathsToMp3s[i]]);
    orderFilenames += "[" + i + ":a] [silence] ";
    silenceparts += 'aevalsrc=exprs=0:d=' + lengthSilence + '[silence], ';
  }
  var args = ["-y"].concat(inputFiles).concat(["-filter_complex", silenceparts + orderFilenames + ' concat=n=' + (2*pathsToMp3s.length) + ':v=0:a=1[outa]', "-map", "[outa]", outputName]);
  // console.log(JSON.stringify(args, null, 2));
  console.log("ffmpeg " + args.join(" "));
  await ffmpegCli(args, message, callback);
}

async function ffmpegCli(args, message, callback) {
  console.log("ffmpeg " + args.map((argum) => argum && argum.toString().indexOf(" ") > -1 ? '"' + argum + '"' : argum).join(" "));
  let ffmpeg = spawn('ffmpeg',args);

  return new Promise((resolve, reject) => {
      ffmpeg.on('exit', (statusCode) => {
          if (statusCode === 0) {
              console.log("exit: " + message);
              resolve(message);
          }
      })

      ffmpeg
          .stderr
          .on('data', (d) => {
              console.log(new String(d));
          })
          .on('error', function(err) {
              console.log('Oh noez, teh errurz: ' + err);
              reject(err);
          });
  });
}

module.exports.concatWithPause = concatWithPause;
module.exports.ffmpegCli = ffmpegCli;