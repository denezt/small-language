const nearley = require("nearley");
const grammar = require("./small.js");
const fs = require('mz/fs');
const debug = false;

async function main(){
  const filename = process.argv[2];
  if (!filename) {
    console.error("Please provide a *.small file.");
    return;
  }
  const code = (await fs.readFile(filename)).toString();
  // Create a Parser object from our grammar.
  const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
  // Parse something!
  parser.feed(code);
  // Convert .small to .ast (AST) - Abstract Syntax Tree
  if (parser.results.length > 1){  
    // Loop through the results when we become an ambigous grammar.
    let i = 0;
    while (i < 5) {
      const ast = parser.results[i++];
      const outputFilename = filename.replace(".small", "-" + i + ".ast");
      await fs.writeFile(outputFilename, JSON.stringify(ast, null, " "));
      console.log(`Wrote ${outputFilename}.`);
    }
    console.error("Error: ambigous parameter detected");    
  } else if (parser.results.length == 1) {
    const ast = parser.results[0];
    const outputFilename = filename.replace(".small",".ast");
    await fs.writeFile(outputFilename, JSON.stringify(ast, null, " "));
    console.log(`Wrote ${outputFilename}.`);
  } else {
    // Program is not complete
    console.error("Error: no parse found.");
  }
  
  // parser.results is an array of possible parsings.
  // console.log(parser.results);
  if (debug){
    console.log(JSON.stringify(parser.results));  
  }  
}

main().catch(err => console.log(err.stack));
