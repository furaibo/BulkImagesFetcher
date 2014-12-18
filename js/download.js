
function download(url, name){
    var a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', name || 'noname');
    a.dispatchEvent(new CustomEvent('click'));
}

var url = "http://fc03.deviantart.net/fs70/f/2013/012/e/c/png_cookie_by_ellatutorials-d5r8nel.png";
var name = "sample";
//download(url, name);

