module.exports = (grunt) ->
	grunt.initConfig
		jshint:
			options:
				jshintrc: ".jshintrc"
			bin:
				src: "bin/*.js"
		coffee:
			compile:
				cwd: "src/"
				expand: yes
				ext: ".js"
				src: "**/*.coffee"
				dest: "lib/"

	grunt.loadNpmTasks "grunt-contrib-coffee"
	grunt.loadNpmTasks "grunt-contrib-jshint"
	grunt.registerTask "default", ["coffee", "jshint"]