var _ = require("lodash");
var process = require("node-ish");
var opt = require("optimist");
var async = require("async");
var path = global.node_modules.path;

opt.options("t", {
	alias: "tasks",
	describe: "A task to perform on the page once it's loaded."
});
opt.options("o", {
	alias: "output",
	describe: "Dump page contents to specified file."
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
var tasks = arrayify(argv.tasks);
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
	tasks.forEach(function (t) {
		var task;
		try {
			task = require(t);
			jobs.push( function (callback) {
				task(page, callback);
			});
		}
		catch (e) {
			console.error("Failed to load task: " + t);
			process.exit(2);
		}
			
	});
	async[parallel ? "parallel" : "series"](jobs, function (error, results) {
		if (argv.output) {
			fs.write(argv.output, page.contents, "w");
		}
		process.exit(code || 0);
	});
});
