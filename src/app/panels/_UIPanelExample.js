/**
 * Created by fdimonte on 20/03/2015.
 */

var UIPanelExample = (function($,UIBasePanel){

    /**
     * UIPanelExample Class
     * @param id
     * @param label
     * @constructor
     */
    function UIPanelExample(id,label){

        var baseID = 'fib_panel';
        this._selectors = {
            main : baseID,
            name : baseID + '-name',
            prop : baseID + '-property'
        };

        UIBasePanel.call(this,id,label);
    }

    /**
     * UIPanelExample prototype
     *
     * @type {UIBasePanel}
     */
    UIPanelExample.prototype = Object.create( UIBasePanel.prototype );

    /********************
     * OVERRIDABLE METHODS
     ********************/

    UIPanelExample.prototype.createContent = function() {

        var $content = $('<div/>')
            .append($('<ul/>').attr('id',this._selectors.main))
            .append($('<p/>').text('panel content'));

        // the returned jQuery object will be appended to this.$el
        return $content.children();

    };

    UIPanelExample.prototype.setEvents = function() {

        // bind events using this.addListener method
        this.addListener('click', '#'+this._selectors.prop, function(e){
            this.trigger('panel_prop_clicked');
            // do something else if needed
        });

    };

    UIPanelExample.prototype.getStyles = function() {

        var styles = {};

        // use css object as value for each property as selector and return it
        styles['#'+this._selectors.name] = {position:'absolute'};
        styles['#'+this._selectors.prop] = {position:'relative'};
        styles['#'+this._selectors.prop+' input'] = {'font-size':'18px'};

        return styles;

    };

    /********************
     * PUBLIC METHODS
     ********************/

    UIPanelExample.prototype.publicMethod = function() {
        // do something
        // call private methods like this
        privateMethod.call(this);
    };

    /********************
     * PRIVATE METHODS
     ********************/

    function privateMethod(){
        // do something
    }

    return UIPanelExample;

}(jQuery,UIBasePanel));