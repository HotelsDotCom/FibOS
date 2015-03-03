/* ACCEPTED LINE COMMANDS

// folders cleaners
grunt clean:all         // remove ALL dynamic folders ( build/, target/, public/ )
grunt clean:target      // remove target/ folder
grunt clean:build       // remove build/ folder
grunt clean:deploy      // remove public/[version]/ folder

// single widget builders
grunt widget:marker     // build and minify MARKER widget into build/[version]/ folder
grunt widget:ruler      // build and minify RULER widget into build/[version]/ folder
grunt widget:slider     // build and minify SLIDER widget into build/[version]/ folder
grunt widget:spacer     // build and minify SPACER widget into build/[version]/ folder
grunt widget:spriter    // build and minify SPRITER widget into build/[version]/ folder

// full builders
grunt build             // build and minify the FibOS GUI with default initializer into build/[version]/ folder
grunt build:venere      // build and minify the FibOS GUI with VENERE initializer into build/[version]/ folder
grunt build:hotels      // build and minify the FibOS GUI with HOTELS initializer into build/[version]/ folder
grunt build-all         // build and minify the FibOS GUI with ALL initializers along with ALL widgets into build/[version]/ folder
grunt deploy            // build and minify ALL into build/[version]/ folder and copy only minified files into public/[version]/ folder

grunt                   // defaults to "grunt build"

// please note
// dynamic folders are used as follows:
// - target: (git ignores it) temporary folder to host processing files
// - build:  (git ignores it) final folder to host built files (both minified and debuggable ones)
// - public: (git stages it)  final folder only for minified files

*/

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
                separator: grunt.util.linefeed+';'+grunt.util.linefeed
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
                    'target/temp/UIWidgets.js',//created by concat:widgets
                    'target/temp/UIPanels.js',//created by concat:panels
                    'target/temp/images.js',//created by _create_images_js (called by _concat_images)
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
        },

        /********************
         * IMAGES to BASE64
         ********************/
        base64: {
            alpha_pattern: {
                files: {
                    'target/temp/alpha.b64': 'src/app/img/alpha_pattern.png'
                }
            },
            sprite_fibos: {
                files: {
                    'target/temp/sprite.b64': 'src/app/img/sprite_fibos.png'
                }
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
    grunt.loadNpmTasks('grunt-base64');

    /****************************************
     *
     * REGISTER TASKS
     *
     ****************************************/

    // --- METHOD tasks --- //

    // Private tasks
    grunt.registerTask('_create_images_js', '', function(){
        var alpha  = grunt.file.read('target/temp/alpha.b64'),
            sprite = grunt.file.read('target/temp/sprite.b64'),
            images = [
                'alpha_pattern:"'+alpha+'"',
                'sprite_fibos:"'+sprite+'"'
            ],
            images_js = 'var images={'+images.join(',')+'};';

        grunt.file.write('target/temp/images.js',images_js);
    });
    grunt.registerTask('_concat_images', '', function(){
        grunt.task.run(
            'base64',
            '_create_images_js'
        );
    });
    grunt.registerTask('_concat_fibos', '', function(){
        grunt.task.run(
            'concat:widgets',
            'concat:panels',
            '_concat_images',
            'concat:full'
        );
    });

    // Main task
    grunt.registerTask('build', 'custom task to build full FibOS with different initial config', function(){
        var task = 'fibos' + (arguments.length>0 ? '_'+arguments[0] : '');
        grunt.task.run(
            'clean:target',
            '_concat_fibos',
            'concat:'+task,
            'uglify:'+task,
            'copy:main',
            'clean:target'
        );
    });

    // Widget task
    grunt.registerTask('widget', 'custom task to build a single widget', function(){
        if(arguments.length>=1){
            grunt.task.run(
                'clean:target',
                'concat:'+arguments[0],
                'uglify:'+arguments[0],
                'copy:widget',
                'clean:target'
            );
        }else{
            grunt.log.error('[ERROR] task WIDGET needs the widget name as argument');
        }
    });

    // --- ALIAS tasks --- //

    // Full tasks
    grunt.registerTask('deploy', ['build-all', 'clean:deploy', 'copy:deploy']);
    grunt.registerTask('build-all', [
        'build', 'build:hotels', 'build:venere',
        'widget:marker', 'widget:ruler', 'widget:slider', 'widget:spacer', 'widget:spriter'
    ]);

    // Default task
    grunt.registerTask('default', ['build']);

};
