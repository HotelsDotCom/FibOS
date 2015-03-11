/**
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
        this.setOptions({
            guidelinesContainer : '#ruler_guides', //where guidelines will be appended
            showMousePos        : true,            //toggle display of mouse coordinates
            showRulerV          : true,            //toggle display of vertical ruler
            showRulerH          : true,            //toggle display of horizontal ruler
            rulerWidth          : 20,              //width of both rulers
            rulerUnit           : 5,               //minimum unit interval (in pixel)
            rulerStepMin        : 2,               //number of minimum units before medium tick
            rulerStepMed        : 5                //number of medium tick before max tick
        },options);

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

        this._extendObject(this._styles, {
            main         :{position:'absolute',top:rulerZero.call(this).top+'px',left:rulerZero.call(this).left+'px'},
            rulers_cont  :{position:'absolute',overflow:'hidden',background:'rgba(255,255,255,.8)'},
            rulers_v     :{width:this._options.rulerWidth+'px',height:rulerH.call(this)+'px',top:'0',left:'-'+this._options.rulerWidth+'px'},
            rulers_h     :{height:this._options.rulerWidth+'px',width:rulerW.call(this)+'px',left:'0',top:'-'+this._options.rulerWidth+'px'},
            ruler        :{'z-index':'1',position:'absolute',border:'0 solid #000'},
            ruler_v      :{'border-bottom-width':'1px',left:'0 !important'},
            ruler_h      :{'border-right-width':'1px',top:'0 !important'},
            rulers_top   :{'z-index':'2',position:'absolute',width:this._options.rulerWidth+'px',height:this._options.rulerWidth+'px',top:'-'+this._options.rulerWidth+'px',left:'-'+this._options.rulerWidth+'px',background:'#fff','border-right':'1px solid #000000','border-bottom':'1px solid #000000'},
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
        this._extendObject(this._styles,{
            ruler_labelv :{'-webkit-transform':'rotate(-90deg)','-moz-transform':'rotate(-90deg)','-ms-transform':'rotate(-90deg)','-o-transform':'rotate(-90deg)',filter:'progid:DXImageTransform.Microsoft.BasicImage(rotation=3)'}
        });

        UIBaseWidget.prototype.initStyles.call(this, extension);

        this._extendObject(this._styles,{
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
