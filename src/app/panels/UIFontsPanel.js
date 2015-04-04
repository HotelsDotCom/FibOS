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
            this.trigger('fonts_toggle', $(e.currentTarget).attr('id'));
        });

    };

    UIFontsPanel.prototype.getStyles = function() {};

    /********************
     * PUBLIC METHODS
     ********************/

    UIFontsPanel.prototype.analyzed = function(fonts) {
        var $tree = $('#'+this._selectors.tree).empty();
        $tree.append(fontsItem.call(this,'hide_fonts',true,'none'));

        for(var family in fonts){
            if(fonts.hasOwnProperty(family)){
                $tree.append(fontsItem.call(this,'toggle_font_'+family,false,family));
            }
        }

        $tree.show();
        console.log(fonts);
    };

    /********************
     * PRIVATE METHODS
     ********************/

    function fontsItem(id, checked, spanText){
        var $li    = $('<li/>'),
            $label = $('<label/>'),
            $span  = $('<span/>')
                .attr('title',spanText)
                .text(spanText),
            $input = this.getBaseElement('radio')
                .attr('id',id)
                .attr('name','fonts')
                .attr('checked',checked);

        $li.append($label.append($input).append($span));

        return $li;
    }

    return UIFontsPanel;

}(jQuery,UIBasePanel));