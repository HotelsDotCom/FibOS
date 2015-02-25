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
                    'src/app/panels/UIExtraPanel.js',
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
            },
            spacer: {
                src: ['src/widgets/UIBaseWidget.js','src/widgets/UISpacerWidget.js'],
                dest: 'target/uiSpacer-<%= pkg.version %>.js'
            },
            spriter: {
                src: ['src/widgets/UIBaseWidget.js','src/widgets/UISpriterWidget.js'],
                dest: 'target/uiSpriter-<%= pkg.version %>.js'
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
            },
            spacer: {
                files: {'target/uiSpacer-<%= pkg.version %>.min.js': ['target/uiSpacer-<%= pkg.version %>.js']}
            },
            spriter: {
                files: {'target/uiSpriter-<%= pkg.version %>.min.js': ['target/uiSpriter-<%= pkg.version %>.js']}
            }
        },
        clean: {
            build: ["target"]
        },
        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        filter: 'isFile',
                        src: ['target/fibos*'],
                        dest: 'build/<%= pkg.version %>/'
                    }
                ]
            },
            widget: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        filter: 'isFile',
                        src: ['target/ui*'],
                        dest: 'build/<%= pkg.version %>/'
                    }
                ]
            }
        }
    });

    // Load the plugins
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Default task
    grunt.registerTask('default', ['build']);

    // Main task
    grunt.registerTask('build',        ['clean', 'concat:fibos',  'uglify:fibos',  'copy:main']);
    // Widget tasks
    grunt.registerTask('build-marker', ['clean', 'concat:marker', 'uglify:marker', 'copy:widget']);
    grunt.registerTask('build-ruler',  ['clean', 'concat:ruler',  'uglify:ruler',  'copy:widget']);
    grunt.registerTask('build-slider', ['clean', 'concat:slider', 'uglify:slider', 'copy:widget']);
    grunt.registerTask('build-spacer', ['clean', 'concat:spacer', 'uglify:spacer', 'copy:widget']);
    grunt.registerTask('build-spriter',['clean', 'concat:spriter','uglify:spriter','copy:widget']);

};
