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
  if (node.type === "var_assign") {
    const varName = node.var_name.value;
    const jsExpr = generateJsForStatementOrExpression(node.value);
    const js = `let ${varName} = ${jsExpr};`;
    return js;
  } else if (node.type === "function_call") {
    const funName = node.func_name.value;
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
    let argList = node.parameters.map((arg) => {
      return generateJsForStatementOrExpression(arg);
    }).join(", ");
    let lambda_body;
    // () => 1
    if (node.body[0].type === 'number'){
      lambda_body = node.body[0].value;    
    } else if (node.body[0].type === "function_call") {
      // () => { func(func(number number) number); }
      lambda_body = generateJsForStatementOrExpression(node.body[0]);
    } else {
      // () => { func(x, y); }
      lambda_body = generateJsForStatementOrExpression(node.body[0][0]);
    }
    console.log(node.body[0].value);
    console.log(node.body[0].type);
    let obj = JSON.stringify(node.body[0]);
    console.log(obj);
    const lambda = `(${argList}) => {return ${lambda_body}}`;
    return lambda;
  } else {
    throw new Error(`Unhandled AST node type ${node.type}`);
  }
}

main().catch(err => console.error(err.stack));
