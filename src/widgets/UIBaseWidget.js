/**
 * Created by fdimonte on 10/02/2015.
 */

var UIBaseWidget = (function($){

    /**
     * UIBaseWidget Class
     *
     * @param ID
     * @param options
     * @constructor
     */
    function UIBaseWidget(ID, options) {

        this.$el = null;

        this._ID = ID;

        this._selectorsMapping = null;
        this._globalSelectors = null;
        this._styles = {};
        this._options = {
            extension : {},    // css extension (accepts all 'styles' object properties)
            reference : 'body' // selector of reference element for all widget features
        };

        this.init(options);

    }

    /**
     * UIBaseWidget prototype
     *
     * @type {{init: Function, initOptions: Function, initStyles: Function, afterInit: Function, createSubElements: Function, createElement: Function, createStyleTag: Function, extendObject: Function, styleObjectToString: Function}}
     */
    UIBaseWidget.prototype = {

        /********************
         * OVERRIDABLE METHODS
         ********************/

        initOptions: function(options) {
            if(options) this.extendObject(this._options, options);
        },
        initStyles: function(extension) {
            if(extension) this.extendObject(this._styles, extension);
        },

        initEvents: function() {
            // does nothing
            // override this method in order to bind events
        },

        createSubElements: function() {
            // does nothing
            // override this method if the widget has internal sub-elements to be created
        },
        afterInit: function() {
            // does nothing
            // override this method if the widget needs some initial settings to be applied
        },

        /********************
         * PUBLIC METHODS
         ********************/

        init: function(options) {
            this.initOptions(options);
            this.initStyles(this._options.extension);

            this.createElement();
            this.createStyleTag();

            this.initEvents();
            this.afterInit();
        },

        createElement: function() {
            var $elem = $('#'+this._ID);
            if($elem.length>0){
                $elem.remove();
                console.log('Container ID already in use and thus has been removed.');
            }
            this.$el = $('<div/>').attr('id',this._ID);
            this.createSubElements();
        },

        createStyleTag: function() {
            var styleId = this._ID+'-style';
            $('#'+styleId).remove();

            var $style = $('<style/>').attr('id',styleId),
                selector,styleMap,styleClass,styleString,isGlobal;

            for(styleClass in this._styles){
                if(this._styles.hasOwnProperty(styleClass)){
                    styleString = this._styles[styleClass];
                    styleMap = this._selectorsMapping && this._selectorsMapping[styleClass];
                    isGlobal = this._globalSelectors && this._globalSelectors[styleClass];
                    selector = isGlobal ? '' : '#'+this._ID;

                    if(styleClass!='main')
                        selector += ' ' + (styleMap || '.'+styleClass);

                    $style.append(selector + ' {'+this.styleObjectToString(styleString)+'}');
                }
            }

            $('head').append($style);
        },

        show: function(){this.$el.show();},
        hide: function(){this.$el.hide();},

        /********************
         * SERVICE METHODS
         ********************/

        //extend each property of the given object with the same property of the given extension
        extendObject: function(obj,ext) {
            for(var p in ext){
                if(ext.hasOwnProperty(p)){
                    if(obj[p] && (obj[p] instanceof Object) && !(obj[p] instanceof Array)) this.extendObject(obj[p],ext[p]);
                    else obj[p] = ext[p];
                }
            }
        },

        //convert each property of a single style object to a single string
        styleObjectToString: function(obj) {
            var styleArray = [];
            for(var s in obj) if(obj.hasOwnProperty(s)) styleArray.push(s+':'+obj[s]+';');
            return styleArray.join('');
        }

    };

    return UIBaseWidget;

}(jQuery));
