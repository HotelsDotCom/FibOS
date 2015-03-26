(function(brand,tag) {
    var brands = ['hotels','venere'],
        tags = ['latest','staging'];

    brand || (brand = prompt('Choose brand: ['+brands.join(' | ')+']\n\n(leave it blank for \''+brands[0]+'\')') || brands[0]);
    tag || (tag = prompt('Choose tag: ['+tags.join(' | ')+']\n\n(leave it blank for \''+tags[0]+'\')') || tags[0]);

    function check(val,arr){
        var _points,_values={};
        for(var i=0;i<val.length;i++){
            _points=[];

            arr.forEach(function(v){
                _values[v] || (_values[v]=0);
                val[i]==v[i] && _values[v]++;
                _points.push({name:v,val:_values[v]});
            });
            _points.sort(function(a,b){return b.val-a.val;});

            if(_points[0].val>_points[1].val)
                return _points[0].name;
        }
        return null;
    }

    if(brands.indexOf(brand)===-1)
        brand = check(brand,brands) || brand;
    if(tags.indexOf(tag)===-1)
        tag = check(tag,tags) || tag;

    var ghUrl = ['VenereDotCom/FibOS/',tag,'/public/fibos-latest-',brand,'.min.js'].join(''),
        rawUrl = 'https://rawgit.com/' + ghUrl,
        script = document.createElement('script');

    script.type = 'text/javascript';
    script.src = rawUrl;

    document.getElementsByTagName('head')[0].appendChild(script);
    console.log('loaded',rawUrl);
}(null,null));
