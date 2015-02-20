/*
 * FibOS FOR VENERE
 * by : Venere UIE team
 * 05/2013
 */

var basePath = 'https://raw.githubusercontent.com/VenereDotCom/FibOS/master/';

var extraOptions = {
   uie_marker  : {opt: {} },
   uie_ruler   : {opt: {} },
   uie_slider  : {opt: {} },
   uie_spacer  : {opt: {} },
   uie_spriter : {opt: {} }
};

var fibOS;
$.getScript(basePath + 'app/FibOS.js', function(){
   fibOS = new FibOS('#themewrapper',basePath,extraOptions);
});
