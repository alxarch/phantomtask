var ident = function (a) {
	return a;
};

module.exports = {
	indent: ident,
	arrayify: function (data) {
		return [].concat(data).filter(ident);
	}
};