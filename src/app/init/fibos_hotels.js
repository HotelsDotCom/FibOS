/**
 * Created by fdimonte on 20/02/2015.
 */

var hotelsOptions = {
    logEvents: false,
    uiSpacer:  {
        spacerSymbols : [{s:'♠︎',f:1.4,l:0.9},{s:'♣',f:1.4,l:0.9},{s:'♥',f:1.4,l:0.9},{s:'♦︎',f:1.4,l:0.9}],
        spacersList:[1,2,4,8,12,16,20,24,28,32,36,40,44,48,52,56,60,64,68,72],
        spacerColors  : ['#0071bc','#ed1e79','#8cc63f','#fbb03b']
    },
    uiMarker:  {
        taglist:{dt:true,dd:true}
    },
    uiSpriter: {
        domain:'hotels.com'
    }
};
$(document).ready(function(){
    var fibos = new FibOS('#content-wrapper', hotelsOptions);
});
