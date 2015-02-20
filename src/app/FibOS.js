/**
 * Created by fdimonte on 10/02/2015.
 *
 * To add a new component: (search 'uiWidget' in this file as example or 'EXAMPLE.N' where N are the following numbers)
 *
 *  1. give extra options in FibOS instantiation process
 *  2. add the component name into this._components object
 *  3. add all communication methods into this.helpers object
 *  4. add initializer process into this.factory.components
 *  5. instantiate the component inside this.factory.fibos method
 *  6. if needed, add a new panel (or implement an existing one) inside this.factory.form.allPanels method
 */

var FibOS = (function(uiMarker,uiRuler,uiSlider,uiSpacer,uiSpriter){

    var images = {
        fibos_sprite : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAABaCAYAAAC1xQZWAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAV/QAAFf0BzXBRYQAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAAVdEVYdENyZWF0aW9uIFRpbWUAMzAvNy8xMyVy0IgAAALQSURBVFiF7ZXPaxNREMe/T6qQwKZBo5JUL7uLBbcQjyaB9lgstbdsQU8B/4GmR/XoH9BTSVtoL5aAhkAixh5LAxaSXiQg1N2ctCWxP9K0JAQk4yEttLv7jG1WKWUH3mWG+fDezHznsWKxSLDB+vb39+3goK/dbl8yEJEtJXKe5oDsAV3hrl3hp9kFYnbV6JotFAfUO0iSJJIkyc8YA2Os5xttiaLo7+lG54Gdp0ZbdoECdoAC5XJ5u1dQVwjgiNYBOaD/BerjBSRJ4opQ13XT3v3Tje5x/ANWTi6oXC7/sIAFwNmU3DVy8muIojgA4DuAgK7r3L3k7CMHdDVBJvWfSIOIxgGEANwCQAD2AKwDyFqSiOjMOfa9SiQSKUVRKqIokiiKpChKdXFx8RMRvTbmEJEZRERPFxYWsicA45mbm0sT0bgxz0q0b4aGhl40m807Vi9wuVw/S6XSPICXp/1WxfbxIADQbDZvA7hp9P/T9u+4XK4qL8Htdu+g08GuoPV4PF7kgeLxeAHAZ6Pfao6yRPSo3W7/mpmZCTcaDR/QKfLU1NR6LBYrAPhgyjN2zTCQj9EZSADYRWcgTRBL0EXt8onWAXU37mJTVXVZ07Sxer3uYYxBEIQDSZJyGxsbzwBA1/WzeVYDGQqFtlqtljA6Ovo1FottMsYwOzv7MJvNBn0+X7VSqfiNINNiU1V1WVGUVj6ff0dEidNndXX1fTAYbKiqumzMM9VI07SxiYmJL5FIxKTw4eHh3ZGRkU1N054YYyZQrVbrn56eLllWFEA0GtUODw/7u4IAoFqt3uCB6vX6dSu/CeT1emtLS0uDPFA6nZYFQTjoCpJlOZfJZIIrKyt3jbFkMnl/bW1tUJblnDHGa//20dGRNxwOa9Fo9BsRsVQqJefz+QeCIOxZtZ+72CYnJ98eD2Q/AHg8ngNZlj8WCoXnwF8M5EXt8onWNtBv0kKv/nwGlC8AAAAASUVORK5CYII=',
        alpha_image  : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAA3NCSVQICAjb4U/gAAAACXBIWXMAABX9AAAV/QHNcFFhAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABV0RVh0Q3JlYXRpb24gVGltZQAzMC83LzEzJXLQiAAAACpJREFUKJFj/P//PwM28ODBA6ziTFhF8YBRDcQAFlzhraCgQB0bRjUQAwCn8Qi/9sh3kAAAAABJRU5ErkJggg=='
    };

    function FibOS(reference,options){

        var jqueryMinVersion = '1.7';

        this._ID='fibos';
        this._fibosID='fibos_form';
        this._fibosTitle='FibOS';
        this._fibosVersion='1.7.2';

        this._reference = ($(reference).length===0) ? 'body' : reference;

        this._componentsOptions = options || {};
        this._components = {
            //uiWidget : null, // EXAMPLE.2
            uiMarker  : null,
            uiRuler   : null,
            uiSlider  : null,
            uiSpacer  : null,
            uiSpriter : null
        };

        this._spacerSelected = null;
        this._groupSelected = null;

        this.initializer.init.call(this,jqueryMinVersion);

    }

    FibOS.prototype = {

        main: {
            getImage : function(name){
                if(!extraComponents || !extraComponents.images[name])
                    return '';
                else
                    return extraComponents.basePath+extraComponents.images[name];
            },

            checkJqueryVersion : function(jqueryMinVersion,callback){
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
        },

        /*---------------------------------------------- INIT AND EVENTS ---*/

        initializer: {
            init : function(jqMinVer){
                this.main.checkJqueryVersion(jqMinVer,function(){
                    $('#'+this._ID).remove();
                    $('#'+this._ID+'_styles').remove();
                    $('head').append(this.factory.styles.call(this));
                    $('body').append(this.factory.fibos.call(this));
                    this.initializer.initialStates();
                    this.initializer.initEvents();
                }.bind(this));
            },
            initialStates: function() {
                $('#fibo_showhide_selected').show();
                $('#fibo_showhide_offset').show();
                $('#fibo_showhide_groups').show();
                $('#fibo_showhide_storage').show();
                $('#fibo_showhide_input').show();
                $('#fibo_showhide_sprites').show();
            },
            initEvents: function() {

            }
        },

        eventHandlers: {

        },

        /*---------------------------------------------- FIBOS PANELS AND COMPONENTS ---*/

        panelsManager: {
            openPanel : function($p){
                this.panelsManager.closeAll();
                $p.find('.vui-label').find('.fibo_checkbox').attr('checked',true);
                $p.find('.vui-content').slideDown();
                $p.addClass('fibo_panel_open');
            },
            closePanel : function($p){
                $p.find('.vui-label').find('.fibo_checkbox').attr('checked',false);
                $p.find('.vui-content').slideUp();
                $p.removeClass('fibo_panel_open');
            },
            closeAll : function(){
                $('.vui-label').find('.fibo_checkbox').attr('checked',false);
                $('.vui-content').slideUp();
                $('.fibo_panel_open').removeClass('fibo_panel_open');
            }
        },

        groupSelected: {

        },

        history: {
            save : function(){
                this._components.uiSpacer.setLocalStorage();
            },
            restore : function(){
                var stJson = this._components.uiSpacer.getLocalStorage(true);
                this.helpers.uiSpacer.showGroupsList(stJson);
            },
            importJson : function(){
                this._components.uiSpacer.loadSpacersFromJson($('#fibo_input').val(),true);
                var stJson = JSON.stringify(this._components.uiSpacer.spacersGroups.groups);
                this.helpers.uiSpacer.showGroupsList(stJson);
            },
            exportJson : function(){
                var stJson = JSON.stringify(this._components.uiSpacer.spacersGroups.groups);
                console.log(stJson);
                alert("Open your browser's console and see the export string.");
            }
        },

        helpers: {
            /* // EXAMPLE.3
            uiWidget : {
              myMethod: function(){}
            },
            */
            uiMarker : {
                callback : function(checked){
                    this._components.uiMarker.preventDefaults(checked);
                },
                highlightCheck : function(){
                    return $('#fibo_showhide_markers').find('.fibo_checkbox').is(':checked');
                },
                fontinfoCheck : function(){
                    return $('#fibo_showhide_markers').find('.fibo_checkbox').is(':checked');
                }
            },
            uiRuler : {},
            uiSlider : {},
            uiSpacer : {
                moveCallback: function(){},
                newGroupAdded: function(){}
            },
            uiSpriter : {
                didAnalyze: function(){}
            }
        },

        /*---------------------------------------------- FACTORY METHODS ---*/

        factory: {

            components: {
                // EXAMPLE.4
                /*
                uiWidget : function(id,opt){
                    opt || (opt={});
                    opt.customOption = 'newValue';
                    return new uiWidget( id, opt );
                },
                */
                uiMarker : function(id,opt){
                    opt || (opt={});
                    opt.checkUseMarker = this.helpers.uiMarker.highlightCheck.bind(this);
                    opt.checkUseFont = this.helpers.uiMarker.fontinfoCheck.bind(this);
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
                    opt.moveCallback = this.helpers.uiSpacer.moveCallback.bind(this);
                    opt.groupCallback = this.helpers.uiSpacer.newGroupAdded.bind(this);
                    return new uiSpacer( id, opt );
                },
                uiSpriter : function(id,opt){
                    opt || (opt={});
                    opt.extension = {obscurerContainer:{top:'auto',left:'auto',margin:'0 auto'}};
                    opt.reference = this._reference;
                    opt.callback = this.helpers.uiSpriter.didAnalyze.bind(this);
                    opt.visible = false;
                    opt.image = this.main.getImage('alpha');
                    return new uiSpriter( id, opt );
                }
            },

            fibos: function() {
                //this._components.uiWidget = this.factory.components.uiWidget.call( this, 'ID', this._componentOptions['uiWidget'] ); // EXAMPLE.5
                this._components.uiMarker  = this.factory.components.uiMarker.call(  this, 'fibos_marker',  this._componentsOptions['uiMarker']  );
                this._components.uiRuler   = this.factory.components.uiRuler.call(   this, 'fibos_ruler',   this._componentsOptions['uiRuler']   );
                this._components.uiSlider  = this.factory.components.uiSlider.call(  this, 'fibos_slider',  this._componentsOptions['uiSlider']  );
                this._components.uiSpacer  = this.factory.components.uiSpacer.call(  this, 'fibos_spacers', this._componentsOptions['uiSpacer']  );
                this._components.uiSpriter = this.factory.components.uiSpriter.call( this, 'fibos_spriter', this._componentsOptions['uiSpriter'] );

                this.$el = $('<div/>').attr('id', this._ID);
                var fibos_background = $('<div/>').attr('id', 'fibo_bg');
                var fibos_controls   = $('<div/>').attr('id', 'fibo_controls');
                var fibos_showhide   = $('<div/>').attr('id', 'fibo_showhide');
                var fibos_clonable   = $('<div/>').attr('id', 'fibo_clonable');

                fibos_controls.append(fibos_showhide);
                fibos_controls.append(this.factory.form.allPanels.call(this));
                fibos_controls.append(fibos_clonable);

                this.$el.append(fibos_background);
                this.$el.append(fibos_controls);

                this.$el.append(this._components.uiSpacer.$el);
                this.$el.append(this._components.uiMarker.$el);
                this.$el.append(this._components.uiRuler.$el);
                this.$el.append(this._components.uiSpriter.$el);

                return this.$el;
            },

            styles: function() {
                return $('<style/>').attr('id',this._ID+'_styles');
            },

            form: {
                fiboSelect : function(id,skipFirst) {
                    var fibonacciSpacersList = this._components.uiSpacer.getinfo.spacersList(true);
                    if(!id)id='fibo_select';
                    var fiboselect = [];
                    fiboselect.push('<select id="'+id+'">');
                    if(!skipFirst)
                        fiboselect.push('<option value="none" disabled="disabled" selected="selected">chose a spacer</option>');
                    for(var f=0;f<fibonacciSpacersList.length;f++)
                        fiboselect.push('<option value="'+('00'+fibonacciSpacersList[f]).substr(-3)+'">'+fibonacciSpacersList[f]+'</option>');
                    fiboselect.push('</select>');

                    return fiboselect.join('');
                },
                panelCheckbox : function(cid,title,checked) {
                    var labid = cid+'_checkbox';
                    var $container = $('<div/>').attr('id',cid).addClass('fibo_toggle');
                    var $checkbox = $('<input/>').attr('id',labid).addClass('fibo_checkbox').attr('type','checkbox').attr('checked',checked);
                    var $label = $('<label/>').attr('for',labid).attr('title',title).html('&nbsp;');
                    return $container.append($checkbox).append($label).prop('outerHTML');
                },
                panelModule : function(label,mid,content) {
                    var labid = mid+'_checkbox';

                    var $module  = $('<div/>').attr('id',mid),
                        $label   = $('<div/>').addClass('vui-label'),
                        $content = $('<div/>').addClass('vui-content');

                    $label.append($('<input/>').attr('id',labid).addClass('fibo_checkbox').attr('type','checkbox'));
                    $label.append($('<label/>').attr('for',labid).html(label));

                    $content.append(content);

                    return $module.append($label).append($content).prop('outerHTML');
                },
                allPanels: function() {
                    var fiboform = [];

                    //external checkboxes
                    fiboform.push(this.factory.form.panelCheckbox('fibo_showhide_spacers','toggle spacers',true));
                    fiboform.push(this.factory.form.panelCheckbox('fibo_showhide_overlay','toggle overlay',false));
                    fiboform.push(this.factory.form.panelCheckbox('fibo_showhide_rulers','toggle rulers',false));
                    fiboform.push(this.factory.form.panelCheckbox('fibo_showhide_markers','toggle marker tool',false));

                    //fibo_form BEGINS
                    fiboform.push('<div id="'+this._fibosID+'">');
                    fiboform.push('<h1>'+this._fibosTitle+' <small>'+this._fibosVersion+'</small></h1>');

                    //spacer selected
                    var mod_spacerSel = [];
                    mod_spacerSel.push('<p>spacer: '+this.factory.form.fiboSelect('fibo_sel_spacer',true)+'</p>');
                    mod_spacerSel.push('<p>left: <input type="text" id="fibo_sel_left"/></p>');
                    mod_spacerSel.push('<p>top: <input type="text" id="fibo_sel_top"/></p>');
                    mod_spacerSel.push('<p>opacity: </p><div id="fibo_sel_slider_container"/>');
                    mod_spacerSel.push('<input type="button" class="vui-btn" id="fibo_sel_delete" value="remove"/>');
                    mod_spacerSel.push('<input type="button" class="vui-btn" id="fibo_sel_duplicate" value="duplicate"/>');
                    fiboform.push(this.factory.form.panelModule('spacer selected','fibo_showhide_selected',mod_spacerSel.join('')));

                    //offset group
                    var mod_offsetGrp = [];
                    mod_offsetGrp.push('<p>group: <span id="fibo_grp_sel"></span></p>');
                    mod_offsetGrp.push('<p>offset top: <input type="text" id="fibo_grp_sel_top"/></p>');
                    mod_offsetGrp.push('<p>offset left: <input type="text" id="fibo_grp_sel_left"/></p>');
                    mod_offsetGrp.push('<p id="fibo_grp_sel_multiple_p">spacers: <span>0</span></p>');
                    mod_offsetGrp.push('<p><input type="checkbox" id="fibo_grp_sel_multiple"/> select inner group </p>');
                    fiboform.push(this.factory.form.panelModule('offset group','fibo_showhide_offset',mod_offsetGrp.join('')));

                    //spacer groups
                    var mod_spacerGrp = [];
                    mod_spacerGrp.push('<ul id="groups_tree"/>');
                    //TODO: implement merging methods!! (version 1.7.3)
                    //mod_spacerGrp.push('<input type="button" class="vui-btn" id="fibo_group_merge_start" value="merge"/>');
                    //mod_spacerGrp.push('<input type="button" class="vui-btn" id="fibo_group_merge_end" value="do it!"/>');
                    mod_spacerGrp.push('<p>name: <input type="text" id="fibo_group_name"/></p>');
                    mod_spacerGrp.push('<input type="button" class="vui-btn" id="fibo_group_rename" value="rename"/>');
                    mod_spacerGrp.push('<input type="button" class="vui-btn" id="fibo_group_delete" value="delete"/>');
                    fiboform.push(this.factory.form.panelModule('spacer groups','fibo_showhide_groups',mod_spacerGrp.join('')));

                    //local storage
                    var mod_historyMan = [];
                    mod_historyMan.push('<input type="button" class="vui-btn" id="fibo_restore" value="restore"/>');
                    mod_historyMan.push('<input type="button" class="vui-btn" id="fibo_save" value="save"/>');
                    fiboform.push(this.factory.form.panelModule('local storage','fibo_showhide_storage',mod_historyMan.join('')));

                    //input string
                    var mod_inputString = [];
                    mod_inputString.push('<textarea id="fibo_input"/>');
                    mod_inputString.push('<input type="button" class="vui-btn" id="fibo_load" value="import"/>');
                    mod_inputString.push('<input type="button" class="vui-btn" id="fibo_export" value="export"/>');
                    fiboform.push(this.panelModule('input string','fibo_showhide_input',mod_inputString.join('')));

                    //loaded sprites
                    var mod_spritePix = [];
                    mod_spritePix.push('<ul id="sprites_tree"/>');
                    mod_spritePix.push('<input type="button" class="vui-btn" id="fibo_sprites_analyze" value="analyze"/>');
                    fiboform.push(this.factory.form.panelModule('loaded sprites','fibo_showhide_sprites',mod_spritePix.join('')));

                    /* EXAMPLE.6
                    //new custom panel
                    var mod_uiWidget = [];
                    mod_uiWidget.push('<p>testing</p>');
                    fiboform.push(this.factory.form.panelModule('panel title', 'panel_ID', mod_uiWidget.join('')));
                    */

                    //spacers dropdown
                    fiboform.push('<div>' + this.factory.form.fiboSelect() + '</div>');

                    //fibo_form ENDS
                    fiboform.push('</div>');

                    return fiboform.join('');
                }
            }

        }

    };

    return FibOS;

}(UIMarkerWidget,UIRulerWidget,UISliderWidget,UISpacerWidget,UISpriterWidget));
