/**
 * Created by fdimonte on 23/02/2015.
 */

var UIInputPanel = (function($,UIBasePanel){

    /**
     * UIInputPanel Class
     *
     * @constructor
     * @param id
     * @param label
     */
    function UIInputPanel(id,label) {

        var baseID = 'fibo_input_';
        this._selectors = {
            input : baseID + 'text',
            load  : baseID + 'load',
            share : baseID + 'export'
        };

        UIBasePanel.call(this,id,label);
    }

    /**
     * UIInputPanel prototype
     *
     * @type {UIBasePanel}
     */
    UIInputPanel.prototype = Object.create(UIBasePanel.prototype);

    /********************
     * OVERRIDABLE METHODS
     ********************/

    UIInputPanel.prototype.createContent = function() {
        var $content = $('<div/>')
            .append($('<textarea/>').attr('id',this._selectors.input))
            .append($('<input/>').attr('type','button').addClass('vui-btn').attr('id',this._selectors.load).val('import'))
            .append($('<input/>').attr('type','button').addClass('vui-btn').attr('id',this._selectors.share).val('export'));

        return $content.children();
    };

    UIInputPanel.prototype.setEvents = function() {

        this.addListener('click', '#'+this._selectors.load, function(e){
            this.trigger('input_import', $('#'+this._selectors.input).val());
        });
        this.addListener('click', '#'+this._selectors.share, function(e){
            this.trigger('input_export');
        });

    };

    UIInputPanel.prototype.getStyles = function() {

    };

    /********************
     * PUBLIC METHODS
     ********************/

    UIInputPanel.prototype.setJson = function(json) {
        this.$el.find('#'+this._selectors.input).val(json);
    };

    /********************
     * PRIVATE METHODS
     ********************/


    return UIInputPanel;

}(jQuery,UIBasePanel));
