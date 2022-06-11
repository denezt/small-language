const fs = require('mz/fs');

async function main(){
  const filename = process.argv[2];
  if (!filename) {
    console.log("Please provide a *.ast file.");
    return;
  }
  const astJson = (await fs.readFile(filename)).toString();
  const runtimeJs = (await fs.readFile("runtime.js")).toString();
  const statements = JSON.parse(astJson);
  const jsCode = generateJsForStatements(statements) + "\n" + runtimeJs;
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
  // console.log(node);
  if (node.type === "var_assign") {
    const varName = node.var_name.value;
    const jsExpr = generateJsForStatementOrExpression(node.value);
    const js = `let ${varName} = ${jsExpr};`;
    return js;
  } else if (node.type === "function_call") {
    let funName = node.func_name.value;
    if (funName === "if"){
      funName = "$if";
    }
    let argList = node.arguments.map((arg) => {
      return generateJsForStatementOrExpression(arg);
    }).join(", ");
    return `${funName}(${argList})`;
  } else if (node.type === "string") {
    return node.value;
  } else if (node.type === "number") {
    return node.value;
  } else if (node.type === "identifier") {
    return node.value;
  } else if (node.type === "lambda") {
    const paramList = node.parameters.map(param => param.value).join(", ");
    console.log(node);
    const jsBody = node.body.map((arg) => {
      return generateJsForStatementOrExpression(arg);
    }).join(", ");
    const lambda_body = `return ${jsBody};`;
    return `function (${paramList}) {\n${indent(lambda_body)}\n}`;
  } else {
    throw new Error(`Unhandled AST node type ${node.type}`);
  }
}

function indent(string){
  return string.split("\n").map(line => "\t" + line).join("\n");
}

main().catch(err => console.error(err.stack));
