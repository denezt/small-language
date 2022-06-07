const moo = require('moo');
const fs = require('mz/fs');

let lexer = moo.compile({
	WS: /[ \t]+/,
	comment: /\/\/.*?$/,
	number: /0|[1-9][0-9]*/,
	string: /"(?:\\["\\]|[^\n"\\])*"/,
	lparen: '(',
	rparen: ')',
	lcurly: '{',
	rcurly: '}',
	identifier: /[a-zA-Z][a-zA-Z_0-9]*/,
	fatarrow: '=>',
	assign: '=',
	NL: { match: /\n/, lineBreaks: true},
});

module.exports = lexer;