module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: { 
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        src: 'js/index.js',
        dest: 'build/index1.min.js' 
      }
    },
	jshint:{
		foo: {
      src: ['js/index.js', 'src/aaa.js']
    },
	},
	watch: {
		scripts: {
			files: ['js/*.js'],
			tasks: ['jshint', 'uglify', 'jsbeautifier'],
			options: {
					spawn: false,
					},
				},
			},
	"jsbeautifier" : {
    files : ["js/index.js", "sass/*/*.scss"],
    options : {
		css:{
			fileTypes: [".scss"]
		}
    }
}
  });
  
  
	 // Laoding Watch.
	 grunt.loadNpmTasks('grunt-contrib-watch');
  
  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Load the plugin that provides the "js-hint" task.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  // Default task(s).
  grunt.registerTask('default', ['uglify', 'jshint']);
  // Beautifier.
  grunt.loadNpmTasks("grunt-jsbeautifier");
  
  

};