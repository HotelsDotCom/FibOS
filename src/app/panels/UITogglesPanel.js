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

        this.addListener('click',  '#'+this._selectors.main, function(e){this.trigger('toggle_fibos');});

        this.addListener('change', '#'+this._selectors.spacers+' .fibo_checkbox', checkbox_handler.call(this,'toggle_spacers'));
        this.addListener('change', '#'+this._selectors.overlay+' .fibo_checkbox', checkbox_handler.call(this,'toggle_overlay'));
        this.addListener('change', '#'+this._selectors.rulers +' .fibo_checkbox', checkbox_handler.call(this,'toggle_rulers') );
        this.addListener('change', '#'+this._selectors.markers+' .fibo_checkbox', checkbox_handler.call(this,'toggle_markers'));

    };

    UITogglesPanel.prototype.getStyles = function() {

    };

    /********************
     * PUBLIC METHODS
     ********************/


    /********************
     * PRIVATE METHODS
     ********************/

    function checkbox_handler(event){
        return function(e){
            this.trigger(event, $(e.currentTarget).is(':checked'));
        }.bind(this);
    }

    return UITogglesPanel;

}(jQuery,UIExtraPanel));
