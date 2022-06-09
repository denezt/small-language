@{%
const myLexer = require("./lexer");
%}

@lexer myLexer

statements
  -> _ml statement (__lb_ statement):* _ml
  {%
      (data) => {
        const repeated = data[2];
        const restStatements = repeated.map(chunks => chunks[2]);
        return [data[1], ...restStatements];
      }    
  %}
  
statement
  -> var_assign   {% id %}
  | function_call {% id %}
  
var_assign
  -> %identifier _ "=" _ expr
  {%
    (data) => {
      return {
        type: "var_assign",
        var_name: data[0],
        value: data[4]
      }
    }
  %}
  | %identifier _ "=" _ expr __ml
  {%
    (data) => {
      return {
        type: "var_assign",
        var_name: data[0],
        value: data[4]
      }
    }
  %}

function_call
  -> %identifier _ "(" _ml (arg_list _ml):?  ")" _ml
  {%
    (data) => {
      return {
        type: "function_call",
        func_name: data[0],
        arguments: data[4] ? data[4][0] : []
      }
    }
  %}

arg_list
  -> expr
  {%
    (data) => {
      return [data[0]];
    }   
  %}
  | arg_list __ml expr
  {%
    (data) => {
      return [...data[0], data[2]];
    }
  %}

expr  
  -> %string        {% id %}
  | %number         {% id %}
  | %identifier     {% id %}
  | function_call   {% id %}
  | lambda          {% id %}

lambda -> "(" _ (param_list _):? ")" _ "=>" _ml lambda_body _ml
  {% 
    (data) => {
      return {
        type: "lambda",
        parameters: data[2] ? data[2][0] : [],
        body: data[7]
      }
    }
  %}

param_list
  -> %identifier (__ %identifier):*
  {%
    (data) => {
      const repeatedItem = data[1];
      const restParams = repeatedItem.map(piece => piece[1]); 
      return [data[0], ...restParams];
    }
  %}

lambda_body
  -> expr
  {% 
    (data) => {
      return [data[0]];
    }
  %}
  | "{" _ %NL statements %NL _ "}"
  {%
    (data) => {
      return [data[3]];
    }
  %}

# Mandatory line-break with optional Whitespace around it
__lb_ -> (_ %NL):+ _

# Option multi-line Whitespace
_ml -> (%WS | %NL):*

# Mandatory multi-line Whitespace
__ml -> (%WS | %NL):+

# Optional Whitespace
_ -> %WS:*

# Mandatory Whitespace
__ -> %WS:+
