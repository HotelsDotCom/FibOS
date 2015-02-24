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

        var baseID = 'fibo_';
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

    };

    UIStoragePanel.prototype.getStyles = function() {

    };

    /********************
     * PUBLIC METHODS
     ********************/

    UIStoragePanel.prototype.save = function(){
        this._gui._components.uiSpacer.setLocalStorage();
    };
    UIStoragePanel.prototype.restore = function(){
        var stJson = this._gui._components.uiSpacer.getLocalStorage(true);
        this._gui._panels.groupPanel.showGroupsList(stJson);
    };
    UIStoragePanel.prototype.importJson = function(){
        this._gui._components.uiSpacer.loadSpacersFromJson($('#fibo_input').val(),true);
        var stJson = JSON.stringify(this._gui._components.uiSpacer.spacersGroups.groups);
        this._gui._panels.groupPanel.showGroupsList(stJson);
    };
    UIStoragePanel.prototype.exportJson = function(){
        var stJson = JSON.stringify(this._components.uiSpacer.spacersGroups.groups);
        console.log(stJson);
        alert("Open your browser's console and see the export string.");
    };

    /********************
     * PRIVATE METHODS
     ********************/


    return UIStoragePanel;

}(jQuery,UIBasePanel));
