
module.exports = function(grunt) {

    /****************************************
     *
     * PROJECT CONFIGURATION
     *
     ****************************************/

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        opt: {
            fibos_header: '/*! <%= pkg.title %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %> */',
            fibos_footer: '',
            widget_header: '/*! ui<%= widgetName %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %> */',
            widget_footer: '',
            fwp_header: '/*! Full Widgets Package - v<%= pkg.version %> - ' + '<%= grunt.template.today("yyyy-mm-dd") %> */',
            fwp_footer: '',
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
                //separator: grunt.util.linefeed+';'+grunt.util.linefeed
            },

            // --- concat WIDGETS (for FibOS and uiWidgets-test) --- //

            uiwidgets: {
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

            uipanels: {
                src: [
                    'src/app/panels/UIBasePanel.js',
                    'src/app/panels/UIExtraPanel.js',
                    'src/app/panels/UIFontsPanel.js',
                    'src/app/panels/UIGroupPanel.js',
                    'src/app/panels/UIInputPanel.js',
                    'src/app/panels/UIOffsetPanel.js',
                    'src/app/panels/UISpacerPanel.js',
                    'src/app/panels/UISpritePanel.js',
                    'src/app/panels/UIStoragePanel.js',
                    'src/app/panels/UIZIndexPanel.js',

                    'src/app/panels/UISelectPanel.js',
                    'src/app/panels/UITogglesPanel.js'
                ],
                dest: 'target/temp/UIPanels.js'
            },

            // --- concat WIDGETS + PANELS + FIBOS --- //

            full: {
                options: {
                    banner: '<%= opt.fibos_header %><%= brandMsg %><%= opt.nl %>'+
                            'var FibOS = (function(){' + '<%= opt.nl %>'+
                            'var fibosVersion = "v<%= pkg.version %>";',
                    footer: '<%= opt.nl %>'+
                            'return FibOS;}());'
                },
                src: [
                    'target/temp/UIWidgets.js',//created by concat:uiwidgets
                    'target/temp/UIPanels.js',//created by concat:uipanels
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
                    banner: '<%= opt.widget_header %><%= opt.nl %>'+
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
                src: [
                    'target/temp/UIWidgets.min.js',
                    'target/temp/images.js',
                    'src/app/init/widgets_test.js'
                ],
                dest: 'target/temp/uiWidgets-test-<%= pkg.version %>.js'
            },

            fwp: {
                src: [
                    'target/temp/UIWidgets.min.js',
                    'target/temp/images.js'
                ],
                dest: 'target/temp/uiWidgets-<%= pkg.version %>.js'
            }

        },

        /********************
         * MINIFY FILES
         ********************/
        uglify: {

            // --- minify FIBOS --- //

            fibos: {
                options: { banner: '<%= opt.fibos_header %><%= brandMsg %><%= opt.nl %>' },
                files: {'target/<%= pkg.name %><%= brandFile %>-<%= pkg.version %>.min.js': ['target/<%= pkg.name %><%= brandFile %>-<%= pkg.version %>.js']}
            },

            // --- minify WIDGETS --- //

            widget: {
                options: { banner: '<%= opt.widget_header %><%= opt.nl %>' },
                files: {'target/ui<%= widgetName %>-<%= pkg.version %>.min.js': ['target/ui<%= widgetName %>-<%= pkg.version %>.js']}
            },

            // --- minify WIDGETS for test purposes --- //

            uiwidgets: {
                options: { banner: '<%= opt.fwp_header %><%= opt.nl %>' },
                files: {'target/temp/UIWidgets.min.js': ['target/temp/UIWidgets.js']}
            },
            test: {
                options: { banner: '<%= opt.fwp_header %>/** built for TESTING purposes **/<%= opt.nl %>' },
                files: {'target/uiWidgets-test-<%= pkg.version %>.min.js': ['target/temp/uiWidgets-test-<%= pkg.version %>.js']}
            },
            fwp: {
                options: { banner: '<%= opt.fwp_header %><%= opt.nl %>' },
                files: {'target/uiWidgets-<%= pkg.version %>.min.js': ['target/temp/uiWidgets-<%= pkg.version %>.js']}
            },

            // --- minify LOADER with prompt version --- //

            prompt: {
                options: {
                    //banner: 'javascript:(function(brand,tag){var brands=[<%= prompt_brands %>],tags=[<%= prompt_tags %>];',
                    //footer: '}(<%= prompt_def1 %>,<%= prompt_def2 %>));'
                    banner: 'javascript:(function(brands,tags,brand,tag){',
                    footer: '}([<%= prompt_brands %>],[<%= prompt_tags %>],<%= prompt_def1 %>,<%= prompt_def2 %>));'
                },
                files: {'src/prompt.min.js': ['src/prompt.js']}
            }

        },

        /********************
         * CLEAN
         ********************/
        clean: {
            all:    ['target','build','public/<%= pkg.version %>'],
            target: ['target'],
            build:  ['build/<%= pkg.version %>'],
            deploy: ['public/<%= pkg.version %>','public/<%= pkg.name %>-latest*.js']
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
                    'target/temp/alpha_pattern.b64': 'src/app/img/alpha_pattern.png'
                }
            },
            sprite_fibos: {
                files: {
                    'target/temp/sprite_fibos.b64': 'src/app/img/sprite_fibos.png'
                }
            },
            marker_line: {
                files: {
                    'target/temp/marker_line.b64': 'src/app/img/marker_line.png'
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
    grunt.registerTask('_create_images_js', '', function(image){
        var s, sources={}, images=[];

        if(image) sources[image] = grunt.file.read('target/temp/'+image+'.b64');
        else {
            sources = {
                alpha_pattern: grunt.file.read('target/temp/alpha_pattern.b64'),
                sprite_fibos: grunt.file.read('target/temp/sprite_fibos.b64'),
                marker_line: grunt.file.read('target/temp/marker_line.b64')
            };
        }
        for(s in sources) if(sources.hasOwnProperty(s)) images.push(s+':"'+sources[s]+'"');

        grunt.file.write('target/temp/images.js', 'var images={'+images.join(',')+'};');
    });

    grunt.registerTask('_concat_images', '', function(image){
        var task = image?':'+image:'';
        grunt.task.run(
            'base64'+task,
            '_create_images_js'+task
        );
    });

    grunt.registerTask('_concat_fibos', '', function(){
        grunt.task.run(
            'concat:uiwidgets',
            'concat:uipanels',
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

    // Prompt task
    grunt.registerTask('prompt', 'minifies prompt loader with custom default values', function(def1,def2){
        var arrBrands = [],
            arrTags = ['"latest"','"staging"'],
            pkgBrands = grunt.config.get('pkg').brands;

        for(var b in pkgBrands) if(pkgBrands.hasOwnProperty(b)) arrBrands.push('"'+b+'"');

        if(arrBrands.indexOf('"'+def1+'"')===-1) def1=null;
        if(arrTags.indexOf('"'+def2+'"')===-1) def2=null;

        grunt.config.set('prompt_brands', arrBrands.join(','));
        grunt.config.set('prompt_tags', arrTags.join(','));
        grunt.config.set('prompt_def1', def1?'"'+def1+'"' : 'null');
        grunt.config.set('prompt_def2', def2?'"'+def2+'"' : 'null');

        grunt.task.run('uglify:prompt');
    });

    // --- ALIAS tasks --- //

    // Widget-Test task
    grunt.registerTask('widgets-test', ['clean:target', 'concat:uiwidgets', 'uglify:uiwidgets', '_concat_images:alpha_pattern', 'concat:test', 'uglify:test', 'copy:widget', 'clean:target']);
    grunt.registerTask('widgets-all', ['clean:target', 'concat:uiwidgets', 'uglify:uiwidgets', '_concat_images:alpha_pattern', 'concat:fwp', 'uglify:fwp','copy:widget', 'clean:target']);

    // Full tasks
    grunt.registerTask('deploy', ['build-all', 'clean:deploy', 'copy:deploy']);
    grunt.registerTask('build-all', [
        'clean:build', 'build', 'build:hotels', 'build:venere',
        'widget:marker', 'widget:ruler', 'widget:slider', 'widget:spacer', 'widget:spriter', 'widgets-all'
    ]);

    // Default task
    grunt.registerTask('default', ['build']);

};
