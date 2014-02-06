// Silence jshint warnings
var document;

module.exports = function (page) {
	page.helpers = {
		html: function (selector) {
			return page.evaluate(function (selector) {
				return [].slice.apply(document.querySelectorAll(selector)).map(function (el) {
					return el.outerHTML;
				});
			}, selector);
		}
	};
};
