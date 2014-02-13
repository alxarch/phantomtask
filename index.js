/* global phantom */
var async = require("async");
var _ = require("lodash");

module.exports = function (src, options, callback) {
	options = _.assign({}, options);
	var page = require('./webpage').create();
	var jobs = [];
	_.forOwn(options.tasks || {}, function (file, options) {
		var task;
		try {
			task = require(file)(options);
		}
		catch (e) {
			throw new Error("Failed to load task: " + file + ". (" + e + ")");
		}
		if (typeof t === "function") {
			jobs.push(function (callback) {
				task.call(page, callback);
			});
		}
	});

	page.open(src, function (status) {
		if (status !== "success") {
			console.error("Failed to open page: " + src);
			process.exit(1);
		}
		[].concat(options.inject || []).forEach(function (script) {
			page.injectJs(script);
		});
		async[options.parallel ? "parallel" : "series"](jobs, function (error, results) {
			if (typeof callback === "function") {
				callback(error);
			}
		});
	});
};
