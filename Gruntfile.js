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
                separator: ';'
            },
            fibos: {
                src: [
                    //widgets
                    'src/widgets/UIBaseWidget.js',
                    'src/widgets/UIMarkerWidget.js',
                    'src/widgets/UIRulerWidget.js',
                    'src/widgets/UISliderWidget.js',
                    'src/widgets/UISpacerWidget.js',
                    'src/widgets/UISpriterWidget.js',
                    //panels
                    'src/app/panels/UIBasePanel.js',
                    'src/app/panels/UIGroupPanel.js',
                    'src/app/panels/UIInputPanel.js',
                    'src/app/panels/UIOffsetPanel.js',
                    'src/app/panels/UISpacerPanel.js',
                    'src/app/panels/UISpritePanel.js',
                    'src/app/panels/UIStoragePanel.js',
                    //extra panels
                    'src/app/panels/UISelectPanel.js',
                    'src/app/panels/UITogglesPanel.js',
                    //main
                    'src/app/FibOS.js',
                    'src/app/fibos_default.js'
                ],
                dest: 'target/<%= pkg.name %>-<%= pkg.version %>.js'
            },
            marker: {
                src: ['src/widgets/UIBaseWidget.js','src/widgets/UIMarkerWidget.js'],
                dest: 'target/uiMarker-<%= pkg.version %>.js'
            },
            ruler: {
                src: ['src/widgets/UIBaseWidget.js','src/widgets/UIRulerWidget.js'],
                dest: 'target/uiRuler-<%= pkg.version %>.js'
            },
            slider: {
                src: ['src/widgets/UIBaseWidget.js','src/widgets/UISliderWidget.js'],
                dest: 'target/uiSlider-<%= pkg.version %>.js'
            }
        },
        uglify: {
            fibos: {
                files: {'target/<%= pkg.name %>-<%= pkg.version %>.min.js': ['target/<%= pkg.name %>-<%= pkg.version %>.js']}
            },
            marker: {
                files: {'target/uiMarker-<%= pkg.version %>.min.js': ['target/uiMarker-<%= pkg.version %>.js']}
            },
            ruler: {
                files: {'target/uiRuler-<%= pkg.version %>.min.js': ['target/uiRuler-<%= pkg.version %>.js']}
            },
            slider: {
                files: {'target/uiSlider-<%= pkg.version %>.min.js': ['target/uiSlider-<%= pkg.version %>.js']}
            }
        },
        clean: {
            build: ["target"]
        }
    });

    // Load the plugins
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Default task(s).
    grunt.registerTask('default', ['build']);

    grunt.registerTask('build', ['clean', 'concat:fibos', 'uglify:fibos']);
    grunt.registerTask('build-marker', ['clean', 'concat:marker', 'uglify:marker']);
    grunt.registerTask('build-ruler', ['clean', 'concat:ruler', 'uglify:ruler']);
    grunt.registerTask('build-slider', ['clean', 'concat:slider', 'uglify:slider']);
};
