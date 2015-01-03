// 即時関数
$(function(){

    // 画像のURLを格納する配列
    var urlBuffer = [];

    // メッセージ受け取り時のイベント定義
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            //
            if (request.msg == "prepare" && request.url != "") {

                // 変数
                var html = getHtmlString(request.url);

                // 画像URLを格納する
                var imageSrc = [];
                $(html).find("img").each(function(){

                    var url;
                    var src = $(this).attr("src");
                    var host = request.url.split('/')[2];

                    // 正規表現
                    var reg_base = new RegExp("^(https?://.+)/");
                    var reg1 = new RegExp("^//(.+)$");
                    var reg2 = new RegExp("^\.\.");

                    // ベース部分となるURLの一部を取得
                    var base = "";
                    if (request.url.match(reg_base)) {
                        base = RegExp.$1;
                    }
                 
                    // URLの修正
                    if (src.match(reg_base)) {   
                        url = src;
                    } else if (src.charAt(0) === "/") {
                        url = "http://" + host + src;
                    } else if (src.match(reg1)) {
                        url = "http://" + RegExp.$1;
                    } else if (src.match(reg2)) {
                        url = base + "/" + src;
                    }

                    imageSrc.push(url);

                });

                // 重複するURLを取り除いた配列を作成する
                var imageUrls = imageSrc.filter(function (x, i, self) {
                    return self.indexOf(x) === i;
                });

                // popup.html側への応答
                sendResponse({
                    numImages: imageUrls.length,
                    imageUrls: imageUrls
                });

            // 画像のダウンロード処理
            } else if (request.msg == "download") {

                // 正規表現
                var reg_name = new RegExp(".+/(.*)");

                // ダウンロード処理
                for (var i=0; i<request.imageUrls.length; i++) {
                    var url = request.imageUrls[i];
                    if (url.match(reg_name)) {
                        downloadImage(url, RegExp.$1);
                    }
                }

                // popup.html側への応答
                sendResponse({
                    numImages: request.imageUrls.length,
                });

            }

        }
    );

});
