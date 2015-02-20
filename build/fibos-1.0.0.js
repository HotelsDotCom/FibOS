/**
 * Created by fdimonte on 20/02/2015.
 */

// WIDGETS
var UIBaseWidget=function(){function t(t,e){this.$el=null,this._ID=t,this._selectorsMapping=null,this._styles={},this._options={extension:{},reference:"body"},this.init(e)}return t.prototype={initOptions:function(t){t&&this.extendObject(this._options,t)},initStyles:function(t){t&&this.extendObject(this._styles,t)},initEvents:function(){},createSubElements:function(){},afterInit:function(){},init:function(t){this.initOptions(t),this.initStyles(this._options.extension),this.createElement(),this.createStyleTag(),this.initEvents(),this.afterInit()},createElement:function(){var t=$("#"+this._ID);t.length>0&&(t.remove(),console.log("Container ID already in use and thus has been removed.")),this.$el=$("<div/>").attr("id",this._ID),this.createSubElements()},createStyleTag:function(){var t=this._ID+"-style";$("#"+t).remove();var e,i,s,r,o=$("<style/>").attr("id",t);for(s in this._styles)this._styles.hasOwnProperty(s)&&(r=this._styles[s],e="#"+this._ID,i=this._selectorsMapping&&this._selectorsMapping[s],"main"!=s&&(e+=" "+(i||"."+s)),o.append(e+" {"+this.styleObjectToString(r)+"}"));$("head").append(o)},extendObject:function(t,e){for(var i in e)e.hasOwnProperty(i)&&(t[i]&&t[i]instanceof Object&&!(t[i]instanceof Array)?this.extendObject(t[i],e[i]):t[i]=e[i])},styleObjectToString:function(t){var e=[];for(var i in t)t.hasOwnProperty(i)&&e.push(i+":"+t[i]+";");return e.join("")}},t}(),
    UIMarkerWidget=function(t){function e(e,i){t.call(this,e,i)}function i(t,e){var i="markerHL";if($(t).data(i)===!0)return!0;e||(e=h(t));var s=$('<div class="'+this._options.markerClass+'"/>').width(e.width).height(e.height).offset(e.offset).click(function(t){o.call(this,$(t.currentTarget),i)}.bind(this));r.call(this,t,s,i)}function s(t,e){var i="markerFI";if($(t).data(i)===!0)return!0;e||(e=h(t));var s=u(t),n=$('<p class="fi1"/>').text(s[0]),l=$('<p class="fi2"/>').text(s[1]),a=$('<p class="fi3"/>').text(s[2]),p=$('<div class="'+this._options.fontClass+'"/>').append(n,l,a).offset({top:e.offset.top-45,left:e.offset.left+10}).click(function(t){console.log(this),o.call(this,$(t.currentTarget),i)}.bind(this));r.call(this,t,p,i)}function r(t,e,i){$(t).data(i,!0),$(e).data("ref",t),this.$el.append(e)}function o(t,e){$($(t).data("ref")).data(e,!1),$(t).remove()}function n(){var t=f.call(this);$(t).off(".prevent").on("click.prevent",function(e){$(e.target).is(t)&&0===$(e.target).closest(this._options.excluded).length&&e.preventDefault()}.bind(this))}function l(){var t=f.call(this);$(t).off(".prevent")}function a(t){g.call(this,t.target)&&this.addTextFontHighlight(t.target)}function p(t){$(t.currentTarget).remove()}function u(t){var e=$(t),i=e.css("font-weight"),s=e.css("font-size").replace("px",""),r=e.css("font-family").split(",")[0].replace(/\"|'/g,""),o=r.split(" ")[0].substr(0,1).toUpperCase(),n=r.split(" ")[1]?r.split(" ")[1].substr(0,1).toUpperCase():r.substr(1,1).toLowerCase(),l=o+n;return[l,i,s]}function h(t){var e=c(t),i=$(t);return{width:i.width(),height:i.height()-(e.t+e.b),offset:{left:i.offset().left+Number(i.css("padding-left").replace("px","")),top:i.offset().top+Number(i.css("padding-top").replace("px",""))+e.t}}}function c(t){var e=$(t),i=!0,s=e.css("font-weight"),r=e.css("font-size").replace("px",""),o=e.css("font-family").split(",")[0].replace(/\"|'/g,""),n={8:d(),9:d(),10:d(),11:d(),12:d(),13:d(),14:d(),15:d(),16:d(),17:d(),18:d(),19:d(),20:d(),21:d(),22:d(),23:d(),24:d(),25:d(),26:d(),27:d(),28:d(),29:d()},l={Arial:n,"Open Sans":n};if(l.Arial[8]=d(0,0),l["Open Sans"][12]=d(1,-1),l["Open Sans"][21]=d(5,1),l["Open Sans"][26]=d(11,5),i){var a=[];a.push('family:"'+o+'" - size:'+r+" - weight:"+s),l[o]||a.push("fontFAMILY not used.. we'll implement it soon!"),l[o]&&(!l[o][r]||0===l[o][r].t&&0===l[o][r].b)&&a.push("fontSIZE not used.. we'll implement it soon!"),a.push("-----------------"),console.log(a.join("\n"))}var p;return p=l[o]?l[o]:n,p=p[r]?p[r]:p[8]}function d(t,e){return{t:t&&0!==t?t:0,b:e&&0!==e?e:0}}function f(){var t=this._options.taglist,e=[];for(var i in t)t.hasOwnProperty(i)&&t[i]&&e.push(i);return e.join(",")}function g(t){var e=$(t);if(""!==this._options.excluded&&e.closest(this._options.excluded).length>0)return!1;var i=""!==e.html()&&""!==e.text()&&" "!==e.text()&&"&nbsp;"!==e.text();if(i){var s,r=this._options.taglist;for(s in r)if(r.hasOwnProperty(s)&&r[s]&&e.is(s))return!0;if(e.is("div")&&0===e.find("*").length)return!0}return!1}return e.prototype=Object.create(t.prototype),e.prototype.initOptions=function(e){this.extendObject(this._options,{checkUseMarker:null,checkUseFont:null,markerClass:"uieMarker",fontClass:"uieFontinfo",excluded:"",taglist:{p:!0,span:!0,strong:!0,li:!0,h1:!0,h2:!0,h3:!0,h4:!0,h5:!0,h6:!0,a:!0,input:!0,select:!0,textfield:!0}}),t.prototype.initOptions.call(this,e),this.extendObject(this._options,{excluded:(""===this._options.excluded?"":this._options.excluded+",")+"."+this._options.fontClass})},e.prototype.initStyles=function(e){var i=this._options.markerClass,s=this._options.fontClass;this._selectorsMapping={marker:"."+i,fontinfo:"."+s,fontinfo_p:"."+s+" p",fontinfo_p1:"."+s+" p.fi1",fontinfo_p2:"."+s+" p.fi2",fontinfo_p3:"."+s+" p.fi3"},this.extendObject(this._styles,{main:{position:"absolute"},marker:{position:"absolute !important","z-index":"1",background:"#0ff",opacity:"0.5"},fontinfo:{position:"absolute !important","z-index":"2",background:"rgba(34, 34, 34, 0.7)",border:"1px solid #fff",padding:"3px","font-family":"Open Sans",color:"#fff"},fontinfo_p:{margin:"0",cursor:"default","text-algin":"center"},fontinfo_p1:{"font-size":"13px","font-weight":"700","margin-top":"-4px"},fontinfo_p2:{"font-size":"10px","font-weight":"400",margin:"-5px 0"},fontinfo_p3:{"font-size":"14px","font-weight":"600","margin-bottom":"-4px"}}),t.prototype.initStyles.call(this,e)},e.prototype.initEvents=function(){var t=this._options.reference,e="."+this._options.markerClass;$(t).off(".markerevent").on("click.markerevent",a.bind(this)).on("click.markerevent",e,p.bind(this))},e.prototype.toggleDefaults=function(t){t?n.call(this):l.call(this)},e.prototype.addTextFontHighlight=function(t){var e,r=this._options.checkUseMarker?this._options.checkUseMarker():!0,o=this._options.checkUseFont?this._options.checkUseFont():!0;return r||o?(e=h(t),r&&i.call(this,t,e),o&&s.call(this,t,e),!0):!1},e}(UIBaseWidget),
    UIRulerWidget=function(t){function e(e,i){t.call(this,e,i)}function i(){var t,e,i,s,r=this.ruler.clone().addClass("ruler_min"),o=this.ruler.clone().addClass("ruler_med"),n=this.ruler.clone().addClass("ruler_max"),l=Math.floor(this._options.rulerMed/this._options.rulerMin),a=Math.floor(this._options.rulerMax/this._options.rulerMed),p=Math.ceil(d.call(this)/this._options.rulerMax),u=Math.ceil(c.call(this)/this._options.rulerMax);for(t=0;l>t;t++)o.append(r.clone().css(f(t*this._options.rulerMin)));for(e=0;a>e;e++)n.append(o.clone().css(f(e*this._options.rulerMed)));if(this._options.showRulerH){for(i=0;u>i;i++)this.rulers_h.append(n.clone().css(f(i*this._options.rulerMax)).append(this.ruler_lab.clone().text((i+1)*this._options.rulerMax)));this.$el.append(this.rulers_h)}if(this._options.showRulerV){for(s=0;p>s;s++)this.rulers_v.append(n.clone().css(f(s*this._options.rulerMax)).append(this.ruler_lab.clone().text((s+1)*this._options.rulerMax)));this.$el.append(this.rulers_v)}this._options.showMousePos&&0===$("#").length&&this.$el.append(this.mousepos),this.$el.append(this.rulertop),this.$el.append(this.guides)}function s(t){if(this._options.showMousePos){var e=u.call(this,t.pageX,t.pageY),i="x:"+e.relative.left+", y:"+e.relative.top;this.mousepos.offset(e.absolute),this.mousepos.text(i)}if(this.guide_dragging){var s,r=g(this.guide_dragging),o=h.call(this),n=p.call(this,t);return"v"===r&&(s={top:o.top,left:n.coords.x}),"h"===r&&(s={left:o.left,top:n.coords.y}),this.guide_dragging.offset(s),!1}return!0}function r(t){var e=_(t.currentTarget),i=this.guideline.clone().addClass("guide_"+e),r=$(this._options.guidelinesContainer);return r.append(i),this.guide_dragging=i,this.guide_dragged=null,s.call(this,t),!1}function o(t){return this.guide_dragging=$(t.currentTarget),this.guide_dragged=null,s.call(this,t),!1}function n(t){var e=p.call(this,t),i=$(t.target).closest(".rulers_container").length>0,s=t.pageX>e.bounds.x.min&&t.pageX<e.bounds.x.max&&t.pageY>e.bounds.y.min&&t.pageY<e.bounds.y.max;!this.guide_dragging||!i&&s||(this.guide_dragging.remove(),this.guide_dragging=null),this.guide_dragged=this.guide_dragging,this.guide_dragging=null}function l(t){var e=t.shiftKey?10:t.altKey?.5:1;if(this.guide_dragged&&t.keyCode>=37&&t.keyCode<=40){var i={top:this.guide_dragged.position().top+(38===t.keyCode?-e:40===t.keyCode?e:0),left:this.guide_dragged.position().left+(37===t.keyCode?-e:39===t.keyCode?e:0)};return"v"===g(this.guide_dragged)&&this.guide_dragged.css({left:i.left}),"h"===g(this.guide_dragged)&&this.guide_dragged.css({top:i.top}),!1}return!0}function a(){var t=h.call(this).top-$(window).scrollTop()-this._options.rulerWidth,e=h.call(this).left-$(window).scrollLeft()-this._options.rulerWidth;this.$el.css({top:h.call(this).top,left:h.call(this).left});var i=0>=t?{position:"fixed",top:"0",left:h.call(this).left}:{position:"absolute",top:-this._options.rulerWidth,left:0},s=0>=e?{left:-h.call(this).left+$(window).scrollLeft()}:{left:-this._options.rulerWidth};this.rulers_h.css(i),this.rulers_v.css(s);var r={top:i.top,position:i.position};r.left=0>=t?this.rulers_v.offset().left:s.left,this.rulertop.css(r),$(".guide_h").css({width:c.call(this)})}function p(t){var e=h.call(this),i=e.left-this._options.rulerWidth,s=e.top-this._options.rulerWidth,r=c.call(this)+e.left,o=d.call(this)+e.top,n=t.pageX<i?i:t.pageX>r?r:t.pageX,l=t.pageY<s?s:t.pageY>o?o:t.pageY;return{coords:{x:n,y:l},bounds:{x:{min:i,max:r},y:{min:s,max:o}},isInside:n===t.pageX&&l===t.pageY}}function u(t,e){var i={},s=this.mousepos.width()+4,r=10,o=16;return i.absolute={left:t+r,top:e+o},i.absolute.left+s+r>$(window).width()&&(i.absolute.left=t-s-r),t-=$(this._options.reference).offset().left,e-=$(this._options.reference).offset().top,i.relative={left:Math.round(t),top:Math.round(e)},i}function h(){return $(this._options.reference).offset()}function c(){return $(this._options.reference).width()+Number($(this._options.reference).css("padding-left").replace("px",""))+Number($(this._options.reference).css("padding-right").replace("px",""))}function d(){return $(this._options.reference).height()+Number($(this._options.reference).css("padding-top").replace("px",""))+Number($(this._options.reference).css("padding-bottom").replace("px",""))}function f(t){return{left:t+"px",top:t+"px"}}function g(t){return $(t).attr("class").replace(/ruler_guideline|guide_| /g,"")}function _(t){return $(t).attr("class").replace(/rulers_|container| /g,"")}return e.prototype=Object.create(t.prototype),e.prototype.initOptions=function(e){this.extendObject(this._options,{guidelinesContainer:"#ruler_guides",showMousePos:!0,showRulerV:!0,showRulerH:!0,rulerWidth:20,rulerUnit:5,rulerStepMin:2,rulerStepMed:5}),t.prototype.initOptions.call(this,e);var i=this._options;i.rulerMin||(i.rulerMin=i.rulerUnit),i.rulerMed||(i.rulerMed=i.rulerMin*i.rulerStepMin),i.rulerMax||(i.rulerMax=i.rulerMed*i.rulerStepMed)},e.prototype.initStyles=function(e){var i=this._options.rulerWidth,s=i/2,r=s/2;this._selectorsMapping={rulers_top:".ruler_origin",rulers_cont:".rulers_container",ruler_min:".ruler.ruler_min",ruler_med:".ruler.ruler_med",ruler_max:".ruler.ruler_max",ruler_label:".ruler .ruler_label",ruler_labelv:".rulers_v .ruler_label",ruler_labelh:".rulers_h .ruler_label",ruler_v:".rulers_v .ruler",ruler_h:".rulers_h .ruler",guide_v:".ruler_guideline.guide_v",guide_h:".ruler_guideline.guide_h",guideline:".ruler_guideline",mousepos:".ruler_mousepos",rulerv_min:".rulers_v .ruler_min",rulerv_med:".rulers_v .ruler_med",rulerv_max:".rulers_v .ruler_max",rulerh_min:".rulers_h .ruler_min",rulerh_med:".rulers_h .ruler_med",rulerh_max:".rulers_h .ruler_max"},this.extendObject(this._styles,{main:{position:"absolute",top:h.call(this).top+"px",left:h.call(this).left+"px"},rulers_cont:{position:"absolute",overflow:"hidden",background:"rgba(255,255,255,.8)"},rulers_v:{width:this._options.rulerWidth+"px",height:d.call(this)+"px",top:"0",left:"-"+this._options.rulerWidth+"px"},rulers_h:{height:this._options.rulerWidth+"px",width:c.call(this)+"px",left:"0",top:"-"+this._options.rulerWidth+"px"},ruler:{"z-index":"1",position:"absolute",border:"0 solid #000"},ruler_v:{"border-bottom-width":"1px",left:"0 !important"},ruler_h:{"border-right-width":"1px",top:"0 !important"},ruler_top:{"z-index":"2",position:"absolute",width:this._options.rulerWidth+"px",height:this._options.rulerWidth+"px",top:"-"+this._options.rulerWidth+"px",left:"-"+this._options.rulerWidth+"px",background:"#fff","border-right":"1px solid #000000","border-bottom":"1px solid #000000"},ruler_min:{width:this._options.rulerMin-1+"px",height:this._options.rulerMin-1+"px"},ruler_med:{width:this._options.rulerMed-1+"px",height:this._options.rulerMed-1+"px"},ruler_max:{width:this._options.rulerMax-1+"px",height:this._options.rulerMax-1+"px"},ruler_label:{position:"absolute","font-family":"helvetica","font-size":"8px",cursor:"default"},ruler_labelh:{bottom:"0px",right:"1px"},ruler_labelv:{bottom:"2px",right:"0px",width:"10px",transform:"rotate(-90deg)"},mousepos:{"z-index":"3",position:"absolute",width:"auto",height:"auto",background:"rgba(200,200,200,.8)",border:"1px solid #fff","font-size":"12px",padding:"1px 5px 3px","white-space":"nowrap"},guideline:{position:"absolute",background:"#0f0",width:"1px",height:"1px"},guide_v:{height:d.call(this)+"px",cursor:"ew-resize"},guide_h:{width:c.call(this)+"px",cursor:"ns-resize"}}),this.extendObject(this._styles,{ruler_labelv:{"-webkit-transform":"rotate(-90deg)","-moz-transform":"rotate(-90deg)","-ms-transform":"rotate(-90deg)","-o-transform":"rotate(-90deg)",filter:"progid:DXImageTransform.Microsoft.BasicImage(rotation=3)"}}),t.prototype.initStyles.call(this,e),this.extendObject(this._styles,{rulerv_min:{width:r+"px !important"},rulerv_med:{width:s+"px !important"},rulerv_max:{width:i+"px !important"},rulerh_min:{height:r+"px !important"},rulerh_med:{height:s+"px !important"},rulerh_max:{height:i+"px !important"}})},e.prototype.createSubElements=function(){this.$el.addClass("rulers"),this.rulers_v=$("<div/>").addClass("rulers_container").addClass("rulers_v"),this.rulers_h=$("<div/>").addClass("rulers_container").addClass("rulers_h"),this.ruler=$("<div/>").addClass("ruler"),this.ruler_lab=$("<div/>").addClass("ruler_label"),this.rulertop=$("<div/>").addClass("ruler_origin"),this.mousepos=$("<div/>").addClass("ruler_mousepos"),this.guideline=$("<div/>").addClass("ruler_guideline"),this.guides=$("<div/>").attr("id","ruler_guides"),i.call(this)},e.prototype.initEvents=function(){$(this.$el).off(".guidesevent").on("mousedown.guidesevent",".rulers_container",r.bind(this)).on("mousedown.guidesevent",".ruler_guideline",o.bind(this)),$("body").off(".guidesevent").on("mousemove.guidesevent",s.bind(this)).on("mouseup.guidesevent",n.bind(this)).on("keydown.guidesevent",l.bind(this)),$(window).off(".rulersevent").on("scroll.rulersevent resize.rulersevent",a.bind(this))},e.prototype.afterInit=function(){a.call(this)},e}(UIBaseWidget),
    UISliderWidget=function(t){function e(e,i){this.sliding=!1,this.mousezero=0,t.call(this,e,i)}function i(t){var e=Math.floor(10*l.call(this,t))/10;return this.slider_output.text(e),this._options.callback&&this._options.callback(t,e),e}function s(t){return $(t.target).is(this.slider_output)?!0:(this.slider_handler.css("left",a.call(this,t,-(this.slider_handler.width()/2))),r.call(this,t),!1)}function r(t){return this.mousezero=this.slider_handler.position().left-p.call(this,t.pageX),this.sliding=!0,n.call(this,t),!1}function o(){return this.sliding=!1,!1}function n(t){return this.sliding&&this.setSliderPerc(a.call(this,t)/u.call(this)),!1}function l(t){var e=this._options.minValue,i=this._options.maxValue,s=this._options.stepValue;return Math.round((e+t*(i-e))/s)*s}function a(t,e){e&&(this.mousezero=e);var i,s=u.call(this);i=p.call(this,t.pageX)+this.mousezero,i=0>i?0:i>s?s:i;var r=this._options.stepValue/(this._options.maxValue-this._options.minValue)*s;return i=Math.floor((i+r/2)/r)*r}function p(t){return t-this.$el.offset().left}function u(){return this.$el.width()-this.slider_handler.width()}return e.prototype=Object.create(t.prototype),e.prototype.initOptions=function(e){this.extendObject(this._options,{minValue:0,maxValue:100,initialValue:100,stepValue:1,callback:null}),t.prototype.initOptions.call(this,e);var i=this._options;i.maxValue<=i.minValue&&(i.maxValue=i.minValue+i.stepValue),i.initialValue<=i.minValue&&(i.initialValue=i.minValue),i.initialValue>=i.maxValue&&(i.initialValue=i.maxValue)},e.prototype.initStyles=function(e){this.extendObject(this._styles,{main:{position:"relative",width:"100px",height:"20px",background:"rgba(100,100,100,.4)"},slider_bar:{position:"absolute",width:"100%",height:"3px",background:"rgb(200,200,200)",top:"9px"},slider_handler:{position:"absolute",width:"10px",height:"20px",background:"rgb(100,100,100)",top:"0",left:"0"},slider_output:{position:"absolute",width:"34px",height:"20px",background:"#fff",top:"0",right:"-34px","text-align":"center","font-size":"12px","line-height":"20px",cursor:"default"}}),t.prototype.initStyles.call(this,e)},e.prototype.createSubElements=function(){this.$el.addClass("slider"),this.slider_bar=$("<div/>").addClass("slider_bar"),this.slider_handler=$("<div/>").addClass("slider_handler"),this.slider_output=$("<div/>").addClass("slider_output"),this.$el.append(this.slider_bar).append(this.slider_handler).append(this.slider_output)},e.prototype.initEvents=function(){var t=".slider_"+this._ID;this.$el.off(t).on("mousedown"+t,s.bind(this)).on("mousedown"+t,".slider_handler",r.bind(this)),$("body").off(t).on("mousemove"+t,n.bind(this)).on("mouseup"+t,o.bind(this))},e.prototype.afterInit=function(){this.setSliderVal(this._options.initialValue)},e.prototype.setSliderVal=function(t){var e=(t-this._options.minValue)/(this._options.maxValue-this._options.minValue);this.setSliderPerc(e)},e.prototype.setSliderPerc=function(t){var e=t*u.call(this);this.slider_handler.css("left",e),i.call(this,t)},e.prototype.getSliderVal=function(){return i.call(this,this.getSliderPerc())},e.prototype.getSliderPerc=function(){var t=this.slider_handler.css("left").replace("px","");return t/u.call(this)},e}(UIBaseWidget),
    UISpacerWidget=function(t){function e(e,i){this.defaultGroupName="spacerGroup_",this.lastUsedGroup=this.defaultGroupName+"0",this.spacersGroups=f(),this.mousezero=null,this.dragging=null,this.dragged=null,t.call(this,e,i),this.spacerObjects=w.call(this)}function i(t,e,i){return o.call(this,t,e,i)}function s(t){return t&&this.spacersGroups.groups[t]?($("#"+t).remove(),delete this.spacersGroups.groups[t],!0):!1}function r(){return this.$el.empty(),this.spacersGroups=f(),!0}function o(t,e,i){t||(t=this.lastUsedGroup);var s=$("#"+t);return 0===s.length&&(s=$('<div id="'+t+'" class="spacers_group"/>'),e||this.$el.append(s),!i&&this._options.groupCallback&&this._options.groupCallback(t)),this.lastUsedGroup=t,s}function n(){var t,e={};$("#"+id+" ."+this._options.spacerClass).each(function(i,s){t=$(s).parent().attr("id"),t===id&&(t="spacerGroupDefault"),e[t]||(e[t]=[]),e[t].push([parseInt(k.call(this,s)),Number($(s).css("top").replace("px","")),Number($(s).css("left").replace("px",""))])}.bind(this)),this.spacersGroups.groups=e}function l(){return n.call(this),JSON.stringify(this.spacersGroups.groups)}function a(t,e,i){var s,r=JSON.parse(t);for(var o in r)r.hasOwnProperty(o)&&(e?(delete this.spacersGroups.groups[o],s=r[o]):(s=this.spacersGroups.groups[o],s||(s=[]),s.push.apply(s,r[o])),this.spacersGroups.groups[o]=s);return p.call(this,i)}function p(t){var e,s,r,o,n,l=[];for(var a in this.spacersGroups.groups)if(this.spacersGroups.groups.hasOwnProperty(a)){o=[],s=this.spacersGroups.groups[a],$("#"+a).remove();for(var p=0;p<s.length;p++)e="f_"+("000"+s[p][0]).substr(-3),r=this.spacerObjects[e].clone(),r.css("top",s[p][1]),r.css("left",s[p][2]),o.push(r.prop("outerHTML"));this._options.grouping?(n=i.call(this,a,!0,!0),n.html(o.join("")),t&&n.hide(),l.push(n.prop("outerHTML"))):l.push(o.join(""))}return l.join("")}function u(t,e,i){var s=a.call(this,t,e,i);this.$el.html(s)}function h(){var t,e,i,s="65",r=this._options.spacerMin-1,o=M.call(this,r),n=[],l=this._options.spacerColors,a=this._options.spacerSymbols,p=l.length,u=a.length,h=r,c=0;h>=p&&(h-=Math.floor(h/p)*p),n.after={position:"absolute",left:"0",color:"#fff","-khtml-opacity":"."+s,"-moz-opacity":"."+s,"-ms-filter":'"alpha(opacity='+s+')"',filter:"alpha(opacity="+s+")",opacity:"."+s};for(var d in o)o.hasOwnProperty(d)&&(e=o[d],t=O.call(this,e),i=("000"+e).substr(-3),n[this._options.spacerClass+".fs_"+i]={width:o[d]+"px",height:o[d]+"px",background:l[h]},t>=p&&(n[this._options.spacerClass+".fs_"+i+":after"]={content:'"'+a[c].s+'"',"font-size":Number(e*a[c].f)+"px","line-height":Number(e*a[c].l)+"px"},(t+1)%p===0&&++c>=u&&(c=u-1)),++h>=p&&(h=0));return n}function c(t){var e=Math.round(t%1*100)/100,i=.25>e?0:e>.75?1:.5;return Math.floor(t)+i}function d(t){var e={top:c(Number(t.css("top").replace("px",""))),left:c(Number(t.css("left").replace("px","")))};t.css(e)}function f(){return{groups:{},totalGroups:function(){var t=0;for(var e in this.groups)this.groups.hasOwnProperty(e)&&t++;return t}}}function g(t){var e=t.shiftKey?10:t.altKey?.5:1;return this.dragged&&t.keyCode>=37&&t.keyCode<=40?(this.dragged.offset({top:this.dragged.offset().top+(38===t.keyCode?-e:40===t.keyCode?e:0),left:this.dragged.offset().left+(37===t.keyCode?-e:39===t.keyCode?e:0)}),this._options.moveCallback&&this._options.moveCallback(this.dragged),!1):!0}function _(t){switch(t.type){case"mousedown":b.call(this,t);case"mousemove":x.call(this,t);break;case"mouseup":y.call(this,t)}}function m(){this.$el.css(S.call(this))}function b(t){var e=$(t.target);return this.mousezero={top:e.position().top-t.pageY+S.call(this).top,left:e.position().left-t.pageX+S.call(this).left},v.call(this,e),!1}function v(t){var e=t.parent();e.append(t),this.dragged=null,this.dragging=t}function x(t){return this.dragging?(this.dragging.offset({top:Number(t.pageY+this.mousezero.top),left:Number(t.pageX+this.mousezero.left)}),d(this.dragging),!1):!0}function y(){return this.dragged=this.dragging,this.dragged?(this.dragged.focus(),void(this.dragging&&(this.dragging=null,this._options.moveCallback&&this._options.moveCallback(this.dragged)))):!0}function w(){for(var t,e={},i=this._options.spacerMin-1;i<this._options.spacersList.length;i++)t=("00"+this._options.spacersList[i]).substr(-3),e["f_"+t]=$('<div class="'+this._options.spacerClass+" fs_"+t+'" tabindex=""/>');return e}function k(t){return $(t).attr("class").replace(this._options.spacerMatch,"")}function C(t,e){for(var i=1,s=1,r=0,o=[],n=1;e>=n;n++)i+=r,r=s,s=i,o.push(i);return 0>=t&&(t=1),o.splice(t-1,e-t+1)}function O(t){var e=this._options.spacersList;for(var i in e)if(e.hasOwnProperty(i)&&e[i]===t)return Number(i);return-1}function M(t,e){(!t||0>t)&&(t=0),(!e||e>this._options.spacersList.length-1)&&(e=this._options.spacersList.length-1);for(var i=[],s=t;e>=s;s++)i.push(this._options.spacersList[s]);return i}function S(){return $(this._options.reference).offset()}return e.prototype=Object.create(t.prototype),e.prototype.initOptions=function(e){this.extendObject(this._options,{localStorage:"fibonacciGroups",spacerClass:"fibospacer",spacerMatch:/fibospacer|fs|_| /g,grouping:!0,moveCallback:null,groupCallback:null,spacersList:C(1,12),spacerMin:3,spacerSymbols:[{s:"•",f:2.8,l:1},{s:"★",f:1,l:1.09}],spacerColors:["#0071bc","#ed1e79","#8cc63f","#fbb03b"]}),t.prototype.initOptions.call(this,e)},e.prototype.initStyles=function(e){var i="0 0 5px 2px #222222 inset";this._selectorsMapping={spacer:"."+this._options.spacerClass,shadow:"."+this._options.spacerClass+":focus",after:"."+this._options.spacerClass+":after"},this.extendObject(this._styles,{main:{position:"absolute",top:S.call(this).top+"px",left:S.call(this).left+"px",width:"0",height:"0",overflow:"visible"},spacer:{position:"absolute",display:"block",cursor:"pointer",overflow:"hidden","font-family":"Arial",outline:"0"},shadow:{"-webkit-box-shadow":i,"-moz-box-shadow":i,"box-shadow":i}}),this.extendObject(this._styles,h.call(this)),t.prototype.initStyles.call(this,e)},e.prototype.initEvents=function(){this.$el.off(".spacerevent").on("mousedown.spacerevent","."+this._options.spacerClass,_.bind(this)),$("body").off(".spacerevent").on("mousemove.spacerevent",_.bind(this)).on("mouseup.spacerevent",_.bind(this)).on("keydown.spacerevent",g.bind(this)),$(window).off(".spacerevent").on("scroll.spacerevent resize.spacerevent",m.bind(this))},e.prototype.renameGroup=function(t,e){if(!t||!e)return!1;if(t===e)return!1;if($("#"+e).length>0)return!1;var r=this.spacersGroups.groups[t];if(!r)return!1;this.spacersGroups.groups[e]=r;var o=i.call(this,e);return o.html($("#"+t).html()),s.call(this,t),!0},e.prototype.offsetGroup=function(t){var e,i,s=this.spacersGroups.groups[this.lastUsedGroup],r=$("#"+this.lastUsedGroup).find("."+this._options.spacerClass);r.each(function(r){var o=$(this);e=Number(s[r][1]),i=Number(s[r][2]),o.css("top",e+Number(t.top)),o.css("left",i+Number(t.left))})},e.prototype.saveOffsetGroup=function(t){var e,i=this.spacersGroups.groups[this.lastUsedGroup];for(e in i)i.hasOwnProperty(e)&&(i[e][1]=Number(i[e][1])+Number(t.top),i[e][2]=Number(i[e][2])+Number(t.left));this.spacersGroups.groups[this.lastUsedGroup]=i},e.prototype.offsetCustomGroup=function(t,e){for(var i=0;i<this.spacerslist.length;i++){var s=$(this.spacerslist[i]),r=s.offset(),o={left:r.left+Number(e.left),top:r.top+Number(e.top)};s.offset(o)}},e.prototype.addNewSpacer=function(t,e){if(-1==O.call(this,spacernum))return console.log("WARNING: addSpacer called with unsupported spacer"),null;e||(e=this.lastUsedGroup);var s=("000"+t).substr(-3),r=this.spacerObjects["f_"+s].clone(),o=this._options.grouping?i.call(this,e):this.$el;return r&&o.append(r),r},e.prototype.jsonToString=function(t,e){e||(e="; ");var i=JSON.parse(t),s=0,r=[];for(var o in i)i.hasOwnProperty(o)&&(s++,r.push("  group name: "+o),r.push("    spacers count: "+i[o].length));return r.unshift("groups count: "+s),r.join(e)},e.prototype.setLocalStorage=function(){return localStorage.setItem(this._options.localStorage,l.call(this)),!0},e.prototype.getLocalStorage=function(t){r.call(this);var e=localStorage.getItem(this._options.localStorage);return e&&u.call(this,e,!0,t),e},e.prototype.loadSpacersFromJson=function(t,e){return t&&u.call(this,t,!0,e),t},e}(UIBaseWidget),
    UISpriterWidget=function(t){function e(e,i){this.spritesInfo={},this.spritesLoaded=0,this.spritesTotal=0,t.call(this,e,i)}function i(t,e){var i=$(this._options.reference),s=i.find("*");return console.log("calculating... (please, wait until done!)"),s.each(function(t,e){var i=$(e),s=i.css("background-image"),r=""===this._options.domain;if(!r&&s.indexOf(this._options.domain)>-1&&(r=!0),r&&"url"!==s.substr(0,3)&&(r=!1),r){var o=i.css("background-position"),n=o.split(" "),a=-1*l(n[0]),p=-1*l(n[1]),u=l(i.css("padding-left"))+l(i.css("padding-right")),h=l(i.css("padding-top"))+l(i.css("padding-bottom")),c={l:a,t:p},d={w:u+i.width(),h:h+i.height()};s&&"none"!==s&&(this.spritesInfo[s]||(this.spritesInfo[s]=[]),this.spritesInfo[s].push({pos:c,size:d}))}}.bind(this)),console.log("DONE!"),this.spritesTotal=n.call(this),t?(t(this.spritesInfo,e),!0):this.spritesInfo}function s(t){var e,i,s,r;for(var n in t)if(t.hasOwnProperty(n)){r=this.filenameFromCss(n,!0),i=o(t[n]),e=this.spriteImage(n),s=$('<div id="'+r+'" class="obscurers_container"/>'),s.append(e);for(var l in i)s.append(i[l]);this.$el.append(s)}}function r(t){var e="top:"+t.pos.t+"px; left:"+t.pos.l+"px; width:"+t.size.w+"px; height:"+t.size.h+"px;";return $("<div/>").addClass("sprite_obscurer").attr("style",e)}function o(t){var e,i,s=[];for(var o in t)t.hasOwnProperty(o)&&(e=t[o],i=r(e),s.push(i));return s}function n(){var t,e=0;for(t in this.spritesInfo)this.spritesInfo.hasOwnProperty(t)&&e++;return e}function l(t){return Number(t.replace(/px|%/g,""))}function a(t){return t.replace(/url\(|\"|\)/g,"")}function p(t){var e=t.lastIndexOf("/");return t.substr(e+1)}return e.prototype=Object.create(t.prototype),e.prototype.initOptions=function(e){this.extendObject(this._options,{visible:!0,opacity:"0.3",color:"#f00",border:"#0f0",image:"",domain:"",callback:null}),t.prototype.initOptions.call(this,e)},e.prototype.initStyles=function(e){this.extendObject(this._styles,{main:{position:"relative",display:this._options.visible?"block":"none"},obscurers_container:{position:"relative",display:"block",top:"0",left:"0","text-align":"left",border:"1px solid "+this._options.border,visibility:"hidden"},sprite_obscurer:{position:"absolute",display:"block",background:this._options.color,opacity:this._options.opacity}}),this._options.image&&""!==this._options.image&&(this._styles.obscurers_container.background='url("'+this._options.image+'") repeat scroll 0 0 transparent'),t.prototype.initStyles.call(this,e)},e.prototype.filenameFromCss=function(t,e){var i=p(a(t));return e?i.replace(/.png|.jpg|.jpeg|.gif/g,""):i},e.prototype.analyze=function(){i.call(this,s.bind(this))},e}(UIBaseWidget);

// MAIN APP
var FibOS=function(e,i,t,o,s){function n(e,i){var t="1.7";this._ID="fibos",this._fibosID="fibos_form",this._fibosTitle="FibOS",this._fibosVersion="1.7.2",this._reference=0===$(e).length?"body":e,this._componentsOptions=i||{},this._components={uiMarker:null,uiRuler:null,uiSlider:null,uiSpacer:null,uiSpriter:null},this._spacerSelected=null,this._groupSelected=null,this.initializer.init.call(this,t)}return n.prototype={main:{getImage:function(e){return extraComponents&&extraComponents.images[e]?extraComponents.basePath+extraComponents.images[e]:""},checkJqueryVersion:function(e,i){if("undefined"!=typeof jQuery){var t=e,o=Number(t.split(".")[0]),s=Number(t.split(".")[1]),n=jQuery.fn.jquery,r=Number(n.split(".")[0]),p=Number(n.split(".")[1]),a=!1;o>r?a=!0:s>p&&(a=!0),a?(alert("FibOS needs jQuery 1.7.2\nWe will load it for you."),$.getScript("http://code.jquery.com/jquery-1.7.2.min.js",i)):i()}}},initializer:{init:function(e){this.main.checkJqueryVersion(e,function(){$("#"+this._ID).remove(),$("#"+this._ID+"_styles").remove(),$("head").append(this.factory.styles.call(this)),$("body").append(this.factory.fibos.call(this)),this.initializer.initialStates(),this.initializer.initEvents()}.bind(this))},initialStates:function(){$("#fibo_showhide_selected").show(),$("#fibo_showhide_offset").show(),$("#fibo_showhide_groups").show(),$("#fibo_showhide_storage").show(),$("#fibo_showhide_input").show(),$("#fibo_showhide_sprites").show()},initEvents:function(){}},eventHandlers:{},panelsManager:{openPanel:function(e){this.panelsManager.closeAll(),e.find(".vui-label").find(".fibo_checkbox").attr("checked",!0),e.find(".vui-content").slideDown(),e.addClass("fibo_panel_open")},closePanel:function(e){e.find(".vui-label").find(".fibo_checkbox").attr("checked",!1),e.find(".vui-content").slideUp(),e.removeClass("fibo_panel_open")},closeAll:function(){$(".vui-label").find(".fibo_checkbox").attr("checked",!1),$(".vui-content").slideUp(),$(".fibo_panel_open").removeClass("fibo_panel_open")}},groupSelected:{},history:{save:function(){this._components.uiSpacer.setLocalStorage()},restore:function(){var e=this._components.uiSpacer.getLocalStorage(!0);this.helpers.uiSpacer.showGroupsList(e)},importJson:function(){this._components.uiSpacer.loadSpacersFromJson($("#fibo_input").val(),!0);var e=JSON.stringify(this._components.uiSpacer.spacersGroups.groups);this.helpers.uiSpacer.showGroupsList(e)},exportJson:function(){var e=JSON.stringify(this._components.uiSpacer.spacersGroups.groups);console.log(e),alert("Open your browser's console and see the export string.")}},helpers:{uiMarker:{callback:function(e){this._components.uiMarker.preventDefaults(e)},highlightCheck:function(){return $("#fibo_showhide_markers").find(".fibo_checkbox").is(":checked")},fontinfoCheck:function(){return $("#fibo_showhide_markers").find(".fibo_checkbox").is(":checked")}},uiRuler:{},uiSlider:{},uiSpacer:{moveCallback:function(){},newGroupAdded:function(){}},uiSpriter:{didAnalyze:function(){}}},factory:{components:{uiMarker:function(i,t){return t||(t={}),t.checkUseMarker=this.helpers.uiMarker.highlightCheck.bind(this),t.checkUseFont=this.helpers.uiMarker.fontinfoCheck.bind(this),t.excluded="#"+this._ID,new e(i,t)},uiRuler:function(e,t){return t||(t={}),t.reference=this._reference,new i(e,t)},uiSlider:function(e,i){return i||(i={}),i.extension={slider_handler:{background:"rgba(200,100,100,.6)"}},new t(e,i)},uiSpacer:function(e,i){return i||(i={}),i.reference=this._reference,i.moveCallback=this.helpers.uiSpacer.moveCallback.bind(this),i.groupCallback=this.helpers.uiSpacer.newGroupAdded.bind(this),new o(e,i)},uiSpriter:function(e,i){return i||(i={}),i.extension={obscurerContainer:{top:"auto",left:"auto",margin:"0 auto"}},i.reference=this._reference,i.callback=this.helpers.uiSpriter.didAnalyze.bind(this),i.visible=!1,i.image=this.main.getImage("alpha"),new s(e,i)}},fibos:function(){this._components.uiMarker=this.factory.components.uiMarker.call(this,"fibos_marker",this._componentsOptions.uiMarker),this._components.uiRuler=this.factory.components.uiRuler.call(this,"fibos_ruler",this._componentsOptions.uiRuler),this._components.uiSlider=this.factory.components.uiSlider.call(this,"fibos_slider",this._componentsOptions.uiSlider),this._components.uiSpacer=this.factory.components.uiSpacer.call(this,"fibos_spacers",this._componentsOptions.uiSpacer),this._components.uiSpriter=this.factory.components.uiSpriter.call(this,"fibos_spriter",this._componentsOptions.uiSpriter),this.$el=$("<div/>").attr("id",this._ID);var e=$("<div/>").attr("id","fibo_bg"),i=$("<div/>").attr("id","fibo_controls"),t=$("<div/>").attr("id","fibo_showhide"),o=$("<div/>").attr("id","fibo_clonable");return i.append(t),i.append(this.factory.form.allPanels.call(this)),i.append(o),this.$el.append(e),this.$el.append(i),this.$el.append(this._components.uiSpacer.$el),this.$el.append(this._components.uiMarker.$el),this.$el.append(this._components.uiRuler.$el),this.$el.append(this._components.uiSpriter.$el),this.$el},styles:function(){return $("<style/>").attr("id",this._ID+"_styles")},form:{fiboSelect:function(e,i){var t=this._components.uiSpacer.getinfo.spacersList(!0);e||(e="fibo_select");var o=[];o.push('<select id="'+e+'">'),i||o.push('<option value="none" disabled="disabled" selected="selected">chose a spacer</option>');for(var s=0;s<t.length;s++)o.push('<option value="'+("00"+t[s]).substr(-3)+'">'+t[s]+"</option>");return o.push("</select>"),o.join("")},panelCheckbox:function(e,i,t){var o=e+"_checkbox",s=$("<div/>").attr("id",e).addClass("fibo_toggle"),n=$("<input/>").attr("id",o).addClass("fibo_checkbox").attr("type","checkbox").attr("checked",t),r=$("<label/>").attr("for",o).attr("title",i).html("&nbsp;");return s.append(n).append(r).prop("outerHTML")},panelModule:function(e,i,t){var o=i+"_checkbox",s=$("<div/>").attr("id",i),n=$("<div/>").addClass("vui-label"),r=$("<div/>").addClass("vui-content");return n.append($("<input/>").attr("id",o).addClass("fibo_checkbox").attr("type","checkbox")),n.append($("<label/>").attr("for",o).html(e)),r.append(t),s.append(n).append(r).prop("outerHTML")},allPanels:function(){var e=[];e.push(this.factory.form.panelCheckbox("fibo_showhide_spacers","toggle spacers",!0)),e.push(this.factory.form.panelCheckbox("fibo_showhide_overlay","toggle overlay",!1)),e.push(this.factory.form.panelCheckbox("fibo_showhide_rulers","toggle rulers",!1)),e.push(this.factory.form.panelCheckbox("fibo_showhide_markers","toggle marker tool",!1)),e.push('<div id="'+this._fibosID+'">'),e.push("<h1>"+this._fibosTitle+" <small>"+this._fibosVersion+"</small></h1>");var i=[];i.push("<p>spacer: "+this.factory.form.fiboSelect("fibo_sel_spacer",!0)+"</p>"),i.push('<p>left: <input type="text" id="fibo_sel_left"/></p>'),i.push('<p>top: <input type="text" id="fibo_sel_top"/></p>'),i.push('<p>opacity: </p><div id="fibo_sel_slider_container"/>'),i.push('<input type="button" class="vui-btn" id="fibo_sel_delete" value="remove"/>'),i.push('<input type="button" class="vui-btn" id="fibo_sel_duplicate" value="duplicate"/>'),e.push(this.factory.form.panelModule("spacer selected","fibo_showhide_selected",i.join("")));var t=[];t.push('<p>group: <span id="fibo_grp_sel"></span></p>'),t.push('<p>offset top: <input type="text" id="fibo_grp_sel_top"/></p>'),t.push('<p>offset left: <input type="text" id="fibo_grp_sel_left"/></p>'),t.push('<p id="fibo_grp_sel_multiple_p">spacers: <span>0</span></p>'),t.push('<p><input type="checkbox" id="fibo_grp_sel_multiple"/> select inner group </p>'),e.push(this.factory.form.panelModule("offset group","fibo_showhide_offset",t.join("")));var o=[];o.push('<ul id="groups_tree"/>'),o.push('<p>name: <input type="text" id="fibo_group_name"/></p>'),o.push('<input type="button" class="vui-btn" id="fibo_group_rename" value="rename"/>'),o.push('<input type="button" class="vui-btn" id="fibo_group_delete" value="delete"/>'),e.push(this.factory.form.panelModule("spacer groups","fibo_showhide_groups",o.join("")));var s=[];s.push('<input type="button" class="vui-btn" id="fibo_restore" value="restore"/>'),s.push('<input type="button" class="vui-btn" id="fibo_save" value="save"/>'),e.push(this.factory.form.panelModule("local storage","fibo_showhide_storage",s.join("")));var n=[];n.push('<textarea id="fibo_input"/>'),n.push('<input type="button" class="vui-btn" id="fibo_load" value="import"/>'),n.push('<input type="button" class="vui-btn" id="fibo_export" value="export"/>'),e.push(this.panelModule("input string","fibo_showhide_input",n.join("")));var r=[];return r.push('<ul id="sprites_tree"/>'),r.push('<input type="button" class="vui-btn" id="fibo_sprites_analyze" value="analyze"/>'),e.push(this.factory.form.panelModule("loaded sprites","fibo_showhide_sprites",r.join(""))),e.push("<div>"+this.factory.form.fiboSelect()+"</div>"),e.push("</div>"),e.join("")}}}},n}(UIMarkerWidget,UIRulerWidget,UISliderWidget,UISpacerWidget,UISpriterWidget);

// VENERE INIT
var venereID = '#themewrapper';
var venereOptions = {
    uiMarker:  {opt: {}},
    uiRuler:   {opt: {}},
    uiSlider:  {opt: {}},
    uiSpacer:  {opt: {}},
    uiSpriter: {opt: {domain:'www.venere.com'} }
};

var fibos = new FibOS();
//var venereFibos = new FibOS(venereID, venereOptions);
