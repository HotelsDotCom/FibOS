//(function(brands,tags,brand,tag){

    (function(brand,tag){
        var headTag = document.getElementsByTagName('head')[0];
        if(!headTag) throw new Error('Attempt to load FibOS on a page without head tag!');

        checkJquery();

        brand || (brand = prompt('Choose brand\n[ '+brands.join(' | ')+' ]\n\n(leave it blank for \''+brands[0]+'\')') || brands[0]);
        tag || (tag = prompt('Choose tag\n[ '+tags.join(' | ')+' ]\n\n(leave it blank for \''+tags[0]+'\')') || tags[0]);

        function checkAnswer(val,arr){
            var _len, _value = null;
            arr.forEach(function(v) {
                _len = val.length;
                if(v.substr(0, _len) == val) _value = v;
            });
            return _value;
        }
        function checkJquery(){
            var required_vers = '1.7.2',
                shouldLoadJQuery = true;
            if (typeof jQuery != 'undefined') {
                var c_maj = parseInt(required_vers.split('.')[0]),
                    c_min = parseInt(required_vers.split('.')[1]),
                    c_fix = parseInt(required_vers.split('.')[2]);
                var jquery_vers = jQuery.fn.jquery,
                    j_maj = parseInt(jquery_vers.split('.')[0]),
                    j_min = parseInt(jquery_vers.split('.')[1]),
                    j_fix = parseInt(jquery_vers.split('.')[2]);
                shouldLoadJQuery = (j_maj<c_maj) || (j_min<c_min) || (j_fix<c_fix);
            }
            if(shouldLoadJQuery){
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = ['https://code.jquery.com/jquery-',required_vers,'.min.js'].join('');
                headTag.appendChild(script);
            }
        }

        if(brands.indexOf(brand)===-1)
            brand = checkAnswer(brand,brands) || brand;
        if(tags.indexOf(tag)===-1)
            tag = checkAnswer(tag,tags) || tag;

        var rawUrl = ['https://rawgit.com/VenereDotCom/FibOS/',tag,'/public/fibos-latest-',brand,'.min.js'].join(''),
            script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = rawUrl;

        headTag.appendChild(script);
        console.log('loaded',rawUrl);
    }(brand,tag));

//}([],[],null,null));