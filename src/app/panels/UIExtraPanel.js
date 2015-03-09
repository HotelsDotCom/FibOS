/**
 * Created by fdimonte on 25/02/2015.
 */

var UIExtraPanel = (function($,UIBasePanel) {

    /**
     * UIExtraPanel Class
     *
     * @param id
     * @constructor
     */
    function UIExtraPanel(id) {
        UIBasePanel.call(this,id);
    }

    /**
     * UIExtraPanel prototype
     *
     * @type {UIBasePanel}
     */
    UIExtraPanel.prototype = Object.create(UIBasePanel.prototype);

    UIExtraPanel.prototype.createElement = function(content) {
        if(!content) return false;
        this.$el = $('<div/>').attr('id',this._ID).append(content);
        return true;
    };

    return UIExtraPanel;

}(jQuery,UIBasePanel));
