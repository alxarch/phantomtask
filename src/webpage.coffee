_ = require "lodash"
events = require "node-ish/events"
eventnames = [
	"Alert"
	"Callback"
	"Closing"
	"Confirm"
	"ConsoleMessage"
	"Error"
	"FilePicker"
	"Initialized"
	"LoadFinished"
	"LoadStarted"
	"NavigationRequested"
	"PageCreated"
	"Prompt"
	"ResourceRequested"
	"ResourceReceived"
	"ResourceTimeout"
	"ResourceError"
	"UrlChanged"
]

initPage = (page) ->
	page.libraryPath = process.cwd()
	_.extend page, events.prototype
	_.forIn eventnames, (name) ->
		method = "on#{name}"
		unless _.isFunction page[method]
			page[method] = ->
				page.emit.apply page, [name.toLowerCase()].concat [].slice.apply(arguments)

	page.on 'consolemessage', (args) ->
		console.log.apply null, [].concat args
	
	page.on 'callback', (args) ->
		page.emit.apply page, [].concat(args or [])

	page.on 'pagecreated', (p) ->
		initPage(p)
		p.parentPage = page

createPage = ->
	page = require('webpage').create()
	initPage page
	page

module.exports =
	create: createPage