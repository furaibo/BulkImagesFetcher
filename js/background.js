
$(function(){

    // 画像のURLを格納する配列
    var imageSrc;
    var urlBuffer = [];

    //
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            //
            if (request.msg == "prepare" && request.url != "") {
         
                // HTML取得
                var html = getHtmlString(request.url);

                // 画像URLを格納する
                imageSrc = $(html).find("img").map(function(){
                    return $(this).attr("src");
                });

                // popup側への応答
                sendResponse({
                    numImages: imageSrc.length
                });

            //
            } else if (request.msg == "proceed") {

                Array.prototype.push.apply(urlBuffer, imageSrc);
                sendResponse({
                    restImages: urlBuffer.length
                });

            //
            } else if (request.msg == "remain") {
                
            }

        }
    );

});
