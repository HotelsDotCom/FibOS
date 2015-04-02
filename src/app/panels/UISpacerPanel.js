/**
 * Created by fdimonte on 23/02/2015.
 */

var UISpacerPanel = (function($,UIBasePanel,UISliderWidget){

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

        var baseID = 'fib_sel';
        this._selectors = {
            spacer    : baseID + '-spacer',
            left      : baseID + '-left',
            top       : baseID + '-top',
            remove    : baseID + '-delete',
            duplicate : baseID + '-duplicate',
            opacity   : baseID + '-opacity',
            slider    : baseID + '-slider_container'
        };

        this._message_disabled = 'no spacers selected';

        UIBasePanel.call(this,id,label);

        this._spacerSelected = null;
        this.disable();
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

        this.uiSlider = new UISliderWidget(this._selectors.opacity,{minValue:20,stepValue:10,callback:this.setOpacity.bind(this),extension:{slider_handler:{background:'rgba(200,100,100,.6)'}}});

        var $content = $('<div/>')
            .append($('<p/>')
                .text('spacer: ')
                .append(this.fiboSelect(this._spacersList,this._selectors.spacer)))
            .append($('<p/>')
                .text('left: ')
                .append(this.getBaseElement('text','small').attr('id',this._selectors.left)))
            .append($('<p/>')
                .text('top: ')
                .append(this.getBaseElement('text','small').attr('id',this._selectors.top)))
            .append($('<p/>')
                .text('opacity: ')
                .append($('<div/>').attr('id',this._selectors.slider)
                    .append(this.uiSlider.$el)))
            .append(this.getBaseElement('button').attr('id',this._selectors.remove).val('remove'))
            .append(this.getBaseElement('button').attr('id',this._selectors.duplicate).val('duplicate'));

        return $content.children();
    };

    UISpacerPanel.prototype.setEvents = function() {

        this.addListener('keyup', '#'+this._selectors.left+',#'+this._selectors.top, function(e){
            changeSpacerPos.call(this,e);
            this.trigger('spacer_offset',"{l:"+$('#'+this._selectors.left).val()+",t:"+$('#'+this._selectors.top).val()+"}");
        });
        this.addListener('change keyup', '#'+this._selectors.spacer, function(e){
            this.trigger('spacer_changed',$(e.currentTarget).val());
            this.applyInfo();
        });
        this.addListener('click', '#'+this._selectors.remove, function(e){
            this.trigger('spacer_delete',this._spacerSelected);
            this.deleteSpacer();
        });
        this.addListener('click', '#'+this._selectors.duplicate, function(e){
            this.trigger('spacer_duplicate',this._spacerSelected);
            this.duplicateSpacer();
        });

    };

    UISpacerPanel.prototype.getStyles = function() {
        var styles = {};

        styles['#'+this._selectors.slider] = {
            margin:'3px 0 6px 8px'
        };

        return styles;
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
        this.uiSlider.setSliderVal(Number(attr.o)*100);
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
            attr.t = parseFloat($(this._spacerSelected).css('top'));
            attr.l = parseFloat($(this._spacerSelected).css('left'));
            attr.o = parseFloat($(this._spacerSelected).css('opacity'));
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

    function changeSpacerPos(e){
        var offset = e.shiftKey ? 10 : e.altKey ? 0.5 : 1;
        var val = Number($(e.currentTarget).val());
        if(isNaN(val)) return false;

        $(e.currentTarget).val(val+(e.keyCode===38?offset:e.keyCode===40?-offset:0));
        this.applyInfo();

        return false;
    }

    return UISpacerPanel;

}(jQuery,UIBasePanel,UISliderWidget));
