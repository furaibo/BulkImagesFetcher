/*
 * 関数を定義する
 */

// HTMLファイルの内容を取得する関数
var getHtml = function(sourceUrl) {
    var defer = $.Deferred();

    $.ajax({
        type: 'GET',
        url: sourceUrl,
        dataType: 'html',
        async: false,
        success: defer.resolve,
        error: defer.fail
    });

    return defer.promise();
}

// HTML文字列を取得する関数
var getHtmlString = function(sourceUrl) {
    var htmlString;

    // 非同期処理を直列化して行う
    getHtml(sourceUrl)
    .done(function(html){
        htmlString = html;
    });

    return htmlString;

}

// HTML文字列をパースしてDOMオブジェクトに変換する
var getHtmlObject = function(sourceUrl) {
    var htmlObject;

    // 非同期処理を直列化して行う
    getHtml(sourceUrl)
    .then(function(html){
        var defer = $.Deferred();
        defer.resolve($.parseHTML(html));
        return defer.promise();
    })
    .done(function(data){
        htmlObject = data;
    });

    return htmlObject;
}

// Chromeクリックイベントの発火により画像をダウンロードする
function downloadImage(url, name) {
    var a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', name || 'noname');
    a.dispatchEvent(new CustomEvent('click'));
}

