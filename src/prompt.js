//(function(brands,tags,brand,tag){

    (function(brand,tag){
        brand || (brand = prompt('Choose brand\n[ '+brands.join(' | ')+' ]\n\n(leave it blank for \''+brands[0]+'\')') || brands[0]);
        tag || (tag = prompt('Choose tag\n[ '+tags.join(' | ')+' ]\n\n(leave it blank for \''+tags[0]+'\')') || tags[0]);

        function check(val,arr){
            var _len,_value;
            arr.forEach(function(v) {
                _len = val.length;
                if(v.substr(0, _len) == val) _value = v;
            });
            return _value;
        }

        if(brands.indexOf(brand)===-1)
            brand = check(brand,brands) || brand;
        if(tags.indexOf(tag)===-1)
            tag = check(tag,tags) || tag;

        var rawUrl = ['https://rawgit.com/VenereDotCom/FibOS/',tag,'/public/fibos-latest-',brand,'.min.js'].join(''),
            script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = rawUrl;

        document.getElementsByTagName('head')[0].appendChild(script);
        console.log('loaded',rawUrl);
    }(brand,tag));

//}([],[],null,null));