@{%
const myLexer = require("./lexer");
%}

@lexer myLexer

statements
  -> statement
  {%
      (data) => {
        return [data[0]];
      }    
  %}
  | statements %NL statement
  {%
      (data) => {
        return [...data[0], data[2]];
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
  | %identifier _ "=" _ expr %NL
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
  -> %identifier _ "(" _ (arg_list _):?  ")"
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
  | arg_list __ expr
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

# Optional Whitespace
_ -> %WS:*

# Mandatory Whitespace
__ -> %WS:+