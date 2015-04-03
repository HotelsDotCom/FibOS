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

        var baseID = 'fib_clone';
        this._selectors = {
            base    : baseID,
            choose  : baseID + '-select',
            element : baseID + '-element'
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
            .append(this.fiboSelect(this._spacersList,this._selectors.choose,'choose'))
            .append($('<div/>').attr('id',this._selectors.element));

        return $content.children();
    };

    UISelectPanel.prototype.setEvents = function() {

        this.addListener('change keyup', '#'+this._selectors.choose, function(e){
            this.trigger('clone_select', $(e.currentTarget).val());
            $('#'+this._selectors.element).html(this._spacersObject['f_'+$(e.currentTarget).val()]);
        });
        this.addListener('mousedown', '#'+this._selectors.element+' .fibospacer', function(e){
            var $c = $('#'+this._selectors.element);
            var pos = {top:e.pageY, left:e.pageX};
            var mzero = {
                top  : -pos.top  + $c.position().top  + parseInt($c.css('padding-top')) + parseInt($c.css('margin-top')),
                left : -pos.left + $c.position().left + parseInt($c.css('padding-left'))
            };

            this.trigger('clone_spacer', {
                pos    : pos,
                mzero  : mzero,
                spacer : e.currentTarget
            });
        });

    };

    UISelectPanel.prototype.getStyles = function() {
        var styles = {};

        styles['#'+this._ID] = {
            'padding-top':'5px'
        };

        styles['#'+this._selectors.choose] = {
            display:'block',
            'margin':'0 auto'
        };

        styles['#'+this._selectors.element] = {
            left:'0',
            'margin-top':'9px',
            padding:'8px',
            position:'absolute'
        };

        return styles;
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
