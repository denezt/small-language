const fs = require('mz/fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);  

async function main(){
  const filename = process.argv[2];
  if (!filename){
    console.log("Please provide a *.small file.");
    return;
  }
  const astFilename = filename.replace(".small",".ast");
  const jsFilename = filename.replace(".small",".js");
  await myExec(`node parse.js ${filename}`);

  if (fs.existsSync(astFilename)) {
    // path exists
    console.log("exists:", astFilename);
    await myExec(`node generate.js ${astFilename}`);
    try {
      await myExec(`node ${jsFilename}`);
    } catch (e) {
      console.log(`Error: ${e.message}`);
    }
  } else {
    console.log("DOES NOT exist:", astFilename);
  }  
}

async function myExec(command){
  const output = await exec(command);
  if (output.stdout) {
    process.stdout.write(output.stdout);
  }
  if (output.stderr) {
    process.stdout.write(output.stderr);    
  }
}

// Main execution
main().catch(err => console.log(err.stack));

