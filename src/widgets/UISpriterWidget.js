/**
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

    UISpriterWidget.prototype.analyze = function(){
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
                for(var s in arr){
                    $obsCont.append(arr[s]);
                }
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
