var _ = require('lodash');
var arrayify = require('./utils').arrayify;
var events = require("events");
var eventnames = [
	"Alert",
	"Callback",
	"Closing",
	"Confirm",
	"ConsoleMessage",
	"Error",
	"FilePicker",
	"Initialized",
	"LoadFinished",
	"LoadStarted",
	"NavigationRequested",
	"PageCreated",
	"Prompt",
	"ResourceRequested",
	"ResourceReceived",
	"ResourceTimeout",
	"ResourceError",
	"UrlChanged"
];

var initPage = function (page) {
	page.libraryPath = process.cwd();
	_.extend(page, events.prototype);
	_.forIn(eventnames, function (name) {
		var method = "on" + name;
		if (!_.isFunction(page[method])) {
			page[method] = function () {
				page.emit.apply(page, [name.toLowerCase()].concat([].slice.apply(arguments)));
			};
		}
	});
	page.on('callback', function (args) {
		this.emit.apply(this, arrayify(args));
	});
	page.on('pagecreated', function (p) {
		initPage(p);
		p.parentPage = page;
	});
};

var createPage = function () {
	var page = require('webpage').create();
	initPage(page);
	return page;
};

module.exports = {
	init: initPage,
	create: createPage
};