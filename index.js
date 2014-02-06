var _ = require("lodash");
var phantomjs = require("phantomjs").path;
var spawn = require("child_process").spawn;
var arrayify = require("./lib/utils").arrayify;
var path = require("path");

var script = path.resolve(__dirname, 'lib/task.js');

module.exports = function (src, options, callback) {
	options = _.extend({}, options || {});
	var inject = arrayify(options.inject);
	var tasks = arrayify(options.tasks);
	var jobs = [];
	var phatomargs = [
		options.images ? '--load-images=' + !!options.images : null,
		options.cookies ? '--cookies-file=' + options.cookies : null,
		options.cache ? '--disk-cache=' + !!options.cache : null
	].filter(_.ident);

	var args = [].concat(options, script, src);
	if (options.outpus) {
		args.push('--output');
		args.push(options.output);
	}
	if (options.parallel) {
		args.push('--parallel');
	}
	inject.forEach( function (i) {
		args.push("--inject");
		args.push(i);
	});
	tasks.forEach( function (t) {
		args.push("--task");
		args.push(t);
	});
	var p = spawn(phantomjs, args);
	p.on("exit", function (code) {
		var error;
		if (code !== 0) {
			error = new Error("Phantomjs exited with code: " + code);
		}
		callback(error);
	});
	return p;
};
