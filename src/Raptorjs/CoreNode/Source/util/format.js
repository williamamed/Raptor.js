module.exports={
	blue:'\x1b[36m{text}\x1b[39m',
	red: '\x1b[31;1m{text}\x1b[0m',
	yellow: '\x1b[33;1m{text}\x1b[22;39m',
	green:'\x1B[32m{text}\x1b[39m',
	getFormated:function(text, color){
		if(this[color])
			return this[color].replace('{text}',text);
		else
			return text;
	},
	
	get: function(text, color){
		if(this[color])
			return this[color].replace('{text}',text);
		else
			return text;
	},

	RED:'red',
	BLUE: 'blue',
	YELLOW: 'yellow',
	GREEN: 'green'
}