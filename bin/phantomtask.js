#!/usr/bin/env phantomjs
// vim: ts=4:sw=4:noet
/* global phantom */
var _ = require("lodash");
var path = require("node-ish/path");

var opt = require("optimist-phantomjs")
	.usage("phantomtask <URL> [options]")
	.alias("t", "task")
	.describe("t", "Add task(s) to be executed on the page.")
	.alias("i", "inject")
	.describe("i", "Inject script(s) into the page.")
	.alias("p", "parallel")
	.describe("p", "Run tasks in parallel.");
var argv = opt.argv;
var tasks = {};
var src = argv._[0];
if (!src) {
	console.error("Missing URL.");
	opt.showHelp();
	phantom.exit(1);
}

var PhantomTask = require("../lib/phantomtask");
var task = new PhantomTask({
	parallel: argv.parallel,
	inject: argv.inject
});

[].concat(argv.task || []).forEach(function (def) {
	var pos = def.indexOf(path.delimiter);
	var taskname, options;
	if (pos === -1) {
		taskname = def;
		options = {};
	}
	else {
		taskname = def.slice(0,pos);
		try {
			options = _.assign({}, JSON.parse(def.slice(pos+1)));
		}
		catch (e) {
			options = {};
		}
	}

	task.add(taskname, options);
});

task.run(src, function (error) {
	if (error) {
		console.error(error);
	}
	phantom.exit(!!error);
});
