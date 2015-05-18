module.exports = function (grunt) {

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jasmine');

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jasmine: {
      all: {
        src: ['js/*.js'],
        options: {
          specs: 'test/unit/*Spec.js',
          vendor: [
            'bower_components/jquery/jquery.js',
            'bower_components/jquery-cookie/jquery.cookie.js',
            'test/*.js'
          ]
        }
      }
    },
    jshint: {
      all: ['Gruntfile.js', 'test/**/*.js', 'js/**/*.js']
    }
  });
  grunt.registerTask('test', 'Validates JS, runs JS unit tests', ['jshint', 'jasmine']);
};
