/**
 * Created by fdimonte on 10/02/2015.
 */

var FibOS = (function(
   $, images,
   uiMarker, uiRuler, uiSpacer, uiSpriter,
   panelSpacer, panelOffset, panelGroup, panelStorage, panelInput, panelSprite, panelFonts, panelSelect, panelToggles
) {

    function FibOS(reference,options){

        var jqueryMinVersion = '1.7';

        this._ID = 'fibos';
        this._fibosTitle = 'FibOS';
        this._fibosVersion = fibosVersion || '';
        this._logEvents = options.logEvents || false;
        this._logEventId = 0;
        delete options.logEvents;

        this._reference = ($(reference).length===0) ? 'body' : reference;

        this._componentsOptions = options || {};
        this._components = {};
        this._panels = {};
        this._styles = {};

        this.$el         = null;
        this.$title      = null;
        this.$background = null;
        this.$controls   = null;
        this.$toggles    = null;
        this.$panels     = null;

        this.init(jqueryMinVersion);

    }

    FibOS.prototype = {

        init: function(jqMinVer) {
            checkJqueryVersion(jqMinVer,function(){
                this.createElement();
                this.createStyles();
                this.initEvents();
            }.bind(this));
        },

        createStyles: function() {
            $('#'+this._ID+'-styles').remove();

            var $styles = $('<style/>').attr('id',this._ID+'-styles');
            var styleObj = this.factory.styles.call(this);
            var styleRows = [];

            var s,selector,selectorMain = '#'+this._ID+' ';
            for(s in styleObj){
                if(styleObj.hasOwnProperty(s)){
                    selector = selectorMain;
                    //if(s!='main') selector += ' '+s;
                    if(s!='main') selector += s.split(',').map(function(v){return v.trim();}).join(','+selectorMain);

                    styleRows.push(selector + '{'+UIBaseWidget.prototype._styleObjectToString(styleObj[s])+'}');
                }
            }

            $('head').append($styles.append(styleRows.join(' ')));
        },
        createElement: function() {
            $('#'+this._ID).remove();

            this.$el         = $('<div/>').attr('id',this._ID);
            this.$title      = $('<h1/>').text(this._fibosTitle).append($('<small/>').text(this._fibosVersion));
            this.$background = $('<div/>').attr('id','fib_background');
            this.$controls   = $('<div/>').attr('id','fib_controls');
            this.$toggles    = $('<div/>').attr('id','fib_toggles');
            this.$panels     = $('<div/>').attr('id','fib_panels').append(this.$title);

            this.$el
                .append(this.$background)
                .append(this.$controls
                    .append(this.$toggles)
                    .append(this.$panels)
                );

            $('body').append(this.$el);

            this.setupComponents();
            this.setupPanels();
        },

        setupComponents: function() {
            this._components.uiMarker  = this.factory.components.uiMarker.call(  this, 'fibos_marker',  this._componentsOptions['uiMarker']  );
            this._components.uiRuler   = this.factory.components.uiRuler.call(   this, 'fibos_rulers',   this._componentsOptions['uiRuler']   );
            this._components.uiSpacer  = this.factory.components.uiSpacer.call(  this, 'fibos_spacers', this._componentsOptions['uiSpacer']  );
            this._components.uiSpriter = this.factory.components.uiSpriter.call( this, 'fibos_spriter', this._componentsOptions['uiSpriter'] );

            this.addWidget(this._components.uiSpacer);
            this.addWidget(this._components.uiMarker);
            this.addWidget(this._components.uiRuler);
            this.addWidget(this._components.uiSpriter);
        },
        setupPanels: function() {

            var spacersList = this._components.uiSpacer.getSpacersList(true);
            var spacersObject = this._components.uiSpacer.spacerObjects;

            // main panels
            this._panels.spacerPanel  = new panelSpacer(  'fibo_panel_selected', 'spacer selected', spacersList );
            this._panels.offsetPanel  = new panelOffset(  'fibo_panel_offset',   'offset group'   );
            this._panels.groupPanel   = new panelGroup(   'fibo_panel_groups',   'spacer groups'  );
            this._panels.storagePanel = new panelStorage( 'fibo_panel_storage',  'local storage'  );
            this._panels.inputPanel   = new panelInput(   'fibo_panel_input',    'input string'   );
            this._panels.spritePanel  = new panelSprite(  'fibo_panel_sprites',  'loaded sprites' );
            this._panels.fontsPanel   = new panelFonts(   'fibo_panel_fonts',    'used fonts'     );

            this.addPanel(this._panels.spacerPanel);
            this.addPanel(this._panels.offsetPanel);
            this.addPanel(this._panels.groupPanel);
            this.addPanel(this._panels.storagePanel);
            this.addPanel(this._panels.inputPanel);
            this.addPanel(this._panels.spritePanel);
            this.addPanel(this._panels.fontsPanel);

            // extra panels
            this._panels.togglesPanel = new panelToggles( 'fibo_extrapanel_toggles' );
            this._panels.selectPanel  = new panelSelect(  'fibo_extrapanel_select', spacersList, spacersObject );

            this.addPanelTo(this._panels.togglesPanel, this.$toggles);
            this.addPanel(this._panels.selectPanel);
        },

        initEvents: function() {

            // keyboard shortcuts
            $('body')
                .off('.fibos_keys')
                .on('keydown.fibos_keys',keyHandler.bind(this));

            // drag GUI
            this.$title
                .off('.fibos_title')
                .on('mousedown.fibos_title',dragHandler.bind(this));

            // panelToggles
            this._panels.togglesPanel.on('toggle_fibos',  function(){
                var isHidden = this.$controls.hasClass('hidden');
                if(isHidden)
                    this.$controls.removeClass('hidden').css({left:0,top:0});
                else
                    this.$controls.addClass('hidden').css({left:this.$controls.width()*-1,top:0});

                var showClonable = !this.$controls.hasClass('hidden') && this._panels.togglesPanel.getStateOf('spacers');
                this._panels.selectPanel.toggleCloneDisplay(showClonable);
            }.bind(this));

            this._panels.togglesPanel.on('toggle_overlay',function(data){
                toggleElement(this.$background,data);
            }.bind(this));

            this._panels.togglesPanel.on('toggle_spacers',function(data){
                toggleElement(this._components.uiSpacer,data);
                var showClonable = !this.$controls.hasClass('hidden') && data;
                this._panels.selectPanel.toggleCloneDisplay(showClonable);
            }.bind(this));

            this._panels.togglesPanel.on('toggle_rulers', function(data){
                toggleElement(this._components.uiRuler,data);
            }.bind(this));

            this._panels.togglesPanel.on('toggle_markers', function(data){
                toggleElement(this._components.uiMarker,data);
            }.bind(this));

            // panelSelect
            this._panels.selectPanel.on('clone_spacer', function(data){
                var cpos = this.$controls.offset();
                data.mzero.top += cpos.top;
                data.mzero.left += cpos.left;
                return this._components.uiSpacer.dragAddNewSpacer(data.spacer,data.mzero,data.pos);
            }.bind(this));

            // panelGroups
            this._panels.groupPanel.on('group_select', function(data){
                this._components.uiSpacer.selectGroup(data);
                this._panels.offsetPanel.selectGroup(data);
                this._panels.spacerPanel.disable();
            }.bind(this));

            this._panels.groupPanel.on('group_list_open', function(){
                this.openPanel('groupPanel');
            }.bind(this));

            // panelStorage
            this._panels.storagePanel.on('history_restore', function(){
                var stJson = this._components.uiSpacer.getLocalStorage(true);
                this._panels.groupPanel.showGroupsList(stJson);
            }.bind(this));

            this._panels.storagePanel.on('history_save', function(){
                this._components.uiSpacer.setLocalStorage();
                alert('spacers saved');
                this.openPanel('groupPanel');
            }.bind(this));

            // panelInput
            this._panels.inputPanel.on('input_import', function(data){
                this._components.uiSpacer.loadSpacersFromJson(data,true);
                var stJson = JSON.stringify(this._components.uiSpacer.spacersGroups);
                this._panels.groupPanel.showGroupsList(stJson);
            }.bind(this));

            this._panels.inputPanel.on('input_export', function(){
                var stJson = JSON.stringify(this._components.uiSpacer.spacersGroups);
                this._panels.inputPanel.setJson(stJson);
                console.log(stJson);
            }.bind(this));

            // panelSprite
            this._panels.spritePanel.on('sprites_analyze', function(){
                this._components.uiSpriter.analyze();
            }.bind(this));

            this._panels.spritePanel.on('sprites_toggle', function(data){
                this._components.uiSpriter.toggleSprite(data);
            }.bind(this));

            // panelFonts
            this._panels.fontsPanel.on('fonts_analyze', function(){
                var fonts = this._components.uiMarker.analyzeFonts();
                this._panels.fontsPanel.analyzed(fonts);
            }.bind(this));

            this._panels.fontsPanel.on('font_toggle', function(data){
                data || (data={family:null,size:null});
                this._components.uiMarker.highlightAllFonts(data.family,data.size);
            }.bind(this));

        },

        addWidget: function(widget) {
            widget.appendTo(this.$el);
        },
        addPanel: function(panel) {
            this.addPanelTo(panel,this.$panels);
        },
        addPanelTo: function(panel,$elem) {
            $elem.append(panel.$el);
            panel.addTo(this);
            this.addStyle(panel.getStyles());

            panel.on('toggle_panel', function(data){
                var p = data.target;
                var t = data.toggle;
                t ? this.openPanel(p) : this.closePanel(p);
            }.bind(this));
        },

        addStyle: function(styles) {
            $.extend(true,this._styles,styles);
        },

        openPanel: function(panelOrName) {
            var panel = panelOrName instanceof UIBasePanel ? panelOrName : this._panels[panelOrName];
            if(panel && !panel.isOpen()){
                this.closeAllPanels();
                panel.open();
            }
        },
        closePanel: function(panelOrName) {
            var panel = panelOrName instanceof UIBasePanel ? panelOrName : this._panels[panelOrName];
            if(panel && panel.isOpen()){
                panel.close();
            }
        },
        closeAllPanels: function() {
            for(var p in this._panels) if(this._panels.hasOwnProperty(p)) this._panels[p].close(true);
        },

        /*---------------------------------------------- FIBOS PANELS AND COMPONENTS ---*/

        callbacks: {
            uiMarker : {
                highlightCheck : function(){
                    return this._panels.togglesPanel.getStateOf('markers');
                },
                fontinfoCheck : function(){
                    return this._panels.togglesPanel.getStateOf('markers');
                }
            },
            uiSpacer : {
                moveCallback: function(moved){
                    this._panels.spacerPanel.moveCallback(moved);
                },
                newGroupAdded: function(groupName){
                    this._panels.groupPanel.newGroupAdded(groupName)
                },
                selectCallback: function(spacer,$target){
                    if(spacer)
                        this._panels.spacerPanel.enable();
                    else if($target && $target.closest('#'+this._ID).length==0)
                        this._panels.spacerPanel.disable();
                }
            },
            uiSpriter : {
                didAnalyze: function(info){
                    this._panels.spritePanel.didAnalyze(info);
                }
            }
        },

        /*---------------------------------------------- FACTORY METHODS ---*/

        factory: {

            components: {
                uiMarker : function(id,opt){
                    opt || (opt={});
                    opt.reference = this._reference;
                    opt.checkShowLines = false;
                    opt.checkUseMarker = this.callbacks.uiMarker.highlightCheck.bind(this);
                    opt.checkUseFont = this.callbacks.uiMarker.fontinfoCheck.bind(this);
                    opt.excluded = '#'+this._ID;
                    opt.markerLine = getImage('marker_line');
                    return new uiMarker( id, opt );
                },
                uiRuler : function(id,opt){
                    opt || (opt={});
                    opt.reference = this._reference;
                    return new uiRuler( id, opt );
                },
                uiSpacer : function(id,opt){
                    opt || (opt={});
                    opt.reference = this._reference;
                    opt.moveCallback = this.callbacks.uiSpacer.moveCallback.bind(this);
                    opt.groupCallback = this.callbacks.uiSpacer.newGroupAdded.bind(this);
                    opt.selectCallback = this.callbacks.uiSpacer.selectCallback.bind(this);
                    return new uiSpacer( id, opt );
                },
                uiSpriter : function(id,opt){
                    opt || (opt={});
                    opt.reference = this._reference;
                    opt.extension = {obscurers_container:{top:'auto',left:'auto',margin:'0 auto'}};
                    opt.callback = this.callbacks.uiSpriter.didAnalyze.bind(this);
                    opt.visible = false;
                    opt.image = getImage('alpha_pattern');
                    return new uiSpriter( id, opt );
                }
            },

            styles: function() {
                var img_sprite = getImage('sprite_fibos') || '';

                var result = {};

                var main = {
                    main:
                        {position:'absolute',top:'0',left:'0','font-family':'Arial','font-size':'12px','text-align':'left',color:'#222','user-select':'none','-webkit-touch-callout':'none'}
                };

                var reset = {
                    'input[type=checkbox]':
                        {margin:'3px'},
                    select:
                        {margin:'0'}
                };

                var elements = {
                    // COMMON INPUTS
                    '.fib-text,.fib-textarea':
                        {color:'#222',overflow:'hidden',background:'transparent',border:'1px solid #777',padding:'3px','font-size':'10px','border-radius':'3px','box-shadow':'0 1px #eee','box-sizing':'content-box'},

                    // SELECTS
                    '.fib-select':
                        {'background-color':'rgba(255, 255, 255, 0.3)',border:'1px solid #666','border-radius':'3px','box-shadow':'none','box-sizing':'content-box','font-size':'12px',padding:'0 3px','text-align':'center'},

                    // LISTS
                    '.fib-list':
                        {'list-style':'none outside none',margin:'5px 0',padding:'0'},
                    '.fib-list label':
                        {color:'#222','font-size':'12px'},

                    // INPUTS (text)
                    '.fib-text':
                        {height:'auto',margin:'0'},
                    '.fib-text-small':
                        {display:'inline-block',width:'30px'},
                    '.fib-text-full':
                        {display:'block',width:'92%',margin:'2px auto'},

                    // TEXTAREAS
                    '.fib-textarea':
                        {display:'block',height:'55px',margin:'2px auto 5px',resize:'none',width:'92%'},

                    // BUTTONS
                    '.fib-button':
                        {background:'url("'+img_sprite+'") repeat-x scroll 0 0 transparent',border:'1px solid #777','border-radius':'3px',padding:'2px 5px 1px',margin:'2px 3px 2px 2px','font-size':'9px','font-weight':'700','text-transform':'uppercase'},
                    '.fib-button:hover,.fib-button:focus':
                        {border:'1px solid #eee'},

                    // RADIOS
                    '.fib-radio':
                        {width:'12px',height:'12px'},
                    '.fib-radio + span':
                        {'vertical-align':'bottom'},

                    // CHECKBOXES
                    '.fib-checkbox':
                        {border:'0 none',clip:'rect(0px, 0px, 0px, 0px)',height:'1px',margin:'-1px',overflow:'hidden',padding:'0',position:'absolute',width:'1px'},
                    '.fib-checkbox + label':
                        {background:'url("'+img_sprite+'") no-repeat scroll 0 0 transparent',display:'block','font-size':'14px','padding-left':'16px',width:'0',margin:'2px'},
                    '.fib-checkbox-circle + label':
                        {'background-position':'-1px -73px'},
                    '.fib-checkbox-circle:checked + label':
                        {'background-position':'-1px -56px'},
                    '.fib-checkbox-arrow + label':
                        {'background-position':'-1px -21px',width:'auto',margin:'0'},
                    '.fib-checkbox-arrow:checked + label':
                        {'background-position':'-1px -38px'},

                    // PANELS
                    '.fib-panel':
                        {background:'rgba(200,200,200,.6)','border-top':'1px solid rgba(200,200,200,.8)','border-bottom':'1px solid rgba(100,100,100,.8)','border-radius':'3px',margin:'0',padding:'3px'},
                    '.fib-panel-open':
                        {background:'rgb(200,200,200)'},
                    '.fib-content':
                        {position:'relative'},
                    '.fib-content p':
                        {'font-size':'12px','text-indent':'8px',margin:'3px 0'},
                    '.fib-overlay':
                        {cursor:'not-allowed',background:'rgba(200, 200, 200, .55)',position:'absolute',height:'100%',width:'100%','z-index':'10'},
                    '.fib-overlay span':
                        {background:'rgb(200, 200, 200)',border:'1px solid #c00',color:'#c00','font-size':'14px','font-weight':'800',padding:'5px 8px',position:'relative',display:'inline-block',top:'40%',left:'50%',transform:'translate(-50%, -50%)'}
                };
                var styles = {
                    '#fib_panels':
                        {color:'#222',background:'rgba(100,100,100,0.6)',padding:'5px','border-radius':'0 0 5px 5px'},
                    '#fib_panels > h1':
                        {'font-size':'18px',margin:'0 0 5px 5px',padding:'0',color:'#222','line-height':'1em',cursor:'move'},
                    '#fib_panels > h1 > small':
                        {'font-size':'10px','font-weight':'400','margin-left':'3px'},

                    '#fib_background':
                        {background:'rgba(0,0,0,0.5)',width:'100%',height:'100%',position:'fixed'},

                    '#fib_controls':
                        {position:'fixed','min-width':'180px'},
                    '#fib_controls.hidden':
                        {display:'block',visibility:'visible'}
                };

                var transitions = {
                    '.fib-panel': {transition: 'background-color 0.3s ease-in-out 0s'}
                };

                var none_rule = {display:'none'};
                var initialDisplay = {
                    '#fib_background': none_rule,
                    '#fibos_rulers': none_rule,
                    '#fibos_spriter': none_rule,
                    '.fib-content': none_rule
                };
                initialDisplay[this._panels.offsetPanel._selectors.multi_p] = none_rule;

                var zIndexes = {
                    main: {'z-index':'9999'},
                    '#fib_background': {'z-index':'0'},
                    '#fibos_marker'  : {'z-index':'1'},
                    '#fibos_spacers' : {'z-index':'2'},
                    '#fibos_rulers'  : {'z-index':'3'},
                    '#fibos_spriter' : {'z-index':'4'},
                    '#fib_controls'  : {'z-index':'10'}
                };
                zIndexes[this._panels.offsetPanel._selectors.multi_box] = {'z-index':'5'};

                var prefixes = {};
                $.extend(true,prefixes,
                    prefixExtend.call(main     , 'user-select'   , 'main'),
                    prefixExtend.call(elements , 'border-radius' , '.fib-button'),
                    prefixExtend.call(elements , 'border-radius' , '.fib-select'),
                    prefixExtend.call(elements , 'border-radius' , '.fib-text,.fib-textarea'),
                    prefixExtend.call(elements , 'box-sizing'    , '.fib-select'),
                    prefixExtend.call(elements , 'box-sizing'    , '.fib-text,.fib-textarea'),
                    prefixExtend.call(elements , 'box-shadow'    , '.fib-select'),
                    prefixExtend.call(elements , 'box-shadow'    , '.fib-text,.fib-textarea')
                );

                $.extend(true,result,main,reset,elements,styles,transitions,initialDisplay,zIndexes,prefixes,this._styles);

                return result;
            }

        }

    };

    /********************
     * PRIVATE METHODS
     ********************/

    function prefixExtend(rule,from){
        var ob = {};
        ob[from] = css3prefix.call(this,rule,from);
        return ob;
    }
    function css3prefix(rule,from){
        var val = this[from][rule],
            ob = {};
        ob['-webkit-'+rule] = val;
        //ob['-khtml-'+rule] = val;
        ob['-moz-'+rule] = val;
        //ob['-ms-'+rule] = val;
        return ob;
    }

    function getImage(name){
        if(images && (images[name] || images[name]===''))
            return 'data:image/png;base64,'+images[name];
        else
            return null;
    }

    function checkJqueryVersion(jqueryMinVersion,callback){
        if (typeof jQuery != 'undefined') {
            var current_vers = jqueryMinVersion;
            var c_maj = Number(current_vers.split('.')[0]);
            var c_min = Number(current_vers.split('.')[1]);

            var jquery_vers = jQuery.fn.jquery;
            var j_maj = Number(jquery_vers.split('.')[0]);
            var j_min = Number(jquery_vers.split('.')[1]);

            var shouldLoadNewstJquery = false;
            if(j_maj<c_maj) shouldLoadNewstJquery = true;
            else if(j_min<c_min) shouldLoadNewstJquery = true;

            if(shouldLoadNewstJquery){
                alert('FibOS needs jQuery 1.7.2\nWe will load it for you.');
                $.getScript('http://code.jquery.com/jquery-1.7.2.min.js',callback);
            }
            else callback();
        }
    }

    function keyHandler(e){
        var key = e.keyCode;
        var mod = e.ctrlKey?'c': e.shiftKey?'s': e.altKey?'a': '';
        switch(key){
            case 68:// letter D
                mod==='a' && this._panels.spacerPanel.duplicateSpacer();
                break;
            case 88:// letter X
                mod==='a' && this._panels.spacerPanel.deleteSpacer();
                break;
        }
    }

    function dragHandler(e){
        var cpos = this.$controls.offset();
        var dpos = {top:$(document).scrollTop(), left:$(document).scrollLeft()};
        var zero = {top:e.pageY-(cpos.top-dpos.top), left:e.pageX-(cpos.left-dpos.left)};
        $('body').off('.fibos_drag')
            .on('mousemove.fibos_drag',draggingHandler.bind(this,zero))
            .on('mouseup.fibos_drag',function(e){$('body').off('.fibos_drag');return false;});
        return false;
    }
    function draggingHandler(zero,e){
        var pos = {top: e.pageY-zero.top, left: e.pageX-zero.left};
        this.$controls.css(pos);
        return false;
    }

    function toggleElement($e,toggle){
        if($e.show && $e.hide) $e[toggle ? 'show' : 'hide']();
    }

    return FibOS;

}(jQuery, images,
   UIMarkerWidget, UIRulerWidget, UISpacerWidget, UISpriterWidget,
   UISpacerPanel, UIOffsetPanel, UIGroupPanel, UIStoragePanel, UIInputPanel, UISpritePanel, UIFontsPanel, UISelectPanel, UITogglesPanel));
