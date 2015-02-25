/**
 * Created by fdimonte on 23/02/2015.
 */

var UIGroupPanel = (function($,UIBasePanel){

    /**
     * UIGroupPanel Class
     *
     * @constructor
     * @param id
     * @param label
     */
    function UIGroupPanel(id,label) {

        var baseID = 'fibo_group_';
        this._selectors = {
            toggle : 'toggle_group_',
            hideall: 'hide_groups',
            tree   : 'groups_tree',
            name   : baseID + 'name',
            rename : baseID + 'rename',
            remove : baseID + 'delete'
        };

        UIBasePanel.call(this,id,label);
    }

    /**
     * UIGroupPanel prototype
     *
     * @type {UIBasePanel}
     */
    UIGroupPanel.prototype = Object.create(UIBasePanel.prototype);

    /********************
     * OVERRIDABLE METHODS
     ********************/

    UIGroupPanel.prototype.createContent = function() {
        var $content = $('<div/>')
            .append($('<ul/>').attr('id',this._selectors.tree))
            .append($('<p/>')
                .text('name: ')
                .append($('<input/>').attr('type','text').attr('id',this._selectors.name)))
            .append($('<input/>').attr('type','button').addClass('vui-btn').attr('id',this._selectors.rename).val('rename'))
            .append($('<input/>').attr('type','button').addClass('vui-btn').attr('id',this._selectors.remove).val('delete'));

        return $content.children();
    };

    UIGroupPanel.prototype.setEvents = function() {

        this.addListener('click', '#'+this._selectors.remove, function(e){
            this.trigger('group_remove');
            this.removeGroup();
        });
        this.addListener('click', '#'+this._selectors.rename, function(e){
            this.trigger('group_rename');
            this.renameGroup();
        });
        this.addListener('change', '#'+this._selectors.tree+' input', function(e){
            this.trigger('group_toggle');
            this.showhideGroups(e);
        });

    };

    UIGroupPanel.prototype.getStyles = function() {

    };

    /********************
     * PUBLIC METHODS
     ********************/

    UIGroupPanel.prototype.newGroupAdded = function(groupName){
        var $tree = $('#'+this._selectors.tree);
        var $li = $tree.find('li');

        if($li.length===0)
            $tree.append(groupItem(this._selectors.hideall,false,'none'));

        $tree.append(groupItem(this._selectors.toggle+groupName, true, groupName));

        this.showhideGroups({currentTarget:$('#'+this._selectors.toggle+groupName)});
    };

    UIGroupPanel.prototype.removeGroup = function(){
        var $tree = $('#'+this._selectors.tree);
        var $li = $tree.find('li');
        var $checked = $li.find('input:checked');
        var $hide = $('#'+this._selectors.hideall);

        if($li.length===0) return false;
        if($checked.attr('id')===this._selectors.hideall) return false;

        $li.find('input').attr('checked',false);
        $hide.attr('checked',true);

        var oldID = $checked.attr('id');
        var oldName = oldID.replace(this._selectors.toggle,'');

        $('#'+oldName).remove();
        $('#'+oldID).closest('li').remove();
        this.showhideGroups({currentTarget:$hide});
        this._gui._components.uiSpacer.updateGroups();
    };

    UIGroupPanel.prototype.renameGroup = function(){
        var $tree = $('#'+this._selectors.tree);
        var $li = $tree.find('li');
        var $checked = $li.find('input:checked');

        if($li.length===0) return false;
        if($checked.attr('id')===this._selectors.hideall) return false;

        var oldID = $checked.attr('id');
        var oldName = oldID.replace(this._selectors.toggle,'');
        var newName = $('#'+this._selectors.name).val();
        newName = newName.split(' ').join('_');

        var newID = this._selectors.toggle+newName;
        this._gui._components.uiSpacer.updateGroups();

        if(this._gui._components.uiSpacer.renameGroup(oldName,newName)){
            $('#'+oldID).closest('li').remove();
            $checked.attr('id',newID).next().text(newName);
        }else{
            alert('cannot rename group');
        }
    };

    UIGroupPanel.prototype.groupsLoaded = function(info_arr){
        var $tree = $('#'+this._selectors.tree);
        var $li = $tree.find('li');
        var $checked = $li.find('input:checked');

        var oldcheck = $checked.length>0 ? $checked.attr('id').replace(this._selectors.toggle,'') : false;
        if(oldcheck===this._selectors.hideall) oldcheck=false;

        $tree.empty().append(groupItem(this._selectors.hideall, Boolean(oldcheck), 'none'));

        var i,name;
        for(i in info_arr){
            if(info_arr.hasOwnProperty(i)){
                name = info_arr[i];
                $tree.append(groupItem(this._selectors.toggle+name, oldcheck===name, name));
            }
        }

        $tree.show();

        if($checked.length>0) this.showhideGroups({currentTarget:$checked});
        //TODO: panelsManager.openPanel($('#fibo_showhide_groups'));
    };

    UIGroupPanel.prototype.showhideGroups = function(e){
        var group,gid = $(e.currentTarget).attr('id');
        var $name = $('#'+this._selectors.name);

        $name.val('');
        $('.spacers_group').hide();

        if(gid!=this._selectors.hideall){
            group = gid.replace(this._selectors.toggle,'');
            $('#'+group).show();
            $name.val(group);
        }

        this.trigger('group_select',group);
    };

    UIGroupPanel.prototype.showGroupsList = function(stJson){
        var spacers_obj = JSON.parse(stJson);
        var selectors = [];

        for(var s in spacers_obj)
            if(spacers_obj.hasOwnProperty(s)) selectors.push(s);

        this.groupsLoaded(selectors);
    };

    /********************
     * PRIVATE METHODS
     ********************/

    function groupItem(id, checked, spanText){
        var $li    = $('<li/>'),
            $label = $('<label/>'),
            $span  = $('<span/>')
                .text(spanText),
            $input = $('<input/>')
                .attr('type','radio')
                .attr('name','groups')
                .addClass('fibo_radio')
                .attr('id',id)
                .attr('checked',checked);

        $li.append($label.append($input).append($span));

        return $li;
    }

    return UIGroupPanel;

}(jQuery,UIBasePanel));
