/**
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
        this.setOptions({
            markerLine     : '',
            markerOffset   : 2,             //how many offset in pixel around text
            checkUseMarker : true,          //if this function returns false the marker won't be applied
            checkShowLines : true,          //if this function returns false the marker won't show xHeight lines
            checkUseFont   : true,          //if this function returns false the fontinfo won't be applied
            markerClass    : 'fiboMarker',  //common highlight element class
            linesClass     : 'fiboLine',    //common marker lines elemet class
            fontClass      : 'fiboFontinfo',//common fontinfo element class
            markerData     : 'markerHL',    //data name for marker elements
            fontData       : 'markerFI',    //data name for fontinfo elements
            excluded       : '',            //selector excluded from marker functionality
            taglist        : {              //list of known tags on which to apply the marker
                p:true,span:true,strong:true,li:true,
                h1:true,h2:true,h3:true,h4:true,h5:true,h6:true,
                a:true,input:true,select:true,textfield:true,label:true
            }
        },options);
        this._options.excluded = (this._options.excluded===''?'':this._options.excluded+',')+'.'+this._options.fontClass;
    };

    UIMarkerWidget.prototype.initStyles = function(extension) {
        var mclass = this._options.markerClass,
            lclass = this._options.linesClass,
            fclass = this._options.fontClass;

        this._selectorsMapping = {
            marker      : '.'+mclass,
            line        : '.'+lclass,
            fontinfo    : '.'+fclass,
            fontinfo_p  : '.'+fclass+' p',
            fontinfo_p1 : '.'+fclass+' p.fi1',
            fontinfo_p2 : '.'+fclass+' p.fi2',
            fontinfo_p3 : '.'+fclass+' p.fi3'
        };

        this.setStyles({
            main        :{position:'absolute'},
            marker      :{position:'absolute !important','z-index':'1',background:'#0ff',opacity:'0.5'},
            line        :{position:'absolute !important','z-index':'2',background:'#f00',left:0,'font-size':'1px','line-height':'1px',height:'1px',width:'100%',overflow:'hidden'},
            fontinfo    :{position:'absolute !important','z-index':'3',background:'rgba(34, 34, 34, 0.7)',border:'1px solid #fff',padding:'3px','font-family':'Open Sans',color:'#fff'},
            fontinfo_p  :{margin:'0',cursor:'default','text-algin':'center'},
            fontinfo_p1 :{'font-size':'13px','font-weight':'700','margin-top':'-4px'},
            fontinfo_p2 :{'font-size':'10px','font-weight':'400','margin':'-5px 0'},
            fontinfo_p3 :{'font-size':'14px','font-weight':'600','margin-bottom':'-4px'}
        },extension);
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

    // TODO: enhance preventDefaults logic with event.stopPropagation()
    //prevent/restore default behaviors for elements in defaults.taglist
    UIMarkerWidget.prototype.toggleListener = function(toggle) {
        toggle ?
            preventDefaults.call(this):
            restoreDefaults.call(this);
    };

    UIMarkerWidget.prototype.addMarkerToElement = function(DOMelement) {
        return addTextFontHighlight.call(this,DOMelement);
    };

    UIMarkerWidget.prototype.markEvent = function(event) {
        return doHighlight.call(this,event);
    };

    UIMarkerWidget.prototype.unmarkEvent = function(event) {
        return undoHighlight.call(this,event);
    };

    /********************
     * PRIVATE METHODS
     ********************/

    /*---SERVICE METHODS---*/

    //add both text highlight and font info on given element
    function addTextFontHighlight(elem) {
        var size;
        var useMarker = checkValue(this._options.checkUseMarker);//this._options.checkUseMarker ? this._options.checkUseMarker() : true;
        var useFont = checkValue(this._options.checkUseFont);//this._options.checkUseFont ? this._options.checkUseFont() : true;
        if(useMarker||useFont)
            size = markerHeight.call(this,elem);
        else
            return false;

        if(useMarker)
            addTextHighlight.call(this,elem,size);
        if(useFont)
            addFontInfo.call(this,elem,size);

        return true;
    }

    //add text highlight around given element
    function addTextHighlight(elem,size) {
        var dataName = this._options.markerData;
        if($(elem).data(dataName)===true) return true;

        size || (size=markerHeight.call(this,elem));

        // x-height lines (depending on this._options.checkShowLines value or return value)
        var lines = xhLines.call(this,size);

        // TODO: enhance text-highlight with multiple line logic
        // highlight element
        var thl = $('<div/>').addClass(this._options.markerClass)
            .width(size.width)
            .height(size.height)
            .offset(size.offset)
            .click(function(e){removeFromMarker($(e.currentTarget),dataName);lines&&lines.remove();});

        appendToMarker.call(this,elem,thl,dataName);
    }

    //add font info above given element
    function addFontInfo(elem,size) {
        var dataName = this._options.fontData;
        if($(elem).data(dataName)===true) return true;

        size || (size=markerHeight.call(this,elem));
        var info = markerFont(elem);
        var p1 = $('<p/>').addClass('fi1').text(info[0]),
            p2 = $('<p/>').addClass('fi2').text(info[1]),
            p3 = $('<p/>').addClass('fi3').text(info[2]);

        var tfi = $('<div/>').addClass(this._options.fontClass)
            .append(p1,p2,p3)
            .offset({
                top  : size.offset.top - 45,
                left : size.offset.left + 10
            })
            .click(function(e){removeFromMarker($(e.currentTarget),dataName);});

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

    //checks for options "check" values
    function checkValue(value) {
        if(value===null) return false;
        if(typeof(value) === 'boolean')  return value;
        if(typeof(value) === 'function') return value();
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
            return !addTextFontHighlight.call(this,e.target);
        }
        return true;
    }

    //remove clicked highlight
    function undoHighlight(e) {
        $(e.currentTarget).remove();
        return false;
    }

    /*---MARKER INFO GETTERS---*/

    //font info array : [name,weight,size]
    function markerFont(elem) {
        var $el = $(elem),
            fw = $el.css('font-weight'),
            fs = $el.css('font-size').replace('px',''),
            ff = $el.css('font-family').split(',')[0].replace(/\"|\'/g,'');

        var lett1 = ff.split(' ')[0].substr(0,1).toUpperCase(),
            lett2 = (ff.split(' ')[1]?ff.split(' ')[1].substr(0,1).toUpperCase():ff.substr(1,1).toLowerCase()),
            name = lett1+lett2;

        return [name,fw,fs];
    }

    //offset info on given elemenet's fontFamily and fontSize css properties
    function markerHeight(elem) {
        var $elem = $(elem),
            ew = $elem.width(),
            ex = $elem.offset().left + parseFloat($elem.css('padding-left')),
            xh = xHeight.call(this,$elem);

        xh.base += this._options.markerOffset;
        xh.top -= this._options.markerOffset;

        return {
            width  : ew,
            height : xh.base-xh.top,
            offset : {
                top  : xh.top,
                left : ex
            }
        };
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

    /*---X-HEIGHT---*/
    // credits to http://brunildo.org/test/xheight.pl
    function xHeight($elem) {
        var family = $elem.css('font-family');
        var size = parseFloat($elem.css('font-size'));

        var $img = $('<img/>').attr('src',this._options.markerLine).css({
            'width'  : '1px',
            'height' : '1px',
            'vertical-align' : 'baseline'
        });
        $img.appendTo($elem);

        var base = $img[0].offsetTop;
        var top = base - xhTop.call(this,family,size);

        $img.remove();

        return {base:base+1,top:top};
    }

    function xhTop(ffamily,fsize){
        var $txh = $('<div/>').attr('id','txh').css({ 'font-family':ffamily , 'font-size':'200px' , width:'10ex'  }),
            $tmh = $('<div/>').attr('id','tmh').css({ 'font-family':ffamily , 'font-size':'200px' , width:'10em'  }),
            $txt = $('<div/>').attr('id','txt').css({ 'font-family':ffamily , 'font-size':'200px' , width:'1ex'   }),
            $tmt = $('<div/>').attr('id','tmt').css({ 'font-family':ffamily , 'font-size':'200px' , width:'1em'   }),
            $tyh = $('<div/>').attr('id','tyh').css({ 'font-family':ffamily , 'font-size':'400px' , width:'10ex'  }),
            $tnh = $('<div/>').attr('id','tnh').css({ 'font-family':ffamily , 'font-size':'400px' , width:'10em'  }),
            $tyt = $('<div/>').attr('id','tyt').css({ 'font-family':ffamily , 'font-size':'400px' , width:'1ex'   }),
            $tnt = $('<div/>').attr('id','tnt').css({ 'font-family':ffamily , 'font-size':'400px' , width:'1em'   }),
            $tfs = $('<div/>').attr('id','tfs').css({ 'font-family':ffamily , 'font-size':fsize   , width:'100em' });

        var $xh_cont = $('<div/>').attr('id','xh_cont')
            .append($txh)
            .append($tmh)
            .append($txt)
            .append($tmt)
            .append($tyh)
            .append($tnh)
            .append($tyt)
            .append($tnt)
            .append($tfs);

        $('body').append($xh_cont);

        var xh = $txh[0].offsetWidth / $tmh[0].offsetWidth,
            xt = $txt[0].offsetWidth / $tmt[0].offsetWidth,
            yh = $tyh[0].offsetWidth / $tnh[0].offsetWidth,
            yt = $tyt[0].offsetWidth / $tnt[0].offsetWidth,
            fs = $tfs[0].offsetWidth / 100;

        var xx = Math.round(yh * fs),
            xs = yh.toPrecision(3);// font-size-adjust value (not used here)

        $xh_cont.empty().remove();

        var thres = 0.005;
        if (Math.abs(xh - yh) > thres || Math.abs(xt - yh) > thres || Math.abs(yt - yh) > thres)
            alert('inconsistent values: ' + xh + ' ' + xt + ' ' + yh + ' ' + yt);

        return xx;
    }

    function xhLines(size) {
        if(!checkValue(this._options.checkShowLines)) return null;

        var xh = {
            top: size.offset.top,
            base: size.offset.top + size.height
        };
        xh.base -= this._options.markerOffset+1;
        xh.top += this._options.markerOffset;

        var $lines = $('<div/>');
        for (var i in xh) {
            if(xh.hasOwnProperty(i)){
                $('<div/>').addClass(this._options.linesClass).css({
                    top  : xh[i],
                    left : size.offset.left,
                    width: size.width
                }).appendTo($lines);
            }
        }
        return $lines.children().appendTo(this.$el);
    }

    return UIMarkerWidget;

}(jQuery,UIBaseWidget));
