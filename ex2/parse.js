const nearley = require("nearley");
const grammar = require("./small.js");
const fs = require('mz/fs');


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
  console.log(JSON.stringify(parser.results));
}

main().catch(err => console.log(err.stack));
