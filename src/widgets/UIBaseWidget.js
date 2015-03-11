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

        this._init(options);

    }

    /**
     * UIBaseWidget prototype
     *
     * @type {{initOptions: Function, initStyles: Function, initEvents: Function, createSubElements: Function, afterInit: Function, show: Function, hide: Function, _init: Function, _createElement: Function, _createStyleTag: Function, _extendObject: Function, _styleObjectToString: Function}}
     */
    UIBaseWidget.prototype = {

        /********************
         * OVERRIDABLE METHODS
         ********************/

        initOptions: function(options) {
            // does nothing
            // override this method in order to setup options
        },

        initStyles: function(extension) {
            // does nothing
            // override this method in order to setup styles
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

        show: function(){this.$el.show();},
        hide: function(){this.$el.hide();},

        setOptions: function(/* option objects */) {
            for(var i in arguments) if(arguments.hasOwnProperty(i)) this._extendObject(this._options, arguments[i]);
        },
        setStyles: function(/* style objects */) {
            for(var i in arguments) if(arguments.hasOwnProperty(i)) this._extendObject(this._styles, arguments[i]);
        },

        /********************
         * INTERNAL METHODS
         ********************/

        _init: function(options) {
            this.initOptions(options);
            this.initStyles(this._options.extension);

            this._createElement();
            this._createStyleTag();

            this.initEvents();
            this.afterInit();
        },

        _createElement: function() {
            var $elem = $('#'+this._ID);
            if($elem.length>0){
                $elem.remove();
                console.log('Container ID already in use and thus has been removed.');
            }
            this.$el = $('<div/>').attr('id',this._ID);
            this.createSubElements();
        },

        _createStyleTag: function() {
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

                    $style.append(selector + ' {'+this._styleObjectToString(styleString)+'}');
                }
            }

            $('head').append($style);
        },

        /********************
         * SERVICE METHODS
         ********************/

        //extend each property of the given object with the same property of the given extension
        _extendObject: function(obj,ext) {
            if(!ext) return;
            for(var p in ext){
                if(ext.hasOwnProperty(p)){
                    if(obj[p] && (obj[p] instanceof Object) && !(obj[p] instanceof Array)) this._extendObject(obj[p],ext[p]);
                    else obj[p] = ext[p];
                }
            }
        },

        //convert each property of a single style object to a single string
        _styleObjectToString: function(obj) {
            var styleArray = [];
            for(var s in obj) if(obj.hasOwnProperty(s)) styleArray.push(s+':'+obj[s]+';');
            return styleArray.join('');
        }

    };

    return UIBaseWidget;

}(jQuery));
