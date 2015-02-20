/*
 * UI TEXT MARKER COMPONENT
 * by : Venere UIE team
 * 07/2013
 * 
 * example:

function myCallbackMarker(){
   return false;
}
function myCallbackFont(){
   return true;
}
var myExtension = {
   marker:{'background':'#0f0',opacity:'0.6',top:'0'},
   markers_container:{'z-index':'9999',top:'0'}
};
var myOptions = {
   extension      : myExtension,
   checkUseMarker : myCallbackMarker,
   checkUseFont   : myCallbackFont,
   markerClass    : 'textHighlight',
   taglist        : {a:false,h4:false,h5:false,h6:false}
};

var myMarker = new uieMarker('myMarker',myOptions);
$('body').append(myMarker.initEvents().preventDefaults(true));

 */

function uieMarker(id,options) {
   
   /*---------------------------------------------- VARIABLES DECLARATION ---*/
   /*---DEFAULTS---*/
   var defaults = {
      extension      : {},            //css extension (accepts all 'styles' object properties)
      checkUseMarker : null,          //if this function returns true the marker will work
      checkUseFont   : null,          //if this function returns true the fontinfo will work
      reference      : 'body',        //reference dom element for binding click events
      markerClass    : 'uieMarker',   //common highlight element class
      fontClass      : 'uieFontinfo', //common fontinfo element class
      excluded       : '',            //selector excluded from marker functionality
      taglist        : {              //list of known tags on which to apply the marker
         p:true,span:true,strong:true,li:true,
         h1:true,h2:true,h3:true,h4:true,h5:true,h6:true,
         a:true,input:true,select:true,textfield:true
      }
   };
   if(options)extendObject(defaults,options);
   extendObject(defaults,{excluded:(defaults.excluded===''?'':defaults.excluded+',')+'.'+defaults.fontClass});
   
   /*---STYLES---*/
   var styles = {
      markers_container :{position:'absolute'},
      marker            :{position:'absolute !important','z-index':'1',background:'#0ff',opacity:'0.5'},
      fontinfo          :{position:'absolute !important','z-index':'2',background:'rgba(34, 34, 34, 0.7)',border:'1px solid #fff',padding:'3px','font-family':'Open Sans',color:'#fff'},
      fontinfo_p        :{margin:'0',cursor:'default','text-algin':'center'},
      fontinfo_p1       :{'font-size':'13px','font-weight':'700','margin-top':'-4px'},
      fontinfo_p2       :{'font-size':'10px','font-weight':'400','margin':'-5px 0'},
      fontinfo_p3       :{'font-size':'14px','font-weight':'600','margin-bottom':'-4px'}
   };
   extendObject(styles,defaults.extension);
   generateStyleTag();
   
   /*---ELEMENTS---*/
   var marker = $('<div id="'+id+'"/>');
   
   /*---------------------------------------------- INTERNAL METHODS ---*/
   /*---EVENTS---*/
   function updateEvents(){
      var ref = defaults.reference;
      var cls = '.'+defaults.markerClass;
      $(ref).off('.markerevent')
             .on('click.markerevent',doHighlight)
             .on('click.markerevent',cls,undoHighlight);
   };
   
   /*---EVENTS HANDLERS---*/
   //check for callback, check for target, then add highlight on clicked text
   function doHighlight(e){
      if(isAcceptedTarget(e.target)){
         addTextFontHighlight(e.target);
      }
   }
   //remove clicked highlight
   function undoHighlight(e){
      $(e.currentTarget).remove();
   }
   
   /*---------------------------------------------- SERVICE METHODS ---*/
   //prevent/restore default behaviors for elements in defaults.taglist
   function toggleDefaults(prevent){
      if(prevent)
         preventDefaults();
      else
         restoreDefaults();
   }
   //prevent default behavior for not excluded tags
   function preventDefaults(){
      $(taglistToString()).on('click.prevent',function(e){
         if($(e.target).is(taglistToString()) && $(e.target).closest(defaults.excluded).length===0)
            e.preventDefault();
      });
   }
   //restore all default behaviors
   function restoreDefaults(){
      $(taglistToString()).off('.prevent');
   }
   
   //add both text highlight and font info on given element
   function addTextFontHighlight(elem){
      var size;
      var useMarker = defaults.checkUseMarker?defaults.checkUseMarker():true;
      var useFont = defaults.checkUseFont?defaults.checkUseFont():true;
      if(useMarker||useFont)
         size = markerSize(elem);
      else
         return false;
      
      if(useMarker)
         addTextHighlight(elem,size);
      if(useFont)
         addFontInfo(elem,size);
      
      return true;
   }
   //add text highlight around given element
   function addTextHighlight(elem,size){
      var dataName = 'markerHL';
      if($(elem).data(dataName)===true) return true;
      
      size || (size=markerSize(elem));
      var thl = $('<div class="'+defaults.markerClass+'"/>')
         .width(size.width)
         .height(size.height)
         .offset(size.offset)
         .click(function(e){removeFromMarker($(this),dataName);});
      
      appendToMarker(elem,thl,dataName);
   }
   //add font info above given element
   function addFontInfo(elem,size){
      var dataName = 'markerFI';
      if($(elem).data(dataName)===true) return true;
      
      size || (size=markerSize(elem));
      var info = markerFont(elem);
      var p1 = $('<p class="fi1"/>').text(info[0]),
          p2 = $('<p class="fi2"/>').text(info[1]),
          p3 = $('<p class="fi3"/>').text(info[2]);
      var tfi = $('<div class="'+defaults.fontClass+'"/>')
         .append(p1,p2,p3)
         .offset({
            top  : size.offset.top - 45,
            left : size.offset.left + 10
         })
         .click(function(e){removeFromMarker($(this),dataName);});
      
      appendToMarker(elem,tfi,dataName);
   }
   
   //append markerElement to marker and set data for both markerElement and its reference (the text node parent)
   function appendToMarker(elem,markerElem,dataName){
      $(elem).data(dataName,true);
      $(markerElem).data('ref',elem);
      marker.append(markerElem);
   }
   //remove markerElement from marker and reset data on its reference (the text node parent)
   function removeFromMarker(markerElem,dataName){
      $($(markerElem).data('ref')).data(dataName,false);
      $(markerElem).remove();
   }
   
   //generate marker styles wrapped in a <style> tag appended to HEAD
   function generateStyleTag(){
      var mclass = defaults.markerClass;
      var fclass = defaults.fontClass;
      var styletag = $('<style id="markers_style"/>');
      styletag.append('#'+id+'                   {'+styleObjToString(styles.markers_container)+'}');
      styletag.append('#'+id+' .'+mclass+'       {'+styleObjToString(styles.marker)+'}');
      styletag.append('#'+id+' .'+fclass+'       {'+styleObjToString(styles.fontinfo)+'}');
      styletag.append('#'+id+' .'+fclass+' p     {'+styleObjToString(styles.fontinfo_p)+'}');
      styletag.append('#'+id+' .'+fclass+' p.fi1 {'+styleObjToString(styles.fontinfo_p1)+'}');
      styletag.append('#'+id+' .'+fclass+' p.fi2 {'+styleObjToString(styles.fontinfo_p2)+'}');
      styletag.append('#'+id+' .'+fclass+' p.fi3 {'+styleObjToString(styles.fontinfo_p3)+'}');
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
   //convert taglist array to string including only tags setted to 'true'
   function taglistToString(){
      var obj=defaults.taglist,list=[];
      for(var tag in obj) if(obj[tag])list.push(tag);
      return list.join(',');
   }
   
   //check for accepted target
   function isAcceptedTarget(target){
      var $target = $(target);
      
      //check target outside excluded selector
      if(defaults.excluded!=='' && $target.closest(defaults.excluded).length>0) 
         return false;
      
      //check for non-empty target
      var isNotEmpty = ($target.html()!=='' &&
                        $target.text()!=='' && 
                        $target.text()!==' ' && 
                        $target.text()!=='&nbsp;');
      if(isNotEmpty){
         //check for defaults
         var tag,tlist=defaults.taglist;
         for(tag in tlist){
            if(tlist[tag] && $target.is(tag)) return true;
         }
         //additional checks
         if($target.is('div') && $target.find('*').length===0) return true;
      }
      
      return false;
   }
   
   //marker size object {width:Number,height:Number,offset:{left:Number,top:Number}}
   function markerSize(elem){
      var fontOffset = markerHeight(elem);
      var $el = $(elem);
      var size = {
         width  : $el.width(),
         height : $el.height()-(fontOffset.t + fontOffset.b),
         offset : {
            left: $el.offset().left + Number($el.css('padding-left').replace('px','')),
            top : $el.offset().top  + Number($el.css('padding-top').replace('px','')) + fontOffset.t
         }
      };
      return size;
   }
   
   //offset info on given elemenet's fontFamily and fontSize css properties
   function markerHeight(elem){
      var $el = $(elem);
      var loginfo = true;
      var fw=$el.css('font-weight');
      var fs=$el.css('font-size').replace('px','')
      var ff=$el.css('font-family').split(',')[0].replace(/\"|'/g,'');
      
      function fo(t,b){
         var top=(t&&t!==0)?t:0;
         var bot=(b&&b!==0)?b:0;
         return {t:top,b:bot};
      }
      
      var sizesDef = {8:fo(),9:fo(),
                     10:fo(),11:fo(),12:fo(),13:fo(),14:fo(),15:fo(),16:fo(),17:fo(),18:fo(),19:fo(),
                     20:fo(),21:fo(),22:fo(),23:fo(),24:fo(),25:fo(),26:fo(),27:fo(),28:fo(),29:fo()};
      var sizes = {'Arial':sizesDef,'Open Sans':sizesDef};
      sizes['Arial']['8']      = fo(0,0);
      sizes['Open Sans']['12'] = fo(1,-1);
      sizes['Open Sans']['21'] = fo(5,1);
      sizes['Open Sans']['26'] = fo(11,5);
      
      if(loginfo){
         var textlog=[];
         textlog.push('family:"'+ff+'" - size:'+fs+' - weight:'+fw);
         if(!sizes[ff])
            textlog.push('fontFAMILY not used.. we\'ll implement it soon!');
         if(sizes[ff] && (!sizes[ff][fs] || (sizes[ff][fs]['t']===0&&sizes[ff][fs]['b']===0)))
            textlog.push('fontSIZE not used.. we\'ll implement it soon!');
         textlog.push('-----------------');
         console.log(textlog.join('\n'));
      }
      
      var finalSize;
      finalSize = sizes[ff] ? sizes[ff] : sizesDef;
      finalSize = finalSize[fs] ? finalSize[fs] : finalSize['8'];
      return finalSize;
   }
   
   //font info array : [name,weight,size]
   function markerFont(elem){
      var $el = $(elem);
      var fw=$el.css('font-weight');
      var fs=$el.css('font-size').replace('px','')
      var ff=$el.css('font-family').split(',')[0].replace(/\"|'/g,'');
      
      var lett1 = ff.split(' ')[0].substr(0,1).toUpperCase();
      var lett2 = (ff.split(' ')[1]?ff.split(' ')[1].substr(0,1).toUpperCase():ff.substr(1,1).toLowerCase());
      var name = lett1+lett2;
      
      return [name,fw,fs];
   }
   
   /*---------------------------------------------- PUBLIC OBJECTS AND METHODS ---*/
   /*---PRIVATE TO PUBLIC METHODS---*/
   function privateUpdateEvents(){
      updateEvents();
      return marker;
   }
   function privateToggleDefaults(prevent){
      toggleDefaults(prevent);
      return marker;
   }
   
   /*---PUBLICLY EXPOSED OBJECT---*/
   marker.initEvents = privateUpdateEvents;//returns marker
   marker.preventDefaults = privateToggleDefaults;//returns marker
   marker.addMarkerToElement = addTextFontHighlight;
   marker.markEvent = doHighlight;
   marker.unmarkEvent = undoHighlight;
   return marker;
   
}
