/**
 * Created by fdimonte on 10/02/2015.
 */

var FibOS = (function(
   $,
   uiMarker, uiRuler, uiSlider, uiSpacer, uiSpriter,
   panelSpacer, panelOffset, panelGroup, panelStorage, panelInput, panelSprite, panelSelect, panelToggles
) {

    function FibOS(reference,options){

        var jqueryMinVersion = '1.7';

        this._ID='fibos';
        this._fibosTitle='FibOS';
        this._logEvents = options.logEvents || false;
        delete options.logEvents;

        this._reference = ($(reference).length===0) ? 'body' : reference;

        this._componentsOptions = options || {};
        this._components = {};
        this._panels = {};

        this.$el = null;
        this.$toggles = null;
        this.$panels = null;

        this.init(jqueryMinVersion);

    }

    FibOS.prototype = {

        getImage : function(name){
            if(images && images[name])
                return 'data:image/png;base64,'+images[name];
            else
                return null;
        },

        init: function(jqMinVer) {
            checkJqueryVersion(jqMinVer,function(){
                this.createStyles();
                this.createElement();
                this.initEvents();
            }.bind(this));
        },

        createStyles: function() {
            $('#'+this._ID+'-styles').remove();

            var $styles = $('<style/>').attr('id',this._ID+'-styles');
            var styleObj = this.factory.styles.call(this);

            var s,selector;
            for(s in styleObj){
                if(styleObj.hasOwnProperty(s)){
                    selector = '#'+this._ID;
                    if(s!='main') selector += ' '+s;

                    $styles.append(selector + ' {'+UIBaseWidget.prototype.styleObjectToString(styleObj[s])+'}');
                }
            }

            $('head').append($styles);
        },
        createElement: function() {
            $('#'+this._ID).remove();

            var $fibo_title  = $('<h1/>').text(this._fibosTitle);

            this.$el         = $('<div/>').attr('id',this._ID);
            this.$background = $('<div/>').attr('id','fibo_bg');
            this.$controls   = $('<div/>').attr('id','fibo_controls');
            this.$toggles    = $('<div/>').attr('id','fibo_toggles');
            this.$panels     = $('<div/>').attr('id','fibo_panels').append($fibo_title);

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
            this._components.uiRuler   = this.factory.components.uiRuler.call(   this, 'fibos_ruler',   this._componentsOptions['uiRuler']   );
            //this._components.uiSlider  = this.factory.components.uiSlider.call(  this, 'fibos_slider',  this._componentsOptions['uiSlider']  );
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

            this.addPanel(this._panels.spacerPanel);
            this.addPanel(this._panels.offsetPanel);
            this.addPanel(this._panels.groupPanel);
            this.addPanel(this._panels.storagePanel);
            this.addPanel(this._panels.inputPanel);
            this.addPanel(this._panels.spritePanel);

            // extra panels
            this._panels.togglesPanel = new panelToggles( 'fibo_extrapanel_toggles' );
            this._panels.selectPanel = new panelSelect( 'fibo_extrapanel_select', spacersList, spacersObject );

            this.addPanelTo(this._panels.togglesPanel, this.$toggles);
            this.addPanel(this._panels.selectPanel);
        },

        initEvents: function() {

            // panelToggles
            this._panels.togglesPanel.on('toggle_fibos',  function(){
                var isHidden = this.$controls.hasClass('hidden');
                if(isHidden){
                    this.$controls.removeClass('hidden').css('left','0px');
                }else{
                    this.$controls.addClass('hidden').css('left',(this.$controls.width()*-1)+'px');
                }
                this._panels.selectPanel.toggleCloneDisplay(isHidden);
            }.bind(this));
            this._panels.togglesPanel.on('toggle_overlay',function(data){
                var w = this.$background;
                data ? w.show() : w.hide();
            }.bind(this));
            this._panels.togglesPanel.on('toggle_spacers',function(data){
                var w = this._components.uiSpacer;
                data ? w.show() : w.hide();
            }.bind(this));
            this._panels.togglesPanel.on('toggle_rulers', function(data){
                var w = this._components.uiRuler;
                data ? w.show() : w.hide();
            }.bind(this));
            this._panels.togglesPanel.on('toggle_markers', function(data){
                var w = this._components.uiMarker;
                data ? w.show() : w.hide();
                this._components.uiMarker.toggleListener(data);
            }.bind(this));

            // panelSelect
            this._panels.selectPanel.on('clone_select', function(data,event){});
            this._panels.selectPanel.on('clone_spacer', function(data){
                fiboClone.call(this,data.pos,data.spacer,data.$clone);
            }.bind(this));

            // panelSpacer
            this._panels.spacerPanel.on('spacer_changed', function(data,event){});
            this._panels.spacerPanel.on('spacer_offset', function(data,event){});
            this._panels.spacerPanel.on('spacer_delete', function(data,event){});
            this._panels.spacerPanel.on('spacer_duplicate', function(data,event){});

            // panelGroups
            this._panels.groupPanel.on('group_remove', function(data,event){});
            this._panels.groupPanel.on('group_rename', function(data,event){});
            this._panels.groupPanel.on('group_select', function(data){
                data && this._components.uiSpacer.newUsedGroup(data);
                this._panels.offsetPanel.selectGroup(data);
                this._components.uiSpacer.updateGroups();
            }.bind(this));
            this._panels.groupPanel.on('group_list_open', function(){
                this.openPanel('groupPanel');
            }.bind(this));

            // panelOffset
            this._panels.offsetPanel.on('group_offset_apply', function(data,event){});
            this._panels.offsetPanel.on('group_offset_save', function(data,event){});
            this._panels.offsetPanel.on('group_toggle_multiple', function(data,event){});

            // panelStorage
            this._panels.storagePanel.on('history_restore', function(){
                var stJson = this._components.uiSpacer.getLocalStorage(true);
                this._panels.groupPanel.showGroupsList(stJson);
            }.bind(this));
            this._panels.storagePanel.on('history_save', function(){
                this._components.uiSpacer.setLocalStorage();
            }.bind(this));

            // panelInput
            this._panels.inputPanel.on('input_import', function(data){
                this._components.uiSpacer.loadSpacersFromJson(data,true);
                var stJson = JSON.stringify(this._components.uiSpacer.spacersGroups.groups);
                this._panels.groupPanel.showGroupsList(stJson);
            }.bind(this));
            this._panels.inputPanel.on('input_export', function(){
                var stJson = JSON.stringify(this._components.uiSpacer.spacersGroups.groups);
                console.log(stJson);
                alert("Open your browser's console and see the export string.");
            }.bind(this));

            // panelSprite
            this._panels.spritePanel.on('sprites_analyze', function(){
                this._components.uiSpriter.analyze();
            }.bind(this));
            this._panels.spritePanel.on('sprites_toggle', function(data){
                this._components.uiSpriter.toggleSprite(data);
            }.bind(this));

        },

        addWidget: function(widget) {
            this.$el.append(widget.$el);
        },
        addPanel: function(panel) {
            this.$panels.append(panel.$el);
            panel.addTo(this);
            //this.addStyle(panel.getStyles());
        },
        addPanelTo: function(panel,$elem) {
            $elem.append(panel.$el);
            panel.addTo(this);
        },

        addStyle: function(styles) {},

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
            for(var p in this._panels) if(this._panels.hasOwnProperty(p)) this._panels[p].close();
        },

        /*---------------------------------------------- FIBOS PANELS AND COMPONENTS ---*/

        callbacks: {
            uiMarker : {
                highlightCheck : function(){
                    return $('#fibo_toggle_markers').find('.fibo_checkbox').is(':checked');
                },
                fontinfoCheck : function(){
                    return $('#fibo_toggle_markers').find('.fibo_checkbox').is(':checked');
                }
            },
            uiRuler : {},
            uiSlider : {},
            uiSpacer : {
                moveCallback: function(moved){
                    this._panels.spacerPanel.moveCallback(moved);
                },
                newGroupAdded: function(groupName){
                    this._panels.groupPanel.newGroupAdded(groupName)
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
                    opt.checkUseMarker = this.callbacks.uiMarker.highlightCheck.bind(this);
                    opt.checkUseFont = this.callbacks.uiMarker.fontinfoCheck.bind(this);
                    opt.excluded = '#'+this._ID;
                    return new uiMarker( id, opt );
                },
                uiRuler : function(id,opt){
                    opt || (opt={});
                    opt.reference = this._reference;
                    return new uiRuler( id, opt );
                },
                uiSlider : function(id,opt){
                    opt || (opt={});
                    opt.extension = {slider_handler:{background:'rgba(200,100,100,.6)'}};
                    return new uiSlider( id, opt );
                },
                uiSpacer : function(id,opt){
                    opt || (opt={});
                    opt.reference = this._reference;
                    opt.moveCallback = this.callbacks.uiSpacer.moveCallback.bind(this);
                    opt.groupCallback = this.callbacks.uiSpacer.newGroupAdded.bind(this);
                    return new uiSpacer( id, opt );
                },
                uiSpriter : function(id,opt){
                    opt || (opt={});
                    opt.extension = {obscurers_container:{top:'auto',left:'auto',margin:'0 auto'}};
                    opt.reference = this._reference;
                    opt.callback = this.callbacks.uiSpriter.didAnalyze.bind(this);
                    opt.visible = false;
                    opt.image = this.getImage('alpha_pattern');
                    return new uiSpriter( id, opt );
                }
            },

            styles: function() {
                var img_sprite = this.getImage('sprite_fibos');
                var styleObject = {

                    main:
                        {position:'absolute',top:'0',left:'0','font-family':'Arial','text-align':'left',color:'#222','user-select':'none'},

                    '#fibo_panels > h1':
                        {'font-size':'18px',margin:'0 0 5px 5px',padding:'0'},
                    '#fibo_panels > h1 > small':
                        {'font-size':'10px','font-weight':'400'},

                    // control panel
                    '#fibo_bg':
                        {background:'rgba(0,0,0,0.5)',width:'100%',height:'100%',position:'fixed'},
                    '#fibo_controls':
                        {position:'fixed','min-width':'180px'},
                    '.fibo_toggle':
                        {background:'rgba(100,100,100,.4)','border-top':'1px solid #fff',height:'21px',position:'absolute',right:'-21px',width:'21px'},

                    // showhide panel
                    '#fibo_toggle_main':
                        {background:'rgba(100,100,100,0.4)',height:'34px',position:'absolute',right:'-13px',width:'13px',cursor:'pointer'},
                    '#fibo_toggle_main:hover':
                        {background:'rgba(100,100,100,1)'},
                    '#fibo_toggle_main:after':
                        {content:'"«"',left:'2px',top:'5px',position:'absolute',color:'#fff'},
                    '#fibo_controls.hidden #fibo_toggle_main:after':
                        {content:'"»"'},

                    // external checkbox containers
                    '#fibo_toggle_spacers': {top:'34px'},
                    '#fibo_toggle_overlay': {top:'55px'},
                    '#fibo_toggle_rulers': {top:'76px'},
                    '#fibo_toggle_markers': {top:'97px'},

                    // checkboxes
                    '.fibo_checkbox':
                        {border:'0 none',clip:'rect(0px, 0px, 0px, 0px)',height:'1px',margin:'-1px',overflow:'hidden',padding:'0',position:'absolute',width:'1px'},
                    '.fibo_checkbox + label':
                        {background:'url("'+img_sprite+'") no-repeat scroll -1px -73px transparent',display:'block','font-size':'14px','padding-left':'16px',width:'0',margin:'2px'},
                    '.fibo_checkbox:checked + label':
                        {'background-position':'-1px -56px'},
                    '#fibo_panels .fibo_checkbox + label':
                        {'background-position':'-1px -21px',width:'auto',margin:'0'},
                    '#fibo_panels .fibo_checkbox:checked + label':
                        {'background-position':'-1px -38px'},
                    '#fibo_panels .fibo_radio':
                        {width:'12px',height:'12px'},

                    // fibo form
                    '#fibo_panels':
                        {color:'#222',background:'rgba(100,100,100,0.6)',padding:'5px'},
                    '#fibo_panels>div':
                        {background:'rgba(200,200,200,.6)','border-top':'1px solid rgba(200,200,200,.8)','border-bottom':'1px solid rgba(100,100,100,.8)',margin:'0',padding:'3px'},
                    '#fibo_panels>div.fibo_panel_open':
                        {background:'rgb(200,200,200)'},
                    '#fibo_clone_select':
                        {display:'block','margin-left':'2px'},
                    '#fibo_clone_element':
                        {position:'absolute',padding:'8px','margin-top':'9px',left:'0'},

                    // fibo panel - INPUT
                    '#fibo_input_text':
                        {display:'block',height:'55px',margin:'2px auto 5px',resize:'none',width:'92%'},
                    // fibo panel - SELECTED
                    '#fibo_panel_selected p':
                        {'font-size':'12px','text-indent':'8px',margin:'3px 0'},
                    '#fibo_sel_left, #fibo_sel_top':
                        {display:'inline-block',width:'50px',height:'auto'},
                    '#fibo_sel_slider_container':
                        {margin:'3px 0 6px 8px'},
                    // fibo panel - OFFSET
                    '#fibo_panel_offset p':
                        {'font-size':'12px','text-indent':'8px',margin:'3px 0'},
                    '#fibo_grp_sel_left, #fibo_grp_sel_top':
                        {display:'inline-block',width:'50px',height:'auto'},
                    '#fibo_grp_sel_multiple':
                        {'margin-left':'0'},
                    '#fibo_grp_sel_multiple_box':
                        {position:'absolute',border:'1px solid #777','background-color':'rgba(100,100,100,.5)'},
                    // fibo panel - GROUPS
                    '#fibo_panel_groups p':
                        {'font-size':'12px','text-indent':'8px',margin:'3px 0'},
                    '#fibo_group_name':
                        {display:'block',width:'160px',height:'auto'},
                    // fibo panel - SPRITES
                    '#fibo_sprites_bg':
                        {position:'fixed',width:'100%',height:'100%','z-index':'-1',background:'#000',opacity:'0.5'},
                    '#sprites_tree':
                        {'list-style':'none outside none',margin:'5px 0',padding:'0'},
                    '#sprites_tree li label':
                        {'font-size':'12px'},
                    '#groups_tree':
                        {'list-style':'none outside none',margin:'5px 0',padding:'0'},
                    '#groups_tree li label':
                        {'font-size':'12px'},

                    // common input styles
                    '#fibo_input_text,#fibo_sel_left,#fibo_sel_top,#fibo_group_name,#fibo_grp_sel_left,#fibo_grp_sel_top':
                        {overflow:'hidden',background:'transparent',border:'1px solid #777','font-size':'10px'},

                    // venere ui styles
                    '.vui-btn':
                        {background:'url("'+img_sprite+'") repeat-x scroll 0 0 transparent',border:'1px solid #777',padding:'2px 5px 1px',margin:'2px','font-size':'9px','font-weight':'700','text-transform':'uppercase'},
                    '.vui-btn:hover,.vui-btn:focus':
                        {border:'1px solid #eee'},
                    '.vui-label': {},
                    '.vui-content': {}
                };

                var initialDisplay = {
                    '#fibo_bg': {display:'none'},
                    '#fibos_ruler': {display:'none'},
                    '#fibos_spriter': {display:'none'},
                    '#fibo_sel_spacer_multiple_p':{display:'none'},
                    '.vui-content': {display:'none'}
                };

                var zIndexes = {
                    main: {'z-index':'9999'},
                    '#fibo_bg': {'z-index':'0'},
                    '#fibos_marker': {'z-index':'1'},
                    '#fibos_spacers': {'z-index':'2'},
                    '#fibos_ruler': {'z-index':'3'},
                    '#fibos_spriter': {'z-index':'4'},
                    '#fibo_grp_sel_multiple_box': {'z-index':'5'},
                    '#fibo_controls': {'z-index':'10'}
                };

                var prefixes = {
                    main: {'-webkit-touch-callout':'none','-webkit-user-select':'none','-khtml-user-select':'none','-moz-user-select':'none','-ms-user-select':'none'}
                };

                $.extend(true,styleObject,initialDisplay,zIndexes,prefixes);

                return styleObject;
            }

        }

    };

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

    function fiboClone(e,spacer,$clone){
        var spacernum = parseInt(this._components.uiSpacer.getSpacerType(spacer));
        var newspacer = this._components.uiSpacer.addNewSpacer(spacernum);
        if(!newspacer) return true;

        var mzero = {top:newspacer.position().top-e.pageY,left:newspacer.position().left-e.pageX};
        mzero.top  += $(document).scrollTop()  + $clone.position().top + parseInt($clone.css('padding-top')) + parseInt($clone.css('margin-top'));
        mzero.left += $(document).scrollLeft() + $clone.position().left + parseInt($clone.css('padding-left'));

        newspacer.offset({top:parseInt(e.pageY+mzero.top), left:parseInt(e.pageX+mzero.left)});
        this._components.uiSpacer.setMouseZero(mzero);
        this._components.uiSpacer.dragSpacer(newspacer);

        return false;
    }

    return FibOS;

}(jQuery,
   UIMarkerWidget, UIRulerWidget, UISliderWidget, UISpacerWidget, UISpriterWidget,
   UISpacerPanel, UIOffsetPanel, UIGroupPanel, UIStoragePanel, UIInputPanel, UISpritePanel, UISelectPanel, UITogglesPanel));
