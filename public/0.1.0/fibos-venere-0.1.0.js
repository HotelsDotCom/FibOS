/*! fibos - v0.1.0 - 2015-03-03 */ 
var FibOS = (function(){
/**
 * Created by fdimonte on 10/02/2015.
 */

var UIBaseWidget = (function($){

    /**
     * UIBaseWidget Class
     *
     * @param ID
     * @param options
     * @constructor
     */
    function UIBaseWidget(ID, options) {

        this.$el = null;

        this._ID = ID;

        this._selectorsMapping = null;
        this._globalSelectors = null;
        this._styles = {};
        this._options = {
            extension : {},    // css extension (accepts all 'styles' object properties)
            reference : 'body' // selector of reference element for all widget features
        };

        this.init(options);

    }

    /**
     * UIBaseWidget prototype
     *
     * @type {{init: Function, initOptions: Function, initStyles: Function, afterInit: Function, createSubElements: Function, createElement: Function, createStyleTag: Function, extendObject: Function, styleObjectToString: Function}}
     */
    UIBaseWidget.prototype = {

        /********************
         * OVERRIDABLE METHODS
         ********************/

        initOptions: function(options) {
            if(options) this.extendObject(this._options, options);
        },
        initStyles: function(extension) {
            if(extension) this.extendObject(this._styles, extension);
        },

        initEvents: function() {
            // does nothing
            // override this method in order to bind events
        },

        createSubElements: function() {
            // does nothing
            // override this method if the widget has internal sub-elements to be created
        },
        afterInit: function() {
            // does nothing
            // override this method if the widget needs some initial settings to be applied
        },

        /********************
         * PUBLIC METHODS
         ********************/

        init: function(options) {
            this.initOptions(options);
            this.initStyles(this._options.extension);

            this.createElement();
            this.createStyleTag();

            this.initEvents();
            this.afterInit();
        },

        createElement: function() {
            var $elem = $('#'+this._ID);
            if($elem.length>0){
                $elem.remove();
                console.log('Container ID already in use and thus has been removed.');
            }
            this.$el = $('<div/>').attr('id',this._ID);
            this.createSubElements();
        },

        createStyleTag: function() {
            var styleId = this._ID+'-style';
            $('#'+styleId).remove();

            var $style = $('<style/>').attr('id',styleId),
                selector,styleMap,styleClass,styleString,isGlobal;

            for(styleClass in this._styles){
                if(this._styles.hasOwnProperty(styleClass)){
                    styleString = this._styles[styleClass];
                    styleMap = this._selectorsMapping && this._selectorsMapping[styleClass];
                    isGlobal = this._globalSelectors && this._globalSelectors[styleClass];
                    selector = isGlobal ? '' : '#'+this._ID;

                    if(styleClass!='main')
                        selector += ' ' + (styleMap || '.'+styleClass);

                    $style.append(selector + ' {'+this.styleObjectToString(styleString)+'}');
                }
            }

            $('head').append($style);
        },

        show: function(){this.$el.show();},
        hide: function(){this.$el.hide();},

        /********************
         * SERVICE METHODS
         ********************/

        //extend each property of the given object with the same property of the given extension
        extendObject: function(obj,ext) {
            for(var p in ext){
                if(ext.hasOwnProperty(p)){
                    if(obj[p] && (obj[p] instanceof Object) && !(obj[p] instanceof Array)) this.extendObject(obj[p],ext[p]);
                    else obj[p] = ext[p];
                }
            }
        },

        //convert each property of a single style object to a single string
        styleObjectToString: function(obj) {
            var styleArray = [];
            for(var s in obj) if(obj.hasOwnProperty(s)) styleArray.push(s+':'+obj[s]+';');
            return styleArray.join('');
        }

    };

    return UIBaseWidget;

}(jQuery));
;/**
 * Created by fdimonte on 12/02/2015.
 */

var UIMarkerWidget = (function($,UIBaseWidget){

    /**
     * UIMarkerWidget Class
     *
     * @param ID
     * @param options
     * @constructor
     */
    function UIMarkerWidget(ID, options) {
        UIBaseWidget.call(this, ID, options);
    }

    /**
     * UIMarkerWidget prototype
     *
     * @type {UIBaseWidget}
     */
    UIMarkerWidget.prototype = Object.create( UIBaseWidget.prototype );

    /********************
     * OVERRIDABLE METHODS
     ********************/

    UIMarkerWidget.prototype.initOptions = function(options) {
        this.extendObject(this._options, {
            checkUseMarker : null,          //if this function returns false the marker won't be applied
            checkUseFont   : null,          //if this function returns false the fontinfo won't be applied
            markerClass    : 'fiboMarker',  //common highlight element class
            fontClass      : 'fiboFontinfo',//common fontinfo element class
            markerData     : 'markerHL',    //data name for marker elements
            fontData       : 'markerFI',    //data name for fontinfo elements
            excluded       : '',            //selector excluded from marker functionality
            taglist        : {              //list of known tags on which to apply the marker
                p:true,span:true,strong:true,li:true,
                h1:true,h2:true,h3:true,h4:true,h5:true,h6:true,
                a:true,input:true,select:true,textfield:true
            }
        });
        UIBaseWidget.prototype.initOptions.call(this, options);
        this.extendObject(this._options,{excluded:(this._options.excluded===''?'':this._options.excluded+',')+'.'+this._options.fontClass});
    };

    UIMarkerWidget.prototype.initStyles = function(extension) {
        var mclass = this._options.markerClass,
            fclass = this._options.fontClass;

        this._selectorsMapping = {
            marker      : '.'+mclass,
            fontinfo    : '.'+fclass,
            fontinfo_p  : '.'+fclass+' p',
            fontinfo_p1 : '.'+fclass+' p.fi1',
            fontinfo_p2 : '.'+fclass+' p.fi2',
            fontinfo_p3 : '.'+fclass+' p.fi3'
        };

        this.extendObject(this._styles, {
            main        :{position:'absolute'},
            marker      :{position:'absolute !important','z-index':'1',background:'#0ff',opacity:'0.5'},
            fontinfo    :{position:'absolute !important','z-index':'2',background:'rgba(34, 34, 34, 0.7)',border:'1px solid #fff',padding:'3px','font-family':'Open Sans',color:'#fff'},
            fontinfo_p  :{margin:'0',cursor:'default','text-algin':'center'},
            fontinfo_p1 :{'font-size':'13px','font-weight':'700','margin-top':'-4px'},
            fontinfo_p2 :{'font-size':'10px','font-weight':'400','margin':'-5px 0'},
            fontinfo_p3 :{'font-size':'14px','font-weight':'600','margin-bottom':'-4px'}
        });
        UIBaseWidget.prototype.initStyles.call(this, extension);
    };

    UIMarkerWidget.prototype.initEvents = function() {
        var ref = this._options.reference;
        var cls = '.'+this._options.markerClass;
        var tag = taglistToString(this._options.taglist);

        $(ref).off('.markerevent')
            .on('click.markerevent',doHighlight.bind(this))
            .on('click.markerevent',cls,undoHighlight.bind(this));

        $(tag).data(this._options.markerData,null);
        $(tag).data(this._options.fontData,null);
    };

    /********************
     * PUBLIC METHODS
     ********************/

    /*---SERVICE METHODS---*/

    //prevent/restore default behaviors for elements in defaults.taglist
    UIMarkerWidget.prototype.toggleListener = function(prevent) {
        if(prevent)
            preventDefaults.call(this);
        else
            restoreDefaults.call(this);
    };

    //add both text highlight and font info on given element
    UIMarkerWidget.prototype.addTextFontHighlight = function(elem) {
        var size;
        var useMarker = this._options.checkUseMarker ? this._options.checkUseMarker() : true;
        var useFont = this._options.checkUseFont ? this._options.checkUseFont() : true;
        if(useMarker||useFont)
            size = markerSize(elem);
        else
            return false;

        if(useMarker)
            addTextHighlight.call(this,elem,size);
        if(useFont)
            addFontInfo.call(this,elem,size);

        return true;
    };

    /********************
     * PRIVATE METHODS
     ********************/

    /*---SERVICE METHODS---*/

    //add text highlight around given element
    function addTextHighlight(elem,size) {
        var dataName = this._options.markerData;
        if($(elem).data(dataName)===true) return true;

        size || (size=markerSize(elem));
        var thl = $('<div class="'+this._options.markerClass+'"/>')
            .width(size.width)
            .height(size.height)
            .offset(size.offset)
            .click(function(e){removeFromMarker.call(this,$(e.currentTarget),dataName);}.bind(this));

        appendToMarker.call(this,elem,thl,dataName);
    }

    //add font info above given element
    function addFontInfo(elem,size) {
        var dataName = this._options.fontData;
        if($(elem).data(dataName)===true) return true;

        size || (size=markerSize(elem));
        var info = markerFont(elem);
        var p1 = $('<p class="fi1"/>').text(info[0]),
            p2 = $('<p class="fi2"/>').text(info[1]),
            p3 = $('<p class="fi3"/>').text(info[2]);
        var tfi = $('<div class="'+this._options.fontClass+'"/>')
            .append(p1,p2,p3)
            .offset({
                top  : size.offset.top - 45,
                left : size.offset.left + 10
            })
            .click(function(e){removeFromMarker.call(this,$(e.currentTarget),dataName);}.bind(this));

        appendToMarker.call(this,elem,tfi,dataName);
    }

    //append markerElement to marker and set data for both markerElement and its reference (the text node parent)
    function appendToMarker(elem,markerElem,dataName) {
        $(elem).data(dataName,true);
        $(markerElem).data('ref',elem);
        this.$el.append(markerElem);
    }

    //remove markerElement from marker and reset data on its reference (the text node parent)
    function removeFromMarker(markerElem,dataName) {
        $($(markerElem).data('ref')).data(dataName,false);
        $(markerElem).remove();
    }

    /*---PREVENT DEFAULTS---*/

    //prevent default behavior for not excluded tags
    function preventDefaults() {
        var tl = taglistToString(this._options.taglist);
        $(tl).off('.prevent')
            .on('click.prevent',function(e){
                if($(e.target).is(tl) && $(e.target).closest(this._options.excluded).length===0)
                    e.preventDefault();
            }.bind(this));
    }

    //restore all default behaviors
    function restoreDefaults() {
        var tl = taglistToString(this._options.taglist);
        $(tl).off('.prevent');
    }

    /*---EVENTS HANDLERS---*/

    //check for callback, check for target, then add highlight on clicked text
    function doHighlight(e) {
        if(isAcceptedTarget.call(this,e.target)){
            this.addTextFontHighlight(e.target);
        }
    }

    //remove clicked highlight
    function undoHighlight(e) {
        $(e.currentTarget).remove();
    }

    /*---MARKER INFO GETTERS---*/

    //font info array : [name,weight,size]
    function markerFont(elem) {
        var $el = $(elem),
            fw = $el.css('font-weight'),
            fs = $el.css('font-size').replace('px',''),
            ff = $el.css('font-family').split(',')[0].replace(/\"|'/g,'');

        var lett1 = ff.split(' ')[0].substr(0,1).toUpperCase(),
            lett2 = (ff.split(' ')[1]?ff.split(' ')[1].substr(0,1).toUpperCase():ff.substr(1,1).toLowerCase()),
            name = lett1+lett2;

        return [name,fw,fs];
    }

    //marker size object {width:Number,height:Number,offset:{left:Number,top:Number}}
    function markerSize(elem) {
        var fontOffset = markerHeight(elem);
        var $el = $(elem);
        return {
            width  : $el.width(),
            height : $el.height()-(fontOffset.t + fontOffset.b),
            offset : {
                left: $el.offset().left + parseInt($el.css('padding-left')),
                top : $el.offset().top  + parseInt($el.css('padding-top')) + fontOffset.t
            }
        };
    }

    //offset info on given elemenet's fontFamily and fontSize css properties
    function markerHeight(elem) {
        var $el = $(elem),
            loginfo = true,
            fw = $el.css('font-weight'),
            fs = $el.css('font-size').replace('px',''),
            ff = $el.css('font-family').split(',')[0].replace(/\"|\'| /g,'').toLowerCase();

        var sizes = {'arial':sizesDefault(),'open sans':sizesDefault()};
        sizes['arial']['8']      = fo(0,0);
        sizes['arial']['12']     = fo(3,1);
        sizes['arial']['18']     = fo(2,-1);
        sizes['arial']['20']     = fo(6,3);
        sizes['open sans']['12'] = fo(1,-1);
        sizes['open sans']['21'] = fo(5,1);
        sizes['open sans']['26'] = fo(11,5);

        if(loginfo){
            var textlog=[];
            textlog.push('family:"'+ff+'" - size:'+fs+' - weight:'+fw);

            if(!sizes[ff])
                textlog.push('fontFAMILY not used.. we\'ll implement it soon!');
            if(sizes[ff] && (!sizes[ff][fs] || (sizes[ff][fs]['t']===0&&sizes[ff][fs]['b']===0)))
                textlog.push('fontSIZE not used.. we\'ll implement it soon!');

            textlog.push('-----------------');
            console.log(textlog.join('\n'));
        }

        var finalSize;
        finalSize = sizes[ff] ? sizes[ff] : sizesDefault();
        finalSize = finalSize[fs] ? finalSize[fs] : finalSize['8'];
        return finalSize;
    }
    function fo(t,b){
        return {
            t : (t&&t!==0) ? t : 0,
            b : (b&&b!==0) ? b : 0
        };
    }
    function sizesDefault(){
        return {8:fo(),9:fo(),
            10:fo(),11:fo(),12:fo(),13:fo(),14:fo(),15:fo(),16:fo(),17:fo(),18:fo(),19:fo(),
            20:fo(),21:fo(),22:fo(),23:fo(),24:fo(),25:fo(),26:fo(),27:fo(),28:fo(),29:fo()};
    }

    /*---SERVICE GETTERS---*/

    //convert taglist array to string including only tags setted to 'true'
    function taglistToString(tagList) {
        var list = [];

        for(var tag in tagList) if(tagList.hasOwnProperty(tag)) if(tagList[tag]) list.push(tag);
        return list.join(',');
    }

    //check for accepted target
    function isAcceptedTarget(target) {
        var $target = $(target);

        //check target outside excluded selector
        if(this._options.excluded!=='' && $target.closest(this._options.excluded).length>0)
            return false;

        //check for non-empty target
        var isNotEmpty = ($target.html()!=='' &&
        $target.text()!=='' &&
        $target.text()!==' ' &&
        $target.text()!=='&nbsp;');

        if(isNotEmpty){
            //check for defaults
            var tag,
                tlist = this._options.taglist;

            for(tag in tlist){
                if(tlist.hasOwnProperty(tag) && tlist[tag] && $target.is(tag)) return true;
            }

            //additional checks
            if($target.is('div') && $target.find('*').length===0) return true;
        }

        return false;
    }

    return UIMarkerWidget;

}(jQuery,UIBaseWidget));
;/**
 * Created by fdimonte on 12/02/2015.
 */

var UIRulerWidget = (function($,UIBaseWidget){

    /**
     * UIRulerWidget Class
     *
     * @param ID
     * @param options
     * @constructor
     */
    function UIRulerWidget(ID, options) {
        UIBaseWidget.call(this, ID, options);
    }

    /**
     * UIRulerWidget prototype
     *
     * @type {UIBaseWidget}
     */
    UIRulerWidget.prototype = Object.create( UIBaseWidget.prototype );

    /********************
     * OVERRIDABLE METHODS
     ********************/

    UIRulerWidget.prototype.initOptions = function(options) {
        this.extendObject(this._options, {
            guidelinesContainer : '#ruler_guides', //where guidelines will be appended
            showMousePos        : true,            //toggle display of mouse coordinates
            showRulerV          : true,            //toggle display of vertical ruler
            showRulerH          : true,            //toggle display of horizontal ruler
            rulerWidth          : 20,              //width of both rulers
            rulerUnit           : 5,               //minimum unit interval (in pixel)
            rulerStepMin        : 2,               //number of minimum units before medium tick
            rulerStepMed        : 5                //number of medium tick before max tick
        });
        UIBaseWidget.prototype.initOptions.call(this, options);

        var op = this._options;
        if(!op.rulerMin) op.rulerMin = op.rulerUnit;
        if(!op.rulerMed) op.rulerMed = op.rulerMin * op.rulerStepMin;
        if(!op.rulerMax) op.rulerMax = op.rulerMed * op.rulerStepMed;
    };

    UIRulerWidget.prototype.initStyles = function(extension) {
        var pxMax = this._options.rulerWidth,
            pxMed = pxMax / 2,
            pxMin = pxMed / 2;

        this._selectorsMapping = {
            rulers_top   : '.ruler_origin',
            rulers_cont  : '.rulers_container',
            ruler_min    : '.ruler.ruler_min',
            ruler_med    : '.ruler.ruler_med',
            ruler_max    : '.ruler.ruler_max',
            ruler_label  : '.ruler .ruler_label',
            ruler_labelv : '.rulers_v .ruler_label',
            ruler_labelh : '.rulers_h .ruler_label',
            ruler_v      : '.rulers_v .ruler',
            ruler_h      : '.rulers_h .ruler',
            guide_v      : '.ruler_guideline.guide_v',
            guide_h      : '.ruler_guideline.guide_h',
            guideline    : '.ruler_guideline',
            mousepos     : '.ruler_mousepos',
            rulerv_min   : '.rulers_v .ruler_min',
            rulerv_med   : '.rulers_v .ruler_med',
            rulerv_max   : '.rulers_v .ruler_max',
            rulerh_min   : '.rulers_h .ruler_min',
            rulerh_med   : '.rulers_h .ruler_med',
            rulerh_max   : '.rulers_h .ruler_max'
        };

        this.extendObject(this._styles, {
            main         :{position:'absolute',top:rulerZero.call(this).top+'px',left:rulerZero.call(this).left+'px'},
            rulers_cont  :{position:'absolute',overflow:'hidden',background:'rgba(255,255,255,.8)'},
            rulers_v     :{width:this._options.rulerWidth+'px',height:rulerH.call(this)+'px',top:'0',left:'-'+this._options.rulerWidth+'px'},
            rulers_h     :{height:this._options.rulerWidth+'px',width:rulerW.call(this)+'px',left:'0',top:'-'+this._options.rulerWidth+'px'},
            ruler        :{'z-index':'1',position:'absolute',border:'0 solid #000'},
            ruler_v      :{'border-bottom-width':'1px',left:'0 !important'},
            ruler_h      :{'border-right-width':'1px',top:'0 !important'},
            ruler_top    :{'z-index':'2',position:'absolute',width:this._options.rulerWidth+'px',height:this._options.rulerWidth+'px',top:'-'+this._options.rulerWidth+'px',left:'-'+this._options.rulerWidth+'px',background:'#fff','border-right':'1px solid #000000','border-bottom':'1px solid #000000'},
            ruler_min    :{width:(this._options.rulerMin-1)+'px',height:(this._options.rulerMin-1)+'px'},
            ruler_med    :{width:(this._options.rulerMed-1)+'px',height:(this._options.rulerMed-1)+'px'},
            ruler_max    :{width:(this._options.rulerMax-1)+'px',height:(this._options.rulerMax-1)+'px'},
            ruler_label  :{position:'absolute','font-family':'helvetica','font-size':'8px',cursor:'default'},
            ruler_labelh :{bottom:'0px',right:'1px'},
            ruler_labelv :{bottom:'2px',right:'0px',width:'10px',transform:'rotate(-90deg)'},
            mousepos     :{'z-index':'3',position:'absolute',width:'auto',height:'auto',background:'rgba(200,200,200,.8)',border:'1px solid #fff','font-size':'12px',padding:'1px 5px 3px','white-space':'nowrap'},
            guideline    :{position:'absolute',background:'#0f0',width:'1px',height:'1px'},
            guide_v      :{height:rulerH.call(this)+'px',cursor:'ew-resize'},
            guide_h      :{width:rulerW.call(this)+'px',cursor:'ns-resize'}
        });
        this.extendObject(this._styles,{
            ruler_labelv :{'-webkit-transform':'rotate(-90deg)','-moz-transform':'rotate(-90deg)','-ms-transform':'rotate(-90deg)','-o-transform':'rotate(-90deg)',filter:'progid:DXImageTransform.Microsoft.BasicImage(rotation=3)'}
        });

        UIBaseWidget.prototype.initStyles.call(this, extension);

        this.extendObject(this._styles,{
            rulerv_min: {width:pxMin+'px !important'},
            rulerv_med: {width:pxMed+'px !important'},
            rulerv_max: {width:pxMax+'px !important'},
            rulerh_min: {height:pxMin+'px !important'},
            rulerh_med: {height:pxMed+'px !important'},
            rulerh_max: {height:pxMax+'px !important'}
        });
    };

    UIRulerWidget.prototype.createSubElements = function() {
        this.$el.addClass('rulers');
        this.rulers_v  = $('<div/>').addClass('rulers_container').addClass('rulers_v');
        this.rulers_h  = $('<div/>').addClass('rulers_container').addClass('rulers_h');
        this.ruler     = $('<div/>').addClass('ruler');
        this.ruler_lab = $('<div/>').addClass('ruler_label');
        this.rulertop  = $('<div/>').addClass('ruler_origin');
        this.mousepos  = $('<div/>').addClass('ruler_mousepos');
        this.guideline = $('<div/>').addClass('ruler_guideline');
        this.guides    = $('<div/>').attr('id','ruler_guides');

        generateRulers.call(this);
    };

    UIRulerWidget.prototype.initEvents = function() {
        $(this.$el).off('.guidesevent')
            .on('mousedown.guidesevent','.rulers_container',appendLineGuide.bind(this))
            .on('mousedown.guidesevent','.ruler_guideline',startGuideDrag.bind(this));

        $('body').off('.guidesevent')
            .on('mousemove.guidesevent',mouseMoving.bind(this))
            .on('mouseup.guidesevent',stopGuideDrag.bind(this))
            .on('keydown.guidesevent',key_handler.bind(this));

        $(window).off('.rulersevent')
            .on('scroll.rulersevent resize.rulersevent',updateRulersPosition.bind(this));
    };

    UIRulerWidget.prototype.afterInit = function() {
        updateRulersPosition.call(this);
    };

    /********************
     * PUBLIC METHODS
     ********************/

    /********************
     * PRIVATE METHODS
     ********************/

    /*---SERVICE METHODS---*/

    function generateRulers() {
        var ruler_min = this.ruler.clone().addClass('ruler_min'),
            ruler_med = this.ruler.clone().addClass('ruler_med'),
            ruler_max = this.ruler.clone().addClass('ruler_max');

        var totmin = Math.floor(this._options.rulerMed/this._options.rulerMin),
            totmed = Math.floor(this._options.rulerMax/this._options.rulerMed),
            totmax_v = Math.ceil(rulerH.call(this)/this._options.rulerMax),
            totmax_h = Math.ceil(rulerW.call(this)/this._options.rulerMax);

        var i,j,x,y;
        for(i=0;i<totmin;i++) ruler_med.append(ruler_min.clone().css(rulerPosition(i*this._options.rulerMin)));
        for(j=0;j<totmed;j++) ruler_max.append(ruler_med.clone().css(rulerPosition(j*this._options.rulerMed)));
        if(this._options.showRulerH){
            for(x=0;x<totmax_h;x++) this.rulers_h.append(ruler_max.clone().css(rulerPosition(x*this._options.rulerMax)).append(this.ruler_lab.clone().text((x+1)*this._options.rulerMax)));
            this.$el.append(this.rulers_h);
        }
        if(this._options.showRulerV){
            for(y=0;y<totmax_v;y++) this.rulers_v.append(ruler_max.clone().css(rulerPosition(y*this._options.rulerMax)).append(this.ruler_lab.clone().text((y+1)*this._options.rulerMax)));
            this.$el.append(this.rulers_v);
        }
        if(this._options.showMousePos && $('#').length===0) this.$el.append(this.mousepos);
        this.$el.append(this.rulertop);
        this.$el.append(this.guides);
    }

    /*---EVENTS HANDLERS---*/

    //while mouse is moving...
    function mouseMoving(e) {
        if(this._options.showMousePos){
            var mpos = rulerMousepos.call(this,e.pageX,e.pageY);
            var output = 'x:'+mpos.relative.left+', y:'+mpos.relative.top;

            this.mousepos.offset(mpos.absolute);
            this.mousepos.text(output);
        }
        if(this.guide_dragging){
            var offset,dir = typeofGuide(this.guide_dragging);
            var rzero = rulerZero.call(this);
            var bounds = getBoundaries.call(this,e);

            if(dir==='v') offset = { top:rzero.top, left:bounds.coords.x};
            if(dir==='h') offset = {left:rzero.left, top:bounds.coords.y};

            this.guide_dragging.offset(offset);
            return false;
        }
        return true;
    }

    //click on each ruler appends a new lineguide and drag to move it
    function appendLineGuide(e) {
        var dir = typeofRuler(e.currentTarget);
        var newGuide = this.guideline.clone().addClass('guide_'+dir);
        var guidesCont = $(this._options.guidelinesContainer);
        guidesCont.append(newGuide);

        this.guide_dragging = newGuide;
        this.guide_dragged = null;
        mouseMoving.call(this,e);
        return false
    }

    //click on single guideline and drag to move it
    function startGuideDrag(e) {
        this.guide_dragging = $(e.currentTarget);
        this.guide_dragged = null;
        mouseMoving.call(this,e);
        return false;
    }

    //on mouseup stop dragging and store dragged guideline reference
    function stopGuideDrag(e) {
        var bounds = getBoundaries.call(this,e);
        var isInsideRulers = $(e.target).closest('.rulers_container').length>0;
        var isInsideElement = e.pageX>bounds.bounds.x.min && e.pageX<bounds.bounds.x.max && e.pageY>bounds.bounds.y.min && e.pageY<bounds.bounds.y.max;
        if(this.guide_dragging && (isInsideRulers || !isInsideElement)){
            this.guide_dragging.remove();
            this.guide_dragging = null;
        }
        this.guide_dragged = this.guide_dragging;
        this.guide_dragging = null;
    }

    //handle keyboard events (arrow keys)
    function key_handler(e) {
        var offset = e.shiftKey?10:e.altKey?0.5:1;
        if(this.guide_dragged){
            if(e.keyCode>=37 && e.keyCode<=40){
                var newpos = {
                    top  : this.guide_dragged.position().top  + (e.keyCode===38?-offset:e.keyCode===40?offset:0),
                    left : this.guide_dragged.position().left + (e.keyCode===37?-offset:e.keyCode===39?offset:0)
                };
                if(typeofGuide(this.guide_dragged)==='v') this.guide_dragged.css({left:newpos.left});
                if(typeofGuide(this.guide_dragged)==='h') this.guide_dragged.css({top:newpos.top});
                return false;
            }
        }
        return true;
    }

    //on scroll and resize update rulers position to fit around the reference (default 'body')
    function updateRulersPosition(e) {
        var refPosTop = rulerZero.call(this).top-$(window).scrollTop()-this._options.rulerWidth;
        var refPosLeft = rulerZero.call(this).left-$(window).scrollLeft()-this._options.rulerWidth;

        this.$el.css({top:rulerZero.call(this).top,left:rulerZero.call(this).left});

        var rhCss = (refPosTop<=0)?
        {position:'fixed',top:'0',left:rulerZero.call(this).left}:
        {position:'absolute',top:-this._options.rulerWidth,left:0};

        var rvCss = (refPosLeft<=0)?
        {left:-rulerZero.call(this).left+$(window).scrollLeft()}:
        {left:-this._options.rulerWidth};

        this.rulers_h.css(rhCss);
        this.rulers_v.css(rvCss);

        var roCss = {top:rhCss.top,position:rhCss.position};
        roCss.left = (refPosTop<=0) ? this.rulers_v.offset().left : rvCss.left;
        this.rulertop.css(roCss);

        $('.guide_h').css({width:rulerW.call(this)});

    }

    /*---GETTERS--*/

    //info object about boundaries of reference element
    function getBoundaries(e) {
        var rzero = rulerZero.call(this),
            xMin = rzero.left - this._options.rulerWidth,
            yMin = rzero.top  - this._options.rulerWidth,
            xMax = rulerW.call(this) + rzero.left,
            yMax = rulerH.call(this) + rzero.top,
            newX = e.pageX<xMin ? xMin : e.pageX>xMax ? xMax : e.pageX,
            newY = e.pageY<yMin ? yMin : e.pageY>yMax ? yMax : e.pageY;

        return {
            coords   : {x:newX,y:newY},
            bounds   : {x:{min:xMin,max:xMax},y:{min:yMin,max:yMax}},
            isInside : (newX===e.pageX && newY===e.pageY)
        };
    }

    //pixel position of mouse inside Rulers
    function rulerMousepos(px,py) {
        var mpos = {},
            mwid = this.mousepos.width()+4,
            offX = 10,
            offY = 16;

        mpos.absolute = {left:px+offX,top:py+offY};
        if(mpos.absolute.left+mwid+offX>$(window).width())
            mpos.absolute.left=px-mwid-offX;

        px = px - $(this._options.reference).offset().left;
        py = py - $(this._options.reference).offset().top;
        mpos.relative = {left:Math.round(px),top:Math.round(py)};
        return mpos;
    }

    //position object of reference element (default: 'body')
    function rulerZero() {
        return $(this._options.reference).offset();
    }

    //width of reference element (default: 'body')
    function rulerW() {
        return $(this._options.reference).width()
            + Number($(this._options.reference).css('padding-left').replace('px',''))
            + Number($(this._options.reference).css('padding-right').replace('px',''));
    }

    //height of reference element (default: 'body')
    function rulerH() {
        return $(this._options.reference).height()
            + Number($(this._options.reference).css('padding-top').replace('px',''))
            + Number($(this._options.reference).css('padding-bottom').replace('px',''));
    }

    //css object of a single ruler position
    function rulerPosition(num) {
        return {left:num+'px',top:num+'px'};
    }

    /*---TYPEOF GETTERS--*/

    //direction of given guide ('v' or 'h')
    function typeofGuide(guide) {
        return $(guide).attr('class').replace(/ruler_guideline|guide_| /g,'');
    }

    //direction of given ruler ('v' or 'h')
    function typeofRuler(ruler) {
        return $(ruler).attr('class').replace(/rulers_|container| /g,'');
    }

    return UIRulerWidget;

}(jQuery,UIBaseWidget));
;/**
 * Created by fdimonte on 11/02/2015.
 */

var UISliderWidget = (function($,UIBaseWidget) {

    /**
     * UISliderWidget Class
     *
     * @param ID
     * @param options
     * @constructor
     */
    function UISliderWidget(ID, options) {
        this.sliding = false;
        this.mousezero = 0;

        UIBaseWidget.call(this, ID, options);
    }

    /**
     * UISliderWidget prototype
     *
     * @type {UIBaseWidget}
     */
    UISliderWidget.prototype = Object.create( UIBaseWidget.prototype );

    /********************
     * OVERRIDABLE METHODS
     ********************/

    UISliderWidget.prototype.initOptions = function(options) {
        this.extendObject(this._options, {
            minValue     : 0,     //minimum value accepted
            maxValue     : 100,   //maximum value accepted
            initialValue : 100,   //initial value (between min and max values)
            stepValue    : 1,     //step value for handler dragging
            callback     : null   //callback on slider value change
        });
        UIBaseWidget.prototype.initOptions.call(this, options);

        var op = this._options;
        if(op.maxValue<=op.minValue)     op.maxValue = op.minValue+op.stepValue;
        if(op.initialValue<=op.minValue) op.initialValue = op.minValue;
        if(op.initialValue>=op.maxValue) op.initialValue = op.maxValue;
    };

    UISliderWidget.prototype.initStyles = function(extension) {
        this.extendObject(this._styles, {
            main          :{position:'relative',width:'100px',height:'20px',background:'rgba(100,100,100,.4)'},
            slider_bar    :{position:'absolute',width:'100%', height:'3px', background:'rgb(200,200,200)',top:'9px'},
            slider_handler:{position:'absolute',width:'10px', height:'20px',background:'rgb(100,100,100)',top:'0',left:'0'},
            slider_output :{position:'absolute',width:'34px', height:'20px',background:'#fff',top:'0',right:'-34px','text-indent':'0','text-align':'center','font-size':'12px','line-height':'20px',cursor:'default'}
        });
        UIBaseWidget.prototype.initStyles.call(this, extension);
    };

    UISliderWidget.prototype.createSubElements = function() {
        this.$el.addClass('slider');
        this.slider_bar     = $('<div/>').addClass('slider_bar');
        this.slider_handler = $('<div/>').addClass('slider_handler');
        this.slider_output  = $('<div/>').addClass('slider_output');

        this.$el
            .append(this.slider_bar)
            .append(this.slider_handler)
            .append(this.slider_output);
    };

    UISliderWidget.prototype.initEvents = function() {
        var namespace = '.slider_'+this._ID;
        this.$el.off(namespace)
            .on('mousedown' + namespace, quickSlide.bind(this))
            .on('mousedown' + namespace, '.slider_handler', slideStart.bind(this));

        $('body').off(namespace)
            .on('mousemove' + namespace, doSlide.bind(this))
            .on('mouseup'   + namespace, slideStop.bind(this));
    };

    UISliderWidget.prototype.afterInit = function() {
        this.setSliderVal(this._options.initialValue);
    };

    /********************
     * PUBLIC METHODS
     ********************/

    /*---SLIDER VALUE MANAGER METHODS---*/

    //set and output the slider value (from given value)
    UISliderWidget.prototype.setSliderVal = function(val) {
        var perc = (val-this._options.minValue) / (this._options.maxValue-this._options.minValue);
        this.setSliderPerc(perc);
    };

    //set and output the slider value (from given percentage)
    UISliderWidget.prototype.setSliderPerc = function(perc) {
        var posx = (perc * sliderWidth.call(this));
        this.slider_handler.css('left',posx);
        outputSliderVal.call(this,perc);
    };

    //retrieve the slider numeric value
    UISliderWidget.prototype.getSliderVal = function() {
        return outputSliderVal.call(this,this.getSliderPerc());
    };

    //retrieve the slider percentage value
    UISliderWidget.prototype.getSliderPerc = function(){
        var posx = this.slider_handler.css('left').replace('px','');
        return posx / sliderWidth.call(this);
    };

    /********************
     * PRIVATE METHODS
     ********************/

    /*---SERVICE METHODS---*/

    //write the output value inside the slider_output element and returns it
    function outputSliderVal(perc){
        var value = Math.floor(sliderValueFromPerc.call(this,perc)*10)/10;
        this.slider_output.text(value);

        if(this._options.callback) this._options.callback(perc,value);
        return value;
    }

    /*---EVENTS HANDLERS---*/

    //quickly move the slider and begin sliding
    function quickSlide(e) {
        if($(e.target).is(this.slider_output)) return true;
        this.slider_handler.css('left',getPosx.call(this,e,-(this.slider_handler.width()/2)));
        slideStart.call(this,e);
        return false;
    }
    //start sliding
    function slideStart(e) {
        this.mousezero = this.slider_handler.position().left - mouseposInside.call(this,e.pageX);
        this.sliding = true;
        doSlide.call(this,e);
        return false;
    }
    //stop sliding
    function slideStop(e) {
        this.sliding = false;
        return false;
    }
    //sliding... :)
    function doSlide(e) {
        if(this.sliding) this.setSliderPerc(getPosx.call(this,e) / sliderWidth.call(this));
        return false;
    }

    /*---GETTERS---*/

    //get slider value from given percentage (according to minValue, maxValue and stepValue)
    function sliderValueFromPerc(perc){
        var vmin  = this._options.minValue,
            vmax  = this._options.maxValue,
            vstep = this._options.stepValue;

        return Math.round((vmin+(perc*(vmax-vmin)))/vstep)*vstep;
    }

    //pixel position of mouse inside Slider approximated to stepValue
    function getPosx(e,mzero){
        if(mzero) this.mousezero = mzero;
        var posx,
            wmax = sliderWidth.call(this);

        posx = mouseposInside.call(this,e.pageX) + this.mousezero;
        posx = posx<0?0 : posx>wmax?wmax : posx;

        var pxUnit = this._options.stepValue / (this._options.maxValue-this._options.minValue) * wmax;
        posx = Math.floor((posx+(pxUnit/2)) / pxUnit) * pxUnit;

        return posx;
    }

    //pixel position of mouse inside Slider
    function mouseposInside(pagex){
        return pagex - this.$el.offset().left;
    }

    //Slider full width
    function sliderWidth(){
        return this.$el.width() - this.slider_handler.width();
    }

    return UISliderWidget;

}(jQuery,UIBaseWidget));
;/**
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
        this.defaultGroupName = 'spacerGroup_';
        this.lastUsedGroup = this.defaultGroupName+'0';
        this.spacersGroups = emptySpacersGroups();
        this.mousezero = null;
        this.dragging = null;
        this.dragged = null;

        UIBaseWidget.call(this, ID, options);

        this.spacerObjects = getSpacers.call(this);
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
        this.extendObject(this._options, {
            localStorage  : 'fibonacciGroups',
            spacerClass   : 'fibospacer',
            spacerMatch   : /fibospacer|fs|_| /g,
            grouping      : true,
            moveCallback  : null,
            groupCallback : null,
            spacersList   : fibonacciSequence(1,12),
            spacerMin     : 3,
            spacerSymbols : [{s:'•',f:2.8,l:1},{s:'★',f:1,l:1.09}],
            spacerColors  : ['#0071bc','#ed1e79','#8cc63f','#fbb03b']
        });
        UIBaseWidget.prototype.initOptions.call(this, options);
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
        this.extendObject(this._styles, {
            main   :{position:'absolute',top:referencePos.call(this).top+'px',left:referencePos.call(this).left+'px',width:'0',height:'0',overflow:'visible'},
            spacer :{position:'absolute',display:'block',cursor:'pointer',overflow:'hidden','font-family':'Arial',outline:'0'},
            shadow :{'-webkit-box-shadow':shad,'-moz-box-shadow':shad,'box-shadow':shad}
        });
        this.extendObject(this._styles, generateSpacersStyles.call(this));

        UIBaseWidget.prototype.initStyles.call(this, extension);
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

    /********************
     * PUBLIC METHODS
     ********************/

    UISpacerWidget.prototype.getSpacersList = function(onlyActiveSpacers){
        return spacersFilter.call(this, onlyActiveSpacers ? this._options.spacerMin-1 : 0);
    };
    UISpacerWidget.prototype.getSpacerType = function(spacer){
        return $(spacer).attr('class').replace(this._options.spacerMatch,'');
    };
    UISpacerWidget.prototype.updateGroups = function(){
        htmlToSpacersGroups.call(this);
    };
    UISpacerWidget.prototype.newUsedGroup = function(newgroup){
        this.lastUsedGroup = newgroup ? newgroup : this.defaultGroupName+(this.spacersGroups.totalGroups()+1);
    };
    UISpacerWidget.prototype.setMouseZero = function(mzero){
        if((mzero.top || mzero.top===0) && (mzero.left || mzero.left===0))
            this.mousezero = mzero;
        else
            console.log('WARNING: setMouseZero called with wrong parameter');
    };
    UISpacerWidget.prototype.dragSpacer = function($target){
        dragSpacer.call(this,$target);
    };

    /*---GROUPS MANAGER---*/

    UISpacerWidget.prototype.renameGroup = function(oldname,newname) {
        if(!oldname || !newname) return false;
        if(oldname === newname) return false;
        if($('#'+newname).length>0) return false;

        var oldArr = this.spacersGroups.groups[oldname];
        if(!oldArr) return false;

        this.spacersGroups.groups[newname] = oldArr;

        var $group = getGroup.call(this,newname);
        $group.html($('#'+oldname).html());
        removeGroup.call(this,oldname);

        return true;
    };

    UISpacerWidget.prototype.offsetGroup = function(offset) {
        var t,l,
            spacers = this.spacersGroups.groups[this.lastUsedGroup],
            $spacers = $('#'+this.lastUsedGroup).find('.'+this._options.spacerClass);

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
        var s,spacers = this.spacersGroups.groups[this.lastUsedGroup];

        if(!spacers) return;
        for(s in spacers){
            if(spacers.hasOwnProperty(s)){
                spacers[s][1] = Number(spacers[s][1]) + Number(offset.top);
                spacers[s][2] = Number(spacers[s][2]) + Number(offset.left);
            }
        }
        this.spacersGroups.groups[this.lastUsedGroup] = spacers;
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

    UISpacerWidget.prototype.addNewSpacer = function(num,group) {
        if(spacerIndex.call(this,num)==-1) {
            console.log('WARNING: addSpacer called with unsupported spacer');
            return null;
        }

        if(!group) group = this.lastUsedGroup;
        var spacerStr = ('000'+num).substr(-3);
        var spacerObj = this.spacerObjects['f_'+spacerStr].clone();
        var $parent = this._options.grouping ? getGroup.call(this,group) : this.$el;
        if(spacerObj) $parent.append(spacerObj);
        return spacerObj;
    };

    /*---SPACERS PARSER---*/

    //given json to descriptive string
    UISpacerWidget.prototype.jsonToString = function(stJson,joinWith) {
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

    /********************
     * PRIVATE METHODS
     ********************/

    /*---GROUPS MANAGER---*/

    function getGroup(name,skipAppend,skipEvent) {
        return addNewGroup.call(this,name,skipAppend,skipEvent);
    }
    function removeGroup(name) {
        if(!name || !this.spacersGroups.groups[name]) return false;
        $('#'+name).remove();
        delete this.spacersGroups.groups[name];
        return true;
    }
    function removeAllGroup() {
        this.$el.empty();
        this.spacersGroups = emptySpacersGroups();
        return true;
    }
    function addNewGroup(name,skipAppend,skipEvent) {
        name || (name=this.lastUsedGroup);

        var newgroup = $('#'+name);
        if(newgroup.length===0){
            newgroup = $('<div id="'+name+'" class="spacers_group"/>');
            if(!skipAppend) this.$el.append(newgroup);
            if(!skipEvent && this._options.groupCallback) this._options.groupCallback(name);
        }
        this.lastUsedGroup = name;

        return newgroup;
    }

    /*---SPACERS PARSER---*/

    //current HTML to spacersGroups
    function htmlToSpacersGroups() {
        var cont,myasset = {};

        //$('#'+this._ID+' .'+this._options.spacerClass).each(function(i,e){
        this.$el.find('.'+this._options.spacerClass).each(function(i,e){
            cont = $(e).parent().attr('id');

            if(cont===this._ID) cont='spacerGroupDefault';
            if(!myasset[cont]) myasset[cont] = [];

            myasset[cont].push([
                parseInt(this.getSpacerType.call(this,e)),
                Number($(e).css('top').replace('px','')),
                Number($(e).css('left').replace('px',''))
            ]);

        }.bind(this));

        this.spacersGroups.groups = myasset;
    }

    //current HTML to spacersGroups and then to Json String
    function spacersToJson() {
        htmlToSpacersGroups.call(this);
        return JSON.stringify(this.spacersGroups.groups);
    }

    //given json to spacersGroups and then to HTML (default output='html')
    function jsonToSpacers(stJson,replace,hide) {
        var spacers_arr,spacers_obj = JSON.parse(stJson);
        for(var s in spacers_obj){
            if(spacers_obj.hasOwnProperty(s)){
                if(replace) {
                    delete this.spacersGroups.groups[s];
                    spacers_arr = spacers_obj[s];
                } else {
                    spacers_arr = this.spacersGroups.groups[s];
                    if(!spacers_arr) spacers_arr = [];
                    spacers_arr.push.apply(spacers_arr,spacers_obj[s]);
                }
                this.spacersGroups.groups[s] = spacers_arr;
            }
        }
        return spacersGroupsToHtml.call(this,hide);
    }

    //convert spacersGroups to appendable HTML or JQuery node objects
    function spacersGroupsToHtml(hide) {
        var sp_name,sp_arr,sp_node,sp_nodes;
        var $group,finalHtml = [];

        for(var groupName in this.spacersGroups.groups){
            if(this.spacersGroups.groups.hasOwnProperty(groupName)){
                sp_nodes = [];
                sp_arr = this.spacersGroups.groups[groupName];
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

                //dopo il primo ciclo sui colori aggiunge i simboli (ogni ciclo sui colori un simbolo diverso)
                if(fiboidx>=fcLen){
                    fibosObjs[fibocls+':after'] = {
                        'content'     : '"'+d_symbols[fs].s+'"',
                        'font-size'   : Number(fibonum*d_symbols[fs].f) + 'px',
                        'line-height' : Number(fibonum*d_symbols[fs].l) + 'px'
                    };
                    this._globalSelectors[fibocls+':after'] = true;

                    //determina l'inizio del ciclo sull'array spacerColors
                    if((fiboidx+1)%fcLen===0){
                        if(++fs>=fsLen)fs=fsLen-1;// incrementa ciclicamente l'indice di symbol
                    }
                }
                if(++fc>=fcLen)fc=0;// incrementa ciclicamente l'indice di colors
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

    /*---EVENTS HANDLERS---*/

    /* Devices Handlers */
    function key_handler(e) {
        var offset = e.shiftKey?10:e.altKey?0.5:1;
        if(this.dragged){
            if(e.keyCode>=37 && e.keyCode<=40){
                this.dragged.offset({
                    top  : ( this.dragged.offset().top  + (e.keyCode===38?-offset:e.keyCode===40?offset:0) ),
                    left : ( this.dragged.offset().left + (e.keyCode===37?-offset:e.keyCode===39?offset:0) )
                });
                if(this._options.moveCallback) this._options.moveCallback(this.dragged);
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
        this.mousezero = {
            top  : ($target.position().top  - e.pageY + referencePos.call(this).top),
            left : ($target.position().left - e.pageX + referencePos.call(this).left)
        };
        dragSpacer.call(this,$target);
        return false;
    }
    function dragSpacer($target) {
        var $parent = $target.parent();
        $parent.append($target);
        this.dragged = null;
        this.dragging = $target;
    }
    function doDrag(e) {
        if(this.dragging){
            this.dragging.offset({
                top  : (Number(e.pageY+this.mousezero.top)),
                left : (Number(e.pageX+this.mousezero.left))
            });
            normalizeSpacerPosition(this.dragging);
            return false;
        }
        return true;
    }
    function stopDrag(e) {
        this.dragged = this.dragging;
        if (!this.dragged) return true;
        this.dragged.focus();
        if(this.dragging){
            this.dragging = null;
            if(this._options.moveCallback) this._options.moveCallback(this.dragged);
        }
    }

    /*---GETTERS---*/

    //return an object whose each property are spacers to be cloned
    function getSpacers() {
        var spacerstr,spacers = {};
        for(var f=this._options.spacerMin-1;f<this._options.spacersList.length;f++){
            spacerstr = ('00'+this._options.spacersList[f]).substr(-3);
            spacers['f_'+spacerstr] = $('<div class="'+this._options.spacerClass+' fs_'+spacerstr+'" tabindex=""/>');
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
;/**
 * Created by fdimonte on 10/02/2015.
 */

var UISpriterWidget = (function($,UIBaseWidget){

    /**
     * UISpriterWidget Class
     *
     * @param ID
     * @param options
     * @constructor
     */
    function UISpriterWidget(ID, options) {
        this.spritesInfo = {};
        this.spritesLoaded = 0; // updated by didLoadSprite()
        this.spritesTotal = 0;  // updated by getCSSImages()

        UIBaseWidget.call(this, ID, options);

        // resize event
        windowResizeEvent.call(this);
        $(window).off('.iuSpriter')
            .on('resize.iuSpriter',windowResizeEvent.bind(this));
    }

    /**
     * UISpriterWidget prototype
     *
     * @type {UIBaseWidget}
     */
    UISpriterWidget.prototype = Object.create( UIBaseWidget.prototype );

    /********************
     * OVERRIDABLE METHODS
     ********************/

    UISpriterWidget.prototype.initOptions = function(options) {
        this.extendObject(this._options, {
            visible   : true,    // default visibility before and right after sprites loaded
            opacity   : '0.3',   // obscurers opacity
            color     : '#f00',  // obscurers color
            border    : '#0f0',  // sprites border color
            image     : '',      // sprites background image pattern
            domain    : '',      // domain accepted (will not load images outside domain)
            callback  : null     // callback triggered when all sprites are loaded (after analyze)
        });
        UIBaseWidget.prototype.initOptions.call(this, options);
    };

    UISpriterWidget.prototype.initStyles = function(extension) {
        this.extendObject(this._styles,{
            main                : {position:'relative',display:this._options.visible?'block':'none'},
            obscurers_container : {position:'relative',display:'block',top:'0',left:'0','text-align':'left',border:'1px solid '+this._options.border,visibility:'hidden'},
            sprite_obscurer     : {position:'absolute',display:'block',background:this._options.color,opacity:this._options.opacity}
        });

        if(this._options.image && this._options.image!=='')
            this._styles.obscurers_container.background = 'url("'+this._options.image+'") repeat scroll 0 0 transparent';

        UIBaseWidget.prototype.initStyles.call(this, extension);
    };

    /********************
     * PUBLIC METHODS
     ********************/

    //file name only from css background-image property (trim extension to have the sole name)
    UISpriterWidget.prototype.filenameFromCss = function(cssUrl,trimExtension) {
        var f = filenameFromUrl(urlFromCss(cssUrl));
        return trimExtension ?
            f.replace(/.png|.jpg|.jpeg|.gif/g,'') :
            f;
    };

    UISpriterWidget.prototype.analyze = function() {
        getCSSImages.call(this,imagesAnalyzed.bind(this));
    };

    UISpriterWidget.prototype.toggleSprite = function(sid) {
        var sprite,$cont;
        var $sprites = $('#'+this._ID);
        var $sprites_bg = $('#fibo_sprites_bg');

        $sprites.hide();
        $sprites_bg.show();
        $('.obscurers_container').hide();
        if(sid!=='hide_sprites'){
            sprite = sid.replace('toggle_sprite_','');
            $cont = $('.obscurers_container#'+sprite);
            $cont.show();
            $sprites.show();
        }
    };

    /********************
     * PRIVATE METHODS
     ********************/

    /*---SPRITE LOADING---*/

    //before loading sprite
    function willLoadSprite() {
        if(this.$el.css('visibility')==='hidden') return false;
        if(!this._options.visible) spriterShow(this.$el);
        return true;
    }

    //after loading sprite
    function didLoadSprite(spriteNotLoaded) {
        if((spriteNotLoaded?this.spritesLoaded:++this.spritesLoaded) < this.spritesTotal) return false;

        if(!this._options.visible) spriterHide(this.$el);
        if(this._options.callback) this._options.callback(this.spritesInfo);
        return true;
    }

    //error loading sprite
    function failLoadSprite(imgurl) {
        var cssUrl = cssFromUrl(imgurl);
        delete this.spritesInfo[cssUrl];

        this.spritesTotal = spritesInfoLength.call(this);
        didLoadSprite.call(this,true);
    }

    /*---SPRITES ANALYZE PROCESS---*/

    //analyze all child elements of 'reference' and take its own background images and position
    function getCSSImages(cb,externalCB) {
        var $main = $(this._options.reference),
            $nodes = $main.find('*');

        console.log('calculating... (please, wait until done!)');
        $nodes.each(function(i,e){
            var $elm = $(e),
                img = $elm.css('background-image');

            var canContinue = (this._options.domain==='');

            if(!canContinue && img.indexOf(this._options.domain)>-1)
                canContinue = true;
            if(canContinue && img.substr(0,3)!=='url')
                canContinue = false;
            if(canContinue && img.indexOf('http')===-1)
                canContinue = false;

            if(canContinue){
                var posStr = $elm.css('background-position'),
                    posArr = posStr.split(' '),
                    posX   = numberFromCssProp(posArr[0]) * -1,
                    posY   = numberFromCssProp(posArr[1]) * -1,
                    offW   = numberFromCssProp($elm.css('padding-left')) + numberFromCssProp($elm.css('padding-right')),
                    offH   = numberFromCssProp($elm.css('padding-top'))  + numberFromCssProp($elm.css('padding-bottom'));

                var pos  = {l:posX,t:posY},
                    size = {w:offW+$elm.width(),h:offH+$elm.height()};

                if(img && img!=='none'){
                    if(!this.spritesInfo[img]) this.spritesInfo[img]=[];
                    this.spritesInfo[img].push({pos:pos,size:size});
                }
            }

        }.bind(this));
        console.log('DONE!');

        this.spritesTotal = spritesInfoLength.call(this);
        if(cb) {
            cb(this.spritesInfo,externalCB);
            return true;
        }
        else return this.spritesInfo;
    }

    //create and append containers when all dom elements has been analyzed (use it as callback for getCSSImages method)
    function imagesAnalyzed(_spritesInfo) {
        var $img,arr,
            $obsCont,
            filename;

        for(var i in _spritesInfo){
            if(_spritesInfo.hasOwnProperty(i)){
                filename = this.filenameFromCss(i,true);
                arr = spriteObscurerArray(_spritesInfo[i]);
                $img = spriteImage.call(this,i);
                $obsCont = $('<div id="'+filename+'" class="obscurers_container"/>');
                $obsCont.append($img);

                for(var s in arr) if(arr.hasOwnProperty(s)) $obsCont.append(arr[s]);

                this.$el.append($obsCont);
            }
        }
    }

    /*---SERVICE METHODS---*/

    //show/hide elements while sprites are loading
    function spriterShow($elem) {$elem.css('visibility','hidden').show();}
    function spriterHide($elem) {$elem.css('visibility','visible').hide();}

    //load a single sprite and return the img dom element (not appended to body)
    function spriteImage(cssUrl) {
        var url = urlFromCss(cssUrl);
        var fid = this.filenameFromCss(cssUrl,true);

        willLoadSprite.call(this);

        var $image = $('<img/>');
        $image
            .on('load',imageLoaded.bind(this,fid))
            .on('error',imageError.bind(this));

        $image.attr('src',url);

        return $image;
    }
    function imageLoaded(fid,e){
        var $cont = $('#'+fid),
            $img  = $(e.target),
            size  = {width:$img.width(), height:$img.height()};

        $cont.css(size);

        if(!this._options.visible) spriterHide($cont);

        didLoadSprite.call(this);
    }
    function imageError(e){
        var imgurl = e.target.src;
        alert('Failed to load the image:\n'+imgurl);
        failLoadSprite.call(this,imgurl);
    }

    /*---GETTERS---*/

    //container div for all sprite obscurers (and the sprite itself)
    function spriteObscurer(ob) {
        var styles = 'top:'+ob.pos.t+'px; left:'+ob.pos.l+'px; width:'+ob.size.w+'px; height:'+ob.size.h+'px;';
        return $('<div/>').addClass('sprite_obscurer').attr('style',styles);
    }

    //array of obscurer for a single sprite
    function spriteObscurerArray(imageObject) {
        var ob,$so,
            arr = [];

        for(var i in imageObject){
            if(imageObject.hasOwnProperty(i)){
                ob = imageObject[i];
                $so = spriteObscurer(ob);
                arr.push($so);
            }
        }
        return arr;
    }

    //number of spritesInfo properties (ie. number of sprites)
    function spritesInfoLength() {
        var s,tot = 0;
        for(s in this.spritesInfo) if(this.spritesInfo.hasOwnProperty(s)) tot++;
        return tot;
    }

    //numeric value of a css property
    function numberFromCssProp(prop) {
        return Number(prop.replace(/px|%/g,''));
    }

    //url string from css background-image property
    function urlFromCss(cssUrl) {
        return cssUrl.replace(/url\(|\"|\)/g,'');
    }

    //file name only from url string
    function filenameFromUrl(url) {
        var i = url.lastIndexOf("/");
        return url.substr(i+1);
    }

    //given url wrapped in css property
    function cssFromUrl(url) {
        return 'url("'+url+'")';
    }

    /*---EVENT HANDLERS---*/

    function windowResizeEvent(e) {
        this.$el
            .width($(window).width())
            .height($(window).height());
    }

    return UISpriterWidget;

}(jQuery,UIBaseWidget));
;/**
 * Created by fdimonte on 23/02/2015.
 */

var UIBasePanel = (function($){

    /**
     * UIBasePanel Class
     *
     * @constructor
     * @param id
     * @param label
     */
    function UIBasePanel(id,label) {
        this.$el = null;
        this._ID = id;
        this._label = label;
        this._gui = null;

        this._listeners = {};

        /*
        the initialize process will call
            this.createContent() - should be overridden
        which will returns a group of jQuery object to be appended to this.$el by
            this.createElement() - should NOT be overridden
        this method returns a Boolean success, if TRUE will call
            this.setEvents() - should be overridden
         */
        this.init();
    }

    /**
     * UIBasePanel prototype
     *
     * @type {{setEvents: Function, getStyles: Function, createContent: Function, init: Function, createElement: Function, addTo: Function, open: Function, close: Function, toggle: Function, addListener: Function, on: Function, off: Function, trigger: Function, fiboSelect: Function, panelCheckbox: Function}}
     */
    UIBasePanel.prototype = {

        /********************
         * OVERRIDABLE METHODS
         ********************/

        setEvents: function() {},
        getStyles: function() {},
        createContent: function() {},

        /********************
         * PUBLIC METHODS
         ********************/

        /*---INITIALIZE METHODS---*/

        init: function() {
            if(this.createElement(this.createContent()))
                this.setEvents();
            else
                throw new Error('cannot initialize panel: '+this._ID+' ('+this._label+')');
        },

        createElement: function(content) {
            if(!content) return false;
            var label_id = this._ID+'_checkbox';

            var $module  = $('<div/>').addClass('vui-panel').attr('id',this._ID),
                $label   = $('<div/>').addClass('vui-label'),
                $content = $('<div/>').addClass('vui-content');

            $label.append($('<input/>').attr('id',label_id).addClass('fibo_checkbox').attr('type','checkbox'));
            $label.append($('<label/>').attr('for',label_id).html(this._label));

            $content.append(content);

            this.$el = $module.append($label).append($content);
            this.$el.find('.fibo_checkbox').on('change',toggle_handler.bind(this));
            return true;
        },

        /*---SERVICE METHODS---*/

        // add panel to FibOS GUI
        addTo: function(gui) {
            this._gui = gui;
        },

        // open/close panel management
        open: function() {
            this.$el.addClass('fibo_panel_open');
            this.$el.find('.vui-label').find('.fibo_checkbox').attr('checked',true);
            this.$el.find('.vui-content').slideDown();
        },
        close: function() {
            this.$el.removeClass('fibo_panel_open');
            this.$el.find('.vui-label').find('.fibo_checkbox').attr('checked',false);
            this.$el.find('.vui-content').slideUp();
        },
        toggle: function() {
            if(isPanelOpen(this))
                this.close();
            else
                this.open();
        },
        isOpen: function() {
            return isPanelOpen(this);
        },

        // events management
        addListener: function(event,child,callback){
            if(typeof(child)=='function')
                this.$el.on(event,child.bind(this));
            else if(typeof(child)=='string')
                this.$el.on(event,child,callback.bind(this));
        },
        on: function(event,handler){
            this._listeners[event] || (this._listeners[event]=[]);
            this._listeners[event].push(handler);
        },
        off: function(event){
            this._listeners[event] = null;
        },
        trigger: function(event,data){
            this._gui && this._gui._logEvents && console.log('trigger [%s] -> %s(%s)',this._ID,event,data);

            var events = this._listeners[event];
            if(!events) return;
            for(var e in events) if(events.hasOwnProperty(e)) events[e](data,event);
        },

        /*---FACTORY METHODS---*/

        fiboSelect : function(list,id,skipFirst) {
            if(!list && !id) return null;

            var $select = $('<select/>').attr('id',id);

            if(!skipFirst)
                $select.append($('<option/>').attr('disabled',true).attr('selected',true).val('none').text('chose a spacer'));

            for(var f=0;f<list.length;f++)
                $select.append($('<option/>').val(('00'+list[f]).substr(-3)).text(list[f]));

            return $select;
        },

        panelCheckbox : function(cont_id,title,checked) {
            var labid = cont_id+'_checkbox';
            var $container = $('<div/>').attr('id',cont_id).addClass('fibo_toggle');
            var $checkbox = $('<input/>').attr('id',labid).addClass('fibo_checkbox').attr('type','checkbox').attr('checked',checked);
            var $label = $('<label/>').attr('for',labid).attr('title',title).html('&nbsp;');
            return $container.append($checkbox).append($label);
        }

    };

    /********************
     * PRIVATE METHODS
     ********************/

    function isPanelOpen(panel){
        return panel.$el.find('.vui-content').css('display')!=='none';
    }

    function toggle_handler(e) {
        var $t = $(e.currentTarget);
        if($t.is(':checked'))
            this._gui.openPanel(this);
        else
            this._gui.closePanel(this);
    }

    return UIBasePanel;

}(jQuery));
;/**
 * Created by fdimonte on 25/02/2015.
 */

var UIExtraPanel = (function($,UIBasePanel) {

    /**
     * UIExtraPanel Class
     *
     * @param id
     * @constructor
     */
    function UIExtraPanel(id) {
        UIBasePanel.call(this,id);
    }

    /**
     * UIExtraPanel prototype
     *
     * @type {UIBasePanel}
     */
    UIExtraPanel.prototype = Object.create(UIBasePanel.prototype);

    UIExtraPanel.prototype.createElement = function(content) {
        if(!content) return false;
        this.$el = $('<div/>').attr('id',this._ID).append(content);
        return true;
    };

    return UIExtraPanel;

}(jQuery,UIBasePanel));
;/**
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
        var $hide = $('#'+this._selectors.hideall);
        var $tree = $('#'+this._selectors.tree);
        var $li = $tree.find('li');
        var $checked = $li.find('input:checked');

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
        this.trigger('group_list_open');
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
;/**
 * Created by fdimonte on 23/02/2015.
 */

var UIInputPanel = (function($,UIBasePanel){

    /**
     * UIInputPanel Class
     *
     * @constructor
     * @param id
     * @param label
     */
    function UIInputPanel(id,label) {

        var baseID = 'fibo_input_';
        this._selectors = {
            input : baseID + 'text',
            load  : baseID + 'load',
            share : baseID + 'export'
        };

        UIBasePanel.call(this,id,label);
    }

    /**
     * UIInputPanel prototype
     *
     * @type {UIBasePanel}
     */
    UIInputPanel.prototype = Object.create(UIBasePanel.prototype);

    /********************
     * OVERRIDABLE METHODS
     ********************/

    UIInputPanel.prototype.createContent = function() {
        var $content = $('<div/>')
            .append($('<textarea/>').attr('id',this._selectors.input))
            .append($('<input/>').attr('type','button').addClass('vui-btn').attr('id',this._selectors.load).val('import'))
            .append($('<input/>').attr('type','button').addClass('vui-btn').attr('id',this._selectors.share).val('export'));

        return $content.children();
    };

    UIInputPanel.prototype.setEvents = function() {

        this.addListener('click', '#'+this._selectors.load, function(e){
            this.trigger('input_import', $('#'+this._selectors.input).val());
        });
        this.addListener('click', '#'+this._selectors.share, function(e){
            this.trigger('input_export');
        });

    };

    UIInputPanel.prototype.getStyles = function() {

    };

    /********************
     * PUBLIC METHODS
     ********************/


    /********************
     * PRIVATE METHODS
     ********************/


    return UIInputPanel;

}(jQuery,UIBasePanel));
;/**
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
;/**
 * Created by fdimonte on 23/02/2015.
 */

var UISpacerPanel = (function($,UIBasePanel,UISliderWidget){

    /**
     * UISpacerPanel Class
     *
     * @constructor
     * @param id
     * @param label
     * @param list
     */
    function UISpacerPanel(id,label,list) {
        this._spacersList = list;

        var baseID = 'fibo_sel_';
        this._selectors = {
            spacer    : baseID + 'spacer',
            left      : baseID + 'left',
            top       : baseID + 'top',
            remove    : baseID + 'delete',
            duplicate : baseID + 'duplicate',
            opacity   : baseID + 'opacity',
            slider    : baseID + 'slider_container'
        };

        UIBasePanel.call(this,id,label);

        this._spacerSelected = null;
    }

    /**
     * UISpacerPanel prototype
     *
     * @type {UIBasePanel}
     */
    UISpacerPanel.prototype = Object.create(UIBasePanel.prototype);

    /********************
     * OVERRIDABLE METHODS
     ********************/

    UISpacerPanel.prototype.createContent = function() {

        this.uiSlider = new UISliderWidget(this._selectors.opacity,{minValue:20,stepValue:10,callback:this.setOpacity.bind(this),extension:{slider_handler:{background:'rgba(200,100,100,.6)'}}});

        var $content = $('<div/>')
            .append($('<p/>')
                .text('spacer: ')
                .append(this.fiboSelect(this._spacersList,this._selectors.spacer,true)))
            .append($('<p/>')
                .text('left: ')
                .append($('<input/>').attr('type','text').attr('id',this._selectors.left)))
            .append($('<p/>')
                .text('top: ')
                .append($('<input/>').attr('type','text').attr('id',this._selectors.top)))
            .append($('<p/>')
                .text('opacity: ')
                .append($('<div/>').attr('id',this._selectors.slider)
                    .append(this.uiSlider.$el)))
            .append($('<input/>').attr('type','button').addClass('vui-btn').attr('id',this._selectors.remove).val('remove'))
            .append($('<input/>').attr('type','button').addClass('vui-btn').attr('id',this._selectors.duplicate).val('duplicate'));

        return $content.children();
    };

    UISpacerPanel.prototype.setEvents = function() {

        this.addListener('keyup', '#'+this._selectors.left+',#'+this._selectors.top, function(e){
            changeSpacerPos.call(this,e);
            this.trigger('spacer_offset',"{l:"+$('#'+this._selectors.left).val()+",t:"+$('#'+this._selectors.top).val()+"}");
        });
        this.addListener('change keyup', '#'+this._selectors.spacer, function(e){
            this.trigger('spacer_changed',$(e.currentTarget).val());
            this.applyInfo();
        });
        this.addListener('click', '#'+this._selectors.remove, function(e){
            this.trigger('spacer_delete',this._spacerSelected);
            this.deleteSpacer();
        });
        this.addListener('click', '#'+this._selectors.duplicate, function(e){
            this.trigger('spacer_duplicate',this._spacerSelected);
            this.duplicateSpacer();
        });

    };

    UISpacerPanel.prototype.getStyles = function() {

    };

    /********************
     * PUBLIC METHODS
     ********************/

    UISpacerPanel.prototype.moveCallback = function(moved){
        this._spacerSelected = moved;
        this.updateInfo();
    };

    UISpacerPanel.prototype.updateInfo = function(){
        var attr = this.getInfo();
        $('#'+this._selectors.spacer).val(attr.f);
        $('#'+this._selectors.left).val(attr.l);
        $('#'+this._selectors.top).val(attr.t);
        this.uiSlider.setSliderVal(Number(attr.o)*100);
    };
    UISpacerPanel.prototype.applyInfo = function(){
        var attr = this.getInfo();
        if(this._spacerSelected){
            $(this._spacerSelected)
                .removeClass('fs_'+attr.f)
                .addClass('fs_'+$('#'+this._selectors.spacer).val())
                .css('left',$('#'+this._selectors.left).val()+'px')
                .css('top',$('#'+this._selectors.top).val()+'px');
        }
    };
    UISpacerPanel.prototype.getInfo = function(){
        var attr = {f:'',t:'',l:'',o:''};
        if(this._spacerSelected){
            attr.f = (this._gui._components.uiSpacer.getSpacerType(this._spacerSelected));
            attr.t = ($(this._spacerSelected).css('top').replace('px',''));
            attr.l = ($(this._spacerSelected).css('left').replace('px',''));
            attr.o = ($(this._spacerSelected).css('opacity'));
        }
        return attr;
    };

    UISpacerPanel.prototype.setOpacity = function(perc,value){
        if(this._spacerSelected)
            $(this._spacerSelected).css('opacity',value/100);
    };
    UISpacerPanel.prototype.deleteSpacer = function(){
        if(this._spacerSelected)
            $(this._spacerSelected).remove();
    };
    UISpacerPanel.prototype.duplicateSpacer = function(){
        if(this._spacerSelected)
            $(this._spacerSelected).parent().append($(this._spacerSelected).clone()).focus();
    };

    /********************
     * PRIVATE METHODS
     ********************/

    function changeSpacerPos(e){
        var offset = e.shiftKey ? 10 : e.altKey ? 0.5 : 1;
        var val = Number($(e.currentTarget).val());

        $(e.currentTarget).val(val+(e.keyCode===38?offset:e.keyCode===40?-offset:0));
        this.applyInfo();

        return false;
    }

    return UISpacerPanel;

}(jQuery,UIBasePanel,UISliderWidget));
;/**
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

        var baseID = 'fibo_sprites_';
        this._selectors = {
            tree    : 'sprites_tree',
            analyze : baseID + 'analyze'
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
            .append($('<ul/>').attr('id',this._selectors.tree))
            .append($('<input/>').attr('type','button').addClass('vui-btn').attr('id',this._selectors.analyze).val('analyze'));

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

    };

    /********************
     * PUBLIC METHODS
     ********************/

    UISpritePanel.prototype.didAnalyze = function(info) {
        var $tree = $('#'+this._selectors.tree).empty();
        $tree.append(spriteItem('hide_sprites',true,'none'));

        var name,file,fid;
        for(name in info){
            if(info.hasOwnProperty(name)){
                file = this._gui._components.uiSpriter.filenameFromCss(name);
                fid = this._gui._components.uiSpriter.filenameFromCss(name,true);
                $tree.append(spriteItem('toggle_sprite_'+fid,false,file));
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
                .text(spanText),
            $input = $('<input/>')
                .attr('type','radio')
                .attr('name','sprites')
                .addClass('fibo_radio')
                .attr('id',id)
                .attr('checked',checked);

        $li.append($label.append($input).append($span));

        return $li;
    }

    return UISpritePanel;

}(jQuery,UIBasePanel));
;/**
 * Created by fdimonte on 23/02/2015.
 */

var UIStoragePanel = (function($,UIBasePanel){

    /**
     * UIStoragePanel Class
     *
     * @param id
     * @param label
     * @constructor
     */
    function UIStoragePanel(id,label) {

        var baseID = 'fibo_storage_';
        this._selectors = {
            restore : baseID + 'restore',
            save    : baseID + 'save'
        };

        UIBasePanel.call(this,id,label);
    }

    /**
     * UIStoragePanel prototype
     *
     * @type {UIBasePanel}
     */
    UIStoragePanel.prototype = Object.create(UIBasePanel.prototype);

    /********************
     * OVERRIDABLE METHODS
     ********************/

    UIStoragePanel.prototype.createContent = function() {
        var $content = $('<div/>')
            .append($('<input/>').attr('type','button').addClass('vui-btn').attr('id',this._selectors.restore).val('restore'))
            .append($('<input/>').attr('type','button').addClass('vui-btn').attr('id',this._selectors.save).val('save'));

        return $content.children();
    };

    UIStoragePanel.prototype.setEvents = function() {

        this.addListener('click', '#'+this._selectors.restore, function(e){this.trigger('history_restore');});
        this.addListener('click', '#'+this._selectors.save,    function(e){this.trigger('history_save');});

    };

    UIStoragePanel.prototype.getStyles = function() {

    };

    /********************
     * PUBLIC METHODS
     ********************/


    /********************
     * PRIVATE METHODS
     ********************/


    return UIStoragePanel;

}(jQuery,UIBasePanel));
;/**
 * Created by fdimonte on 23/02/2015.
 */

var UISelectPanel = (function($,UIExtraPanel){

    /**
     * UISelectPanel Class
     *
     * @constructor
     * @param id
     * @param list
     */
    function UISelectPanel(id,list,spacers) {
        this._spacersList = list;
        this._spacersObject = spacers;

        var baseID = 'fibo_clone_';
        this._selectors = {
            choose  : baseID + 'select',
            element : baseID + 'element'
        };

        UIExtraPanel.call(this,id);
    }

    /**
     * UISelectPanel prototype
     *
     * @type {UIBasePanel}
     */
    UISelectPanel.prototype = Object.create(UIExtraPanel.prototype);

    /********************
     * OVERRIDABLE METHODS
     ********************/

    UISelectPanel.prototype.createContent = function() {
        var $content = $('<div/>')
            .append(this.fiboSelect(this._spacersList,this._selectors.choose))
            .append($('<div/>').attr('id',this._selectors.element));

        return $content.children();
    };

    UISelectPanel.prototype.setEvents = function() {

        this.addListener('change keyup', '#'+this._selectors.choose, function(e){
            this.trigger('clone_select', $(e.currentTarget).val());
            $('#'+this._selectors.element).html(this._spacersObject['f_'+$(e.currentTarget).val()]);
        });
        this.addListener('mousedown', '#'+this._selectors.element+' .fibospacer', function(e){
            this.trigger('clone_spacer', {
                pos    : {pageX:e.pageX,pageY:e.pageY},
                $clone : $('#'+this._selectors.element),
                spacer : e.currentTarget
            });
        });

    };

    UISelectPanel.prototype.getStyles = function() {

    };

    /********************
     * PUBLIC METHODS
     ********************/

    UISelectPanel.prototype.toggleCloneDisplay = function(show) {
        if(show)
            $('#'+this._selectors.element).show();
        else
            $('#'+this._selectors.element).hide();
    };

    /********************
     * PRIVATE METHODS
     ********************/


    return UISelectPanel;

}(jQuery,UIExtraPanel));
;/**
 * Created by fdimonte on 23/02/2015.
 */

var UITogglesPanel = (function($,UIExtraPanel){

    /**
     * UITogglesPanel Class
     *
     * @constructor
     * @param id
     */
    function UITogglesPanel(id) {

        var baseID = 'fibo_toggle_';
        this._selectors = {
            main    : baseID + 'main',
            spacers : baseID + 'spacers',
            overlay : baseID + 'overlay',
            rulers  : baseID + 'rulers',
            markers : baseID + 'markers'
        };

        UIExtraPanel.call(this,id);
    }

    /**
     * UITogglesPanel prototype
     *
     * @type {UIBasePanel}
     */
    UITogglesPanel.prototype = Object.create(UIExtraPanel.prototype);

    /********************
     * OVERRIDABLE METHODS
     ********************/

    UITogglesPanel.prototype.createContent = function() {
        var $content = $('<div/>')
            .append($('<div/>').attr('id',this._selectors.main))
            .append(this.panelCheckbox(this._selectors.spacers,'toggle spacers',true))
            .append(this.panelCheckbox(this._selectors.overlay,'toggle overlay',false))
            .append(this.panelCheckbox(this._selectors.rulers, 'toggle rulers',false))
            .append(this.panelCheckbox(this._selectors.markers,'toggle marker tool',false));

        return $content.children();
    };

    UITogglesPanel.prototype.setEvents = function() {

        this.addListener('click',  '#'+this._selectors.main, function(e){this.trigger('toggle_fibos');});

        this.addListener('change', '#'+this._selectors.spacers+' .fibo_checkbox', checkbox_handler.call(this,'toggle_spacers'));
        this.addListener('change', '#'+this._selectors.overlay+' .fibo_checkbox', checkbox_handler.call(this,'toggle_overlay'));
        this.addListener('change', '#'+this._selectors.rulers +' .fibo_checkbox', checkbox_handler.call(this,'toggle_rulers') );
        this.addListener('change', '#'+this._selectors.markers+' .fibo_checkbox', checkbox_handler.call(this,'toggle_markers'));

    };

    UITogglesPanel.prototype.getStyles = function() {

    };

    /********************
     * PUBLIC METHODS
     ********************/


    /********************
     * PRIVATE METHODS
     ********************/

    function checkbox_handler(event){
        return function(e){
            this.trigger(event, $(e.currentTarget).is(':checked'));
        }.bind(this);
    }

    return UITogglesPanel;

}(jQuery,UIExtraPanel));
;/**
 * Created by fdimonte on 10/02/2015.
 *
 * // test in localhost:8000
 * $ python -m SimpleHTTPServer
 */

var FibOS = (function(
   $,
   uiMarker, uiRuler, uiSlider, uiSpacer, uiSpriter,
   panelSpacer, panelOffset, panelGroup, panelStorage, panelInput, panelSprite, panelSelect, panelToggles
) {

    var images = {
        fibos_sprite : 'iVBORw0KGgoAAAANSUhEUgAAABIAAABaCAYAAAC1xQZWAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAV/QAAFf0BzXBRYQAAABx0RVh0U29mdHdhcmUAQWRvYmUgRmlyZXdvcmtzIENTNui8sowAAAAVdEVYdENyZWF0aW9uIFRpbWUAMzAvNy8xMyVy0IgAAALQSURBVFiF7ZXPaxNREMe/T6qQwKZBo5JUL7uLBbcQjyaB9lgstbdsQU8B/4GmR/XoH9BTSVtoL5aAhkAixh5LAxaSXiQg1N2ctCWxP9K0JAQk4yEttLv7jG1WKWUH3mWG+fDezHznsWKxSLDB+vb39+3goK/dbl8yEJEtJXKe5oDsAV3hrl3hp9kFYnbV6JotFAfUO0iSJJIkyc8YA2Os5xttiaLo7+lG54Gdp0ZbdoECdoAC5XJ5u1dQVwjgiNYBOaD/BerjBSRJ4opQ13XT3v3Tje5x/ANWTi6oXC7/sIAFwNmU3DVy8muIojgA4DuAgK7r3L3k7CMHdDVBJvWfSIOIxgGEANwCQAD2AKwDyFqSiOjMOfa9SiQSKUVRKqIokiiKpChKdXFx8RMRvTbmEJEZRERPFxYWsicA45mbm0sT0bgxz0q0b4aGhl40m807Vi9wuVw/S6XSPICXp/1WxfbxIADQbDZvA7hp9P/T9u+4XK4qL8Htdu+g08GuoPV4PF7kgeLxeAHAZ6Pfao6yRPSo3W7/mpmZCTcaDR/QKfLU1NR6LBYrAPhgyjN2zTCQj9EZSADYRWcgTRBL0EXt8onWAXU37mJTVXVZ07Sxer3uYYxBEIQDSZJyGxsbzwBA1/WzeVYDGQqFtlqtljA6Ovo1FottMsYwOzv7MJvNBn0+X7VSqfiNINNiU1V1WVGUVj6ff0dEidNndXX1fTAYbKiqumzMM9VI07SxiYmJL5FIxKTw4eHh3ZGRkU1N054YYyZQrVbrn56eLllWFEA0GtUODw/7u4IAoFqt3uCB6vX6dSu/CeT1emtLS0uDPFA6nZYFQTjoCpJlOZfJZIIrKyt3jbFkMnl/bW1tUJblnDHGa//20dGRNxwOa9Fo9BsRsVQqJefz+QeCIOxZtZ+72CYnJ98eD2Q/AHg8ngNZlj8WCoXnwF8M5EXt8onWNtBv0kKv/nwGlC8AAAAASUVORK5CYII=',
        alpha_image  : 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAA3NCSVQICAjb4U/gAAAACXBIWXMAABX9AAAV/QHNcFFhAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABV0RVh0Q3JlYXRpb24gVGltZQAzMC83LzEzJXLQiAAAACpJREFUKJFj/P//PwM28ODBA6ziTFhF8YBRDcQAFlzhraCgQB0bRjUQAwCn8Qi/9sh3kAAAAABJRU5ErkJggg=='
    };

    function FibOS(reference,options){

        var jqueryMinVersion = '1.7';

        this._ID='fibos';
        this._fibosTitle='FibOS';
        this._fibosVersion='1.7.2';
        this._logEvents = true;

        this._reference = ($(reference).length===0) ? 'body' : reference;

        this._componentsOptions = options || {};
        this._components = {};
        this._panels = {};

        this.$el = null;
        this.$toggles = null;
        this.$panels = null;

        this.init(jqueryMinVersion);

    }

    FibOS.prototype = {

        getImage : function(name){
            if(images[name])
                return 'data:image/png;base64,'+images[name];
            else
                return null;
        },

        init: function(jqMinVer) {
            checkJqueryVersion(jqMinVer,function(){
                this.createStyles();
                this.createElement();
                this.initEvents();
            }.bind(this));
        },

        createStyles: function() {
            $('#'+this._ID+'-styles').remove();

            var $styles = $('<style/>').attr('id',this._ID+'-styles');
            var styleObj = this.factory.styles.call(this);

            var s,selector;
            for(s in styleObj){
                if(styleObj.hasOwnProperty(s)){
                    selector = '#'+this._ID;
                    if(s!='main') selector += ' '+s;

                    $styles.append(selector + ' {'+UIBaseWidget.prototype.styleObjectToString(styleObj[s])+'}');
                }
            }

            $('head').append($styles);
        },
        createElement: function() {
            $('#'+this._ID).remove();

            var $fibo_title  = $('<h1/>').text(this._fibosTitle).append($('<small/>').text(this._fibosVersion));

            this.$el         = $('<div/>').attr('id',this._ID);
            this.$background = $('<div/>').attr('id','fibo_bg');
            this.$controls   = $('<div/>').attr('id','fibo_controls');
            this.$toggles    = $('<div/>').attr('id','fibo_toggles');
            this.$panels     = $('<div/>').attr('id','fibo_panels').append($fibo_title);

            this.$el
                .append(this.$background)
                .append(this.$controls
                    .append(this.$toggles)
                    .append(this.$panels)
                );

            $('body').append(this.$el);

            this.setupComponents();
            this.setupPanels();
        },

        setupComponents: function() {
            this._components.uiMarker  = this.factory.components.uiMarker.call(  this, 'fibos_marker',  this._componentsOptions['uiMarker']  );
            this._components.uiRuler   = this.factory.components.uiRuler.call(   this, 'fibos_ruler',   this._componentsOptions['uiRuler']   );
            //this._components.uiSlider  = this.factory.components.uiSlider.call(  this, 'fibos_slider',  this._componentsOptions['uiSlider']  );
            this._components.uiSpacer  = this.factory.components.uiSpacer.call(  this, 'fibos_spacers', this._componentsOptions['uiSpacer']  );
            this._components.uiSpriter = this.factory.components.uiSpriter.call( this, 'fibos_spriter', this._componentsOptions['uiSpriter'] );

            this.addWidget(this._components.uiSpacer);
            this.addWidget(this._components.uiMarker);
            this.addWidget(this._components.uiRuler);
            this.addWidget(this._components.uiSpriter);
        },
        setupPanels: function() {

            var spacersList = this._components.uiSpacer.getSpacersList(true);
            var spacersObject = this._components.uiSpacer.spacerObjects;

            // main panels
            this._panels.spacerPanel  = new panelSpacer(  'fibo_panel_selected', 'spacer selected', spacersList );
            this._panels.offsetPanel  = new panelOffset(  'fibo_panel_offset',   'offset group'   );
            this._panels.groupPanel   = new panelGroup(   'fibo_panel_groups',   'spacer groups'  );
            this._panels.storagePanel = new panelStorage( 'fibo_panel_storage',  'local storage'  );
            this._panels.inputPanel   = new panelInput(   'fibo_panel_input',    'input string'   );
            this._panels.spritePanel  = new panelSprite(  'fibo_panel_sprites',  'loaded sprites' );

            this.addPanel(this._panels.spacerPanel);
            this.addPanel(this._panels.offsetPanel);
            this.addPanel(this._panels.groupPanel);
            this.addPanel(this._panels.storagePanel);
            this.addPanel(this._panels.inputPanel);
            this.addPanel(this._panels.spritePanel);

            // extra panels
            this._panels.togglesPanel = new panelToggles( 'fibo_extrapanel_toggles' );
            this._panels.selectPanel = new panelSelect( 'fibo_extrapanel_select', spacersList, spacersObject );

            this.addPanelTo(this._panels.togglesPanel, this.$toggles);
            this.addPanel(this._panels.selectPanel);
        },

        initEvents: function() {

            // panelToggles
            this._panels.togglesPanel.on('toggle_fibos',  function(){
                var isHidden = this.$controls.hasClass('hidden');
                if(isHidden){
                    this.$controls.removeClass('hidden').css('left','0px');
                }else{
                    this.$controls.addClass('hidden').css('left',(this.$controls.width()*-1)+'px');
                }
                this._panels.selectPanel.toggleCloneDisplay(isHidden);
            }.bind(this));
            this._panels.togglesPanel.on('toggle_overlay',function(data){
                var w = this.$background;
                data ? w.show() : w.hide();
            }.bind(this));
            this._panels.togglesPanel.on('toggle_spacers',function(data){
                var w = this._components.uiSpacer;
                data ? w.show() : w.hide();
            }.bind(this));
            this._panels.togglesPanel.on('toggle_rulers', function(data){
                var w = this._components.uiRuler;
                data ? w.show() : w.hide();
            }.bind(this));
            this._panels.togglesPanel.on('toggle_markers', function(data){
                var w = this._components.uiMarker;
                data ? w.show() : w.hide();
                this._components.uiMarker.toggleListener(data);
            }.bind(this));

            // panelSelect
            this._panels.selectPanel.on('clone_select', function(data,event){});
            this._panels.selectPanel.on('clone_spacer', function(data){
                fiboClone.call(this,data.pos,data.spacer,data.$clone);
            }.bind(this));

            // panelSpacer
            this._panels.spacerPanel.on('spacer_changed', function(data,event){});
            this._panels.spacerPanel.on('spacer_offset', function(data,event){});
            this._panels.spacerPanel.on('spacer_delete', function(data,event){});
            this._panels.spacerPanel.on('spacer_duplicate', function(data,event){});

            // panelGroups
            this._panels.groupPanel.on('group_remove', function(data,event){});
            this._panels.groupPanel.on('group_rename', function(data,event){});
            this._panels.groupPanel.on('group_select', function(data){
                data && this._components.uiSpacer.newUsedGroup(data);
                this._panels.offsetPanel.selectGroup(data);
                this._components.uiSpacer.updateGroups();
            }.bind(this));
            this._panels.groupPanel.on('group_list_open', function(){
                this.openPanel('groupPanel');
            }.bind(this));

            // panelOffset
            this._panels.offsetPanel.on('group_offset_apply', function(data,event){});
            this._panels.offsetPanel.on('group_offset_save', function(data,event){});
            this._panels.offsetPanel.on('group_toggle_multiple', function(data,event){});

            // panelStorage
            this._panels.storagePanel.on('history_restore', function(){
                var stJson = this._components.uiSpacer.getLocalStorage(true);
                this._panels.groupPanel.showGroupsList(stJson);
            }.bind(this));
            this._panels.storagePanel.on('history_save', function(){
                this._components.uiSpacer.setLocalStorage();
            }.bind(this));

            // panelInput
            this._panels.inputPanel.on('input_import', function(data){
                this._components.uiSpacer.loadSpacersFromJson(data,true);
                var stJson = JSON.stringify(this._components.uiSpacer.spacersGroups.groups);
                this._panels.groupPanel.showGroupsList(stJson);
            }.bind(this));
            this._panels.inputPanel.on('input_export', function(){
                var stJson = JSON.stringify(this._components.uiSpacer.spacersGroups.groups);
                console.log(stJson);
                alert("Open your browser's console and see the export string.");
            }.bind(this));

            // panelSprite
            this._panels.spritePanel.on('sprites_analyze', function(){
                this._components.uiSpriter.analyze();
            }.bind(this));
            this._panels.spritePanel.on('sprites_toggle', function(data){
                this._components.uiSpriter.toggleSprite(data);
            }.bind(this));

        },

        addWidget: function(widget) {
            this.$el.append(widget.$el);
        },
        addPanel: function(panel) {
            this.$panels.append(panel.$el);
            panel.addTo(this);
            //this.addStyle(panel.getStyles());
        },
        addPanelTo: function(panel,$elem) {
            $elem.append(panel.$el);
            panel.addTo(this);
        },

        addStyle: function(styles) {},

        openPanel: function(panelOrName) {
            var panel = panelOrName instanceof UIBasePanel ? panelOrName : this._panels[panelOrName];
            if(panel && !panel.isOpen()){
                this.closeAllPanels();
                panel.open();
            }
        },
        closePanel: function(panelOrName) {
            var panel = panelOrName instanceof UIBasePanel ? panelOrName : this._panels[panelOrName];
            if(panel && panel.isOpen()){
                panel.close();
            }
        },
        closeAllPanels: function() {
            for(var p in this._panels) if(this._panels.hasOwnProperty(p)) this._panels[p].close();
        },

        /*---------------------------------------------- FIBOS PANELS AND COMPONENTS ---*/

        callbacks: {
            uiMarker : {
                highlightCheck : function(){
                    return $('#fibo_toggle_markers').find('.fibo_checkbox').is(':checked');
                },
                fontinfoCheck : function(){
                    return $('#fibo_toggle_markers').find('.fibo_checkbox').is(':checked');
                }
            },
            uiRuler : {},
            uiSlider : {},
            uiSpacer : {
                moveCallback: function(moved){
                    this._panels.spacerPanel.moveCallback(moved);
                },
                newGroupAdded: function(groupName){
                    this._panels.groupPanel.newGroupAdded(groupName)
                }
            },
            uiSpriter : {
                didAnalyze: function(info){
                    this._panels.spritePanel.didAnalyze(info);
                }
            }
        },

        /*---------------------------------------------- FACTORY METHODS ---*/

        factory: {

            components: {
                uiMarker : function(id,opt){
                    opt || (opt={});
                    opt.checkUseMarker = this.callbacks.uiMarker.highlightCheck.bind(this);
                    opt.checkUseFont = this.callbacks.uiMarker.fontinfoCheck.bind(this);
                    opt.excluded = '#'+this._ID;
                    return new uiMarker( id, opt );
                },
                uiRuler : function(id,opt){
                    opt || (opt={});
                    opt.reference = this._reference;
                    return new uiRuler( id, opt );
                },
                uiSlider : function(id,opt){
                    opt || (opt={});
                    opt.extension = {slider_handler:{background:'rgba(200,100,100,.6)'}};
                    return new uiSlider( id, opt );
                },
                uiSpacer : function(id,opt){
                    opt || (opt={});
                    opt.reference = this._reference;
                    opt.moveCallback = this.callbacks.uiSpacer.moveCallback.bind(this);
                    opt.groupCallback = this.callbacks.uiSpacer.newGroupAdded.bind(this);
                    return new uiSpacer( id, opt );
                },
                uiSpriter : function(id,opt){
                    opt || (opt={});
                    opt.extension = {obscurers_container:{top:'auto',left:'auto',margin:'0 auto'}};
                    opt.reference = this._reference;
                    opt.callback = this.callbacks.uiSpriter.didAnalyze.bind(this);
                    opt.visible = false;
                    opt.image = this.getImage('alpha_image');
                    return new uiSpriter( id, opt );
                }
            },

            styles: function() {
                var img_sprite = this.getImage('fibos_sprite');
                var img_alpha = this.getImage('alpha_image');

                var styleObject = {

                    main:
                        {position:'absolute',top:'0',left:'0','font-family':'Arial','text-align':'left',color:'#222','user-select':'none'},

                    '#fibo_panels > h1':
                        {'font-size':'18px',margin:'0 0 5px 5px',padding:'0'},
                    '#fibo_panels > h1 > small':
                        {'font-size':'10px','font-weight':'400'},

                    // control panel
                    '#fibo_bg':
                        {background:'rgba(0,0,0,0.5)',width:'100%',height:'100%',position:'fixed'},
                    '#fibo_controls':
                        {position:'fixed','min-width':'180px'},
                    '.fibo_toggle':
                        {background:'rgba(100,100,100,.4)','border-top':'1px solid #fff',height:'21px',position:'absolute',right:'-21px',width:'21px'},

                    // showhide panel
                    '#fibo_toggle_main':
                        {background:'rgba(100,100,100,0.4)',height:'34px',position:'absolute',right:'-13px',width:'13px',cursor:'pointer'},
                    '#fibo_toggle_main:hover':
                        {background:'rgba(100,100,100,1)'},
                    '#fibo_toggle_main:after':
                        {content:'"«"',left:'2px',top:'5px',position:'absolute',color:'#fff'},
                    '#fibo_controls.hidden #fibo_toggle_main:after':
                        {content:'"»"'},

                    // external checkbox containers
                    '#fibo_toggle_spacers': {top:'34px'},
                    '#fibo_toggle_overlay': {top:'55px'},
                    '#fibo_toggle_rulers': {top:'76px'},
                    '#fibo_toggle_markers': {top:'97px'},

                    // checkboxes
                    '.fibo_checkbox':
                        {border:'0 none',clip:'rect(0px, 0px, 0px, 0px)',height:'1px',margin:'-1px',overflow:'hidden',padding:'0',position:'absolute',width:'1px'},
                    '.fibo_checkbox + label':
                        {background:'url("'+img_sprite+'") no-repeat scroll -1px -73px transparent',display:'block','font-size':'14px','padding-left':'16px',width:'0',margin:'2px'},
                    '.fibo_checkbox:checked + label':
                        {'background-position':'-1px -56px'},
                    '#fibo_panels .fibo_checkbox + label':
                        {'background-position':'-1px -21px',width:'auto',margin:'0'},
                    '#fibo_panels .fibo_checkbox:checked + label':
                        {'background-position':'-1px -38px'},
                    '#fibo_panels .fibo_radio':
                        {width:'12px',height:'12px'},

                    // fibo form
                    '#fibo_panels':
                        {color:'#222',background:'rgba(100,100,100,0.6)',padding:'5px'},
                    '#fibo_panels>div':
                        {background:'rgba(200,200,200,.6)','border-top':'1px solid rgba(200,200,200,.8)','border-bottom':'1px solid rgba(100,100,100,.8)',margin:'0',padding:'3px'},
                    '#fibo_panels>div.fibo_panel_open':
                        {background:'rgb(200,200,200)'},
                    '#fibo_clone_select':
                        {display:'block','margin-left':'2px'},
                    '#fibo_clone_element':
                        {position:'absolute',padding:'8px','margin-top':'9px',left:'0'},

                    // fibo panel - INPUT
                    '#fibo_input_text':
                        {display:'block',height:'55px',margin:'2px auto 5px',resize:'none',width:'92%'},
                    // fibo panel - SELECTED
                    '#fibo_panel_selected p':
                        {'font-size':'12px','text-indent':'8px',margin:'3px 0'},
                    '#fibo_sel_left, #fibo_sel_top':
                        {display:'inline-block',width:'50px',height:'auto'},
                    '#fibo_sel_slider_container':
                        {margin:'3px 0 6px 8px'},
                    // fibo panel - OFFSET
                    '#fibo_panel_offset p':
                        {'font-size':'12px','text-indent':'8px',margin:'3px 0'},
                    '#fibo_grp_sel_left, #fibo_grp_sel_top':
                        {display:'inline-block',width:'50px',height:'auto'},
                    '#fibo_grp_sel_multiple':
                        {'margin-left':'0'},
                    '#fibo_grp_sel_multiple_box':
                        {position:'absolute',border:'1px solid #777','background-color':'rgba(100,100,100,.5)'},
                    // fibo panel - GROUPS
                    '#fibo_panel_groups p':
                        {'font-size':'12px','text-indent':'8px',margin:'3px 0'},
                    '#fibo_group_name':
                        {display:'block',width:'160px',height:'auto'},
                    // fibo panel - SPRITES
                    '#fibo_sprites_bg':
                        {position:'fixed',width:'100%',height:'100%','z-index':'-1',background:'#000',opacity:'0.5'},
                    '#sprites_tree':
                        {'list-style':'none outside none',margin:'5px 0',padding:'0'},
                    '#sprites_tree li label':
                        {'font-size':'12px'},
                    '#groups_tree':
                        {'list-style':'none outside none',margin:'5px 0',padding:'0'},
                    '#groups_tree li label':
                        {'font-size':'12px'},

                    // common input styles
                    '#fibo_input_text,#fibo_sel_left,#fibo_sel_top,#fibo_group_name,#fibo_grp_sel_left,#fibo_grp_sel_top':
                        {overflow:'hidden',background:'transparent',border:'1px solid #777','font-size':'10px'},

                    // venere ui styles
                    '.vui-btn':
                        {background:'url("'+img_sprite+'") repeat-x scroll 0 0 transparent',border:'1px solid #777',padding:'2px 5px 1px',margin:'2px','font-size':'9px','font-weight':'700','text-transform':'uppercase'},
                    '.vui-btn:hover,.vui-btn:focus':
                        {border:'1px solid #eee'},
                    '.vui-label': {},
                    '.vui-content': {}
                };

                var initialDisplay = {
                    '#fibo_bg': {display:'none'},
                    '#fibos_ruler': {display:'none'},
                    '#fibos_spriter': {display:'none'},
                    '#fibo_sel_spacer_multiple_p':{display:'none'},
                    '.vui-content': {display:'none'}
                };

                var zIndexes = {
                    main: {'z-index':'9999'},
                    '#fibo_bg': {'z-index':'0'},
                    '#fibos_marker': {'z-index':'1'},
                    '#fibos_spacers': {'z-index':'2'},
                    '#fibos_ruler': {'z-index':'3'},
                    '#fibos_spriter': {'z-index':'4'},
                    '#fibo_grp_sel_multiple_box': {'z-index':'5'},
                    '#fibo_controls': {'z-index':'10'}
                };

                var prefixes = {
                    main: {'-webkit-touch-callout':'none','-webkit-user-select':'none','-khtml-user-select':'none','-moz-user-select':'none','-ms-user-select':'none'}
                };

                $.extend(true,styleObject,initialDisplay,zIndexes,prefixes);

                return styleObject;
            }

        }

    };

    function checkJqueryVersion(jqueryMinVersion,callback){
        if (typeof jQuery != 'undefined') {
            var current_vers = jqueryMinVersion;
            var c_maj = Number(current_vers.split('.')[0]);
            var c_min = Number(current_vers.split('.')[1]);

            var jquery_vers = jQuery.fn.jquery;
            var j_maj = Number(jquery_vers.split('.')[0]);
            var j_min = Number(jquery_vers.split('.')[1]);

            var shouldLoadNewstJquery = false;
            if(j_maj<c_maj) shouldLoadNewstJquery = true;
            else if(j_min<c_min) shouldLoadNewstJquery = true;

            if(shouldLoadNewstJquery){
                alert('FibOS needs jQuery 1.7.2\nWe will load it for you.');
                $.getScript('http://code.jquery.com/jquery-1.7.2.min.js',callback);
            }
            else callback();
        }
    }

    function fiboClone(e,spacer,$clone){
        var spacernum = parseInt(this._components.uiSpacer.getSpacerType(spacer));
        var newspacer = this._components.uiSpacer.addNewSpacer(spacernum);
        if(!newspacer) return true;

        var mzero = {top:newspacer.position().top-e.pageY,left:newspacer.position().left-e.pageX};
        mzero.top  += $(document).scrollTop()  + $clone.position().top + parseInt($clone.css('padding-top')) + parseInt($clone.css('margin-top'));
        mzero.left += $(document).scrollLeft() + $clone.position().left + parseInt($clone.css('padding-left'));

        newspacer.offset({top:parseInt(e.pageY+mzero.top), left:parseInt(e.pageX+mzero.left)});
        this._components.uiSpacer.setMouseZero(mzero);
        this._components.uiSpacer.dragSpacer(newspacer);

        return false;
    }

    return FibOS;

}(jQuery,
   UIMarkerWidget, UIRulerWidget, UISliderWidget, UISpacerWidget, UISpriterWidget,
   UISpacerPanel, UIOffsetPanel, UIGroupPanel, UIStoragePanel, UIInputPanel, UISpritePanel, UISelectPanel, UITogglesPanel));

return FibOS;}());;/**
 * Created by fdimonte on 20/02/2015.
 */

var venereID = '#themewrapper';
var venereOptions = {
   uiSpriter: {domain:'www.venere.com'}
};

var fibos = new FibOS(venereID, venereOptions);
