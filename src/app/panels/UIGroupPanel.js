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
            $tree.append(groupItem('hide_groups',false,'none'));

        $tree.append(groupItem('hide_group_'+groupName, true, groupName));

        this.showhideGroups({currentTarget:$('#showhide_group_'+groupName)});
    };

    UIGroupPanel.prototype.removeGroup = function(){
        var $tree = $('#'+this._selectors.tree);
        var $li = $tree.find('li');
        var $checked = $li.find('input:checked');
        var $hide = $('#hide_groups');

        if($li.length===0) return false;
        if($checked.attr('id')==='hide_groups') return false;

        $li.find('input').attr('checked',false);
        $hide.attr('checked',true);

        var oldID = $checked.attr('id');
        var oldName = oldID.replace('showhide_group_','');

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
        if($checked.attr('id')==='hide_groups') return false;

        var oldID = $checked.attr('id');
        var oldName = oldID.replace('showhide_group_','');
        var newName = $('#fibo_group_name').val();
        newName = newName.split(' ').join('_');

        var newID = 'showhide_group_'+newName;
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

        var oldcheck = $checked.length>0 ? $checked.attr('id').replace('showhide_group_','') : false;
        if(oldcheck==='hide_groups') oldcheck=false;

        $tree.empty().append(groupItem('hide_groups', Boolean(oldcheck), 'none'));

        var i,name;
        for(i in info_arr){
            if(info_arr.hasOwnProperty(i)){
                name = info_arr[i];
                $tree.append(groupItem('showhide_group_'+name, oldcheck===name, name));
            }
        }

        $tree.show();

        if($checked.length>0) this.showhideGroups({currentTarget:$checked});
        //TODO: panelsManager.openPanel($('#fibo_showhide_groups'));
    };

    UIGroupPanel.prototype.showhideGroups = function(e){
        var group,gid = $(e.currentTarget).attr('id');
        $('.spacers_group').hide();

        $('#'+this._selectors.name).val('');

        if(gid=='hide_groups'){
            this._gui._components.uiSpacer.newUsedGroup();
            this._gui._panels.offsetPanel.selectGroup();
        }else{
            group = gid.replace('showhide_group_','');
            $('#'+group).show();
            $('#fibo_group_name').val(group);
            this._gui._components.uiSpacer.newUsedGroup(group);
            this._gui._panels.offsetPanel.selectGroup(group);
        }

        this._gui._components.uiSpacer.updateGroups();
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
