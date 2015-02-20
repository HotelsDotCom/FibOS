/*
 * UI SLIDER COMPONENT
 * by : Venere UIE team
 * 06/2013
 * 
 * example:

function myCallback(perc,value) {
   console.log(value+" ("+Math.round(perc*100)+"%)");
}
var myExtension = {
   slider:         {margin:'5px',width:'200px'},
   slider_handler: {background:'rgba(100,100,200,1)',width:'20px'}
};
var myOptions = {
   callback:     myCallback,
   extension:    myExtension,
   minValue:     180,
   maxValue:     360,
   initialValue: 270,
   stepValue:    5
};

var mySlider = new uieSlider('mySlider',myOptions);
$('body').append(mySlider);

 */

function uieSlider(id,options) {
   
   /*---------------------------------------------- VARIABLES DECLARATION ---*/
   /*---DEFAULTS---*/
   var defaults = {
      extension    : {},    //css extension (accepts all 'styles' object properties)
      callback     : null,  //callback on slider value change
      minValue     : 0,     //minimum value accepted
      maxValue     : 100,   //maximum value accepted
      initialValue : 100,   //initial value (between min and max values)
      stepValue    : 1      //step value for handler dragging
   };
   if(options)extendObject(defaults,options);
   
   if(defaults.maxValue<=defaults.minValue)     defaults.maxValue = defaults.minValue+defaults.stepValue;
   if(defaults.initialValue<=defaults.minValue) defaults.initialValue = defaults.minValue;
   if(defaults.initialValue>=defaults.maxValue) defaults.initialValue = defaults.maxValue;

   /*---STYLES---*/
   var styles = {
      slider        :{position:'relative',width:'100px',height:'20px',background:'rgba(100,100,100,.4)'},
      slider_bar    :{position:'absolute',width:'100%', height:'3px', background:'rgb(200,200,200)',top:'9px'},
      slider_handler:{position:'absolute',width:'10px', height:'20px',background:'rgb(100,100,100)',top:'0',left:'0'},
      slider_output :{position:'absolute',width:'34px', height:'20px',background:'#fff',top:'0',right:'-34px','text-align':'center','font-size':'12px','line-height':'20px',cursor:'default'}
   };
   extendObject(styles,defaults.extension);
   
   /*---ELEMENTS---*/
   var slider = $('<div id="'+id+'" class="slider" style="'+styleObjToString(styles.slider)+'"/>');
   var slider_bar = $('<div class="slider_bar" style="'+styleObjToString(styles.slider_bar)+'"/>');
   var slider_handler = $('<div class="slider_handler" style="'+styleObjToString(styles.slider_handler)+'"/>');
   var slider_output = $('<div class="slider_output" style="'+styleObjToString(styles.slider_output)+'"/>');
   generateSlider();
   
   /*---INITIAL VALUE---*/
   var sliding,mousezero=0;
   setSliderVal(defaults.initialValue);
   
   /*---------------------------------------------- INTERNAL METHODS ---*/
   /*---EVENTS---*/
   $(slider).on('mousedown.sliderevent',quickSlide)
            .on('mousedown.sliderevent','.slider_handler',slideStart);
   $('body').on('mousemove.sliderevent',doSlide)
            .on('mouseup.sliderevent',slideStop);
   
   /*---EVENTS HANDLERS---*/
   //quickly move the slider and begin sliding
   function quickSlide(e){
      if($(e.target).is(slider_output)) return true;
      slider_handler.css('left',getPosx(e,-(slider_handler.width()/2)));
      slideStart(e);
      return false;
   }
   //start sliding
   function slideStart(e){
      mousezero=slider_handler.position().left-mouseposInside(e.pageX);
      sliding=true;
      doSlide(e);
      return false;
   }
   //stop sliding
   function slideStop(e){
      sliding=false;
      return false;
   }
   //sliding... :)
   function doSlide(e){
      if(sliding) setSliderPerc(getPosx(e)/sliderWidth());
      return false;
   }
   
   /*---------------------------------------------- SERVICE METHODS ---*/
   /*---DOM ELEMENT FACTORY---*/
   function generateSlider(){
      slider
         .append(slider_bar)
         .append(slider_handler)
         .append(slider_output);
   }
   
   /*---SLIDER VALUE MANAGER METHODS---*/
   //set and output the Slider value (from given value)
   function setSliderVal(val){
      var perc = (val-defaults.minValue)/(defaults.maxValue-defaults.minValue);
      setSliderPerc(perc);
   }
   //set and output the Slider value (from given percentage)
   function setSliderPerc(perc){
      var posx = (perc*sliderWidth());
      slider_handler.css('left',posx);
      outputSliderVal(perc);
   }
   //write the output value inside the slider_output element
   function outputSliderVal(perc){
      var value = Math.floor(getSliderVal(perc)*10)/10;
      slider_output.text(value);
      if(defaults.callback)defaults.callback(perc,value);
      return value;
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
   //get slider value from given percentage (according to minValue, maxValue and stepValue)
   function getSliderVal(perc){
      var vmin=defaults.minValue,vmax=defaults.maxValue,vstep=defaults.stepValue;
      return Math.round((vmin+(perc*(vmax-vmin)))/vstep)*vstep;
   }
   //pixel position of mouse inside Slider approximated to stepValue
   function getPosx(e,mzero){
      if(mzero)mousezero=mzero;
      var posx,wmax=sliderWidth();
      posx = mouseposInside(e.pageX)+mousezero;
      posx = posx<0?0 : posx>wmax?wmax : posx;
      var pxUnit=defaults.stepValue/(defaults.maxValue-defaults.minValue)*wmax;
      posx = Math.floor((posx+(pxUnit/2))/pxUnit)*pxUnit;
      return posx;
   }
   //pixel position of mouse inside Slider
   function mouseposInside(pagex){
      var realX = pagex-slider.offset().left;
      return realX;
   }
   //Slider full width
   function sliderWidth(){
      return slider.width()-slider_handler.width();
   }
   
   /*---------------------------------------------- PUBLIC OBJECTS AND METHODS ---*/
   /*---PRIVATE TO PUBLIC METHODS---*/
   function privateSetSliderValue(newval){
      setSliderVal(newval);
   }
   function privateSliderValue(){
      return outputSliderVal(privateSliderPercentage());
   }
   function privateSliderPercentage(){
      var posx = slider_handler.css('left').replace('px','');
      return posx/sliderWidth();
   }
   
   /*---PUBLICLY EXPOSED OBJECT---*/
   slider.setValue         = privateSetSliderValue;
   slider.sliderValue      = privateSliderValue;
   slider.sliderPercentage = privateSliderPercentage;
   return slider;
   
}
