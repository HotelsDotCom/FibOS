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
     * UIFontsPanel prototype
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

        styles['#'+this._selectors.tree+' li > span'] = {
            display:'inline-block',
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
        $tree.append(fontSizeItem.call(this,'hide_fonts',true,'none',null));

        var family,sizes,size,$family;
        for(family in fonts){
            if(fonts.hasOwnProperty(family)){
                $family = fontFamilyItem.call(this,family);
                sizes = orderedSizes(fonts[family]);
                for(var s=0;s<sizes.length;s++){
                    size = sizes[s];
                    $family.append(fontSizeItem.call(this, null, false, size.key, {family:family,size:size.key}));
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

    function fontFamilyItem(spanText){
        var $ul    = this.getBaseElement('list'),
            $li    = $('<li/>'),
            $span  = $('<span/>')
                .attr('title',spanText)
                .text(spanText);

        $ul.append($li.append($span));

        return $ul;
    }
    function fontSizeItem(id, checked, spanText, data){
        var $li    = $('<li/>'),
            $label = $('<label/>'),
            $span  = $('<span/>')
                .attr('title',spanText)
                .text(spanText),
            $input = this.getBaseElement('radio')
                .attr('name','fonts')
                .attr('checked',checked);

        id && $input.attr('id',id);
        data && $input.data('data',data);

        $li.append($label.append($input).append($span));

        return $li;
    }

    function orderedSizes(fontsFamily){
        var ordered = [];
        for(var s in fontsFamily){
            if(fontsFamily.hasOwnProperty(s))
                ordered.push({key:s,val:fontsFamily[s]});
        }
        return ordered.sort(function(a,b){return parseFloat(a.key) - parseFloat(b.key)});
    }

    return UIFontsPanel;

}(jQuery,UIBasePanel));