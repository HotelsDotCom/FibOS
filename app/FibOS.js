/* 
 * FibOS GUI
 * 
 * @author  Venere UIE Team
 * @date    May 2013
 */


var fibosComponents = {
   
   //base path for all FibOS resources
   basePath : 'https://raw.githubusercontent.com/VenereDotCom/FibOS/master/',
   
   //components to be loaded before init
   list : {
      uie_spacer  : {url:'components/uieSpacer.js'  , opt:{}},
      uie_slider  : {url:'components/uieSlider.js'  , opt:{}},
      uie_ruler   : {url:'components/uieRuler.js'   , opt:{}},
      uie_marker  : {url:'components/uieMarker.js'  , opt:{}},
      uie_spriter : {url:'components/uieSpriter.js' , opt:{}}
   },
   
   //images for FibOS UI
   images : {
      sprite : 'app/img/sprite_fibo.png',
      alpha  : 'app/img/alpha_pattern.png'
   }
};

function FibOS(reference,basePathOrExtraComponents,extraOptions) {
   
   // Venere main container's ID
   reference || (reference='#themewrapper');
   if($(reference).length===0) reference = 'body';
   
   /*---------------------------------------------- GLOBAL VARIABLES ---*/
   var fibosID='fibonacci',fibosTitle='FibOS',fibosVersion='1.7.2';
   var selected,selectedGroup=[];
   var uieSpacerManager,uieRulerManager,uieMarkerManager,uieSpriteManager;
   var uieSliderSpacer,uieSliderBackground;
   var componentsOptions = {};
   var jqueryMinVersion = '1.7';
   
   /*---------------------------------------------- ENTER POINT ---*/
   var main = {
      getImage : function(name){
         if(!extraComponents || !extraComponents.images[name])
            return '';
         else
            return extraComponents.basePath+extraComponents.images[name];
      },
      getModules : function(modules){
         var modulesLoaded=0;
         var tot=0;
         for(var c in modules.list){
            $.getScript(modules.basePath+modules.list[c].url,gotModule(c,modules.list[c].opt))
            tot++;
         }
         if(tot===0)initializer.init();
         
         function gotModule(mod,opt){
            return function(){
               console.log('LOADED: '+mod);
               componentsOptions[mod] = opt;
               if(++modulesLoaded===tot) initializer.init();
            };
         }
      },
      extendObject : function(obj,ext){
         for(var p in ext){
            if(obj[p] && (obj[p] instanceof Object) && !(obj[p] instanceof Array)) this.extendObject(obj[p],ext[p]);
            else obj[p]=ext[p];
         }
      },
      checkJqueryVersion : function(callback){
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
   };
   
   // default extra components
   var extraComponents;
   switch(typeof(basePathOrExtraComponents)){
      case 'string':
         fibosComponents.basePath = basePathOrExtraComponents;
         extraComponents = fibosComponents;
         break;
      case 'object':
         extraComponents = basePathOrExtraComponents;
         break;
   }
   
   (function(){
      main.extendObject(extraComponents.list,extraOptions);
      if(!extraComponents) initializer.init();
      else main.getModules(extraComponents);
   })();
   
   /*---------------------------------------------- INIT AND EVENTS ---*/
   var initializer = {
      init : function(){
         main.checkJqueryVersion(function(){
            $('#'+fibosID).remove();
            $('#fibo_styles').remove();
            $('head').append(factory.styles());
            $('body').append(factory.fibos());
            initializer.initialStates();
            initializer.initEvents();
         });
      },
      initialStates : function(){
         $('#fibo_showhide_selected').show();
         $('#fibo_showhide_offset').show();
         $('#fibo_showhide_groups').show();
         $('#fibo_showhide_storage').show();
         $('#fibo_showhide_input').show();
         $('#fibo_showhide_sprites').show();
      },
      initEvents : function(){
         //control panel
         $('#fibo_showhide').click(eventHandlers.fiboControlsToggle);
         $('#fibo_showhide_overlay').find('.fibo_checkbox').change(eventHandlers.checkbox_handler_for('#fibo_bg'));
         $('#fibo_showhide_spacers').find('.fibo_checkbox').change(eventHandlers.checkbox_handler_for('#fibo_container'));
         $('#fibo_showhide_rulers').find('.fibo_checkbox').change(eventHandlers.checkbox_handler_for('#fibo_rulers'));
         $('#fibo_showhide_markers').find('.fibo_checkbox').change(eventHandlers.checkbox_handler_for('#fibo_markers',components.marker.callback));

         $('#fibo_showhide_input').find('.fibo_checkbox').change(eventHandlers.togglePanelCallback);
         $('#fibo_showhide_selected').find('.fibo_checkbox').change(eventHandlers.togglePanelCallback);
         $('#fibo_showhide_offset').find('.fibo_checkbox').change(eventHandlers.togglePanelCallback);
         $('#fibo_showhide_groups').find('.fibo_checkbox').change(eventHandlers.togglePanelCallback);
         $('#fibo_showhide_sprites').find('.fibo_checkbox').change(eventHandlers.togglePanelCallback);
         $('#fibo_showhide_storage').find('.fibo_checkbox').change(eventHandlers.togglePanelCallback);

         $('#fibo_select').on('change keyup',eventHandlers.changeSpacerSel);
         $('#fibo_clonable').on('mousedown','.fibospacer',eventHandlers.fiboClone);

         //history
         $('#fibo_restore').click(history.restore);
         $('#fibo_save').click(history.save);
         $('#fibo_load').click(history.import);
         $('#fibo_export').click(history.export);

         //groups helpers
         $('#fibo_grp_sel_left,#fibo_grp_sel_top')
            .on('keydown',eventHandlers.changeGroupPos)
            .on('blur',groupSelected.saveOffset);
         $('#fibo_grp_sel_multiple').on('change',groupSelected.toggleMultiSpacer);

         //helpers
         $('#fibo_sel_left,#fibo_sel_top')
            .on('keydown',eventHandlers.changeSpacerPos);
         $('#fibo_sel_spacer').on('change',spacerSelected.applyInfo);
         $('#fibo_sel_delete').click(spacerSelected.deleteSpacer);
         $('#fibo_sel_duplicate').click(spacerSelected.duplicateSpacer);

         //spriter
         $('#fibo_sprites_analyze').click(components.spriter.analyze);
         $('#sprites_tree').on('change','input',components.spriter.showhideSprites);

         //groups
         $('#fibo_group_delete').click(components.spacer.removeGroup);
         $('#fibo_group_rename').click(components.spacer.renameGroup);
         $('#groups_tree').on('change','input',components.spacer.showhideGroups);

         //keyboard events
         $('body').off('.keyhelp')
                   .on('keydown.keyhelp',eventHandlers.key_handler);

         //text marker
         if(uieMarkerManager){
            uieMarkerManager.initEvents();
         }

         //resize
         eventHandlers.windowSizeEvent();
         $(window).off('.windowsize')
                   .on('resize.windowsize',eventHandlers.windowSizeEvent);
      }
   };
   
   var eventHandlers = {
      
      //handler for window resize event
      windowSizeEvent : function(){
         var width = $(window).width();
         var height = $(window).height();
         $('#fibo_sprites')
            .width(width)
            .height(height);
      },
      
      //handler for key events
      key_handler : function(e){
         var mod = e.ctrlKey?'c':e.shiftKey?'s':e.altKey?'a':'';
         var key = e.keyCode;
         switch(key){
            case 68:// letter D
               if(mod==='a')
                  spacerSelected.duplicateSpacer();
               break;
            case 88:// letter X
               if(mod==='a')
                  spacerSelected.deleteSpacer();
               break;
         }
      },
      
      //generic handler for checkboxes
      checkbox_handler_for : function(id,cb){
         return function(e){
            var ischeck = $(e.currentTarget).is(':checked');
            ischeck ? $(id).show() : $(id).hide();
            if(cb) cb(ischeck);
         };
      },
      
      //handler for inner panel checkboxes (panel sections)
      togglePanelCallback : function(e){
         var $t = $(e.currentTarget);
         if($t.is(':checked'))
            panelsManager.openPanel($t.parent().parent());
         else
            panelsManager.closePanel($t.parent().parent());
      },
      
      //handler for key event in 'spacer selected' panel
      changeSpacerPos : function(e){
         var offset = e.shiftKey?10:e.altKey?0.5:1;
         var val = Number($(this).val());
         if(selected) $(this).val(val+(e.keyCode===38?offset:e.keyCode===40?-offset:0));
         spacerSelected.applyInfo();
      },

      changeGroupPos : function(e){
         var offset = e.shiftKey?10:e.altKey?0.5:1;
         var val = Number($(this).val());
         $(this).val(val+(e.keyCode===38?offset:e.keyCode===40?-offset:0));
         groupSelected.applyInfo(e);
      },
      
      //handler for spacer dropdown
      changeSpacerSel : function(e){
         var fiboSpacer = (uieSpacerManager.getinfo.spacers())['f_'+$(this).val()];
         $('#fibo_clonable').html(fiboSpacer);
      },
      
      //spacer cloning event
      fiboClone : function(e){
         var spacernum = parseInt(uieSpacerManager.getinfo.spacerType(e.target));
         var newspacer = uieSpacerManager.manager.addSpacer(spacernum);
         if(!newspacer) return true;

         var mzero = {top:newspacer.position().top-e.pageY,left:newspacer.position().left-e.pageX};
         mzero.top  += $(document).scrollTop()  + $('#fibo_clonable').position().top + Number($('#fibo_clonable').css('padding-top').replace('px',''));
         mzero.left += $(document).scrollLeft() + $('#fibo_clonable').position().left + Number($('#fibo_clonable').css('padding-left').replace('px',''));

         newspacer.offset({top:parseInt(e.pageY+mzero.top), left:parseInt(e.pageX+mzero.left)});
         uieSpacerManager.manager.setMouseZero(mzero).dragSpacer(newspacer);

         return false;
      },
      
      //control panel show/hide
      fiboControlsToggle : function(){
         if($('#fibo_controls').hasClass('hided')){
            $('#fibo_controls').removeClass('hided').css('left','0px');
            $('#fibo_clonable').show();
         }else{
            $('#fibo_controls').addClass('hided').css('left',($('#fibo_controls').width()*-1)+'px');
            $('#fibo_clonable').hide();
         }
      }
   };
   
   /*---------------------------------------------- FIBOS PANELS AND COMPONENTS ---*/
   var panelsManager = {
      openPanel : function($p){
         this.closeAll();
         $p.find('.vui-label .fibo_checkbox').attr('checked',true);
         $p.find('.vui-content').slideDown();
         $p.addClass('fibo_panel_open');
      },
      closePanel : function($p){
         $p.find('.vui-label .fibo_checkbox').attr('checked',false);
         $p.find('.vui-content').slideUp();
         $p.removeClass('fibo_panel_open');
      },
      closeAll : function(){
         $('.vui-label .fibo_checkbox').attr('checked',false);
         $('.vui-content').slideUp();
         $('.fibo_panel_open').removeClass('fibo_panel_open');
      }
   };

   var groupSelected = {
      applyInfo : function(e){
         var offset = {
            top: $('#fibo_grp_sel_top').val(),
            left: $('#fibo_grp_sel_left').val()
         };
         if(selectedGroup.length>0){
            uieSpacerManager.manager.offsetCustom(selectedGroup,offset);
            $(e.currentTarget).val('0');
         }else{
            uieSpacerManager.manager.offsetGroup(offset);
         }
      },
      selectGroup : function(groupName){
         groupName || (groupName='');
         $('#fibo_grp_sel').text(groupName);
         $('#fibo_grp_sel_multiple_p').find('span').text($('#'+groupName).find('div').length);
      },
      saveOffset : function(e){
         var offset = {
            top: $('#fibo_grp_sel_top').val(),
            left: $('#fibo_grp_sel_left').val()
         };
         uieSpacerManager.manager.applyOffset(offset);
         $(e.currentTarget).val('0');
      },
      toggleMultiSpacer : function(){
         var zero = {top:0,left:0};
         var groupSelecting;

         function selectStart(e){
            var $this = $(e.target);
            if($this.parents('#'+fibosID).length>0 || $this.is('#'+fibosID)) return true;

            groupSelecting = true;
            e.preventDefault();
            zero = {top:e.pageY, left:e.pageX};
            $('#fibo_grp_sel_multiple_box').remove();
            $('<div id="fibo_grp_sel_multiple_box"/>').appendTo('body');
         }
         function selectMulti(e){
            if(!groupSelecting) return true;

            var toX,toY;
            var pos = zero;
            var pX = e.pageX;
            var pY = e.pageY;
            if(pX<zero.left){
               pos.left = pX;
               toX = zero.left;
            }else{
               toX = pX;
            }
            if(pY<zero.top){
               pos.top = pY;
               toY = zero.top;
            }else{
               toY = pY;
            }
            var w = toX - pos.left;
            var h = toY - pos.top;

            $('#fibo_grp_sel_multiple_box')
               .offset(pos)
               .width(w)
               .height(h);
         }
         function selectEnd(e){
            if(!groupSelecting) return true;
            groupSelecting = false;

            var mbox = $('#fibo_grp_sel_multiple_box');
            var mboxOffset = mbox.offset();
            var box = {
               left: mboxOffset.left,
               top: mboxOffset.top,
               width: mbox.width(),
               height: mbox.height()
            };
            mbox.remove();

            selectedGroup = findSpacersInsideBox(box);
            $('#fibo_grp_sel_multiple_p').find('span').text(selectedGroup.length);
         }
         function findSpacersInsideBox(box){
            box || (box={top:0,left:0,width:0,height:0});
            var selectedSpacers = [];
            var spacerslist = $('#'+$('#fibo_grp_sel').text()).find('div');
            var singlespacer,singleoffset,isInside;

            spacerslist.each(function(i,e){
               singlespacer = $(this);
               singleoffset = singlespacer.offset();
               isInside = (
                  singleoffset.left >= box.left &&
                  singleoffset.top  >= box.top &&
                  singleoffset.left+singlespacer.width() <= box.left+box.width &&
                  singleoffset.top+singlespacer.height() <= box.top+box.height
               );
               if (isInside) selectedSpacers.push(singlespacer);
            });

            return selectedSpacers;
         }

         selectedGroup = [];
         if($(this).is(':checked')){
            $('#fibo_grp_sel_multiple_p').find('span').text(0);
            $('body')
               .css('cursor','crosshair')
               .on('mousedown.multiselect',selectStart)
               .on('mousemove.multiselect',selectMulti)
               .on('mouseup.multiselect',selectEnd);
         }else{
            $('#fibo_grp_sel_multiple_p').find('span').text($('#'+uieSpacerManager.getinfo.groupName()).find('div').length);
            $('body')
               .css('cursor','inherit')
               .off('.multiselect');
         }
      }
   };

   var spacerSelected = {
      updateInfo : function(){
         var attr = spacerSelected.getInfo();
         $('#fibo_sel_spacer').val(attr.f);
         $('#fibo_sel_left').val(attr.l);
         $('#fibo_sel_top').val(attr.t);
         uieSliderSpacer.setValue(Number(attr.o)*100);
      },
      applyInfo : function(){
         var attr = spacerSelected.getInfo();
         if(selected){
            $(selected)
               .removeClass('fs_'+attr.f)
               .addClass('fs_'+$('#fibo_sel_spacer').val())
               .css('left',$('#fibo_sel_left').val()+'px')
               .css('top',$('#fibo_sel_top').val()+'px');
         }
      },
      getInfo : function(){
         var attr = {f:'',t:'',l:'',o:''};
         if(selected){
            attr.f = (uieSpacerManager.getinfo.spacerType(selected));
            attr.t = ($(selected).css('top').replace('px',''));
            attr.l = ($(selected).css('left').replace('px',''));
            attr.o = ($(selected).css('opacity'));
         }
         return attr;
      },
      setOpacity : function(perc,value){
         if(selected)
            $(selected).css('opacity',value/100);
      },
      deleteSpacer : function(){
         if(selected)
            $(selected).remove();
      },
      duplicateSpacer : function(){
         if(selected)
            $(selected).parent().append($(selected).clone()).focus();
      }
   };
   
   var history = {
      save : function(){
         uieSpacerManager.storage.save();
      },
      restore : function(){
         var stJson = uieSpacerManager.storage.restore(true);
         components.spacer.showGroupsList(stJson);
      },
      import : function(){
         uieSpacerManager.storage.load($('#fibo_input').val(),true);
         var stJson = uieSpacerManager.getinfo.spacersJson();
         components.spacer.showGroupsList(stJson);
      },
      export : function(){
         var stJson = uieSpacerManager.getinfo.spacersJson();
         console.log(stJson);
         alert("Open your browser's console and see the export string.");
      }
   };
   
   var components = {
      marker : {
         callback : function(checked){
            uieMarkerManager.preventDefaults(checked);
         },
         highlightCheck : function(){
            return $('#fibo_showhide_markers .fibo_checkbox').is(':checked');
         },
         fontinfoCheck : function(){
            return $('#fibo_showhide_markers .fibo_checkbox').is(':checked');
         }
      },
      ruler : {},
      slider : {},
      spacer : {
         moveCallback : function(moved){
            selected = moved;
            spacerSelected.updateInfo();
         },
         newGroupAdded : function(groupName){
            var $tree = $('#groups_tree');
            if($tree.find('li').length===0)
               $tree.append('<li><label><input type="radio" name="groups" class="fibo_radio" id="hide_groups"/>none</label></li>');
            $tree.append('<li><label><input type="radio" name="groups" class="fibo_radio" id="showhide_group_'+groupName+'" checked/><span>'+groupName+'</span></label></li>');
            components.spacer.showhideGroups({currentTarget:$('#showhide_group_'+groupName)});
         },
         removeGroup : function(){
            if($('#groups_tree li').length===0) return false;
            if($('#groups_tree li input:checked').attr('id')==='hide_groups') return false;

            var oldID = $('#groups_tree li input:checked').attr('id');
            var oldName = oldID.replace('showhide_group_','');
            $('#groups_tree li input').attr('checked',false);
            $('#hide_groups').attr('checked',true);

            $('#'+oldName).remove();
            $('#'+oldID).closest('li').remove();
            components.spacer.showhideGroups({currentTarget:$('#hide_groups')});
            uieSpacerManager.manager.updateGroups();
         },
         renameGroup : function(){
            if($('#groups_tree li').length===0) return false;
            if($('#groups_tree li input:checked').attr('id')==='hide_groups') return false;

            var oldID = $('#groups_tree li input:checked').attr('id');
            var oldName = oldID.replace('showhide_group_','');
            var newName = $('#fibo_group_name').val();
            if(newName.indexOf(' ')>-1){
               alert('group name cannot contain spaces');
               return false;
            }
            var newID = 'showhide_group_'+newName;
            uieSpacerManager.manager.updateGroups();
            if(uieSpacerManager.manager.renameGroup(oldName,newName)){
               $('#'+oldID).closest('li').remove();
               $('#groups_tree li input:checked').attr('id',newID).next().text(newName);
            }else{
               alert('cannot rename group');
            }
         },
         groupsLoaded : function(info_arr){
            var $checked = $('#groups_tree li input:checked');
            var oldcheck = $checked.length>0 ? $checked.attr('id').replace('showhide_group_','') : false;
            if(oldcheck==='hide_groups') oldcheck=false;
            var $tree = $('#groups_tree').empty();
            $tree.append('<li><label><input type="radio" name="groups" class="fibo_radio" id="hide_groups"'+(oldcheck?'':' checked')+'/>none</label></li>');

            var i,name;
            for(i in info_arr){
               name = info_arr[i];
               $tree.append('<li><label><input type="radio" name="groups" class="fibo_radio" id="showhide_group_'+name+'"'+(oldcheck===name?' checked':'')+'/><span>'+name+'</span></label></li>');
            }

            $tree.show();
            if($checked.length>0) components.spacer.showhideGroups({currentTarget:$checked});
            panelsManager.openPanel($('#fibo_showhide_groups'));
         },
         showhideGroups : function(e){
            var group,gid = $(e.currentTarget).attr('id');
            $('.spacers_group').hide();
            $('#fibo_group_name').val('');
            if(gid=='hide_groups'){
               uieSpacerManager.manager.newUsedGroup();
               groupSelected.selectGroup();
            }else{
               group = gid.replace('showhide_group_','');
               $('#'+group).show();
               $('#fibo_group_name').val(group);
               uieSpacerManager.manager.newUsedGroup(group);
               groupSelected.selectGroup(group);
            }
            uieSpacerManager.manager.updateGroups();
         },
         showGroupsList : function(stJson){
            var spacers_obj = JSON.parse(stJson);
            var selectors = [];
            for(var s in spacers_obj){
               selectors.push(s);
            }
            components.spacer.groupsLoaded(selectors);
         }
      },
      spriter : {
         analyze : function(){
            $('#fibo_sprites_analyze').hide();
            uieSpriteManager.analyze();
         },
         didAnalyze : function(info){
            var $tree = $('#sprites_tree').empty();
            $tree.append('<li><label><input type="radio" name="sprites" class="fibo_radio" id="hide_sprites" checked/>none</label></li>');

            var name,file,fid;
            for(name in info){
               file = uieSpriteManager.css2file(name);
               fid = uieSpriteManager.css2file(name,true);
               $tree.append('<li><label><input type="radio" name="sprites" class="fibo_radio" id="showhide_sprite_'+fid+'"/><span>'+file+'</span></label></li>');
            }

            $tree.show();
            if($('#fibo_sprites_bg').length===0)
               $('.obscurers_container').parent().prepend('<div id="fibo_sprites_bg" style="display:none;"/>');
         },
         showhideSprites : function(e){
            var sprite,$cont;
            var sid = $(e.currentTarget).attr('id');
            $('#fibo_sprites').hide();
            $('#fibo_sprites_bg').show();
            $('.obscurers_container').hide();
            if(sid!=='hide_sprites'){
               sprite = sid.replace('showhide_sprite_','');
               $cont = $('.obscurers_container#'+sprite);
               $cont.show();
               $('#fibo_sprites').show();
            }
         }
      }
   };
   
   /*---------------------------------------------- FACTORY METHODS ---*/
   var factory = {
      fibos : function(){
         var fibo_main       = $('<div id="'+fibosID+'"/>');
         var fibo_background = $('<div id="fibo_bg"/>');
         var fibo_controls   = $('<div id="fibo_controls"/>');
         var fibo_showhide   = $('<div id="fibo_showhide"/>');
         var fibo_clonable   = $('<div id="fibo_clonable"/>');

         uieSpacerManager = factory.components.fibos_spacer('fibo_container',componentsOptions['uie_spacer']);
         uieMarkerManager = factory.components.fibos_marker('fibo_markers',componentsOptions['uie_marker']);
         uieRulerManager = factory.components.fibos_ruler('fibo_rulers',componentsOptions['uie_ruler']);
         uieSpriteManager = factory.components.fibos_spriter('fibo_sprites',componentsOptions['uie_spriter']);

         fibo_controls.append(fibo_showhide);
         fibo_controls.append(factory.form.allPanels());
         fibo_controls.append(fibo_clonable);
         fibo_main.append(fibo_background);
         fibo_main.append(fibo_controls);

         //add additional uie-components:
         fibo_main.append(uieSpacerManager);
         fibo_main.append(uieMarkerManager);
         fibo_main.append(uieRulerManager.appendEvent());
         fibo_main.append(uieSpriteManager);

         //uieSilders
         uieSliderSpacer = factory.components.fibos_slider('fibo_sel_opacity',{minValue:20,stepValue:10,callback:spacerSelected.setOpacity});
         fibo_controls.find('#fibo_sel_slider_container')
            .append(uieSliderSpacer);

         return fibo_main;
      },
      
      styles : function(){
         var img_sprite = main.getImage('sprite');
         var img_alpha = main.getImage('alpha');

         var styles = $('<style id="fibo_styles"/>');
         // Shared fibonacci styles
         $(styles).append('#'+fibosID+' {position:absolute;top:0;left:0;z-index:9999;font-family:Arial;text-align:left;color:#222;}');
         $(styles).append('#'+fibosID+' {-webkit-touch-callout:none;-webkit-user-select:none;-khtml-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;}');
         $(styles).append('#'+fibosID+' #fibo_form>h1 {font-size:18px;margin: 0 0 5px 5px;padding:0;}');
         $(styles).append('#'+fibosID+' #fibo_form>h1>small {font-size:10px;font-weight:400;}');

         // Control panel styles
         $(styles).append('#fibo_bg {background:rgba(0,0,0,0.5);width:100%;height:100%;position:fixed;}');
         $(styles).append('#fibo_controls {position:fixed;min-width:180px;}');
         $(styles).append('.fibo_toggle {background:rgba(100,100,100,.4);border-top:1px solid #FFFFFF;height:21px;position:absolute;right:-21px;width:21px;}');

         // ShowHide Panel
         $(styles).append('#fibo_showhide {background:rgba(100,100,100,0.4);height:34px;position:absolute;right:-13px;width:13px;cursor:pointer;}');
         $(styles).append('#fibo_showhide:hover {background:rgba(100,100,100,1);}');
         $(styles).append('#fibo_showhide:after {content:"«";left:2px;top:5px;position:absolute;color:#fff;}');
         $(styles).append('#fibo_controls.hided #fibo_showhide:after {content:"»";}');

         // External Checkbox Containers
         $(styles).append('#fibo_showhide_spacers {top:34px;}');
         $(styles).append('#fibo_showhide_overlay {top:55px;}');
         $(styles).append('#fibo_showhide_rulers  {top:76px;}');
         $(styles).append('#fibo_showhide_markers {top:97px;}');

         // Checkboxes
         $(styles).append('.fibo_checkbox {border:0 none;clip:rect(0px, 0px, 0px, 0px);height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px;}');
         $(styles).append('.fibo_checkbox + label {display:block;font-size:14px;padding-left:16px;width:0;margin:2px;}');
         $(styles).append('.fibo_checkbox + label {background:url("'+img_sprite+'") no-repeat scroll -1px -73px transparent;}');
         $(styles).append('.fibo_checkbox:checked + label {background-position:-1px -56px;}');
         $(styles).append('#fibo_form .fibo_checkbox + label {background-position:-1px -21px;width:auto;margin:0;}');
         $(styles).append('#fibo_form .fibo_checkbox:checked + label {background-position:-1px -38px;}');
         $(styles).append('#fibo_form .fibo_radio {width:12px;height:12px;}');

         // Fibo Form
         $(styles).append('#fibo_form     {color:#222;background:rgba(100,100,100,0.6);padding:5px;}');
         $(styles).append('#fibo_form>div {background:rgba(200,200,200,.6);border-top:1px solid rgba(200,200,200,.8);border-bottom:1px solid rgba(100,100,100,.8);margin:0;padding:3px;}');
         $(styles).append('#fibo_form>div.fibo_panel_open {background:rgb(200,200,200);}');
         $(styles).append('#fibo_select   {display:block;margin-left:2px;}');
         $(styles).append('#fibo_clonable {padding:8px;}');

         // FiboPanel - INPUT
         $(styles).append('#fibo_input {display:block;height:55px;margin:2px auto 5px;resize:none;width:92%;}');
         // FiboPanel - SELECTED
         $(styles).append('#fibo_showhide_selected p {font-size:12px;text-indent:8px;margin:3px 0;}');
         $(styles).append('#fibo_sel_left,#fibo_sel_top {display:inline-block;width:50px;height:auto;}');
         $(styles).append('#fibo_sel_slider_container {margin:3px 0 6px 8px;}');
         $(styles).append('#fibo_sel_spacer_multiple_p {display:none;}');
         // FiboPanel - OFFSET
         $(styles).append('#fibo_showhide_offset p {font-size:12px;text-indent:8px;margin:3px 0;}');
         $(styles).append('#fibo_grp_sel_left,#fibo_grp_sel_top {display:inline-block;width:50px;height:auto;}');
         $(styles).append('#fibo_grp_sel_multiple {margin-left:0;}');
         $(styles).append('#fibo_grp_sel_multiple_box {position:absolute;border:1px solid #777;background-color:rgba(100,100,100,.5);}');
         // FiboPanel - GROUPS
         $(styles).append('#fibo_showhide_groups p {font-size:12px;text-indent:8px;margin:3px 0;}');
         $(styles).append('#fibo_group_name {display:block;width:160px;height:auto;}');
         // FiboPanel - SPRITES
         $(styles).append('#fibo_sprites_bg {position:fixed;width:100%;height:100%;z-index:-1;background:#000;opacity:0.6;}');
         $(styles).append('#sprites_tree {list-style:none outside none;margin:5px 0;padding:0;}');
         $(styles).append('#sprites_tree li label {font-size:12px;}');
         $(styles).append('#groups_tree {list-style:none outside none;margin:5px 0;padding:0;}');
         $(styles).append('#groups_tree li label {font-size:12px;}');

         // Common input styles
         $(styles).append('#fibo_input,#fibo_sel_left,#fibo_sel_top,#fibo_group_name,#fibo_grp_sel_left,#fibo_grp_sel_top');
         $(styles).append('{overflow:hidden;background:transparent;border:1px solid #777777;font-size:10px;}');

         // Venere UI Styles
         $(styles).append('.vui-btn {background:url("'+img_sprite+'") repeat-x scroll 0 0 transparent;border:1px solid #777;padding:2px 5px 1px;margin:2px;font-size:9px;font-weight:700;text-transform:uppercase;}');
         $(styles).append('.vui-btn:hover,.vui-btn:focus {border:1px solid #eee;}');
         $(styles).append('.vui-label {}');
         $(styles).append('.vui-content {display:none;}');

         // Initial visibility
         $(styles).append('#fibo_bg      {display:none;}');
         $(styles).append('#fibo_rulers  {display:none;}');
         $(styles).append('#fibo_sprites {display:none;}');
         //$(styles).append('#fibo_grp_sel_multiple_p {display:none;}');

         // Z-indexes
         $(styles).append('#fibo_bg        {z-index:0;}');
         $(styles).append('#fibo_markers   {z-index:1;}');
         $(styles).append('#fibo_container {z-index:2;}');
         $(styles).append('#fibo_rulers    {z-index:3;}');
         $(styles).append('#fibo_sprites   {z-index:4;}');
         $(styles).append('#fibo_grp_sel_multiple_box {z-index:5;}')
         $(styles).append('#fibo_controls  {z-index:10;}');

         return styles;
      },
      
      components : {
         fibos_spacer : function(id,options){
            options || (options={});
            options.reference = reference;
            options.moveCallback = components.spacer.moveCallback;
            options.groupCallback = components.spacer.newGroupAdded;
            return new uieSpacer(id,options);
         },
         fibos_slider : function(id,options){
            var ext = {slider_handler:{background:'rgba(200,100,100,.6)'}};
            options || (options={});
            options.extension = ext;
            return new uieSlider(id,options);
         },
         fibos_ruler : function(id,options){
            options || (options={});
            options.reference = reference;
            return new uieRuler(id,options);
         },
         fibos_marker : function(id,options){
            options || (options={});
            options.checkUseMarker = components.marker.highlightCheck;
            options.checkUseFont = components.marker.fontinfoCheck;
            options.excluded = '#'+fibosID;
            return new uieMarker(id,options);
         },
         fibos_spriter : function(id,options){
            options || (options={});
            options.extension = {obscurerContainer:{top:'auto',left:'auto',margin:'0 auto'}};
            options.reference = reference;
            options.callback = components.spriter.didAnalyze;
            options.visible = false;
            options.image = main.getImage('alpha');
            return new uieSpriter(id,options);
         }
      },
      
      form : {
         fiboSelect : function(id,skipFirst){
            var fibonacciSpacersList = uieSpacerManager.getinfo.spacersList(true);
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
         panelCheckbox : function(cid,title,checked){
            var labid = cid+'_checkbox';
            var $container = $('<div id="'+cid+'" class="fibo_toggle"/>');
            var $checkbox = $('<input type="checkbox" class="fibo_checkbox" id="'+labid+'"'+(checked?' checked':'')+'/>');
            var $label = $('<label for="'+labid+'" title="'+title+'">&nbsp;</label>');
            return $container.append($checkbox).append($label).prop('outerHTML');
         },
         panelModule : function(label,mid,content){
            var labid = mid+'_checkbox';
            var $module = $('<div id="'+mid+'"/>');
            var $label = $('<div class="vui-label"/>');
            var $content = $('<div class="vui-content"/>');

            $label.append('<input type="checkbox" class="fibo_checkbox" id="'+labid+'"/>');
            $label.append('<label for="'+labid+'">'+label+'</label>');

            $content.append(content);

            return $module.append($label).append($content).prop('outerHTML');
         },
         allPanels : function(){
            var fiboform = [];
            //external checkboxes
            fiboform.push(this.panelCheckbox('fibo_showhide_spacers','toggle spacers',true));
            fiboform.push(this.panelCheckbox('fibo_showhide_overlay','toggle overlay',false));
            fiboform.push(this.panelCheckbox('fibo_showhide_rulers','toggle rulers',false));
            fiboform.push(this.panelCheckbox('fibo_showhide_markers','toggle marker tool',false));

            //fibo_form
            fiboform.push('<div id="fibo_form">');
            fiboform.push('<h1>'+fibosTitle+' <small>'+fibosVersion+'</small></h1>');

            //selected
            var mod_spacerSel = [];
            mod_spacerSel.push('<p>spacer: '+this.fiboSelect('fibo_sel_spacer',true)+'</p>');
            mod_spacerSel.push('<p>left: <input type="text" id="fibo_sel_left"/></p>');
            mod_spacerSel.push('<p>top: <input type="text" id="fibo_sel_top"/></p>');
            mod_spacerSel.push('<p>opacity: </p><div id="fibo_sel_slider_container"/>');
            mod_spacerSel.push('<input type="button" class="vui-btn" id="fibo_sel_delete" value="remove"/>');
            mod_spacerSel.push('<input type="button" class="vui-btn" id="fibo_sel_duplicate" value="duplicate"/>');
            fiboform.push(this.panelModule('spacer selected','fibo_showhide_selected',mod_spacerSel.join('')));

            //offset
            var mod_offsetGrp = [];
            mod_offsetGrp.push('<p>group: <span id="fibo_grp_sel"></span></p>');
            mod_offsetGrp.push('<p>offset top: <input type="text" id="fibo_grp_sel_top"/></p>');
            mod_offsetGrp.push('<p>offset left: <input type="text" id="fibo_grp_sel_left"/></p>');
            mod_offsetGrp.push('<p id="fibo_grp_sel_multiple_p">spacers: <span>0</span></p>');
            mod_offsetGrp.push('<p><input type="checkbox" id="fibo_grp_sel_multiple"/> select inner group </p>');
            fiboform.push(this.panelModule('offset group','fibo_showhide_offset',mod_offsetGrp.join('')));

            //groups
            var mod_spacerGrp = [];
            mod_spacerGrp.push('<ul id="groups_tree"/>');
            //TODO: implement merging methods!! (version 1.7.3)
//            mod_spacerGrp.push('<input type="button" class="vui-btn" id="fibo_group_merge_start" value="merge"/>');
//            mod_spacerGrp.push('<input type="button" class="vui-btn" id="fibo_group_merge_end" value="do it!"/>');
            mod_spacerGrp.push('<p>name: <input type="text" id="fibo_group_name"/></p>');
            mod_spacerGrp.push('<input type="button" class="vui-btn" id="fibo_group_rename" value="rename"/>');
            mod_spacerGrp.push('<input type="button" class="vui-btn" id="fibo_group_delete" value="delete"/>');
            fiboform.push(this.panelModule('spacer groups','fibo_showhide_groups',mod_spacerGrp.join('')));

            //history
            var mod_historyMan = [];
            mod_historyMan.push('<input type="button" class="vui-btn" id="fibo_restore" value="restore"/>');
            mod_historyMan.push('<input type="button" class="vui-btn" id="fibo_save" value="save"/>');
            fiboform.push(this.panelModule('local storage','fibo_showhide_storage',mod_historyMan.join('')));

            //input
            var mod_inputString = [];
            mod_inputString.push('<textarea id="fibo_input"/>');
            mod_inputString.push('<input type="button" class="vui-btn" id="fibo_load" value="import"/>');
            mod_inputString.push('<input type="button" class="vui-btn" id="fibo_export" value="export"/>');
            fiboform.push(this.panelModule('input string','fibo_showhide_input',mod_inputString.join('')));

            //sprites
            var mod_spritePix = [];
            mod_spritePix.push('<ul id="sprites_tree"/>');
            mod_spritePix.push('<input type="button" class="vui-btn" id="fibo_sprites_analyze" value="analyze"/>');
            fiboform.push(this.panelModule('loaded sprites','fibo_showhide_sprites',mod_spritePix.join('')));

            //dropdown
            fiboform.push('<div>' + this.fiboSelect() + '</div>');
            fiboform.push('</div>');

            return fiboform.join('');
         }
      }
   };
   
}