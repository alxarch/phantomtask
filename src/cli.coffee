#!/usr/bin/env phantomjs

system = require "system"
usage = ->
	console.log help()
help = -> """

phantomtask <URL> [tasks] [options]

Tasks:
    -t, --task <module>      Add task(s) to be executed on the page.

    After each task argument the following arguments apply:

    -n, --name <taskname>    Name this task.
    -o, --options <json>     Pass options to the task. (JSON string)

Options:
    -h, --help               Display help.
    -p, --parallel           Run tasks in parallel.
    -d, --debug              Output debug info.
    -i, --inject <script>    Inject script(s) into the page.

"""

options = {}
src = null
tasks = []
scripts = []
args = [].slice.call system.args, 1
do (args) ->

	i = 0
	total = args.length
	parseTask = ->
		path = args[i++]
		label = null
		options = {}

		while i < total
			switch args[i]
				when "-n", "--name"
					i++
					label = args[i++]
				when "-o", "--options"
					i++
					_.assign options, JSON.parse args[i++]
				else
					i--
					return [path, label, options]

	while i < total
		switch args[i]
			when "-t", "--task"
				i++
				tasks.push parseTask()
			when "-i", "--inject"
				i++
				scripts.push args[i]
			when "-h", "--help"
				usage()
				phantom.exit 0
			when "-p", "--parallel"
				options.parallel = yes
			when "-d", "--debug"
				options.debug = yes
			else
				src = args[i]
		i++

unless src
	console.error """

	Error: No URL provided.
	"""
	usage()
	phantom.exit 1

PhantomTask = require "./phantomtask"
task = new PhantomTask options

for script in scripts
	task.inject script

for t in tasks
	task.add.apply task, t

task.run src, (error) ->
	if error
		console.error error
		phantom.exit 1
	else
		phantom.exit 0