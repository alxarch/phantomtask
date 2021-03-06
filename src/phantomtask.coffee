async = require "async"
{assign} = require "lodash"

class PhantomTask
	
	constructor: (options) ->
		@jobs = []
		@scripts = []
		@options = assign {}, options
		@page = require('./webpage').create()

	add: (request, description = "Job ##{@jobs.length}", options = {}) ->

		task = require(request) options
		@jobs.push (done) =>
			console.log description
			task.apply @page, [done]
		@

	inject: (script) ->
		@scripts.push script
		@

	run: (url, callback) ->
		unless typeof callback is "function"
			callback = ->

		@page.open url, (status) =>
			unless status is "success"
				callback new Error "Failed to open page: #{url}"

			for script in [].concat(@scripts)
				@page.injectJs script
			
			method = if @options.parallel then "parallel" else "series"
			async[method] @jobs, (error) ->
				callback error
		@

module.exports = PhantomTask