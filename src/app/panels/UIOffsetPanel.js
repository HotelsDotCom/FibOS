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
            multi_p : mainID + 'multiple_p',
            multi_box:mainID + 'multiple_box'
        };

        UIBasePanel.call(this,id,label);

        this._groupSelected = [];
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

        this.addListener('keydown', '#'+this._selectors.left+', #'+this._selectors.top, function(e){
            changeGroupPos.call(this,e);
            this.trigger('group_offset_apply',"{l:"+$('#'+this._selectors.left).val()+",t:"+$('#'+this._selectors.top).val()+"}");
        });
        this.addListener('blur', '#'+this._selectors.left+', #'+this._selectors.top, function(e){
            this.trigger('group_offset_save',"{l:"+$('#'+this._selectors.left).val()+",t:"+$('#'+this._selectors.top).val()+"}");
            saveOffset.call(this,e)
        });
        this.addListener('change', '#'+this._selectors.multi, function(e){
            this.trigger('group_toggle_multiple');
            multiSpacerManager.toggle($(e.currentTarget).is(':checked'),this);
        });

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
        $('#'+this._selectors.group).text(groupName);
        $('#'+this._selectors.multi_p).find('span').text($('#'+groupName).find('div').length);
    };

    /********************
     * PRIVATE METHODS
     ********************/

    function changeGroupPos(e){
        var offset = e.shiftKey ? 10 : e.altKey ? 0.5 : 1;
        var val = Number($(e.currentTarget).val());

        $(e.currentTarget).val(val+(e.keyCode===38?offset:e.keyCode===40?-offset:0));
        this.applyInfo(e);

        return false;
    }

    function saveOffset(e){
        var offset = {
            top: $('#'+this._selectors.top).val(),
            left: $('#'+this._selectors.left).val()
        };
        this._gui._components.uiSpacer.saveOffsetGroup(offset);
        $(e.currentTarget).val('0');
    }

    var multiSpacerManager = {

        toggle: function(isActive,ctx){
            this.ctx = ctx;
            this.fibos = ctx._gui;
            this.id_multibox = ctx._selectors.multi_box;
            this.id_multipar = ctx._selectors.multi_p;
            this.id_grouptxt = ctx._selectors.group;

            this.zero = {top:0,left:0};
            this.groupSelecting = false;
            this.ctx._groupSelected = [];

            if(isActive){
                $('#'+this.id_multipar).find('span').text('0');
                $('body')
                    .css('cursor','crosshair')
                    .on('mousedown.multiselect',this.selectStart.bind(this))
                    .on('mousemove.multiselect',this.selectMulti.bind(this))
                    .on('mouseup.multiselect',this.selectEnd.bind(this));
            }else{
                $('#'+this.id_multipar).find('span').text($('#'+this.fibos._components.uiSpacer.lastUsedGroup).find('div').length);
                $('body')
                    .css('cursor','inherit')
                    .off('.multiselect');
            }
        },

        selectStart: function(e){
            var $this = $(e.target);
            var gui_id = '#'+this.fibos._ID;
            if($this.parents(gui_id).length>0 || $this.is(gui_id)) return true;

            e.preventDefault();
            this.groupSelecting = true;
            this.zero = {top:e.pageY, left:e.pageX};

            $('#'+this.id_multibox).remove();
            this.fibos.$el.append($('<div/>').attr('id',this.id_multibox));
        },

        selectMulti: function(e){
            if(!this.groupSelecting) return true;

            var toX,toY;
            var pos = this.zero;
            var pX = e.pageX;
            var pY = e.pageY;
            if(pX<this.zero.left){
                pos.left = pX;
                toX = this.zero.left;
            }else{
                toX = pX;
            }
            if(pY<this.zero.top){
                pos.top = pY;
                toY = this.zero.top;
            }else{
                toY = pY;
            }
            var w = toX - pos.left;
            var h = toY - pos.top;

            $('#'+this.id_multibox)
                .offset(pos)
                .width(w)
                .height(h);
        },

        selectEnd: function(e){
            if(!this.groupSelecting) return true;
            this.groupSelecting = false;

            var mbox = $('#'+this.id_multibox);
            if(mbox.length==0) return;

            var mboxOffset = mbox.offset();
            var box = {
                left: mboxOffset.left,
                top: mboxOffset.top,
                width: mbox.width(),
                height: mbox.height()
            };
            mbox.remove();

            this.ctx._groupSelected = this.findSpacersInsideBox(box);
            $('#'+this.id_multipar).find('span').text(this.ctx._groupSelected.length);
        },

        findSpacersInsideBox: function(box){
            box || (box={top:0,left:0,width:0,height:0});
            var selectedSpacers = [];
            var spacerslist = $('#'+$('#'+this.id_grouptxt).text()).find('div');
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

    };

    return UIOffsetPanel;

}(jQuery,UIBasePanel));
