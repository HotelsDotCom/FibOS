/**
 * Created by fdimonte on 17/04/2015.
 */

var UIZIndexPanel = (function($,UIBasePanel){

    /**
     * UIZIndexPanel Class
     *
     * @param id
     * @param label
     * @constructor
     */
    function UIZIndexPanel(id,label){

        var baseID = 'fib_zindexes';
        this._selectors = {
            tree    : baseID + '-tree',
            analyze : baseID + '-analyze'
        };

        UIBasePanel.call(this,id,label);
    }

    /**
     * UIZIndexPanel prototype
     *
     * @type {UIBasePanel}
     */
    UIZIndexPanel.prototype = Object.create( UIBasePanel.prototype );

    /********************
     * OVERRIDABLE METHODS
     ********************/

    UIZIndexPanel.prototype.createContent = function() {
        var $content = $('<div/>')
            .append(this.getBaseElement('list').attr('id',this._selectors.tree))
            .append(this.getBaseElement('button').attr('id',this._selectors.analyze).val('analyze'));

        return $content.children();
    };

    UIZIndexPanel.prototype.setEvents = function() {

        this.addListener('click', '#'+this._selectors.analyze, function(e){
            this.trigger('zindex_analyze');
            this.analyze();
            $(e.currentTarget).remove();
        });

        this.addListener('change', '#'+this._selectors.tree+' input', function(e){
            this.trigger('zindex_toggle', $(e.currentTarget).data('data'));
        });

    };

    UIZIndexPanel.prototype.getStyles = function() {

        var styles = {};

        styles['#' + this._selectors.tree + ' span.fz_zi'] = {'border':'1px solid #999','border-radius':'3px',display:'inline-block',padding:'0 2px','margin-right':'2px'};
        styles['#' + this._selectors.tree + ' span.fz_id'] = {'background-color':'#8be'};
        styles['#' + this._selectors.tree + ' span.fz_cl'] = {'background-color':'#9c9'};

        return styles;

    };

    /********************
     * PUBLIC METHODS
     ********************/

    UIZIndexPanel.prototype.analyze = function() {
        var indexes=[];
        $('*').each(function(i,e){
            var $e = $(e),
                z = $e.css('z-index'),
                id = $e.attr('id'),
                cl = $e.attr('class'),
                tag = $e.prop('tagName');

            var excluded = ['style','script'];
            if(!$e.is('#fibos') && $e.parents('#fibos').length===0 && excluded.indexOf(tag.toLowerCase())==-1)
                z!='auto'&&indexes.push({$e:$e,z:z,tag:tag,id:id,cl:cl});
        });
        analyzed.call(this,indexes.sort(function(a,b){return a.z-b.z;}));
    };

    /********************
     * PRIVATE METHODS
     ********************/

    function analyzed(zindexes) {
        var $tree = $('#'+this._selectors.tree).empty();
        $tree.append(zindexItem.call(this,'hide_indexes',true,'none',null));

        var name;
        for(var z=0;z<zindexes.length;z++){
            name = zindexes[z].z + ':' + zindexes[z].tag.toLowerCase();
            zindexes[z].id && (name += '#' + zindexes[z].id);
            zindexes[z].cl && (name += '.' + zindexes[z].cl);
            $tree.append(zindexItem.call(this,null,false,name,zindexes[z]));
        }

        $tree.show();
        console.log(zindexes);
    }

    function zindexItem(id, checked, spanText, data){
        var html = splittedName(spanText);

        var $li    = $('<li/>'),
            $label = $('<label/>'),
            $span  = $('<span/>')
                .attr('title',spanText)
                .html(html),
            $input = this.getBaseElement('radio')
                .attr('name','zindexes')
                .attr('checked',checked);

        id && $input.attr('id',id);
        data && $input.data('data',data);

        $li.append($label.append($input).append($span));

        return $li;
    }

    function splittedName(name){
        var _tag,_zi,_id,_cl,arr,
            splitted = name;

        if(splitted.indexOf(':')>-1){
            arr = splitted.split(':');
            _zi = arr[0];
            _tag = arr[1];

            if(_tag.indexOf('#')>-1){
                arr = _tag.split('#');
                _tag = arr[0];
                _id = arr[1];

                if(_id.indexOf('.')>-1){
                    arr = _id.split('.');
                    _id = arr[0];
                    _cl = arr[1];
                }

            }else if(_tag.indexOf('.')>-1){
                arr = _tag.split('.');
                _tag = arr[0];
                _cl = arr[1];
            }
        }

        _zi && (splitted  = $('<span/>').addClass('fz_zi').text(_zi).prop('outerHTML') + _tag);
        _id && (splitted += $('<span/>').addClass('fz_id').text('#'+_id).prop('outerHTML'));
        _cl && (splitted += $('<span/>').addClass('fz_cl').text('.'+_cl).prop('outerHTML'));

        return splitted;
    }

    return UIZIndexPanel;

}(jQuery,UIBasePanel));