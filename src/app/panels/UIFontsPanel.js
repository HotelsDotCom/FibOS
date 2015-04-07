/**
 * Created by fdimonte on 03/04/2015.
 */

var UIFontsPanel = (function($,UIBasePanel){

    /**
     * UIFontsPanel Class
     *
     * @param id
     * @param label
     * @constructor
     */
    function UIFontsPanel(id,label){

        var baseID = 'fib_fonts';
        this._selectors = {
            tree    : baseID + '-tree',
            analyze : baseID + '-analyze'
        };

        UIBasePanel.call(this,id,label);
    }

    /**
     * UIPanelExample prototype
     *
     * @type {UIBasePanel}
     */
    UIFontsPanel.prototype = Object.create( UIBasePanel.prototype );

    /********************
     * OVERRIDABLE METHODS
     ********************/

    UIFontsPanel.prototype.createContent = function() {
        var $content = $('<div/>')
            .append(this.getBaseElement('list').attr('id',this._selectors.tree))
            .append(this.getBaseElement('button').attr('id',this._selectors.analyze).val('analyze'));

        return $content.children();
    };

    UIFontsPanel.prototype.setEvents = function() {

        this.addListener('click', '#'+this._selectors.analyze, function(e){
            this.trigger('fonts_analyze');
            $(e.currentTarget).remove();
        });

        this.addListener('change', '#'+this._selectors.tree+' input', function(e){
            this.trigger('font_toggle', $(e.currentTarget).data('data'));
        });

    };

    UIFontsPanel.prototype.getStyles = function() {
        var styles = {};

        styles['#'+this._ID+' .fib-content'] = {
            'max-height':'144px',
            overflow:'auto'
        };

        styles['#'+this._selectors.tree+' li'] = {
            color:'#222',
            margin:'0',
            padding:'0'
        };

        styles['#'+this._selectors.tree+' li > span'] = {
            display:'inline-block',
            'margin-top':'5px',
            'font-weight':'800',
            'word-break':'break-all'
        };

        return styles;
    };

    /********************
     * PUBLIC METHODS
     ********************/

    UIFontsPanel.prototype.analyzed = function(fonts) {
        var $tree = $('#'+this._selectors.tree).empty();
        $tree.append(fontsItem.call(this,'hide_fonts',true,'none'));

        var family,sizes,size,$family;
        for(family in fonts){
            if(fonts.hasOwnProperty(family)){
                $family = familyItem(family);
                sizes = fonts[family];
                for(size in sizes){
                    if(sizes.hasOwnProperty(size))
                        $family.append(fontsItem.call(this, 'toggle_font_'+family+'_'+size, false, size, {family:family,size:size}));
                }
                $tree.append($family);
            }
        }

        $tree.show();
        console.log(fonts);
    };

    /********************
     * PRIVATE METHODS
     ********************/

    function familyItem(spanText){
        var $ul    = $('<ul/>'),
            $li    = $('<li/>'),
            $span  = $('<span/>')
                .attr('title',spanText)
                .text(spanText);

        $ul.append($li.append($span));

        return $ul;
    }
    function fontsItem(id, checked, spanText, data){
        var $li    = $('<li/>'),
            $label = $('<label/>'),
            $span  = $('<span/>')
                .attr('title',spanText)
                .text(spanText),
            $input = this.getBaseElement('radio')
                .data('data',data)
                .attr('id',id)
                .attr('name','fonts')
                .attr('checked',checked);

        $li.append($label.append($input).append($span));

        return $li;
    }

    return UIFontsPanel;

}(jQuery,UIBasePanel));