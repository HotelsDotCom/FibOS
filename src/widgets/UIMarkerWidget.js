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
        this.extendObject(this._options, {
            checkUseMarker : null,          //if this function returns true the marker will work
            checkUseFont   : null,          //if this function returns true the fontinfo will work
            markerClass    : 'uieMarker',   //common highlight element class
            fontClass      : 'uieFontinfo', //common fontinfo element class
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

        $(ref).off('.markerevent')
            .on('click.markerevent',doHighlight.bind(this))
            .on('click.markerevent',cls,undoHighlight.bind(this));
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
        var dataName = 'markerHL';
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
        var dataName = 'markerFI';
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
            .click(function(e){console.log(this);removeFromMarker.call(this,$(e.currentTarget),dataName);}.bind(this));

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
        var tl = taglistToString.call(this);
        $(tl).off('.prevent')
            .on('click.prevent',function(e){
                if($(e.target).is(tl) && $(e.target).closest(this._options.excluded).length===0)
                    e.preventDefault();
            }.bind(this));
    }

    //restore all default behaviors
    function restoreDefaults() {
        var tl = taglistToString.call(this);
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
                left: $el.offset().left + Number($el.css('padding-left').replace('px','')),
                top : $el.offset().top  + Number($el.css('padding-top').replace('px','')) + fontOffset.t
            }
        };
    }

    //offset info on given elemenet's fontFamily and fontSize css properties
    function markerHeight(elem) {
        var $el = $(elem),
            loginfo = true,
            fw = $el.css('font-weight'),
            fs = $el.css('font-size').replace('px',''),
            ff = $el.css('font-family').split(',')[0].replace(/\"|'/g,'');

        var sizesDef = {8:fo(),9:fo(),
            10:fo(),11:fo(),12:fo(),13:fo(),14:fo(),15:fo(),16:fo(),17:fo(),18:fo(),19:fo(),
            20:fo(),21:fo(),22:fo(),23:fo(),24:fo(),25:fo(),26:fo(),27:fo(),28:fo(),29:fo()};

        var sizes = {'Arial':sizesDef,'Open Sans':sizesDef};
        sizes['Arial']['8']      = fo(0,0);
        sizes['Open Sans']['12'] = fo(1,-1);
        sizes['Open Sans']['21'] = fo(5,1);
        sizes['Open Sans']['26'] = fo(11,5);

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
        finalSize = sizes[ff] ? sizes[ff] : sizesDef;
        finalSize = finalSize[fs] ? finalSize[fs] : finalSize['8'];
        return finalSize;
    }
    function fo(t,b){
        return {
            t : (t&&t!==0) ? t : 0,
            b : (b&&b!==0) ? b : 0
        };
    }

    /*---SERVICE GETTERS---*/

    //convert taglist array to string including only tags setted to 'true'
    function taglistToString() {
        var obj = this._options.taglist,
            list = [];

        for(var tag in obj) if(obj.hasOwnProperty(tag)) if(obj[tag]) list.push(tag);
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
