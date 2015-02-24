/**
 * Created by fdimonte on 23/02/2015.
 */

var UISpritePanel = (function($,UIBasePanel){

    /**
     * UISpritePanel Class
     *
     * @constructor
     * @param id
     * @param label
     */
    function UISpritePanel(id,label) {

        var baseID = 'fibo_sprites';
        this._selectors = {
            tree    : 'sprites_tree',
            analyze : baseID + 'analyze'
        };

        UIBasePanel.call(this,id,label);
    }

    /**
     * UISpritePanel prototype
     *
     * @type {UIBasePanel}
     */
    UISpritePanel.prototype = Object.create(UIBasePanel.prototype);

    /********************
     * OVERRIDABLE METHODS
     ********************/

    UISpritePanel.prototype.createContent = function() {
        var $content = $('<div/>')
            .append($('<ul/>').attr('id',this._selectors.tree))
            .append($('<input/>').attr('type','button').addClass('vui-btn').attr('id',this._selectors.analyze).val('analyze'));

        return $content.children();
    };

    UISpritePanel.prototype.setEvents = function() {

    };

    UISpritePanel.prototype.getStyles = function() {

    };

    /********************
     * PUBLIC METHODS
     ********************/


    /********************
     * PRIVATE METHODS
     ********************/


    return UISpritePanel;

}(jQuery,UIBasePanel));
