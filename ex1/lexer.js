const moo = require('moo')

let lexer = moo.compile({
	WS: /[ \t]+/,
	comment: /\/\/.*?$/,
	number: /0|[1-9][0-9]*/,
	string: /"(?:\\["\\]|[^\n"\\])*"/,
	lparen: '(',
	rparen: ')',
	identifier: /[a-zA-Z][a-zA-Z_0-9]*/,
	fatarrow: '=>',
	assign: '=',
	NL: { match: /\n/, lineBreaks: true},
})

// lexer.reset(`123 ("ABC") apple a9913`);
lexer.reset(`= =>`);

while (true) {
	const token = lexer.next();
	if (!token){
		break;
	}
	console.log(token);
}
