async = require "async"
{assign} = require "lodash"

class PhantomTask
	constructor: (options) ->
		@jobs = []
		@options = assign {}, options
		@page = require('./webpage').create()

	add: (request, description = "Job ##{@jobs.length}", options = {}) ->
		task = require(request) options
		@jobs.push (done) ->
			console.log description
			task.call page, done
		@

	run: (url, callback) ->
		unless typeof callback is "function"
			callback = ->

		@page.open url, (status) =>
			unless status is "success"
				callback new Error "Failed to open page: #{src}"
			for script in [].concat(@options.inject or [])
				@page.injectJs script
			
			method = if @options.parallel then "parallel" else "series"
			async[method] @jobs, (error) ->
				callback error
		@

module.exports = PhantomTask