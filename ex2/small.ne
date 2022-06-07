@{%
const myLexer = require("./lexer");
%}

@lexer myLexer

statement
  -> var_assign

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

expr  
  -> %string  {% id %}
  | %number   {% id %}

# Optional Whitespace
_ -> %WS:*

# Mandatory Whitespace
__ -> %WS:+