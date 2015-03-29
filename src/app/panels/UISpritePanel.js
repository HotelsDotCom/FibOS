/**
 * Created by fdimonte on 23/02/2015.
 */

var UISpritePanel = (function($,UIBasePanel){

    /**
     * UISpritePanel Class
     *
     * @constructor
     * @param id
     * @param label
     */
    function UISpritePanel(id,label) {

        var baseID = 'fibo_sprites_';
        this._selectors = {
            tree    : 'sprites_tree',
            analyze : baseID + 'analyze'
        };

        UIBasePanel.call(this,id,label);
    }

    /**
     * UISpritePanel prototype
     *
     * @type {UIBasePanel}
     */
    UISpritePanel.prototype = Object.create(UIBasePanel.prototype);

    /********************
     * OVERRIDABLE METHODS
     ********************/

    UISpritePanel.prototype.createContent = function() {
        var $content = $('<div/>')
            .append($('<ul/>').attr('id',this._selectors.tree))
            .append($('<input/>').attr('type','button').addClass('vui-btn').attr('id',this._selectors.analyze).val('analyze'));

        return $content.children();
    };

    UISpritePanel.prototype.setEvents = function() {

        this.addListener('click', '#'+this._selectors.analyze, function(e){
            this.trigger('sprites_analyze');
            $(e.currentTarget).remove();
        });
        this.addListener('change', '#'+this._selectors.tree+' input', function(e){
            this.trigger('sprites_toggle', $(e.currentTarget).attr('id'));
        });

    };

    UISpritePanel.prototype.getStyles = function() {

    };

    /********************
     * PUBLIC METHODS
     ********************/

    UISpritePanel.prototype.didAnalyze = function(info) {
        var $tree = $('#'+this._selectors.tree).empty();
        $tree.append(spriteItem('hide_sprites',true,'none'));

        var name,file,fid;
        for(name in info){
            if(info.hasOwnProperty(name)){
                file = this._gui._components.uiSpriter.filenameFromCss(name);
                fid = this._gui._components.uiSpriter.filenameFromCss(name,true);
                $tree.append(spriteItem('toggle_sprite_'+fid,false,file));
            }
        }

        $tree.show();
        if($('#fibo_sprites_bg').length===0)
            $('.obscurers_container').parent().prepend('<div id="fibo_sprites_bg" style="display:none;"/>');
    };

    /********************
     * PRIVATE METHODS
     ********************/

    function spriteItem(id, checked, spanText){
        var $li    = $('<li/>'),
            $label = $('<label/>'),
            $span  = $('<span/>')
                .attr('title',spanText)
                .text(spanText),
            $input = $('<input/>')
                .attr('type','radio')
                .attr('name','sprites')
                .addClass('fibo_radio')
                .attr('id',id)
                .attr('checked',checked);

        $li.append($label.append($input).append($span));

        return $li;
    }

    return UISpritePanel;

}(jQuery,UIBasePanel));
