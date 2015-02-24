/**
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
            slider_output :{position:'absolute',width:'34px', height:'20px',background:'#fff',top:'0',right:'-34px','text-align':'center','font-size':'12px','line-height':'20px',cursor:'default'}
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
