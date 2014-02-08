require("node-ish").extend(require);

var fs = require("fs");
var _ = require("lodash");
var opt = require("optimist");
var async = require("async");
var path = require("path");
var arrayify = require("./utils").arrayify;

opt.options("t", {
	alias: "tasks",
	describe: "A task to perform on the page once it's loaded."
});
opt.options("o", {
	alias: "options",
	describe: "JSON string of options to pass to tasks."
});
opt.options("p", {
	alias: "parallel",
	describe: "Run all tasks in parallel."
});

opt.options("i", {
	alias: "inject",
	describe: "Inject script(s) to the page."
});

var argv = opt.argv;
var src = argv._[0];
var dest = argv._[1];
var inject = arrayify(argv.inject);

var options = JSON.parse(argv.options || "{}");

if (typeof options !== "object") {
	options = {};
}

var tasks = arrayify(argv.tasks).map(function (file){
	var task = require(file)(options);
	return (typeof task === "function") ? task : null;
}).filter(_.identity);

var parallel = argv.parallel;
var page = require('./webpage').create();

page.open(src, function (status) {
	if (status !== "success") {
		console.error("Failed to open page: " + src);
		process.exit(1);
	}

	inject.forEach(function (script) {
		page.injectJs(script);
	});
	var jobs = [];
	tasks.forEach(function (task) {
		jobs.push(function (callback) {
			task.apply(page, callback);
		});
	});
	async[parallel ? "parallel" : "series"](jobs, function (error, results) {
		process.exit(!!error);
	});
});
