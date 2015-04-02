/**
 * Created by fdimonte on 12/02/2015.
 */

var UISpacerWidget = (function($,UIBaseWidget){

    /**
     * UISpacerWidget Class
     *
     * @param ID
     * @param options
     * @constructor
     */
    function UISpacerWidget(ID, options) {
        this._defaultGroupName = 'spacerGroup_';
        this._lastUsedGroup = this._defaultGroupName+'1';
        this._mousezero = null;
        this._dragging = null;
        this._dragged = null;

        this.spacersGroups = null;
        this.spacerObjects = null;

        UIBaseWidget.call(this, ID, options);
    }

    /**
     * UISpacerWidget prototype
     *
     * @type {UIBaseWidget}
     */
    UISpacerWidget.prototype = Object.create( UIBaseWidget.prototype );

    /********************
     * OVERRIDABLE METHODS
     ********************/

    UISpacerWidget.prototype.initOptions = function(options) {
        this.setOptions({
            localStorage  : 'fibonacciGroups',
            spacerClass   : 'fibospacer',
            spacerMatch   : /fibospacer|fs|_| /g,
            grouping      : true,
            moveCallback  : null,
            groupCallback : null,
            selectCallback: null,
            spacersList   : fibonacciSequence(1,12),
            spacerMin     : 3,
            spacerSymbols : [{s:'•',f:2.8,l:1},{s:'★',f:1,l:1.09}],
            spacerColors  : ['#0071bc','#ed1e79','#8cc63f','#fbb03b']
        },options);
    };

    UISpacerWidget.prototype.initStyles = function(extension) {
        var shad = '0 0 5px 2px #222222 inset';

        this._selectorsMapping = {
            spacer: '.'+this._options.spacerClass,
            shadow: '.'+this._options.spacerClass+':focus',
            after : '.'+this._options.spacerClass+':after'
        };
        this._globalSelectors = {
            spacer: true,
            shadow: true,
            after: true
        };

        this.setStyles({
            main   :{position:'absolute',top:referencePos.call(this).top+'px',left:referencePos.call(this).left+'px',width:'0',height:'0',overflow:'visible'},
            spacer :{position:'absolute',display:'block',cursor:'pointer',overflow:'hidden','font-family':'Arial',outline:'0'},
            shadow :{'-webkit-box-shadow':shad,'-moz-box-shadow':shad,'box-shadow':shad}
        }, generateSpacersStyles.call(this), extension);
    };

    UISpacerWidget.prototype.initEvents = function() {
        this.$el.off('.spacerevent')
            .on('mousedown.spacerevent','.'+this._options.spacerClass,mouse_handler.bind(this));

        $('body').off('.spacerevent')
            .on('mousemove.spacerevent',mouse_handler.bind(this))
            .on('mouseup.spacerevent',mouse_handler.bind(this))
            .on('keydown.spacerevent',key_handler.bind(this));

        $(window).off('.spacerevent')
            .on('scroll.spacerevent resize.spacerevent',scroll_handler.bind(this));
    };

    UISpacerWidget.prototype.afterInit = function() {
        this.spacersGroups = {};
        this.spacerObjects = getSpacers.call(this);
    };

    /********************
     * PUBLIC METHODS
     ********************/

    /*---SPACERS MANAGER---*/

    UISpacerWidget.prototype.addNewSpacer = function(num,group) {
        if(spacerIndex.call(this,num)==-1) {
            console.log('WARNING: addSpacer called with unsupported spacer');
            return null;
        }

        if(!group) group = this._lastUsedGroup;
        var spacerStr = ('000'+num).substr(-3);
        var $spacerObj = this.spacerObjects['f_'+spacerStr].clone();
        var $parent = this._options.grouping ? getGroup.call(this,group) : this.$el;
        if($spacerObj) $parent.append($spacerObj);
        return $spacerObj;
    };

    UISpacerWidget.prototype.dragSpacer = function($target){
        dragSpacer.call(this,$target);
    };

    UISpacerWidget.prototype.getSpacerType = function(spacer){
        return $(spacer).attr('class').replace(this._options.spacerMatch,'');
    };

    UISpacerWidget.prototype.getSpacersList = function(onlyActiveSpacers){
        return spacersFilter.call(this, onlyActiveSpacers ? this._options.spacerMin-1 : 0);
    };

    /*---GROUPS MANAGER---*/

    UISpacerWidget.prototype.renameGroup = function(oldname,newname) {
        if(!oldname || !newname) return false;
        if(oldname === newname) return false;
        if($('#'+newname).length>0) return false;

        var oldArr = this.spacersGroups[oldname];
        if(!oldArr) return false;

        this.spacersGroups[newname] = oldArr;

        var $group = getGroup.call(this,newname);
        $group.html($('#'+oldname).html());
        removeGroup.call(this,oldname);

        return true;
    };

    UISpacerWidget.prototype.offsetCustomGroup = function(spacerslist,offset) {
        for(var i=0;i<spacerslist.length;i++){
            var $spacer = $(spacerslist[i]);
            var zero = $spacer.offset();
            var pos = {
                left: zero.left + Number(offset.left),
                top:  zero.top  + Number(offset.top)
            };
            $spacer.offset(pos);
        }
    };

    UISpacerWidget.prototype.offsetGroup = function(offset) {
        var t,l,
            spacers = this.spacersGroups[this._lastUsedGroup],
            $spacers = $('#'+this._lastUsedGroup).find('.'+this._options.spacerClass);

        if(!spacers) return;
        $spacers.each(function(i,e){
            var $spacer = $(e);
            t = Number(spacers[i][1]);
            l = Number(spacers[i][2]);
            $spacer.css('top',t+Number(offset.top));
            $spacer.css('left',l+Number(offset.left));
        });
    };

    UISpacerWidget.prototype.saveOffsetGroup = function(offset) {
        var s,spacers = this.spacersGroups[this._lastUsedGroup];

        if(!spacers) return;
        for(s in spacers){
            if(spacers.hasOwnProperty(s)){
                spacers[s][1] = Number(spacers[s][1]) + Number(offset.top);
                spacers[s][2] = Number(spacers[s][2]) + Number(offset.left);
            }
        }
        this.spacersGroups[this._lastUsedGroup] = spacers;
    };

    UISpacerWidget.prototype.selectGroup = function(groupName){
        this._lastUsedGroup = groupName ? groupName : this._defaultGroupName+(totalGroups.call(this)+1);
    };

    UISpacerWidget.prototype.updateGroups = function(){
        htmlToSpacersGroups.call(this);
    };

    UISpacerWidget.prototype.spacersGroupLength = function(groupName){
        return $('#'+(groupName || this._lastUsedGroup)).find('div').length;
    };

    /*---LOCAL STORAGE---*/

    UISpacerWidget.prototype.setLocalStorage = function() {
        localStorage.setItem(this._options.localStorage, spacersToJson.call(this));
        return true;
    };
    UISpacerWidget.prototype.getLocalStorage = function(hide){
        removeAllGroup.call(this);
        var stJson = localStorage.getItem(this._options.localStorage);
        if (stJson) insertHtmlFromJson.call(this,stJson,true,hide);
        return stJson;
    };
    UISpacerWidget.prototype.loadSpacersFromJson = function(stJson,hide){
        if (stJson) insertHtmlFromJson.call(this,stJson,true,hide);
        return stJson;
    };

    /*---SERVICE METHODS---*/

    UISpacerWidget.prototype.getFibonacci = function(min,max){
        fibonacciSequence(min,max)
    };

    UISpacerWidget.prototype.setMouseZero = function(mzero){
        if((mzero.top || mzero.top===0) && (mzero.left || mzero.left===0))
            this._mousezero = mzero;
        else
            console.log('WARNING: setMouseZero called with wrong parameter');
    };

    /********************
     * PRIVATE METHODS
     ********************/

    /*---GROUPS MANAGER---*/

    function getGroup(name,skipAppend,skipEvent) {
        return addNewGroup.call(this,name,skipAppend,skipEvent);
    }
    function removeGroup(name) {
        if(!name || !this.spacersGroups[name]) return false;
        $('#'+name).remove();
        delete this.spacersGroups[name];
        return true;
    }
    function removeAllGroup() {
        this.$el.empty();
        this.spacersGroups = {};
        return true;
    }
    function addNewGroup(name,skipAppend,skipEvent) {
        name || (name=this._lastUsedGroup);

        var newgroup = $('#'+name);
        if(newgroup.length===0){
            newgroup = $('<div/>').attr('id',name).addClass('spacers_group');
            if(!skipAppend) this.$el.append(newgroup);
            if(!skipEvent && this._options.groupCallback) this._options.groupCallback(name);
        }
        this._lastUsedGroup = name;

        return newgroup;
    }

    /*---SPACERS PARSER---*/

    //current HTML to spacersGroups
    function htmlToSpacersGroups() {
        var cont,myasset = {};

        this.$el.find('.'+this._options.spacerClass).each(function(i,e){
            var $e = $(e);
            cont = $e.parent().attr('id');

            if(cont===this._ID) cont='spacerGroupDefault';
            if(!myasset[cont]) myasset[cont] = [];

            myasset[cont].push([
                parseInt(this.getSpacerType.call(this,e)),
                Number($e.css('top').replace('px','')),
                Number($e.css('left').replace('px',''))
            ]);

        }.bind(this));

        this.spacersGroups = myasset;
    }

    //current HTML to spacersGroups and then to Json String
    function spacersToJson() {
        htmlToSpacersGroups.call(this);
        return JSON.stringify(this.spacersGroups);
    }

    //given json to spacersGroups and then to HTML (default output='html')
    function jsonToSpacers(stJson,replace,hide) {
        var spacers_arr,spacers_obj = JSON.parse(stJson);
        for(var s in spacers_obj){
            if(spacers_obj.hasOwnProperty(s)){
                if(replace) {
                    delete this.spacersGroups[s];
                    spacers_arr = spacers_obj[s];
                } else {
                    spacers_arr = this.spacersGroups[s];
                    if(!spacers_arr) spacers_arr = [];
                    spacers_arr.push.apply(spacers_arr,spacers_obj[s]);
                }
                this.spacersGroups[s] = spacers_arr;
            }
        }
        return spacersGroupsToHtml.call(this,hide);
    }

    //given json to descriptive string
    function jsonToString(stJson,joinWith) {
        joinWith || (joinWith='; ');
        var obj = JSON.parse(stJson);
        var count = 0;
        var str = [];
        for(var s in obj){
            if(obj.hasOwnProperty(s)){
                count++;
                str.push('  group name: '+s);
                str.push('    spacers count: '+obj[s].length);
            }
        }
        str.unshift('groups count: '+count);
        return str.join(joinWith);
    }

    //convert spacersGroups to appendable HTML or JQuery node objects
    function spacersGroupsToHtml(hide) {
        var sp_name,sp_arr,sp_node,sp_nodes;
        var $group,finalHtml = [];

        for(var groupName in this.spacersGroups){
            if(this.spacersGroups.hasOwnProperty(groupName)){
                sp_nodes = [];
                sp_arr = this.spacersGroups[groupName];
                $('#'+groupName).remove();

                for(var s=0; s<sp_arr.length; s++){
                    sp_name = 'f_' + ('000'+sp_arr[s][0]).substr(-3);
                    sp_node = this.spacerObjects[sp_name].clone();
                    sp_node.css('top',sp_arr[s][1]);
                    sp_node.css('left',sp_arr[s][2]);
                    sp_nodes.push(sp_node.prop('outerHTML'));
                }

                if(this._options.grouping){
                    $group = getGroup.call(this,groupName,true,true);
                    $group.html(sp_nodes.join(''));
                    if(hide) $group.hide();
                    finalHtml.push($group.prop('outerHTML'));
                }else{
                    finalHtml.push(sp_nodes.join(''));
                }
            }
        }
        return finalHtml.join('');
    }

    //add or replace html inside spacers container with given json string
    function insertHtmlFromJson(stJson,overwrite,hide){
        var html = jsonToSpacers.call(this,stJson,overwrite,hide);
        this.$el.html(html);
    }

    /*---SERVICE METHODS---*/

    //return css object with all spacers needed (method called by initStyles)
    function generateSpacersStyles() {

        var alpha = '65';//spacer symbols opacity
        var fiboidx,fibonum,fibostr,fibocls,
            fibomin    = this._options.spacerMin-1;//fibomin represents the Nth index of spacers list (0-based)
        var fibos      = spacersFilter.call(this,fibomin),
            fibosObjs  = [];
        var d_colors   = this._options.spacerColors,
            d_symbols  = this._options.spacerSymbols;
        var fcLen      = d_colors.length,
            fsLen      = d_symbols.length;
        var fc         = fibomin, //colors index
            fs         = 0;       //symbol index

        if(fc>=fcLen) fc-=(Math.floor(fc/fcLen)*fcLen);

        fibosObjs['after'] = {position:'absolute',left:'0',color:'#fff','-khtml-opacity':'.'+alpha,'-moz-opacity':'.'+alpha,'-ms-filter':'"alpha(opacity='+alpha+')"',filter:'alpha(opacity='+alpha+')',opacity:'.'+alpha};
        for(var f in fibos){
            if(fibos.hasOwnProperty(f)){
                fibonum = fibos[f];
                fiboidx = spacerIndex.call(this,fibonum);
                fibostr = ('000'+fibonum).substr(-3);
                fibocls = this._options.spacerClass+'.fs_'+fibostr;

                fibosObjs[fibocls] = {
                    width      : fibos[f]+'px',
                    height     : fibos[f]+'px',
                    background : d_colors[fc]
                };
                this._globalSelectors[fibocls] = true;

                // after the first color cycle, it adds symbols (every cycle changes symbol)
                if(fiboidx>=fcLen){
                    fibosObjs[fibocls+':after'] = {
                        'content'     : '"'+d_symbols[fs].s+'"',
                        'font-size'   : Number(fibonum*d_symbols[fs].f) + 'px',
                        'line-height' : Number(fibonum*d_symbols[fs].l) + 'px'
                    };
                    this._globalSelectors[fibocls+':after'] = true;

                    //defines the beginning of the color cycle (spacerColors array)
                    if((fiboidx+1)%fcLen===0){
                        if(++fs>=fsLen)fs=fsLen-1;// cyclically increment the symbol index
                    }
                }
                if(++fc>=fcLen)fc=0;// cyclically increment the color index
            }
        }
        return fibosObjs;
    }

    //round the given number to the nearest 0.5 decimal
    function roundToHalf(num) {
        var d = Math.round((num%1)*100)/100;
        var i = (d<.25)?0:(d>.75)?1:.5;
        return Math.floor(num)+i;
    }

    function normalizeSpacerPosition($spacer) {
        var newpos = {
            top  : roundToHalf( Number($spacer.css('top').replace('px','')) ),
            left : roundToHalf( Number($spacer.css('left').replace('px','')) )
        };
        $spacer.css(newpos);
    }

    function emptySpacersGroups() {
        return {
            groups: {},
            totalGroups: function(){var t=0;for(var f in this.groups)if(this.groups.hasOwnProperty(f))t++;return t;}
        };
    }
    function totalGroups(){
        var t=0;
        for(var f in this.spacersGroups) if(this.spacersGroups.hasOwnProperty(f)) t++;
        return t;
    }

    /*---EVENTS HANDLERS---*/

    /* Devices Handlers */
    function key_handler(e) {
        var offset = e.shiftKey?10:e.altKey?0.5:1;
        if(this._dragged){
            if(e.keyCode>=37 && e.keyCode<=40){
                this._dragged.offset({
                    top  : ( this._dragged.offset().top  + (e.keyCode===38?-offset:e.keyCode===40?offset:0) ),
                    left : ( this._dragged.offset().left + (e.keyCode===37?-offset:e.keyCode===39?offset:0) )
                });
                if(this._options.moveCallback) this._options.moveCallback(this._dragged);
                return false;
            }
        }
        return true;
    }
    function mouse_handler(e) {
        switch(e.type){
            case 'mousedown':
                startDrag.call(this,e);
            case 'mousemove':
                doDrag.call(this,e);
                break;
            case 'mouseup':
                stopDrag.call(this,e);
                break;
        }
    }
    function scroll_handler(e) {
        this.$el.css(referencePos.call(this));
    }

    /* Dragging Handlers */
    function startDrag(e) {
        var $target = $(e.target);
        this._mousezero = {
            top  : ($target.position().top  - e.pageY + referencePos.call(this).top),
            left : ($target.position().left - e.pageX + referencePos.call(this).left)
        };
        dragSpacer.call(this,$target);
        return false;
    }
    function dragSpacer($target) {
        $target.parent().append($target);// move to biggest z-index
        this.updateGroups();
        this._dragged = null;
        this._dragging = $target;
        this._options.selectCallback && this._options.selectCallback($target);
    }
    function doDrag(e) {
        if(this._dragging){
            this._dragging.offset({
                top  : (Number(e.pageY+this._mousezero.top)),
                left : (Number(e.pageX+this._mousezero.left))
            });
            normalizeSpacerPosition(this._dragging);
            return false;
        }
        return true;
    }
    function stopDrag(e) {
        this._dragged = this._dragging;
        if (!this._dragged) {
            this._options.selectCallback && this._options.selectCallback(null,$(e.target));
            return true;
        }
        this._dragged.focus();
        if(this._dragging){
            this._dragging = null;
            this.updateGroups();
            if(this._options.moveCallback) this._options.moveCallback(this._dragged);
        }
    }

    /*---GETTERS---*/

    //return an object whose each property are spacers to be cloned
    function getSpacers() {
        var spacerstr,spacers = {};
        for(var f=this._options.spacerMin-1;f<this._options.spacersList.length;f++){
            spacerstr = ('00'+this._options.spacersList[f]).substr(-3);
            spacers['f_'+spacerstr] = $('<div/>').addClass(this._options.spacerClass+' fs_'+spacerstr).attr('tabindex','');
        }
        return spacers;
    }

    //the fibonacci sequence! (min and max represent the Nth values of the sequence)
    function fibonacciSequence(min,max) {
        var fibo=1,last=1,llast=0,fibos=[];
        for (var f=1;f<=max;f++){
            fibo+=llast;
            llast=last;
            last=fibo;
            fibos.push(fibo);
        }
        if(min<=0)min=1;
        return fibos.splice(min-1,max-min+1);
    }

    //returns index of given spacer number inside spacerList array
    function spacerIndex(fibonum) {
        var list = this._options.spacersList;
        for(var f in list){
            if(list.hasOwnProperty(f) && list[f]===fibonum) return Number(f);
        }
        return -1;
    }

    //returns the spacersList array filtered with min and max indexes
    function spacersFilter(min,max) {
        if(!min||min<0)min=0;
        if(!max||max>this._options.spacersList.length-1) max=this._options.spacersList.length-1;

        var arr=[];
        for(var s=min;s<=max;s++){
            arr.push(this._options.spacersList[s]);
        }
        return arr;
    }

    //position object of reference element (default: 'body')
    function referencePos() {
        return $(this._options.reference).offset();
    }

    return UISpacerWidget;

}(jQuery,UIBaseWidget));
