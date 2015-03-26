(function(brand,tag) {
    brand || (brand = prompt('Choose brand: [hotels | venere]\n\n(leave it blank for \'hotels\')') || 'hotels');
    tag || (tag = prompt('Choose tag: [latest | staging]\n\n(leave it blank for \'latest\')') || 'latest');
    var ghUrl = ['VenereDotCom/FibOS/',tag,'/public/fibos-latest-',brand,'.min.js'].join(''),
        rawUrl = 'https://rawgit.com/' + ghUrl,
        script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = rawUrl;
    document.getElementsByTagName('head')[0].appendChild(script);
}(null,null));