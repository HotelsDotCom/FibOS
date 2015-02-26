/**
 * Created by fdimonte on 23/02/2015.
 */

var UIStoragePanel = (function($,UIBasePanel){

    /**
     * UIStoragePanel Class
     *
     * @param id
     * @param label
     * @constructor
     */
    function UIStoragePanel(id,label) {

        var baseID = 'fibo_storage_';
        this._selectors = {
            restore : baseID + 'restore',
            save    : baseID + 'save'
        };

        UIBasePanel.call(this,id,label);
    }

    /**
     * UIStoragePanel prototype
     *
     * @type {UIBasePanel}
     */
    UIStoragePanel.prototype = Object.create(UIBasePanel.prototype);

    /********************
     * OVERRIDABLE METHODS
     ********************/

    UIStoragePanel.prototype.createContent = function() {
        var $content = $('<div/>')
            .append($('<input/>').attr('type','button').addClass('vui-btn').attr('id',this._selectors.restore).val('restore'))
            .append($('<input/>').attr('type','button').addClass('vui-btn').attr('id',this._selectors.save).val('save'));

        return $content.children();
    };

    UIStoragePanel.prototype.setEvents = function() {

        this.addListener('click', '#'+this._selectors.restore, function(e){this.trigger('history_restore');});
        this.addListener('click', '#'+this._selectors.save,    function(e){this.trigger('history_save');});

    };

    UIStoragePanel.prototype.getStyles = function() {

    };

    /********************
     * PUBLIC METHODS
     ********************/


    /********************
     * PRIVATE METHODS
     ********************/


    return UIStoragePanel;

}(jQuery,UIBasePanel));
