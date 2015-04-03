/**
 * Created by fdimonte on 23/02/2015.
 */

var UIBasePanel = (function($){

    /**
     * UIBasePanel Class
     *
     * @constructor
     * @param id
     * @param label
     */
    function UIBasePanel(id,label) {
        this.$el = null;
        this._ID = id;
        this._label = label;
        this._gui = null;

        this._listeners = {};

        /*
        the initialize process will call
            this.createContent() - should be overridden
        which will returns a group of jQuery object to be appended to this.$el by
            this.createElement() - should NOT be overridden
        this method returns a Boolean success, if TRUE will call
            this.setEvents() - should be overridden
         */
        this.init();
    }

    /**
     * UIBasePanel prototype
     *
     * @type {{setEvents: Function, getStyles: Function, createContent: Function, init: Function, createElement: Function, addTo: Function, open: Function, close: Function, toggle: Function, addListener: Function, on: Function, off: Function, trigger: Function, fiboSelect: Function}}
     */
    UIBasePanel.prototype = {

        /********************
         * OVERRIDABLE METHODS
         ********************/

        enabled: function() {},
        disabled: function() {},
        setEvents: function() {},
        getStyles: function() {},
        createContent: function() {},

        /********************
         * PUBLIC METHODS
         ********************/

        /*---INITIALIZE METHODS---*/

        init: function() {
            if(this.createElement(this.createContent()))
                this.setEvents();
            else
                throw new Error('cannot initialize panel: '+this._ID+' ('+this._label+')');
        },

        createElement: function(content) {
            if(!content) return false;
            var label_id = this._ID+'_checkbox';

            var $panel   = $('<div/>').addClass('fib-panel').attr('id',this._ID),
                $label   = $('<div/>').addClass('fib-label-cont'),
                $content = $('<div/>').addClass('fib-content'),
                $overlay = $('<div/>').addClass('fib-overlay').append($('<span/>').text(this._message_disabled || 'disabled'));

            $label.append(this.getBaseElement('checkbox','arrow').attr('id',label_id));
            $label.append($('<label/>').attr('for',label_id).html(this._label));

            $content.append($overlay.hide()).append(content);

            this.$el = $panel.append($label).append($content);
            this.$el.find('.fib-label-cont').find('.fib-checkbox').on('change',function(e){
                this.trigger( 'toggle_panel', {target:this, toggle:$(e.currentTarget).is(':checked')} );
            }.bind(this));

            return true;
        },

        /*---SERVICE METHODS---*/

        // add panel to FibOS GUI
        addTo: function(gui) {
            this._gui = gui;
        },

        // enable/disable panel
        enable: function() {
            this.$el.find('.fib-overlay').fadeOut(200);
            this.enabled();
        },
        disable: function() {
            this.$el.find('.fib-overlay').fadeIn(200);
            this.disabled();
        },

        // open/close panel management
        open: function() {
            this.$el.addClass('fib-panel-open');
            this.$el.find('.fib-label-cont').find('.fib-checkbox').prop('checked',true);
            this.$el.find('.fib-content').slideDown();
            this.trigger('panel_open');
        },
        close: function() {
            this.$el.removeClass('fib-panel-open');
            this.$el.find('.fib-label-cont').find('.fib-checkbox').prop('checked',false);
            this.$el.find('.fib-content').slideUp();
            this.trigger('panel_close');
        },
        toggle: function() {
            if(isPanelOpen(this))
                this.close();
            else
                this.open();
        },
        isOpen: function() {
            return isPanelOpen(this);
        },

        // events management
        addListener: function(event,child,callback){
            if(typeof(child)=='function')
                this.$el.on(event,child.bind(this));
            else if(typeof(child)=='string')
                this.$el.on(event,child,callback.bind(this));
        },
        on: function(event,handler){
            this._listeners[event] || (this._listeners[event]=[]);
            this._listeners[event].push(handler);
        },
        off: function(event){
            this._listeners[event] = null;
        },
        trigger: function(event,data){
            this._gui && this._gui._logEvents && console.log('#%d : [%s] -> %s(%o)',++this._gui._logEventId,this._ID,event,data)

            var events = this._listeners[event];
            if(!events) return;
            for(var e in events) if(events.hasOwnProperty(e)) events[e](data,event);
        },

        /*---FACTORY METHODS---*/

        fiboSelect : function(list,id,firstValue) {
            if(!list && !id) return null;

            var $select = this.getBaseElement('select').attr('id',id);

            if(firstValue)
                $select.append($('<option/>').attr('disabled',true).attr('selected',true).val('none').text(firstValue));

            for(var f=0;f<list.length;f++)
                $select.append($('<option/>').val(('00'+list[f]).substr(-3)).text(list[f]));

            return $select;
        },

        getBaseElement: function(tag,suffix){
            if(!tag) return null;

            var prefix = 'fib';
            var tags = {
                list     : 'ul',
                checkbox : 'input',
                button   : 'input',
                radio    : 'input',
                text     : 'input'
            };

            var $tag = $('<'+(tags[tag]||tag)+'/>');
            $tag.addClass([prefix,tag].join('-'));

            suffix    != null    && $tag.addClass([prefix,tag,suffix].join('-'));
            tags[tag] == 'input' && $tag.attr('type',tag);

            return $tag;
        }

    };

    /********************
     * PRIVATE METHODS
     ********************/

    function isPanelOpen(panel){
        return panel.$el.find('.fib-content').css('display')!=='none';
    }

    return UIBasePanel;

}(jQuery));
