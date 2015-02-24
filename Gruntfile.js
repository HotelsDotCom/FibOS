// usage:
// install node!!!
// npm install -g grunt-cli
// npm install
// grunt

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';',
            },
            dist: {
                src: ['src/app/FibOS.js', 'src/app/fibos_venere.js'],
                dest: 'target/<%= pkg.name%>-<%= pkg.version%>.js',
            }
        },
        uglify: {
            my_target: {
                files: {
                    'target/<%= pkg.name%>-<%= pkg.version%>.min.js': ['target/<%= pkg.name%>-<%= pkg.version%>.js']
                }
            }
        },
        clean: {
            build: ["target"],
        }
    });

    // Load the plugins
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task(s).
    grunt.registerTask('default', ['build']);

    grunt.registerTask('build', ['clean', 'concat', 'uglify']);
};