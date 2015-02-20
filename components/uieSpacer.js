/*
 * UI SPACER COMPONENT
 * by : Venere UIE team
 * 07/2013
 * 
 * example:

var myOptions = {
   extension     : { main:{'z-index':'1000'} },
   spacerMin     : 1,
   spacerSymbols : ['A','B','C'],
   spacersList   : [1,5,10,15,20,25,30,35,40,45,50,55,60,65]
};

var myspacer = new uieSpacer('fibo_container',myOptions);
$('body').append(myspacer);

 */

function uieSpacer(id,options) {
   
   /*---------------------------------------------- VARIABLES DECLARATION ---*/
   /*---DEFAULTS---*/
   var defaults = {
      extension     : {},      //css extension (accepts all 'styles' object properties)
      reference     : 'body',
      styleTagId    : 'spacer_style',
      localStorage  : 'fibonacciGroups',
      spacerClass   : 'fibospacer',
      spacerMatch   : /fibospacer|fs|_| /g,
      grouping      : true,
      moveCallback  : null,
      groupCallback : null,
      spacersList   : fibonacciSequence(1,12),
      spacerMin     : 3,
      spacerSymbols : [{s:'•',f:2.8,l:1},{s:'★',f:1.65,l:0.73}],
      //spacerSymbols : ['•','★'],
      spacerColors  : ['#0071bc','#ed1e79','#8cc63f','#fbb03b'],
      //fontSizes     : ['21px','36px','59px','98px','90px','148px','238px','388px'],
      //lineHeights   : ['0.36em','0.45em']
   };
   if(options)extendObject(defaults,options);
   
   /*---STYLES---*/
   var styles = {
      main   :{position:'absolute',top:referencePos().top+'px',left:referencePos().left+'px',width:'0',height:'0',overflow:'visible'},
      spacer :{position:'absolute',display:'block',cursor:'pointer',overflow:'hidden','font-family':'Arial',outline:'0'}
   };
   extendObject(styles,defaults.extension);
   generateStyleTag();
   
   /*---ELEMENTS---*/
   var spacer = newElement();
   function newElement(){
      if($('#'+id).length>0){
         $('#'+id).remove();
         console.log('Container ID already in use and thus has been removed.');
      }
      return $('<div id="'+id+'"/>');
   }
   
   // grouping manager
   var defaultGroupName = 'spacerGroup_';
   var lastUsedGroup = defaultGroupName+'0';
   var spacersGroups = emptySpacersGroups();
   function emptySpacersGroups(){
      return {
         groups:{},
         totalGroups:function(){var t=0;for(var f in this.groups)t++;return t;}
      };
   }
   
   /*---INITIAL VALUE---*/
   var mousezero,dragging,dragged;
   var spacerObjects = getSpacers();
   
   /*---------------------------------------------- INTERNAL METHODS ---*/
   /*---EVENTS---*/
   $(spacer).off('.spacerevent')
             .on('mousedown.spacerevent','.'+defaults.spacerClass,mouse_handler);
   $('body').off('.spacerevent')
             .on('mousemove.spacerevent',mouse_handler)
             .on('mouseup.spacerevent',mouse_handler)
             .on('keydown.spacerevent',key_handler);
   $(window).off('.spacerevent')
             .on('scroll.spacerevent resize.spacerevent',updateReferencePosition);
   
   /*---EVENTS HANDLERS---*/
   function key_handler(e){
      var offset = e.shiftKey?10:e.altKey?0.5:1;
      if(dragged){
         if(e.keyCode>=37 && e.keyCode<=40){
            dragged.offset({
               top  : ( dragged.offset().top  + (e.keyCode===38?-offset:e.keyCode===40?offset:0) ),
               left : ( dragged.offset().left + (e.keyCode===37?-offset:e.keyCode===39?offset:0) )
            });
            if(defaults.moveCallback)defaults.moveCallback(dragged);//updateFiboSelected();
            return false;
         }
      }
      return true;
   }
   function mouse_handler(e){
      switch(e.type){
         case 'mousedown':
            startDrag(e);
         case 'mousemove':
            doDrag(e);
            break;
         case 'mouseup':
            stopDrag(e);
            break;
      }
   }
   
   //on scroll and resize update reference position inside document (default 'body')
   function updateReferencePosition(e){
      spacer.css(referencePos());
   }
   
   /* Dragging */
   function startDrag(e){
      var $target = $(e.target);
      mousezero = {
         top  : ($target.position().top  - e.pageY + referencePos().top),
         left : ($target.position().left - e.pageX + referencePos().left)
      };
      dragSpacer($target);
      return false;
   }
   function dragSpacer($target){
      var $parent = $target.parent();
      $parent.append($target);
      dragged = null;
      dragging = $target;
   }
   function doDrag(e){
      if(dragging){
         dragging.offset({
            top  : (Number(e.pageY+mousezero.top)),
            left : (Number(e.pageX+mousezero.left))
         });
         normalizeSpacerPosition(dragging);
         return false;
      }
      return true;
   }
   function stopDrag(e){
      dragged = dragging;
      if (!dragged) return true;
      dragged.focus();
      if(dragging){
         dragging = null;
         if(defaults.moveCallback)defaults.moveCallback(dragged);//updateFiboSelected();
      }
   }
   
   /*---------------------------------------------- SERVICE METHODS ---*/
   function getGroup(name,skipAppend,skipEvent){
      return addNewGroup(name,skipAppend,skipEvent);
   }
   function removeGroup(name){
      if(!name || !spacersGroups.groups[name]) return false;
      $('#'+name).remove();
      delete spacersGroups.groups[name];
      return true;
   }
   function removeAllGroup(){
      spacer.empty();
      spacersGroups = emptySpacersGroups();
      return true;
   }
   function renameGroup(oldname,newname){
      if(!oldname || !newname) return false;
      if(oldname === newname) return false;
      if($('#'+newname).length>0) return false;
      
      var oldArr = spacersGroups.groups[oldname];
      if(!oldArr) return false;
      
      spacersGroups.groups[newname] = oldArr;
      
      var $group = getGroup(newname);
      $group.html($('#'+oldname).html());
      removeGroup(oldname);

      return true;
   }
   function offsetGroup(offset){
      var t,l,
          spacers = spacersGroups.groups[lastUsedGroup],
          $spacers = $('#'+lastUsedGroup).find('.'+defaults.spacerClass);

      $spacers.each(function(i,e){
         var $spacer = $(this);
         t = Number(spacers[i][1]);//Number($spacer.css('top').replace('px',''));
         l = Number(spacers[i][2]);//Number($spacer.css('left').replace('px',''));
         $spacer.css('top',t+Number(offset.top));
         $spacer.css('left',l+Number(offset.left));
      });
   }
   function saveOffsetGroup(offset){
      var s,spacers = spacersGroups.groups[lastUsedGroup];
      for(s in spacers){
         spacers[s][1] = Number(spacers[s][1]) + Number(offset.top);
         spacers[s][2] = Number(spacers[s][2]) + Number(offset.left);
      }
      spacersGroups.groups[lastUsedGroup] = spacers;
   }

   function offsetCustomGroup(spacerslist,offset){
      for(var i=0;i<spacerslist.length;i++){
         var $spacer = $(spacerslist[i]);
         var zero = $spacer.offset();
         var pos = {
            left: zero.left + Number(offset.left),
            top:  zero.top  + Number(offset.top)
         };
         $spacer.offset(pos);
      }
   }
   
   function addNewGroup(name,skipAppend,skipEvent){
      name || (name=lastUsedGroup);
      
      var newgroup = $('#'+name);
      if(newgroup.length===0){
         newgroup = $('<div id="'+name+'" class="spacers_group"/>');
         if(!skipAppend) spacer.append(newgroup);
         if(!skipEvent && defaults.groupCallback) defaults.groupCallback(name);
      }
      lastUsedGroup = name;

      return newgroup;
   }
   function addNewSpacer(num,group){
      if(!group) group = lastUsedGroup;
      var spacerStr = ('000'+num).substr(-3);
      var spacerObj = spacerObjects['f_'+spacerStr].clone();
      var $parent = defaults.grouping ? getGroup(group) : spacer;
      if(spacerObj)
         $parent.append(spacerObj);
      return spacerObj;
   }
   
   function normalizeSpacerPosition($spacer){
      var newpos = {
         top  : roundToHalf( Number($spacer.css('top').replace('px','')) ),
         left : roundToHalf( Number($spacer.css('left').replace('px','')) )
      };
      $spacer.css(newpos);
   }
   
   /*---SPACERS PARSER - TO JSON AND BACK---*/
   //current HTML to spacersGroups
   function htmlToSpacersGroups(){
      var cont,myasset = {};
      $('#'+id+' .'+defaults.spacerClass).each(function(i,e){
         cont = $(this).parent().attr('id');
         if(cont===id) cont='spacerGroupDefault';
         if(!myasset[cont]) myasset[cont] = [];
         myasset[cont].push([
            parseInt(getSpacerType(this)),
            Number($(this).css('top').replace('px','')),
            Number($(this).css('left').replace('px',''))
         ]);
      });
      spacersGroups.groups = myasset;
   }
   
   //current HTML to spacersGroups and then to Json String
   function spacersToJson(){
      htmlToSpacersGroups();
      
//      if(defaults.grouping){
//         var newgroup = defaultGroupName+(spacersGroups.totalGroups()+1);
//         var fiboname = isNewGroup?newgroup:lastUsedGroup;
//         if(!fiboname) fiboname = newgroup;
//         lastUsedGroup = fiboname;
//      }
      
      var stJson = JSON.stringify(spacersGroups.groups);
      return stJson;
   }
   
   //given json to spacersGroups and then to HTML (default output='html')
   function jsonToSpacers(stJson,replace,hide){
      var spacers_arr,spacers_obj = JSON.parse(stJson);
      for(var s in spacers_obj){
         if(replace) {
            delete spacersGroups.groups[s];
            spacers_arr = spacers_obj[s];
         } else {
            spacers_arr = spacersGroups.groups[s];
            if(!spacers_arr) spacers_arr = [];
            spacers_arr.push.apply(spacers_arr,spacers_obj[s]);
         }
         spacersGroups.groups[s] = spacers_arr;
      }
      return spacersGroupsToHtml(hide);
   }
   
   //given json to descriptive string
   function jsonToString(stJson,joinWith){
      joinWith || (joinWith='; ');
      var obj = JSON.parse(stJson);
      var count = 0;
      var str = [];
      for(var s in obj){
         count++;
         str.push('  group name: '+s);
         str.push('    spacers count: '+obj[s].length);
      }
      str.unshift('groups count: '+count);
      return str.join(joinWith);
   }
   
   //convert spacersGroups to appendable HTML or JQuery node objects
   function spacersGroupsToHtml(hide){
      var sp_name,sp_arr,sp_node,sp_nodes;
      var $group,finalHtml = [];
      
      for(var groupName in spacersGroups.groups){
         sp_nodes = [];
         sp_arr = spacersGroups.groups[groupName];
         $('#'+groupName).remove();
         
         for(var s=0; s<sp_arr.length; s++){
            sp_name = 'f_' + ('000'+sp_arr[s][0]).substr(-3);
            sp_node = spacerObjects[sp_name].clone();
            sp_node.css('top',sp_arr[s][1]);
            sp_node.css('left',sp_arr[s][2]);
            sp_nodes.push(sp_node.prop('outerHTML'));
         }
         
         if(defaults.grouping){
            $group = getGroup(groupName,true,true);
            $group.html(sp_nodes.join(''));
            if(hide) $group.hide();
            finalHtml.push($group.prop('outerHTML'));
         }else{
            finalHtml.push(sp_nodes.join(''));
         }
      }
      return finalHtml.join('');
   }
   
   //add or replace html inside spacers container with given json string
   function insertHtmlFromJson(stJson,overwrite,hide){
      var html = jsonToSpacers(stJson,overwrite,hide);
      spacer.html(html);
   }
   
   /*---LOCAL STORAGE---*/
   function setLocalStorage(){
      localStorage.setItem(defaults.localStorage, spacersToJson());       
      return true;
   }
   function getLocalStorage(hide){
      removeAllGroup();
      var stJson = localStorage.getItem(defaults.localStorage);
      if (stJson) insertHtmlFromJson(stJson,true,hide);
      return stJson;
   }
   function loadSpacersFromJson(stJson,hide){
      if (stJson) insertHtmlFromJson(stJson,true,hide);
      return stJson;
   }
   
   /*---FIBONACCI SPACERS---*/
   //return an object whose each property are spacers to be cloned
   function getSpacers(){
      var spacerstr,spacers = {};
      for(var f=defaults.spacerMin-1;f<defaults.spacersList.length;f++){
         spacerstr = ('00'+defaults.spacersList[f]).substr(-3);
         spacers['f_'+spacerstr] = $('<div class="'+defaults.spacerClass+' fs_'+spacerstr+'" tabindex=""/>');
      }
      return spacers;
   }
   
   /*---DOM ELEMENT FACTORIES---*/
   //return css portion with all spacers needed (method called by generateStyleTag)
   function generateSpacersStyles(){
      var alpha = '65';//spacer symbols opacity
      var fiboidx,fibonum,fibostr,
          fibomin    = defaults.spacerMin-1;//fibomin represents the Nth index of spacers list (0-based)
      var fibos      = spacersFilter(fibomin),
          fibostyles = [];
      var d_colors   = defaults.spacerColors,
          //d_fsizes   = defaults.fontSizes,
          d_symbols  = defaults.spacerSymbols;
          //d_lheight  = defaults.lineHeights;
      var fcLen      = d_colors.length,
          //ffLen      = d_fsizes.length,
          fsLen      = d_symbols.length;
          //flLen      = d_lheight.length;
      var fc         = 0, //colors index
          //ff         = 0, //fontSize index
          fs         = 0; //symbol index
          //fl         = 0; //lineHeight index
      
      fc=fibomin;
      if(fc>=fcLen)fc-=(Math.floor(fc/fcLen)*fcLen);
      
      fibostyles.push('.'+defaults.spacerClass+':after {position:absolute;left:0;color:#fff;-khtml-opacity:.'+alpha+';-moz-opacity:.'+alpha+';-ms-filter:"alpha(opacity='+alpha+')";filter:alpha(opacity='+alpha+');opacity:.'+alpha+';}');
      for(var f in fibos){
         fibonum=fibos[f];
         fiboidx=spacerIndex(fibonum);
         fibostr=('000'+fibonum).substr(-3);
         fibostyles.push('.'+defaults.spacerClass+'.fs_'+fibostr+' {width:'+fibos[f]+'px;height:'+fibos[f]+'px;background:'+d_colors[fc]+';}');
         
         //dopo il primo ciclo sui colori aggiunge i simboli (ogni ciclo sui colori un simbolo diverso)
         if(fiboidx>=fcLen){
            fibostyles.push('.'+defaults.spacerClass+'.fs_'+fibostr+':after {content:"'+d_symbols[fs].s+'";font-size:'+(fibonum*d_symbols[fs].f)+'px;line-height:'+(fibonum*d_symbols[fs].l)+'px;}');
            
            //determina l'inizio del ciclo sull'array spacerColors
            if((fiboidx+1)%fcLen===0){
               if(++fs>=fsLen)fs=fsLen-1;// incrementa ciclicamente l'indice di symbol
               //if(++fl>=flLen)fl=flLen-1;// incrementa ciclicamente l'indice di lineheight
            }
            //if(++ff>=ffLen)ff=ffLen-1;// incrementa ciclicamente l'indice di fontsize
         }
         if(++fc>=fcLen)fc=0;// incrementa ciclicamente l'indice di colors
      }
      return fibostyles.join('\n');
   }
   
   //generate all spacers styles wrapped in a <style> tag appended to HEAD
   function generateStyleTag(){
      $('style#'+defaults.styleTagId).remove();
      var shad = '0 0 5px 2px #222222 inset';
      
      var styletag = $('<style id="'+defaults.styleTagId+'"/>');
      styletag.append('#'+id+' {'+styleObjToString(styles.main)+'}\n');
      styletag.append('#'+id+' .'+defaults.spacerClass+':focus {box-shadow:'+shad+';-moz-box-shadow:'+shad+';-webkit-box-shadow:'+shad+';}\n');
      styletag.append('.'+defaults.spacerClass+' {'+styleObjToString(styles.spacer)+'}\n');
      styletag.append(generateSpacersStyles());
      $('head').append(styletag);
   }
   
   /*---EXTENSIONS---*/
   //extend each property of the given object with the same property of the given extension
   function extendObject(obj,ext){
      for(var p in ext){
         if(obj[p] && (obj[p] instanceof Object) && !(obj[p] instanceof Array)) extendObject(obj[p],ext[p]);
         else obj[p]=ext[p];
      }
   }
   //convert each property of a single style object to a single string
   function styleObjToString(obj){
      var styleArray = [];
      for(var s in obj) styleArray.push(s+':'+obj[s]+';');
      return styleArray.join('');
   }
   
   /*---GETTERS---*/
   function getSpacerType(spacer){
      return $(spacer).attr('class').replace(defaults.spacerMatch,'');      
   }
   
   //the fibonacci sequence! (min and max represent the Nth values of the sequence)
   function fibonacciSequence(min,max){
      var fibo=1,last=1,llast=0,fibos=[];
      for (var f=1;f<=max;f++){
         fibo+=llast;
         llast=last;
         last=fibo;
         fibos.push(fibo);
      }
      if(min<=0)min=1;
      return fibos.splice(min-1,max-min+1);
   }
   
   //returns index of given spacer number inside spacerList array
   function spacerIndex(fibonum){
      var list = defaults.spacersList;
      for(var f in list){
         if(list[f]===fibonum) return Number(f);
      }
      return -1;
   }
   
   //returns the spacersList array filtered with min and max indexes
   function spacersFilter(min,max){
      if(!min||min<0)min=0;
      if(!max||max>defaults.spacersList.length-1)max=defaults.spacersList.length-1;
      
      var arr=[];
      for(var s=min;s<=max;s++){
         arr.push(defaults.spacersList[s]);
      }
      return arr;
   }
   
   //position object of reference element (default: 'body')
   function referencePos(){
      return $(defaults.reference).offset();
   }
   
   //round the given number to the nearest 0.5 decimal
   function roundToHalf(num){
      var d = Math.round((num%1)*100)/100;
      var i = (d<.25)?0:(d>.75)?1:.5;
      var ret = (Math.floor(num)+i);
      return ret;
   }
   
   /*---------------------------------------------- PUBLIC OBJECTS AND METHODS ---*/
   /*---PRIVATE TO PUBLIC METHODS---*/
   function privateGetSpacerObjects(){
      return spacerObjects;
   }
   function privateGetSpacerType(spacer){
      return getSpacerType(spacer);
   }
   function privateGetSpacersList(onlyActiveSpacers){
      if(onlyActiveSpacers)
         return spacersFilter(defaults.spacerMin-1);
      else
         return defaults.spacersList;
   }
   function privateGetSpacerIndex(spacernum){
      return spacerIndex(spacernum);
   }
   function privateGetSpacersGroups(){
      return spacersGroups;
   }
   function privateGetSpacersJson(){
      return JSON.stringify(spacersGroups.groups);
   }
   function privateGetLastUsedGroup(){
      return lastUsedGroup;
   }
   function privateSetMousezero(mzero){
      if((mzero.top || mzero.top===0) && (mzero.left || mzero.left===0))
         mousezero = mzero;
      else
         console.log('WARNING: setMouseZero called with wrong parameter');
      
      return spacer.manager;
   }
   function privateAddNewSpacer(spacernum){
      if(spacerIndex(spacernum)>-1)
         return addNewSpacer(spacernum);
      
      console.log('WARNING: addSpacer called with unsupported spacer');
      return null;
   }
   function privateDragSpacer($target){
      return dragSpacer($target);
   }
   function privateJSonDescriptiveString(){
      return jsonToString(localStorage.getItem(defaults.localStorage),'\n');
   }
   function privateNewLastUsedGroup(newgroup){
      lastUsedGroup = newgroup ? newgroup : defaultGroupName+(spacersGroups.totalGroups()+1);
   }
   function privateUpdateGroups(){
      htmlToSpacersGroups();
      return spacer.manager;
   }
   function privateRenameGroup(oldName,newName){
      return renameGroup(oldName,newName);
   }
   function privateRemoveGroup(name){
      removeGroup(name);
      return spacer.manager;
   }
   function privateRemoveAllGroup(){
      removeAllGroup();
      return spacer.manager;
   }
   function privateOffsetGroup(offset){
      offsetGroup(offset);
      return spacer.manager;
   }
   function privateSaveOffsetGroup(offset){
      saveOffsetGroup(offset);
      return spacer.manager;
   }
   function privateOffsetCustom($list,offset){
      offsetCustomGroup($list,offset);
      return spacer.manager;
   }
   
   /*---PUBLICLY EXPOSED OBJECT---*/
   spacer.fibonacciSequence        = fibonacciSequence;
   spacer.getinfo = {
                     spacers       : privateGetSpacerObjects,
                     spacerType    : privateGetSpacerType,
                     spacersList   : privateGetSpacersList,
                     spacerIndex   : privateGetSpacerIndex,
                     spacersGroups : privateGetSpacersGroups,
                     spacersJson   : privateGetSpacersJson,
                     groupName     : privateGetLastUsedGroup
                    };
   spacer.storage = {
                     save          : setLocalStorage,
                     restore       : getLocalStorage,
                     load          : loadSpacersFromJson,
                     string        : privateJSonDescriptiveString
                    };
   spacer.manager = {
                     setMouseZero  : privateSetMousezero,
                     addSpacer     : privateAddNewSpacer,
                     dragSpacer    : privateDragSpacer,
                     newUsedGroup  : privateNewLastUsedGroup,
                     updateGroups  : privateUpdateGroups,
                     applyOffset   : privateSaveOffsetGroup,
                     offsetGroup   : privateOffsetGroup,
                     offsetCustom  : privateOffsetCustom,
                     renameGroup   : privateRenameGroup,
                     removeGroup   : privateRemoveGroup,
                     removeAll     : privateRemoveAllGroup
                    };
   return spacer;
   
}
