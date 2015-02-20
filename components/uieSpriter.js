/*
 * UI SPRITER COMPONENT
 * by : Venere UIE team
 * 07/2013
 * 
 * example:

var myOptions = {
   reference: '#themewrapper'
};

var myspriter = new uieSpriter('sprite_analyzer',myOptions);
$('body').append(myspriter);

myspriter.analyzeSprites();

 */

function uieSpriter(id,options) {
   
   /*---------------------------------------------- VARIABLES DECLARATION ---*/
   /*---DEFAULTS---*/
   var defaults = {
      extension : {},      // css extension (accepts all 'styles' object properties)
      reference : 'body',  // selector in which will search for element with background
      visible   : true,    // default visibility before and right after sprites loaded
      opacity   : '0.3',   // obscurers opacity
      color     : '#f00',  // obscurers color
      border    : '#0f0',  // sprites border color
      image     : '',      // sprites background image pattern
      domain    : '',      // domain accepted (will not load images outside domain)
      callback  : null     // callback triggered when all sprites are loaded (after analyze)
   };
   if(options)extendObject(defaults,options);
   
   /*---STYLES---*/
   var styles = {
      main              : {position:'relative',display:defaults.visible?'block':'none'},
      obscurerContainer : {position:'relative',display:'block',top:'0',left:'0','text-align':'left',border:'1px solid '+defaults.border,visibility:'hidden'},
      spriteObscurer    : {position:'absolute',display:'block',background:defaults.color,opacity:defaults.opacity}
   };
   if(defaults.image && defaults.image!==''){
      styles.obscurerContainer.background = 'url("'+defaults.image+'") repeat scroll 0 0 transparent';
   }
   extendObject(styles,defaults.extension);
   generateStyleTag();
   
   /*---ELEMENTS---*/
   var spriter = newElement();
   function newElement(){
      if($('#'+id).length>0){
         $('#'+id).remove();
         console.log('Container ID already in use and thus has been removed.');
      }
      return $('<div id="'+id+'"/>');
   }
   
   /*---INITIAL VALUES---*/
   var spritesInfo = {};
   
   /*---------------------------------------------- SERVICE METHODS ---*/
   //sprites loading manager
   var spritesLoaded = 0; // updated by didLoadSprite()
   var spritesTotal = 0; // updated by getCSSImages()
   
   //before loading sprite
   function willLoadSprite(){
      if(spriter.css('visibility')==='hidden') return false;
      if(!defaults.visible) spriterShow(spriter);
      return true;
   }
   //after loading sprite
   function didLoadSprite(spriteNotLoaded){
      if((spriteNotLoaded?spritesLoaded:++spritesLoaded) < spritesTotal) return false;
      
      if(!defaults.visible) spriterHide(spriter);
      if(defaults.callback) defaults.callback(spritesInfo);
      return true;
   }
   //error loading sprite
   function failLoadSprite(imgurl){
      var cssUrl = cssFromUrl(imgurl);
      delete spritesInfo[cssUrl];
      
      spritesTotal = spritesInfoLength();
      didLoadSprite(true);
   }
   
   //show/hide elements while sprites are loading
   function spriterShow($elem){$elem.css('visibility','hidden').show();}
   function spriterHide($elem){$elem.css('visibility','visible').hide();}
   
   //create and append containers when all dom elements has been analyzed
   function imagesAnalyzed(_spritesInfo){
      var $img,arr;
      var $obsCont;
      var filename;
      for(var i in _spritesInfo){
         filename = filenameFromCss(i,true);
         arr = spriteObscurerArray(_spritesInfo[i]);
         $img = spriteImage(i);
         $obsCont = $('<div id="'+filename+'" class="obscurers_container"/>');
         $obsCont.append($img);
         for(var s in arr){
            $obsCont.append(arr[s]);
         }
         spriter.append($obsCont);
      }
   }
   
   /*---DOM ELEMENT FACTORIES---*/
   //container div for all sprite obscurers (and the sprite itself)
   function spriteObscurer(ob){
      var styles = 'top:'+ob.pos.t+'px; left:'+ob.pos.l+'px; width:'+ob.size.w+'px; height:'+ob.size.h+'px;';
      var $so = $('<div class="sprite_obscurer" style="'+styles+'"/>');
      return $so;
   }
   
   //generate sprite obscurer styles wrapped in a <style> tag appended to HEAD
   function generateStyleTag(){
      $('#spriter_style').remove();
      var styletag = $('<style id="spriter_style"/>');
      styletag.append('#'+id+'                      {'+styleObjToString(styles.main)+'}');
      styletag.append('#'+id+' .sprite_obscurer     {'+styleObjToString(styles.spriteObscurer)+'}');
      styletag.append('#'+id+' .obscurers_container {'+styleObjToString(styles.obscurerContainer)+'}');
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
   //convert each property of a single style object (eg. slider_bar) to a single string
   function styleObjToString(obj){
      var styleArray = [];
      for(var s in obj) styleArray.push(s+':'+obj[s]+';');
      return styleArray.join('');
   }
   
   /*---GETTERS---*/
   //analyze all child elements of 'reference' and take its own background images and position
   function getCSSImages(cb,externalCB){
      var $main = $(defaults.reference);
      var $nodes = $main.find('*');
      
      console.log('calculating... (please, wait until done!)');
      $nodes.each(function(i,e){
         var $elm = $(e);
         var img = $elm.css('background-image');
         var canContinue = (defaults.domain==='');
         if(!canContinue && img.indexOf(defaults.domain)>-1)
            canContinue = true;
         
         if(canContinue){
            var posStr = $elm.css('background-position');
            var posArr = posStr.split(' ');
            var posX = (numberFromCssProp(posArr[0]))*-1;
            var posY = (numberFromCssProp(posArr[1]))*-1;
            var offW = numberFromCssProp($elm.css('padding-left')) + numberFromCssProp($elm.css('padding-right'));
            var offH = numberFromCssProp($elm.css('padding-top')) + numberFromCssProp($elm.css('padding-bottom'));

            var pos = {l:posX,t:posY};
            var size = {w:offW+$elm.width(),h:offH+$elm.height()};
            if(img && img!=='none'){
                if(!spritesInfo[img]) spritesInfo[img]=[];
                spritesInfo[img].push({pos:pos,size:size});
            }
         }
      });
      console.log('DONE!');
      
      spritesTotal = spritesInfoLength();
      if(cb) {
         cb(spritesInfo,externalCB);
         return true;
      }
      else return spritesInfo;
   }
   
   //number of spritesInfo properties (ie. number of sprites)
   function spritesInfoLength(){
      var s,tot = 0;
      for(s in spritesInfo) if(spritesInfo.hasOwnProperty(s)) tot++;
      return tot;
   }
   
   //load a single sprite and return the img dom element (not appended to body)
   function spriteImage(cssUrl){
      var url = urlFromCss(cssUrl);
      var fid = filenameFromCss(cssUrl,true);
      
      willLoadSprite();
      function imageLoaded(e){
         var $img = $(e.target);
         var size = {width:$img.width(),height:$img.height()};
         var $cont = $('#'+fid);
         $cont.css(size);
         
         if(!defaults.visible) spriterHide($cont);
         
         didLoadSprite();
      }
      function imageError(e){
         var imgurl = e.target.src;
         alert('Failed to load the image:\n'+imgurl);
         failLoadSprite(imgurl);
      }
      
      var $image = $('<img/>');
      $image
         .on('load',imageLoaded)
         .on('error',imageError);
      $image.attr('src',url);
      return $image;
   }
   
   //array of obscurer for a single sprite
   function spriteObscurerArray(imageObject){
      var ob,$so;
      var arr = [];
      for(var i in imageObject){
         ob = imageObject[i];
         $so = spriteObscurer(ob);
         arr.push($so);
      }
      return arr;
   }
   
   //numeric value of a css property
   function numberFromCssProp(prop){
      return Number(prop.replace(/px|%/g,''));
   }
   //url string from css background-image property
   function urlFromCss(cssUrl){
      return cssUrl.replace(/url\(|\"|\)/g,'');
   }
   //file name only from url string
   function filenameFromUrl(url){
      var i = url.lastIndexOf("/");
      var f = url.substr(i+1);
      return f;
   }
   //file name only from css background-image property (trim extension to have the sole name)
   function filenameFromCss(cssUrl,trimExtension){
      var f = filenameFromUrl(urlFromCss(cssUrl));
      return (trimExtension) ?
               f.replace(/.png|.jpg|.jpeg|.gif/g,'') :
               f;
   }
   //given url wrapped in css property
   function cssFromUrl(url){
      return 'url("'+url+'")';
   }

   /*---------------------------------------------- PUBLIC OBJECTS AND METHODS ---*/
   /*---PRIVATE TO PUBLIC METHODS---*/
   function privateGetCSSImages(){
      getCSSImages(imagesAnalyzed);
      return spriter;
   }
   function privateGetSpritesWithObscurers(){
      return getCSSImages();
   }
   function privateGetSpritesInfo(){
      return spritesInfo;
   }
   function privateFilenameFromCss(cssUrl,trimExtension){
      return filenameFromCss(cssUrl,trimExtension);
   }
   
   /*---PUBLICLY EXPOSED OBJECT---*/
   spriter.analyze  = privateGetCSSImages;
   spriter.css2file = privateFilenameFromCss;
   spriter.getinfo  = {
                       sprites     : privateGetSpritesWithObscurers,
                       spritesInfo : privateGetSpritesInfo
                      };
   return spriter;
   
}
