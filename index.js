var S = require("string");
var _ = require("lodash");

var path = require("path");
var script = path.resolve(__dirname, 'lib/task.js');

var PHANTOM_ARGUMENTS = ["loadImages", "diskCache", "cookiesFile"];

module.exports = function (options) {
	options = _.extend({}, options || {});

	var args = [];

	_(options).pick(PHANTOM_ARGUMENTS).forOwn(function (key, value) {
		args.push("--" + S(key).dasherize().toString());
		args.push(value);
	});

	_.forOwn([].concat(options.tasks || {}), function (file, options) {
		args.push("-t");
		args.push(file + path.delimiter + JSON.stringify(options));
	});

	_([].concat(options.inject || [])).forIn(function (file) {
		args.push("-i");
		args.push(file);
	});

	if (options.parallel) {
		args.push("-p");
	}

	args.push(script);

	return function (src, callback) {
		var phantomjs = require("phantomjs").path;
		var spawn = require("child_process").spawn;
		var p = spawn(phantomjs, args.concat(src));
		p.on("exit", function (code) {
			var error;
			if (code !== 0) {
				error = new Error("Phantomjs exited with code: " + code);
			}
			callback(error);
		});
		return p;
	};
};
