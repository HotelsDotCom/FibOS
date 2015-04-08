/**
 * Created by fdimonte on 18/03/2015.
 */

var UIWidgetExample = (function($, UIBaseWidget){

    /**
     * UIWidgetExample Class
     *
     * @param ID
     * @param options
     * @constructor
     */
    function UIWidgetExample(ID, options){
        // custom code here to be used before or inside 'init' methods
        UIBaseWidget.call(this, ID, options);
    }

    /**
     * UIWidgetExample prototype
     *
     * @type {UIBaseWidget}
     */
    UIWidgetExample.prototype = Object.create( UIBaseWidget.prototype );

    /********************
     * OVERRIDABLE METHODS
     ********************/

    UIWidgetExample.prototype.initOptions = function(options) {

        // extend _options object with options param
        this.setOptions({
                myBoolean: true,
                myString: 'example',
                myObject: {
                    isExample: true
                }
        },options);

        // extra code HERE in order to use or modify some options
        // usually to ensure some options not to be overridden

    };

    UIWidgetExample.prototype.initStyles = function(extension) {

        // create a selectors mapping
        this._selectorsMapping = {
            par: '.content p',
            small: '.content p small'
        };

        // create a global selectors object
        this._globalSelectors = {
            small: true
        };

        // extend _styles object with extension param (accepts multiple Objects)
        this.setStyles({
            par: {'font-family':'Arial','font-size':'12px'},
            big: {'font-size':'18px','font-weight':'800'},
            small: {'font-size':'8px'}
        },extension);

        /*
        the above example will produce this css:

        #mainID .content p {font-family:Arial;font-size:12px;}
        #mainID .big {font-size:18px;font-weight:800;}
        .content p small {font-size:8px;}
        */

        // extra code HERE in order to use or modify some styles
        // usually to ensure some rules not to be overridden

    };

    UIWidgetExample.prototype.initEvents = function() {

        // set up events with jQuery or simple javascript
        // something like..
        this.$el.off('.namespace')
            .on('mouseover.namespace',mouse_handler.bind(this));

    };

    UIWidgetExample.prototype.createSubElements = function() {

        // create this.$el's sub-elements
        this.$el.addClass('myClass');
        this.$subElement = $('<div/>').addClass('sub');

        this.$el.append(this.$subElement);

    };

    UIWidgetExample.prototype.afterInit = function() {

        // do some initialization process after all elements are created and all events are bind
        // eg:
        this.publicMethod();

    };

    /********************
     * PUBLIC METHODS
     ********************/

    UIWidgetExample.prototype.publicMethod = function() {
        // do something
        // call private methods like this
        privateMethod.call(this);
    };

    /********************
     * PRIVATE METHODS
     ********************/

    function privateMethod(){
        // do something
    }

    function mouse_handler(e){
        // mouse events handler
    }

    return UIWidgetExample;

}(jQuery, UIBaseWidget));