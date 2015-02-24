/**
 * Created by fdimonte on 23/02/2015.
 */

var UIOffsetPanel = (function($,UIBasePanel){

    /**
     * UIOffsetPanel Class
     *
     * @constructor
     * @param id
     * @param label
     */
    function UIOffsetPanel(id,label) {

        var baseID = 'fibo_grp_';
        var mainID = baseID+'sel_';
        this._selectors = {
            group   : mainID.substr(0,mainID.length-1),
            top     : mainID + 'top',
            left    : mainID + 'left',
            multi   : mainID + 'multiple',
            multi_p : mainID + 'multiple_p'
        };

        UIBasePanel.call(this,id,label);

        this._groupSelected = null;
    }

    /**
     * UIOffsetPanel prototype
     *
     * @type {UIBasePanel}
     */
    UIOffsetPanel.prototype = Object.create(UIBasePanel.prototype);

    /********************
     * OVERRIDABLE METHODS
     ********************/

    UIOffsetPanel.prototype.createContent = function() {
        var $content = $('<div/>')
            .append($('<p/>')
                .text('group: ')
                .append($('<span/>').attr('id',this._selectors.group)))
            .append($('<p/>')
                .text('offset top: ')
                .append($('<input/>').attr('type','text').attr('id',this._selectors.top)))
            .append($('<p/>')
                .text('offset left: ')
                .append($('<input/>').attr('type','text').attr('id',this._selectors.left)))
            .append($('<p/>').attr('id',this._selectors.multi_p)
                .text('spacers: ')
                .append($('<span/>').text('0')))
            .append($('<p/>')
                .text('select inner group'))
                .append($('<input/>').attr('type','checkbox').attr('id',this._selectors.multi));

        return $content.children();
    };

    UIOffsetPanel.prototype.setEvents = function() {

    };

    UIOffsetPanel.prototype.getStyles = function() {

    };

    /********************
     * PUBLIC METHODS
     ********************/

    UIOffsetPanel.prototype.applyInfo = function(e){
        var offset = {
            top: $('#'+this._selectors.top).val(),
            left: $('#'+this._selectors.left).val()
        };
        if(this._groupSelected.length>0){
            this._gui._components.uiSpacer.offsetCustomGroup(this._groupSelected,offset);
            $(e.currentTarget).val('0');
        }else{
            this._gui._components.uiSpacer.offsetGroup(offset);
        }
    };

    UIOffsetPanel.prototype.selectGroup = function(groupName){
        groupName || (groupName='');
        $('#fibo_grp_sel').text(groupName);
        $('#fibo_grp_sel_multiple_p').find('span').text($('#'+groupName).find('div').length);
    };

    UIOffsetPanel.prototype.saveOffset = function(e){
        var offset = {
            top: $('#'+this._selectors.top).val(),
            left: $('#'+this._selectors.left).val()
        };
        this._gui._components.uiSpacer.saveOffsetGroup(offset);
        $(e.currentTarget).val('0');
    };

    UIOffsetPanel.prototype.toggleMultiSpacer = function(){
        var zero = {top:0,left:0};
        var groupSelecting;

        function selectStart(e){
            var $this = $(e.target);
            var gui_id = '#'+this._gui._ID;
            if($this.parents(gui_id).length>0 || $this.is(gui_id)) return true;

            groupSelecting = true;
            e.preventDefault();
            zero = {top:e.pageY, left:e.pageX};
            $('#fibo_grp_sel_multiple_box').remove();
            $('<div/>').attr('id','fibo_grp_sel_multiple_box').appendTo('body');
        }
        function selectMulti(e){
            if(!groupSelecting) return true;

            var toX,toY;
            var pos = zero;
            var pX = e.pageX;
            var pY = e.pageY;
            if(pX<zero.left){
                pos.left = pX;
                toX = zero.left;
            }else{
                toX = pX;
            }
            if(pY<zero.top){
                pos.top = pY;
                toY = zero.top;
            }else{
                toY = pY;
            }
            var w = toX - pos.left;
            var h = toY - pos.top;

            $('#fibo_grp_sel_multiple_box')
                .offset(pos)
                .width(w)
                .height(h);
        }
        function selectEnd(e){
            if(!groupSelecting) return true;
            groupSelecting = false;

            var mbox = $('#fibo_grp_sel_multiple_box');
            var mboxOffset = mbox.offset();
            var box = {
                left: mboxOffset.left,
                top: mboxOffset.top,
                width: mbox.width(),
                height: mbox.height()
            };
            mbox.remove();

            this._groupSelected = findSpacersInsideBox(box);
            $('#'+this._selectors.multi_p).find('span').text(this._groupSelected.length);
        }
        function findSpacersInsideBox(box){
            box || (box={top:0,left:0,width:0,height:0});
            var selectedSpacers = [];
            var spacerslist = $('#'+$('#fibo_grp_sel').text()).find('div');
            var singlespacer,singleoffset,isInside;

            spacerslist.each(function(i,e){
                singlespacer = $(e);
                singleoffset = singlespacer.offset();
                isInside = (
                    singleoffset.left >= box.left &&
                    singleoffset.top  >= box.top &&
                    singleoffset.left+singlespacer.width() <= box.left+box.width &&
                    singleoffset.top+singlespacer.height() <= box.top+box.height
                );
                if (isInside) selectedSpacers.push(singlespacer);
            });

            return selectedSpacers;
        }

        this._groupSelected = [];
        if($(this).is(':checked')){
            $('#'+this._selectors.multi_p).find('span').text('0');
            $('body')
                .css('cursor','crosshair')
                .on('mousedown.multiselect',selectStart.bind(this))
                .on('mousemove.multiselect',selectMulti.bind(this))
                .on('mouseup.multiselect',selectEnd.bind(this));
        }else{
            $('#'+this._selectors.multi_p).find('span').text($('#'+this._gui._components.uiSpacer.lastUsedGroup).find('div').length);
            $('body')
                .css('cursor','inherit')
                .off('.multiselect');
        }
    };

    /********************
     * PRIVATE METHODS
     ********************/


    return UIOffsetPanel;

}(jQuery,UIBasePanel));
