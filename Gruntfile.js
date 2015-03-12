
module.exports = function(grunt) {

    /****************************************
     *
     * PROJECT CONFIGURATION
     *
     ****************************************/

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        opt: {
            header: '/*! <%= pkg.title %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %> */',
            footer: '',
            wheader: '/*! ui<%= widgetName %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %> */',
            wfooter: '',
            nl: grunt.util.linefeed,
            brand : function(brand){
                return '/** built for '+brand+' **/';
            }
        },

        /********************
         * CONCAT FILES
         ********************/
        concat: {
            options: {
                separator: grunt.util.linefeed+';'+grunt.util.linefeed
            },

            // --- concat WIDGETS (for FibOS and uiWidgetsTest) --- //

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
            
            // --- concat FINAL (with initializer for brand) --- //

            fibos: {
                src: ['target/temp/fibos_full.js', 'src/app/init/fibos_<%= brandName %>.js'],
                dest: 'target/<%= pkg.name %><%= brandFile %>-<%= pkg.version %>.js'
            },

            // --- concat ONLY WIDGET (single task for widget) --- //

            widget: {
                options: {
                    banner: '<%= opt.wheader %><%= opt.nl %>'+
                            'var ui<%= widgetName %> = (function(){' + '<%= opt.nl %>',
                    footer: '<%= opt.nl %>'+
                            'return UI<%= widgetName %>Widget;}());'
                },
                src: ['src/widgets/UIBaseWidget.js','src/widgets/UI<%= widgetName %>Widget.js'],
                dest: 'target/ui<%= widgetName %>-<%= pkg.version %>.js'
            },

            // --- concat TEST INIT (with all minified widgets) --- //

            test: {
                options: {
                    banner: 'var test = (function(){' + '<%= opt.nl %>',
                    footer: '<%= opt.nl %>' + 'return test;}());'
                },
                src: ['target/temp/UIWidgets.min.js','src/app/init/widgets_test.js'],
                dest: 'target/uiWidgetsTest-<%= pkg.version %>.js'
            }

        },

        /********************
         * MINIFY FILES
         ********************/
        uglify: {

            // --- minify FIBOS --- //

            fibos: {
                options: { banner: '<%= opt.header %><%= brandMsg %><%= opt.nl %>' },
                files: {'target/<%= pkg.name %><%= brandFile %>-<%= pkg.version %>.min.js': ['target/<%= pkg.name %><%= brandFile %>-<%= pkg.version %>.js']}
            },

            // --- minify WIDGETS --- //

            widget: {
                options: { banner: '<%= opt.wheader %><%= opt.nl %>' },
                files: {'target/ui<%= widgetName %>-<%= pkg.version %>.min.js': ['target/ui<%= widgetName %>-<%= pkg.version %>.js']}
            },
            
            // --- minify WIDGETS for test purposes --- //

            widgets: {
                files: {'target/temp/UIWidgets.min.js': ['target/temp/UIWidgets.js']}
            },
            test: {
                files: {'target/uiWidgetsTest-<%= pkg.version %>.min.js': ['target/uiWidgetsTest-<%= pkg.version %>.js']}
            }

        },

        /********************
         * CLEAN
         ********************/
        clean: {
            all:    ["target","build","public/<%= pkg.version %>"],
            target: ["target"],
            build:  ["build"],
            deploy: ["public/<%= pkg.version %>","public/<%= pkg.name %>-latest*.js"]
        },

        /********************
         * COPY
         ********************/
        copy: {
            fibos: {
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
                        src: ['build/<%= pkg.version %>/<%= pkg.name %>*.min.js'],
                        dest: 'public/',
                        opt: {
                            from:'<%= pkg.name %>',
                            to:'<%= pkg.name %>-latest'
                        },
                        rename: function(dest, src) {
                            src = src.replace(/[0-9]/g,'');
                            src = src.replace(/-\.\./,'');
                            src = src.replace(this.opt.from,this.opt.to);
                            return dest + src;
                        }
                    },
                    {
                        expand: true,
                        flatten: true,
                        filter: 'isFile',
                        src: ['build/<%= pkg.version %>/<%= pkg.name %>*.min.js'],
                        dest: 'public/<%= pkg.version %>/'
                    },
                    {
                        expand: true,
                        flatten: true,
                        filter: 'isFile',
                        src: ['build/<%= pkg.version %>/ui*.min.js'],
                        dest: 'public/<%= pkg.version %>/widgets/'
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
    grunt.registerTask('build', 'custom task to build full FibOS with different initial config', function(brand){
        var pkgBrand = grunt.config.get('pkg').brands[brand];
        grunt.config.set('brandName',pkgBrand ? brand : 'default');
        grunt.config.set('brandFile',brand ? '-'+brand : '');
        grunt.config.set('brandMsg', brand ? '<%= opt.brand("'+(pkgBrand || brand)+'") %>' : '');

        grunt.task.run(
            'clean:target',
            '_concat_fibos',
            'concat:fibos',
            'uglify:fibos',
            'copy:fibos',
            'clean:target'
        );
    });

    // Widget task
    grunt.registerTask('widget', 'custom task to build a single widget', function(widget){
        var widgetName = widget[0].toUpperCase() + widget.slice(1).toLowerCase();
        grunt.config.set('widgetName',widgetName);

        if(arguments.length>=1){
            grunt.task.run(
                'clean:target',
                'concat:widget',
                'uglify:widget',
                'copy:widget',
                'clean:target'
            );
        }else{
            grunt.log.error('[ERROR] task WIDGET needs the widget name as argument');
        }
    });
    
    grunt.registerTask('test', '', function(){
        grunt.task.run(
            'clean:target',
            'concat:widgets',
            'uglify:widgets',
            'concat:test',
            'uglify:test',
            'copy:widget',
            'clean:target'
        );
    });

    // --- ALIAS tasks --- //

    // Full tasks
    grunt.registerTask('deploy', ['build-all', 'clean:deploy', 'copy:deploy']);
    grunt.registerTask('build-all', [
        'clean:build', 'build', 'build:hotels', 'build:venere',
        'widget:marker', 'widget:ruler', 'widget:slider', 'widget:spacer', 'widget:spriter'
    ]);

    // Default task
    grunt.registerTask('default', ['build']);

};
