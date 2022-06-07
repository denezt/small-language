const fs = require('mz/fs');

async function main(){
  const filename = process.argv[2];
  if (!filename) {
    console.log("Please provide a *.ast file.");
    return;
  }
  const astJson = (await fs.readFile(filename)).toString();
  const statements = JSON.parse(astJson);
  const jsCode = generateJsForStatements(statements);
  const outputFilename = filename.replace(".ast",".js");
  await fs.writeFile(outputFilename, jsCode); 
  console.log(`Wrote ${outputFilename}.`);
}

function generateJsForStatements(statements){
  const lines = [];
  for (let statement of statements) {
    const line = generateJsForStatementOrExpression(statement);
    lines.push(line);
  }
  return lines.join("\n");
}

function generateJsForStatementOrExpression(node){
  if (node.type === "var_assign") {
    const varName = node.var_name.value;
    const jsExpr = generateJsForStatementOrExpression(node.value);
    const js = `var ${varName} = ${jsExpr};`;
    return js;
  } else if (node.type === "function_call") {
    const funName = node.func_name.value;
    const argList = node.arguments.map((arg) => {
      return generateJsForStatementOrExpression(arg);
    }).join(", ");
    return `${funName}(${argList})`;
  } else if (node.type === "string") {
    return node.value;
  } else if (node.type === "number") {
    return node.value;
  } else {
    throw new Error(`Unhandled AST node type ${node.type}`);
  }
}

main().catch(err => console.error(err.stack));