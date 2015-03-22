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

        // TODO: improve multipliers
        this.multipliers = {
            'default':{
                top    : 0.19230769230769232,
                bottom : 0.19230769230769232,
                height : 0.15384615384615385
            },
            'opensans':{
                top    :    0.1920,//30769230769232
                bottom :      0.20,//3076923076923078
                height : 0.2222222222//(use with line-height)
                //height : 0.3076920 //3076923077 (use with font-size)
            }
        };

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
            markerOffset   : 2,             //how many offset in pixel around text
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
                a:true,input:true,select:true,textfield:true,label:true
            }
        },options);
        this._options.excluded = (this._options.excluded===''?'':this._options.excluded+',')+'.'+this._options.fontClass;
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

        this.setStyles({
            main        :{position:'absolute'},
            marker      :{position:'absolute !important','z-index':'1',background:'#0ff',opacity:'0.5'},
            fontinfo    :{position:'absolute !important','z-index':'2',background:'rgba(34, 34, 34, 0.7)',border:'1px solid #fff',padding:'3px','font-family':'Open Sans',color:'#fff'},
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
        var useMarker = this._options.checkUseMarker ? this._options.checkUseMarker() : true;
        var useFont = this._options.checkUseFont ? this._options.checkUseFont() : true;
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

        size || (size=markerHeight.call(this,elem));
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
            ff = $elem.css('font-family').split(',')[0].replace(/\"|\'| /g,'').toLowerCase(),
//            dp = $elem.css('display'),
            fs = parseFloat($elem.css('font-size')),
//            fw = parseInt($elem.css('font-weight')),
            lh = parseFloat($elem.css('line-height')),
//            eh = $elem.height(),
            ew = $elem.width(),
            ey = $elem.offset().top + parseFloat($elem.css('padding-top')),
            ex = $elem.offset().left + parseFloat($elem.css('padding-left'));

        var multi = this.multipliers[ff] || this.multipliers.default;

        // TODO: this works nicely with 'normal' line-heights.. fix logic for different line-heights

        // distance between upper and lower letters
        var delta_top    = fs * multi.top - this._options.markerOffset,
            delta_bottom = fs * multi.bottom - this._options.markerOffset;
        // distance between line-height and font height
        var delta_height = lh * multi.height;

        return {
            width  : ew,
            height : fs - delta_top - delta_bottom,
            offset : {
                top  : ey + delta_top + delta_height,
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

    return UIMarkerWidget;

}(jQuery,UIBaseWidget));
