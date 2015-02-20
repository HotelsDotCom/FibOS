/*
 * UI COMPONENT
 * by : Venere UIE team
 * [date]
 * 
 */

function uieComponent(id,options) {
   
   /*---------------------------------------------- VARIABLES DECLARATION ---*/
   /*---DEFAULTS---*/
   var defaults = {
      extension : {} //css extension (accepts all 'styles' object properties)
   };
   if(options)extendObject(defaults,options);
   
   /*---STYLES---*/
   var styles = {
   };
   extendObject(styles,defaults.extension);
   
   /*---ELEMENTS---*/
   var myComponent = newElement();
   function newElement(){
      if($('#'+id).length>0){
         $('#'+id).remove();
         console.log('Container ID already in use and thus has been removed.');
      }
      return $('<div id="'+id+'"/>');
   }
   
   /*---INITIAL VALUES---*/
   
   /*---------------------------------------------- INTERNAL METHODS ---*/
   /*---EVENTS---*/
   
   /*---EVENTS HANDLERS---*/
   
   /*---------------------------------------------- SERVICE METHODS ---*/
   /*---DOM ELEMENT FACTORIES---*/
   
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
   
   /*---------------------------------------------- PUBLIC OBJECTS AND METHODS ---*/
   /*---PRIVATE TO PUBLIC METHODS---*/
   
   /*---PUBLICLY EXPOSED OBJECT---*/
   return myComponent;
   
}
