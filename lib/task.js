require("node-ish").extend(require);

var fs = require("fs");
var _ = require("lodash");
var opt = require("optimist");
var async = require("async");
var path = require("path");
var arrayify = require("./utils").arrayify;

opt.describe("t", "A task to perform on the page once it's loaded.");
opt.describe("p", "Run all tasks in parallel.");
opt.describe("i", "Inject script(s) to the page.");

var argv = opt.argv;
var src = argv._[0];

var parallel = argv.p;
var inject = [].concat(argv.i);
var tasks = [].concat(argv.t)
	.map(function (def){
		def = def.split(path.delimiter);
		var file = def[0];
		var opt = JSON.parse(def[1] || "{}");
		var task = require(file)(opt);
		return (typeof task === "function") ? task : null;
	})
	.filter(_.identity);

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
