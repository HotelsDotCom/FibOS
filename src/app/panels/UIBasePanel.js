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
     * @type {{setEvents: Function, getStyles: Function, createContent: Function, init: Function, createElement: Function, addTo: Function, open: Function, close: Function, toggle: Function, addListener: Function, on: Function, off: Function, trigger: Function, fiboSelect: Function, panelCheckbox: Function}}
     */
    UIBasePanel.prototype = {

        /********************
         * OVERRIDABLE METHODS
         ********************/

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

            var $module  = $('<div/>').addClass('vui-panel').attr('id',this._ID),
                $label   = $('<div/>').addClass('vui-label'),
                $content = $('<div/>').addClass('vui-content');

            $label.append($('<input/>').attr('id',label_id).addClass('fibo_checkbox').attr('type','checkbox'));
            $label.append($('<label/>').attr('for',label_id).html(this._label));

            $content.append(content);

            this.$el = $module.append($label).append($content);
            this.$el.find('.fibo_checkbox').on('change',this.toggle_handler.bind(this));
            return true;
        },

        /*---SERVICE METHODS---*/

        // add panel to FibOS GUI
        addTo: function(gui) {
            this._gui = gui;
        },

        // open/close panel management
        open: function() {
            this.$el.addClass('fibo_panel_open');
            this.$el.find('.vui-label').find('.fibo_checkbox').attr('checked',true);
            this.$el.find('.vui-content').slideDown();
        },
        close: function() {
            this.$el.removeClass('fibo_panel_open');
            this.$el.find('.vui-label').find('.fibo_checkbox').attr('checked',false);
            this.$el.find('.vui-content').slideUp();
        },
        toggle: function() {
            if(isPanelOpen(this))
                this.close();
            else
                this.open();
        },
        toggle_handler: function(e) {
            var $t = $(e.currentTarget);
            if($t.is(':checked'))
                this.open();
            else
                this.close();
        },

        /*---FACTORY METHODS---*/

        fiboSelect : function(list,id,skipFirst) {
            if(!list && !id) return null;

            var $select = $('<select/>').attr('id',id);

            if(!skipFirst)
                $select.append($('<option/>').attr('disabled',true).attr('selected',true).val('none').text('chose a spacer'));

            for(var f=0;f<list.length;f++)
                $select.append($('<option/>').val(('00'+list[f]).substr(-3)).text(list[f]));

            return $select;
        },

        panelCheckbox : function(cont_id,title,checked) {
            var labid = cont_id+'_checkbox';
            var $container = $('<div/>').attr('id',cont_id).addClass('fibo_toggle');
            var $checkbox = $('<input/>').attr('id',labid).addClass('fibo_checkbox').attr('type','checkbox').attr('checked',checked);
            var $label = $('<label/>').attr('for',labid).attr('title',title).html('&nbsp;');
            return $container.append($checkbox).append($label);
        }

    };

    /********************
     * PRIVATE METHODS
     ********************/

    function isPanelOpen(panel){
        return panel.$el.find('.vui-content').css('display')!=='none';
    }

    return UIBasePanel;

}(jQuery));
