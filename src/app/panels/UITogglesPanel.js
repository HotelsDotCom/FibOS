/**
 * Created by fdimonte on 23/02/2015.
 */

var UITogglesPanel = (function($,UIExtraPanel){

    /**
     * UITogglesPanel Class
     *
     * @constructor
     * @param id
     */
    function UITogglesPanel(id) {

        var baseID = 'fibo_toggle_';
        this._selectors = {
            main    : baseID + 'main',
            spacers : baseID + 'spacers',
            overlay : baseID + 'overlay',
            rulers  : baseID + 'rulers',
            markers : baseID + 'markers'
        };

        UIExtraPanel.call(this,id);
    }

    /**
     * UITogglesPanel prototype
     *
     * @type {UIBasePanel}
     */
    UITogglesPanel.prototype = Object.create(UIExtraPanel.prototype);

    /********************
     * OVERRIDABLE METHODS
     ********************/

    UITogglesPanel.prototype.createContent = function() {
        var $content = $('<div/>')
            .append($('<div/>').attr('id',this._selectors.main))
            .append(this.panelCheckbox(this._selectors.spacers,'toggle spacers',true))
            .append(this.panelCheckbox(this._selectors.overlay,'toggle overlay',false))
            .append(this.panelCheckbox(this._selectors.rulers, 'toggle rulers',false))
            .append(this.panelCheckbox(this._selectors.markers,'toggle marker tool',false));

        return $content.children();
    };

    UITogglesPanel.prototype.setEvents = function() {

    };

    UITogglesPanel.prototype.getStyles = function() {

    };

    /********************
     * PUBLIC METHODS
     ********************/


    /********************
     * PRIVATE METHODS
     ********************/


    return UITogglesPanel;

}(jQuery,UIExtraPanel));
