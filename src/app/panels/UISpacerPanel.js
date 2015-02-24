/**
 * Created by fdimonte on 23/02/2015.
 */

var UISpacerPanel = (function($,UIBasePanel){

    /**
     * UISpacerPanel Class
     *
     * @constructor
     * @param id
     * @param label
     * @param list
     */
    function UISpacerPanel(id,label,list) {
        this._spacersList = list;

        var baseID = 'fibo_sel_';
        this._selectors = {
            spacer    : baseID + 'spacer',
            left      : baseID + 'left',
            top       : baseID + 'top',
            remove    : baseID + 'delete',
            duplicate : baseID + 'duplicate',
            slider    : baseID + 'slider_container'
        };

        UIBasePanel.call(this,id,label);

        this._spacerSelected = null;
    }

    /**
     * UISpacerPanel prototype
     *
     * @type {UIBasePanel}
     */
    UISpacerPanel.prototype = Object.create(UIBasePanel.prototype);

    /********************
     * OVERRIDABLE METHODS
     ********************/

    UISpacerPanel.prototype.createContent = function() {
        var $content = $('<div/>')
            .append($('<p/>')
                .text('spacer: ')
                .append(this.fiboSelect(this._spacersList,this._selectors.spacer,true)))
            .append($('<p/>')
                .text('left: ')
                .append($('<input/>').attr('type','text').attr('id',this._selectors.left)))
            .append($('<p/>')
                .text('top: ')
                .append($('<input/>').attr('type','text').attr('id',this._selectors.top)))
            .append($('<p/>')
                .text('opacity: '))
            .append($('<div/>').attr('id',this._selectors.slider))
            .append($('<input/>').attr('type','button').addClass('vui-btn').attr('id',this._selectors.remove).val('remove'))
            .append($('<input/>').attr('type','button').addClass('vui-btn').attr('id',this._selectors.duplicate).val('duplicate'));

        return $content.children();
    };

    UISpacerPanel.prototype.setEvents = function() {

    };

    UISpacerPanel.prototype.getStyles = function() {

    };

    /********************
     * PUBLIC METHODS
     ********************/

    UISpacerPanel.prototype.moveCallback = function(moved){
        this._spacerSelected = moved;
        this.updateInfo();
    };

    UISpacerPanel.prototype.updateInfo = function(){
        var attr = this.getInfo();
        $('#'+this._selectors.spacer).val(attr.f);
        $('#'+this._selectors.left).val(attr.l);
        $('#'+this._selectors.top).val(attr.t);
        this._gui._components.uiSlider.setSliderVal(Number(attr.o)*100);
    };
    UISpacerPanel.prototype.applyInfo = function(){
        var attr = this.getInfo();
        if(this._spacerSelected){
            $(this._spacerSelected)
                .removeClass('fs_'+attr.f)
                .addClass('fs_'+$('#'+this._selectors.spacer).val())
                .css('left',$('#'+this._selectors.left).val()+'px')
                .css('top',$('#'+this._selectors.top).val()+'px');
        }
    };
    UISpacerPanel.prototype.getInfo = function(){
        var attr = {f:'',t:'',l:'',o:''};
        if(this._spacerSelected){
            attr.f = (this._gui._components.uiSpacer.getSpacerType(this._spacerSelected));
            attr.t = ($(this._spacerSelected).css('top').replace('px',''));
            attr.l = ($(this._spacerSelected).css('left').replace('px',''));
            attr.o = ($(this._spacerSelected).css('opacity'));
        }
        return attr;
    };

    UISpacerPanel.prototype.setOpacity = function(perc,value){
        if(this._spacerSelected)
            $(this._spacerSelected).css('opacity',value/100);
    };
    UISpacerPanel.prototype.deleteSpacer = function(){
        if(this._spacerSelected)
            $(this._spacerSelected).remove();
    };
    UISpacerPanel.prototype.duplicateSpacer = function(){
        if(this._spacerSelected)
            $(this._spacerSelected).parent().append($(this._spacerSelected).clone()).focus();
    };

    /********************
     * PRIVATE METHODS
     ********************/


    return UISpacerPanel;

}(jQuery,UIBasePanel));