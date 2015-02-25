/**
 * Created by fdimonte on 23/02/2015.
 */

var UISelectPanel = (function($,UIExtraPanel){

    /**
     * UISelectPanel Class
     *
     * @constructor
     * @param id
     * @param list
     */
    function UISelectPanel(id,list) {
        this._spacersList = list;

        var baseID = 'fibo_clone_';
        this._selectors = {
            select: baseID + 'select'
        };

        UIExtraPanel.call(this,id);
    }

    /**
     * UISelectPanel prototype
     *
     * @type {UIBasePanel}
     */
    UISelectPanel.prototype = Object.create(UIExtraPanel.prototype);

    /********************
     * OVERRIDABLE METHODS
     ********************/

    UISelectPanel.prototype.createContent = function() {
        var $content = $('<div/>')
            .append(this.fiboSelect(this._spacersList,this._selectors.select));

        return $content.children();
    };

    UISelectPanel.prototype.setEvents = function() {

    };

    UISelectPanel.prototype.getStyles = function() {

    };

    /********************
     * PUBLIC METHODS
     ********************/


    /********************
     * PRIVATE METHODS
     ********************/


    return UISelectPanel;

}(jQuery,UIExtraPanel));
