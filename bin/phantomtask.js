#!/usr/bin/env phantomjs
// vim: ts=4:sw=4:noet
/* global phantom */
var _ = require("lodash");
var path = require("node-ish")("path");

var argv = require("optimist-phantomjs")
	.demand("t")
	.alias("t", "task")
	.describe("t", "Add task(s) to be executed on the page.")
	.alias("i", "inject")
	.describe("i", "Inject script(s) into the page.")
	.alias("p", "parallel")
	.describe("p", "Run tasks in parallel.")
	.argv;

var tasks = {};
var src = argv._["1"];
var options = {
	parallel: argv.parallel,
	inject: [].concat(argv.inject || []),
	tasks: tasks
};

[].concat(argv.task).forEach(function (def) {
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

	tasks[taskname] = options;
});

var phantomtask = require("../index");
phantomtask(src, options, function (error) {
	phantom.exit(!!error);
});
