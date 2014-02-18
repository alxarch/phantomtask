module.exports = (grunt) ->
	grunt.initConfig
		coffee:
			options:
				bare: yes
			compile:
				cwd: "src/"
				expand: yes
				ext: ".js"
				src: "**/*.coffee"
				dest: "lib/"

	grunt.loadNpmTasks "grunt-contrib-coffee"
	grunt.registerTask "build", ["coffee"]
	grunt.registerTask "default", ["build"]