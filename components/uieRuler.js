/*
 * UI RULER COMPONENT
 * by : Venere UIE team
 * 06/2013
 * 
 * example:

var myExtension = {
   rulers     : {'z-index':'9999'},
   ruler      : {border:'0 solid #f00'},
   mousepos   : {background:'#cc0'},
   guideline  : {background:'#00f'}
};
var myOptions = {
   guidelinesContainer : '#myGuidelinesContainer',
   extension    : myExtension,
   reference    : '#themewrapper',
   showMousePos : true,
   showRulerV   : false,
   showRulerH   : true,
   rulerWidth   : 40,
   rulerUnit    : 10,
   rulerStepMin : 10,
   rulerStepMed : 10
};

var myRuler = uieRuler('myRuler',myOptions);
$('body').append(myRuler.appendEvent());

 */

function uieRuler(id,options) {
   
   /*---------------------------------------------- VARIABLES DECLARATION ---*/
   /*---DEFAULTS---*/
   var defaults = {
      extension           : {},              //css extension (accepts all 'styles' object properties)
      reference           : 'body',          //reference dom element for rulers placement
      guidelinesContainer : '#ruler_guides', //where guidelines will be appended
      showMousePos        : true,            //toggle display of mouse coordinates
      showRulerV          : true,            //toggle display of vertical ruler
      showRulerH          : true,            //toggle display of horizonatl ruler
      rulerWidth          : 20,              //width of both rulers
      rulerUnit           : 5,               //minimum unit interval (in pixel)
      rulerStepMin        : 2,               //number of minimum units before medium tick
      rulerStepMed        : 5                //number of medium tick before max tick
   };
   if(options)extendObject(defaults,options);
   if(!defaults.rulerMin) defaults.rulerMin=defaults.rulerUnit;
   if(!defaults.rulerMed) defaults.rulerMed=defaults.rulerMin*defaults.rulerStepMin;
   if(!defaults.rulerMax) defaults.rulerMax=defaults.rulerMed*defaults.rulerStepMed;
   
   var guide_dragging,guide_dragged;
   
   /*---STYLES---*/
   var styles = {
      rulers       :{position:'absolute',top:rulerZero().top+'px',left:rulerZero().left+'px'},
      rulers_cont  :{position:'absolute',overflow:'hidden',background:'rgba(255,255,255,.8)'},
      rulers_v     :{width:defaults.rulerWidth+'px',height:rulerH()+'px',top:'0',left:'-'+defaults.rulerWidth+'px'},
      rulers_h     :{height:defaults.rulerWidth+'px',width:rulerW()+'px',left:'0',top:'-'+defaults.rulerWidth+'px'},
      ruler        :{'z-index':'1',position:'absolute',border:'0 solid #000'},
      ruler_v      :{'border-bottom-width':'1px',left:'0 !important'},
      ruler_h      :{'border-right-width':'1px',top:'0 !important'},
      ruler_top    :{'z-index':'2',position:'absolute',width:defaults.rulerWidth+'px',height:defaults.rulerWidth+'px',top:'-'+defaults.rulerWidth+'px',left:'-'+defaults.rulerWidth+'px',background:'#fff','border-right':'1px solid #000000','border-bottom':'1px solid #000000'},
      ruler_min    :{width:(defaults.rulerMin-1)+'px',height:(defaults.rulerMin-1)+'px'},
      ruler_med    :{width:(defaults.rulerMed-1)+'px',height:(defaults.rulerMed-1)+'px'},
      ruler_max    :{width:(defaults.rulerMax-1)+'px',height:(defaults.rulerMax-1)+'px'},
      ruler_label  :{position:'absolute','font-family':'helvetica','font-size':'8px',cursor:'default'},
      ruler_labelh :{bottom:'0px',right:'1px'},
      ruler_labelv :{bottom:'2px',right:'0px',width:'10px',transform:'rotate(-90deg)'},
      mousepos     :{'z-index':'3',position:'absolute',width:'auto',height:'auto',background:'rgba(200,200,200,.8)',border:'1px solid #fff','font-size':'12px',padding:'1px 5px 3px','white-space':'nowrap'},
      guideline    :{position:'absolute',background:'#0f0',width:'1px',height:'1px'},
      guide_v      :{height:rulerH()+'px',cursor:'ew-resize'},
      guide_h      :{width:rulerW()+'px',cursor:'ns-resize'}
   };
   // cross-browser extensions
   var brwExtension = {
      ruler_labelv :{'-webkit-transform':'rotate(-90deg)','-moz-transform':'rotate(-90deg)','-ms-transform':'rotate(-90deg)','-o-transform':'rotate(-90deg)',filter:'progid:DXImageTransform.Microsoft.BasicImage(rotation=3)'}
   };
   extendObject(styles,brwExtension);
   
   // custom extensions
   extendObject(styles,defaults.extension);
   generateStyleTag();
   
   /*---ELEMENTS---*/
   $('#'+id).remove();
   var rulers    = $('<div id="'+id+'" class="rulers"/>');
   var rulers_v  = $('<div class="rulers_v rulers_container"/>');
   var rulers_h  = $('<div class="rulers_h rulers_container"/>');
   var ruler     = $('<div class="ruler"/>');
   var ruler_lab = $('<div class="ruler_label"/>');
   var rulertop  = $('<div class="ruler_origin"/>');
   var mousepos  = $('<div class="ruler_mousepos"/>');
   var guides    = $('<div id="ruler_guides"/>');
   var guideline = $('<div class="ruler_guideline"/>');
   generateRulers();
   
   /*---------------------------------------------- INTERNAL METHODS ---*/
   /*---EVENTS---*/
   $(rulers).off('.guidesevent')
             .on('mousedown.guidesevent','.rulers_container',appendLineGuide)
             .on('mousedown.guidesevent','.ruler_guideline',startGuideDrag);
   $('body').off('.guidesevent')
             .on('mousemove.guidesevent',mouseMoving)
             .on('mouseup.guidesevent',stopGuideDrag)
             .on('keydown.guidesevent',key_handler);
   $(window).off('.rulersevent')
             .on('scroll.rulersevent resize.rulersevent',updateRulersPosition);
   
   /*---EVENTS HANDLERS---*/
   //while mouse is moving...
   function mouseMoving(e){
      if(defaults.showMousePos){
         var mpos = rulerMousepos(e.pageX,e.pageY);
         var output = 'x:'+mpos.relative.left+', y:'+mpos.relative.top;
         mousepos.offset(mpos.absolute);
         mousepos.text(output);
      }
      if(guide_dragging){
         var offset,dir = typeofGuide(guide_dragging);
         var rzero = rulerZero();
         var bounds = getBoundaries(e);
         
         if(dir==='v') offset = { top:rzero.top, left:bounds.coords.x};
         if(dir==='h') offset = {left:rzero.left, top:bounds.coords.y};
         
         guide_dragging.offset(offset);
         return false;
      }
      return true;
   }
   
   //click on each ruler appends a new lineguide and drag to move it
   function appendLineGuide(e){
      var dir = typeofRuler(e.currentTarget);
      var newGuide = guideline.clone().addClass('guide_'+dir);
      var guidesCont = $(defaults.guidelinesContainer);
      guidesCont.append(newGuide);
      guide_dragging = newGuide;
      guide_dragged = null;
      mouseMoving(e);
      return false
   }
   
   //click on single guideline and drag to move it
   function startGuideDrag(e){
      var theGuide = $(e.currentTarget);
      guide_dragging = theGuide;
      guide_dragged = null;
      mouseMoving(e);
      return false;
   }
   
   //on mouseup stop dragging and store dragged guideline reference
   function stopGuideDrag(e){
      var bounds = getBoundaries(e);
      var isInsideRulers = $(e.target).closest('.rulers_container').length>0;
      var isInsideElement = e.pageX>bounds.bounds.x.min && e.pageX<bounds.bounds.x.max && e.pageY>bounds.bounds.y.min && e.pageY<bounds.bounds.y.max;
      if(guide_dragging && (isInsideRulers || !isInsideElement)){
         guide_dragging.remove();
         guide_dragging = null;
      }
      guide_dragged = guide_dragging;
      guide_dragging = null;
   }
   
   //handle keyboard events (arrow keys)
   function key_handler(e){
      var offset = e.shiftKey?10:e.altKey?0.5:1;
      if(guide_dragged){
         if(e.keyCode>=37 && e.keyCode<=40){
            var newpos = {
               top  : guide_dragged.position().top  + (e.keyCode===38?-offset:e.keyCode===40?offset:0),
               left : guide_dragged.position().left + (e.keyCode===37?-offset:e.keyCode===39?offset:0)
            };
            if(typeofGuide(guide_dragged)==='v') guide_dragged.css({left:newpos.left});
            if(typeofGuide(guide_dragged)==='h') guide_dragged.css({top:newpos.top});
            return false;
         }
      }
      return true;
   }
   
   //on scroll and resize update rulers position to fit around the reference (default 'body')
   function updateRulersPosition(e){
      var refPosTop = rulerZero().top-$(window).scrollTop()-defaults.rulerWidth;
      var refPosLeft = rulerZero().left-$(window).scrollLeft()-defaults.rulerWidth;
      
      rulers.css({top:rulerZero().top,left:rulerZero().left});
      
      var rhCss = (refPosTop<=0)?
         {position:'fixed',top:'0',left:rulerZero().left}:
         {position:'absolute',top:-defaults.rulerWidth,left:0};
      var rvCss = (refPosLeft<=0)?
         {left:-rulerZero().left+$(window).scrollLeft()}:
         {left:-defaults.rulerWidth};
      rulers_h.css(rhCss);
      rulers_v.css(rvCss);
      
      var roCss = {top:rhCss.top,position:rhCss.position};
      roCss.left = (refPosTop<=0) ? rulers_v.offset().left : rvCss.left;
      rulertop.css(roCss);
      
      $('.guide_h').css({width:rulerW()});
   }
   
   /*---------------------------------------------- SERVICE METHODS ---*/
   /*---DOM ELEMENT FACTORIES---*/
   //generate all rulers according to options
   function generateRulers(){
      var ruler_min = ruler.clone().addClass('ruler_min');
      var ruler_med = ruler.clone().addClass('ruler_med');
      var ruler_max = ruler.clone().addClass('ruler_max');
      
      var totmin = Math.floor(defaults.rulerMed/defaults.rulerMin);
      var totmed = Math.floor(defaults.rulerMax/defaults.rulerMed);
      var totmax_v = Math.ceil(rulerH()/defaults.rulerMax);
      var totmax_h = Math.ceil(rulerW()/defaults.rulerMax);
      
      var i,j,x,y;
      for(i=0;i<totmin;i++) ruler_med.append(ruler_min.clone().css(rulerPosition(i*defaults.rulerMin)));
      for(j=0;j<totmed;j++) ruler_max.append(ruler_med.clone().css(rulerPosition(j*defaults.rulerMed)));
      if(defaults.showRulerH){
         for(x=0;x<totmax_h;x++) rulers_h.append(ruler_max.clone().css(rulerPosition(x*defaults.rulerMax)).append(ruler_lab.clone().text((x+1)*defaults.rulerMax)));
         rulers.append(rulers_h);
      }
      if(defaults.showRulerV){
         for(y=0;y<totmax_v;y++) rulers_v.append(ruler_max.clone().css(rulerPosition(y*defaults.rulerMax)).append(ruler_lab.clone().text((y+1)*defaults.rulerMax)));
         rulers.append(rulers_v);
      }
      if(defaults.showMousePos && $('#').length===0) rulers.append(mousepos);
      rulers.append(rulertop);
      rulers.append(guides);
   }
   
   //generate all rulers styles wrapped in a <style> tag appended to HEAD
   function generateStyleTag(){
      var pxMax = defaults.rulerWidth;
      var pxMed = pxMax/2;
      var pxMin = pxMed/2;
      var styletag = $('<style id="rulers_style"/>');
      styletag.append('#'+id+'.rulers                        {'+styleObjToString(styles.rulers)+'}');
      styletag.append('#'+id+'.rulers .ruler_origin          {'+styleObjToString(styles.ruler_top)+'}');
      styletag.append('#'+id+'.rulers .rulers_container      {'+styleObjToString(styles.rulers_cont)+'}');
      styletag.append('#'+id+'.rulers .rulers_v              {'+styleObjToString(styles.rulers_v)+'}');
      styletag.append('#'+id+'.rulers .rulers_h              {'+styleObjToString(styles.rulers_h)+'}');
      styletag.append('#'+id+'.rulers .ruler                 {'+styleObjToString(styles.ruler)+'}');
      styletag.append('#'+id+'.rulers .rulers_v .ruler       {'+styleObjToString(styles.ruler_v)+'}');
      styletag.append('#'+id+'.rulers .rulers_h .ruler       {'+styleObjToString(styles.ruler_h)+'}');
      styletag.append('#'+id+'.rulers .ruler.ruler_min       {'+styleObjToString(styles.ruler_min)+'}');
      styletag.append('#'+id+'.rulers .ruler.ruler_med       {'+styleObjToString(styles.ruler_med)+'}');
      styletag.append('#'+id+'.rulers .ruler.ruler_max       {'+styleObjToString(styles.ruler_max)+'}');
      styletag.append('#'+id+'.rulers .ruler .ruler_label    {'+styleObjToString(styles.ruler_label)+'}');
      styletag.append('#'+id+'.rulers .rulers_v .ruler_label {'+styleObjToString(styles.ruler_labelv)+'}');
      styletag.append('#'+id+'.rulers .rulers_h .ruler_label {'+styleObjToString(styles.ruler_labelh)+'}');
      styletag.append('#'+id+'.rulers .rulers_v .ruler_min   {width:'+pxMin+'px !important;}');
      styletag.append('#'+id+'.rulers .rulers_v .ruler_med   {width:'+pxMed+'px !important;}');
      styletag.append('#'+id+'.rulers .rulers_v .ruler_max   {width:'+pxMax+'px !important;}');
      styletag.append('#'+id+'.rulers .rulers_h .ruler_min   {height:'+pxMin+'px !important;}');
      styletag.append('#'+id+'.rulers .rulers_h .ruler_med   {height:'+pxMed+'px !important;}');
      styletag.append('#'+id+'.rulers .rulers_h .ruler_max   {height:'+pxMax+'px !important;}');
      styletag.append('#'+id+'.rulers .ruler_mousepos        {'+styleObjToString(styles.mousepos)+'}');
      styletag.append('.ruler_guideline                      {'+styleObjToString(styles.guideline)+'}');
      styletag.append('.ruler_guideline.guide_v              {'+styleObjToString(styles.guide_v)+'}');
      styletag.append('.ruler_guideline.guide_h              {'+styleObjToString(styles.guide_h)+'}');
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
   
   /*---GETTERS--*/
   //pixel position of mouse inside Rulers
   function rulerMousepos(px,py){
      var mpos = {},
          mwid = mousepos.width()+4,
          offX = 10,
          offY = 16;
      
      mpos.absolute = {left:px+offX,top:py+offY};
      if(mpos.absolute.left+mwid+offX>$(window).width())
         mpos.absolute.left=px-mwid-offX;
      px = px - $(defaults.reference).offset().left;
      py = py - $(defaults.reference).offset().top;
      mpos.relative = {left:Math.round(px),top:Math.round(py)};
      return mpos;
   }
   
   //info object about boundaries of reference element
   function getBoundaries(e){
      var rzero = rulerZero();
      var xMin = rzero.left - defaults.rulerWidth;
      var yMin = rzero.top  - defaults.rulerWidth;
      var xMax = rulerW() + rzero.left;
      var yMax = rulerH() + rzero.top;
      var newX = e.pageX<xMin ? xMin : e.pageX>xMax ? xMax : e.pageX;
      var newY = e.pageY<yMin ? yMin : e.pageY>yMax ? yMax : e.pageY;
      
      return {coords   : {x:newX,y:newY},
              bounds   : {x:{min:xMin,max:xMax},y:{min:yMin,max:yMax}},
              isInside : (newX===e.pageX && newY===e.pageY)
             };
   }
   
   //css object of a single ruler position
   function rulerPosition(num){
      return {left:num+'px',top:num+'px'};
   }
   //position object of reference element (default: 'body')
   function rulerZero(){
      return $(defaults.reference).offset();
   }
   //width of reference element (default: 'body')
   function rulerW(){
      return $(defaults.reference).width()
             +Number($(defaults.reference).css('padding-left').replace('px',''))
             +Number($(defaults.reference).css('padding-right').replace('px',''));
   }
   //height of reference element (default: 'body')
   function rulerH(){
      return $(defaults.reference).height()
             +Number($(defaults.reference).css('padding-top').replace('px',''))
             +Number($(defaults.reference).css('padding-bottom').replace('px',''));
   }
   
   //direction of given guide ('v' or 'h')
   function typeofGuide(guide){
      return $(guide).attr('class').replace(/ruler_guideline|guide_| /g,'');
   }
   //direction of given ruler ('v' or 'h')
   function typeofRuler(ruler){
      return $(ruler).attr('class').replace(/rulers_|container| /g,'');
   }
   
   /*---------------------------------------------- PUBLIC OBJECTS AND METHODS ---*/
   /*---PRIVATE TO PUBLIC METHODS---*/
   function privateAppendEvent(){
      updateRulersPosition();
      return rulers;
   }
   
   /*---PUBLICLY EXPOSED OBJECT---*/
   rulers.appendEvent = privateAppendEvent;
   return rulers;
   
}
