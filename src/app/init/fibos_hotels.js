/**
 * Created by fdimonte on 20/02/2015.
 */

var hotelsOptions = {
    logEvents: false,
    uiMarker:  {taglist:{dt:true,dd:true}},
    uiSpriter: {domain:'hotels.com'}
};
$(document).ready(function(){
    var fibos = new FibOS('body', hotelsOptions);
});
