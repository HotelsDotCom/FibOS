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

        var baseID = 'fib_sprites';
        this._selectors = {
            tree    : baseID + '-tree',
            analyze : baseID + '-analyze'
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
            .append(this.getBaseElement('list').attr('id',this._selectors.tree))
            .append(this.getBaseElement('button').attr('id',this._selectors.analyze).val('analyze'));

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
        var styles = {};

        styles['#'+this._selectors.tree+' span'] = {
            display:'inline-block',
            'max-width':'180px',
            overflow:'hidden',
            'text-overflow':'ellipsis',
            'white-space':'nowrap'
        };

        return styles;
    };

    /********************
     * PUBLIC METHODS
     ********************/

    UISpritePanel.prototype.didAnalyze = function(info) {
        var $tree = $('#'+this._selectors.tree).empty();
        $tree.append(spriteItem.call(this,'hide_sprites',true,'none'));

        var name,file,fid;
        for(name in info){
            if(info.hasOwnProperty(name)){
                file = this._gui._components.uiSpriter.filenameFromCss(name);
                fid = this._gui._components.uiSpriter.filenameFromCss(name,true);
                $tree.append(spriteItem.call(this,'toggle_sprite_'+fid,false,file));
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
            $input = this.getBaseElement('radio')
                .attr('id',id)
                .attr('name','sprites')
                .attr('checked',checked);

        $li.append($label.append($input).append($span));

        return $li;
    }

    return UISpritePanel;

}(jQuery,UIBasePanel));
