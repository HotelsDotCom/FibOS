// usage:
// install node!!!
// npm install -g grunt-cli
// npm install
// grunt

module.exports = function(grunt) {

    /****************************************
     *
     * PROJECT CONFIGURATION
     *
     ****************************************/

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        opt: {
            header: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %> */',
            footer: '',
            nl: grunt.util.linefeed,
            brand : function(brand){
                return '/** built for '+brand.toUpperCase()+' **/';
            }
        },

        /********************
         * CONCAT FILES
         ********************/
        concat: {
            options: {
                separator: ';'
            },

            // --- concat WIDGETS (for FibOS) --- //
            widgets: {
                src: [
                    'src/widgets/UIBaseWidget.js',
                    'src/widgets/UIMarkerWidget.js',
                    'src/widgets/UIRulerWidget.js',
                    'src/widgets/UISliderWidget.js',
                    'src/widgets/UISpacerWidget.js',
                    'src/widgets/UISpriterWidget.js'
                ],
                dest: 'target/temp/UIWidgets.js'
            },

            // --- concat PANELS (for FibOS) --- //
            panels: {
                src: [
                    'src/app/panels/UIBasePanel.js',
                    'src/app/panels/UIExtraPanel.js',
                    'src/app/panels/UIGroupPanel.js',
                    'src/app/panels/UIInputPanel.js',
                    'src/app/panels/UIOffsetPanel.js',
                    'src/app/panels/UISpacerPanel.js',
                    'src/app/panels/UISpritePanel.js',
                    'src/app/panels/UIStoragePanel.js',

                    'src/app/panels/UISelectPanel.js',
                    'src/app/panels/UITogglesPanel.js'
                ],
                dest: 'target/temp/UIPanels.js'
            },

            // --- concat WIDGETS + PANELS + FIBOS --- //
            full: {
                options: {
                    banner: '<%= opt.header %><%= opt.nl %>'+
                            'var FibOS = (function(){' + '<%= opt.nl %>',
                    footer: '<%= opt.nl %>'+
                            'return FibOS;}());'
                },
                src: [
                    'target/temp/UIWidgets.js',
                    'target/temp/UIPanels.js',
                    'src/app/FibOS.js'
                ],
                dest: 'target/temp/fibos_full.js'
            },

            // --- concat FINAL (with initialize) --- //
            fibos: {
                src: [
                    'target/temp/fibos_full.js',
                    'src/app/init/fibos_default.js'
                ],
                dest: 'target/<%= pkg.name %>-<%= pkg.version %>.js'
            },
            fibos_hotels: {
                src: [
                    'target/temp/fibos_full.js',
                    'src/app/init/fibos_hotels.js'
                ],
                dest: 'target/<%= pkg.name %>-hotels-<%= pkg.version %>.js'
            },
            fibos_venere: {
                src: [
                    'target/temp/fibos_full.js',
                    'src/app/init/fibos_venere.js'
                ],
                dest: 'target/<%= pkg.name %>-venere-<%= pkg.version %>.js'
            },

            // --- concat ONLY WIDGETS --- //
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

        /********************
         * MINIFY FILES
         ********************/
        uglify: {

            // --- minify FIBOS --- //
            fibos: {
                options: { banner: '<%= opt.header %><%= opt.nl %>' },
                files: {'target/<%= pkg.name %>-<%= pkg.version %>.min.js': ['target/<%= pkg.name %>-<%= pkg.version %>.js']}
            },
            fibos_hotels: {
                options: { banner: '<%= opt.header %><%= opt.brand("hotels.com") %><%= opt.nl %>' },
                files: {'target/<%= pkg.name %>-hotels-<%= pkg.version %>.min.js': ['target/<%= pkg.name %>-hotels-<%= pkg.version %>.js']}
            },
            fibos_venere: {
                options: { banner: '<%= opt.header %><%= opt.brand("venere.com") %><%= opt.nl %>' },
                files: {'target/<%= pkg.name %>-venere-<%= pkg.version %>.min.js': ['target/<%= pkg.name %>-venere-<%= pkg.version %>.js']}
            },

            // --- minify WIDGETS --- //
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

        /********************
         * CLEAN
         ********************/
        clean: {
            all:    ["target","build","public"],
            target: ["target"],
            build:  ["build"],
            deploy: ["public/<%= pkg.version %>"]
        },

        /********************
         * COPY
         ********************/
        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        filter: 'isFile',
                        src: ['target/<%= pkg.name %>*'],
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
            },
            deploy: {
                files: [
                    {
                        expand: true,
                        flatten: true,
                        filter: 'isFile',
                        src: ['build/<%= pkg.version %>/*.min.js'],
                        dest: 'public/<%= pkg.version %>/'
                    }
                ]
            }
        }
    });

    /****************************************
     *
     * LOAD PLUGINS
     *
     ****************************************/

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');

    /****************************************
     *
     * REGISTER TASKS
     *
     ****************************************/

    // Default task
    grunt.registerTask('default', ['build']);

    // Main tasks
    grunt.registerTask('_concat_fibos', ['concat:widgets', 'concat:panels', 'concat:full']);
    grunt.registerTask('build', 'custom task to build full FibOS with different initial config', function(){
        var task = 'fibos' + (arguments.length>0 ? '_'+arguments[0] : '');
        if(task){
            grunt.task.run(
                'clean:target',
                '_concat_fibos',
                'concat:'+task,
                'uglify:'+task,
                'copy:main',
                'clean:target'
            );
        }else{
            grunt.log.error('[ERROR] no FIBOS sub task with given name: %s',arg);
        }
    });

    // Widget task
    grunt.registerTask('widget', 'custom task to build a single widget', function(arg){
        if(arguments.length>0){
            grunt.task.run(
                'clean:target',
                'concat:'+arg,
                'uglify:'+arg,
                'copy:widget',
                'clean:target'
            );
        }else{
            grunt.log.error('[ERROR] task WIDGET needs an argument');
        }
    });

    // Full tasks
    grunt.registerTask('build-all', [
        'build', 'build:hotels', 'build:venere',
        'widget:marker', 'widget:ruler', 'widget:slider', 'widget:spacer', 'widget:spriter'
    ]);

    grunt.registerTask('deploy', ['build-all', 'clean:deploy', 'copy:deploy']);

};
