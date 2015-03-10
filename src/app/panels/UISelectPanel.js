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
    function UISelectPanel(id,list,spacers) {
        this._spacersList = list;
        this._spacersObject = spacers;

        var baseID = 'fibo_clone_';
        this._selectors = {
            choose  : baseID + 'select',
            element : baseID + 'element'
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
            .append(this.fiboSelect(this._spacersList,this._selectors.choose))
            .append($('<div/>').attr('id',this._selectors.element));

        return $content.children();
    };

    UISelectPanel.prototype.setEvents = function() {

        this.addListener('change keyup', '#'+this._selectors.choose, function(e){
            this.trigger('clone_select', $(e.currentTarget).val());
            $('#'+this._selectors.element).html(this._spacersObject['f_'+$(e.currentTarget).val()]);
        });
        this.addListener('mousedown', '#'+this._selectors.element+' .fibospacer', function(e){
            this.trigger('clone_spacer', {
                pos    : {top:e.pageY,left:e.pageX},
                $clone : $('#'+this._selectors.element),
                spacer : e.currentTarget
            });
        });

    };

    UISelectPanel.prototype.getStyles = function() {

    };

    /********************
     * PUBLIC METHODS
     ********************/

    UISelectPanel.prototype.toggleCloneDisplay = function(show) {
        $('#'+this._selectors.element)[show?'show':'hide']();
    };

    /********************
     * PRIVATE METHODS
     ********************/


    return UISelectPanel;

}(jQuery,UIExtraPanel));
