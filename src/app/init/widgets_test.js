/**
 * Created by fdimonte on 12/03/2015.
 */

var test = {

    uiSpriter: function(){
        var sw = new UISpriterWidget('TEST');
        $('body').append(sw.$el);
        sw.analyze();
    },

    uiSlider: function(){
        function slider_callback_a(perc,value) {
            console.log("SLIDER A : "+value+" ("+Math.round(perc*100)+"%)");
        }
        function slider_callback_b(perc,value) {
            console.log("SLIDER B : "+value+" ("+Math.round(perc*100)+"%)");
        }
        var slider_opt_a = {
            callback:     slider_callback_a,
            minValue:     180,
            maxValue:     360,
            initialValue: 270,
            stepValue:    5
        };
        var slider_opt_b = {
            callback:     slider_callback_b,
            extension:    {main:{width:'1000px'},slider_handler:{width:'30px',background:'rgba(200,0,0,0.6)'}},
            minValue:     100,
            maxValue:     3000,
            initialValue: 1500,
            stepValue:    10
        };

        var slider_a = new UISliderWidget('SliderA',slider_opt_a);
        $('body').append(slider_a.$el);

        var slider_b = new UISliderWidget('SliderB',slider_opt_b);
        $('body').append(slider_b.$el);
    },

    uiRuler: function(){
        var myExtension = {
            main       : {'z-index':'9999'},
            ruler      : {border:'0 solid #f00'},
            mousepos   : {background:'#cc0'},
            guideline  : {background:'#00f'}
        };
        var myOptions = {
            extension    : myExtension,
            showMousePos : true,
            showRulerV   : false,
            showRulerH   : true,
            rulerWidth   : 40,
            rulerUnit    : 10,
            rulerStepMin : 10,
            rulerStepMed : 10
        };

        var myRuler = new UIRulerWidget('myRuler',myOptions);
        $('body').append(myRuler.$el);
    },

    uiMarker: function(){
        function myCallbackMarker(){
            return false;
        }
        function myCallbackFont(){
            return true;
        }
        var myExtension = {
            main:{'z-index':'9999',top:'0'},
            marker:{'background':'#0f0',opacity:'0.6',top:'0'}
        };
        var myOptions = {
            extension      : myExtension,
            checkUseMarker : myCallbackMarker,
            checkUseFont   : myCallbackFont,
            markerClass    : 'textHighlight',
            taglist        : {a:false,h4:false,h5:false,h6:false}
        };

        var myMarker = new UIMarkerWidget('myMarker', myOptions);
        $('body').append(myMarker.$el);
        myMarker.initEvents();
        myMarker.toggleDefaults(true);
    },

    uiSpacer: function(){
        var myOptions = {
            extension     : { main:{'z-index':'1000'} },
            spacerMin     : 1,
            spacersList   : [1,5,10,15,20,25,30,35,40,45,50,55,60,65]
        };
        var myspacer = new UISpacerWidget('fibo_container',myOptions);
        $('body').append(myspacer.$el);
        myspacer.addNewSpacer(20);
    }

};
