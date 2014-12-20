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
                var host = request.url.split('/')[2];

                // 画像URLを格納する
                var imageSrc = [];
                $(html).find("img").each(function(){
                    var url = $(this).attr("src");
                    if (url.charAt(0) == "/") {
                        url = "http://" + host + url;
                    }
                    imageSrc.push(url);
                });

                // popup側への応答
                sendResponse({
                    numImages: imageSrc.length,
                    imageUrls: imageSrc
                });

            //
            } else if (request.msg == "proceed") {
                Array.prototype.push.apply(urlBuffer, imageSrc);

                sendResponse({
                    restImages: urlBuffer.length
                });

                //
                // ダウンロード処理
                //

            } else if (request.msg == "remain") {
                sendResponse({
                    restImages: urlBuffer.length
                });
               
            }

        }
    );

});
