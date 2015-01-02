/*
 * popup.htmlのボタン動作、文面の変更に関する即時関数
 */

// 即時関数
$(function(){

    /*
     *  デフォルト値の設定
     */
    // 画像のサイズのデフォルト値を入れる
    $("#height_lower").prop("value", 100);
    $("#height_upper").prop("value", 1000);
    $("#width_lower").prop("value", 100);
    $("#width_upper").prop("value", 1000);


    /*
     *  イベント定義
     */
    // 画像の縦サイズの入力の有無の切り替え
    $("#height_available").click(function(){
        if ($("#height_available").is(":checked")) {
            $("#height_lower").prop("disabled", false);
            $("#height_upper").prop("disabled", false);
        } else {
            $("#height_lower").prop("disabled", true);
            $("#height_upper").prop("disabled", true);
        }
    });

    // 画像の横サイズの入力の有無の切り替え
    $("#width_available").click(function(){
        if ($("#width_available").is(":checked")) {
            $("#width_lower").prop("disabled", false);
            $("#width_upper").prop("disabled", false);
        } else {
            $("#width_lower").prop("disabled", true);
            $("#width_upper").prop("disabled", true);
        }
    });

    // DL候補画像のDLの切り替え
    $(document).on("click", "img.thumbnail", function(imageUrls){

        var src = $(this).prop("src");

        if ($(this).css("opacity") == 1.0) {
            $(this).fadeTo(500, 0.2);  // フェードアウト
        } else {
            $(this).fadeTo(500, 1.0); // フェードイン
        }
    });

    // ダウンロードボタンを押した際の処理
    $("#start_download").click(function(){

        // ダウンロード対象の画像URLを取得する
        var imageUrls = [];
        $("img.thumbnail").each(function(){
            if ($(this).css("opacity") == 1.0) {
                imageUrls.push($(this).prop("src"));
            }
        });

        // backgroundへの処理要求
        chrome.runtime.sendMessage({
            msg: "download",
            imageUrls: imageUrls
        },
        function(response) {
            if (response.numImages > 0) {
                $("#status").text("DL画像: " + response.numImages + "枚");
            }
        });

    });

    // DLが終了したら音を鳴らす
    /*
    $("#start_download").click(function(){
        if ($("#notice").is(":checked")) {
            var audio = new Audio("../audio/beep.mp3");
            audio.play();
        }
    });
    */


    /*
     *  関数定義
     */

    // 画像をプリロードする
    jQuery.preloadImages = function(){
        //var imageUrls = [];
        for(var i=0; i<arguments.length; i++){
            $("img", self).each(function(){
                var img = new Image();
                img.src = arguments[i];
            });
        }
    };


    /*
     *  バックグラウンドとの通信
     */
    // 現在開いているWebページのURLを取得する
    chrome.tabs.getSelected(window.id, function(tab){

        //
        var imageUrls = [];


        /*
         * ポップアップ画面表示時に行う処理
         */

        // 画像ダウンロード処理前の準備
        (function() {
            var defer = $.Deferred();

            chrome.runtime.sendMessage({
                msg: "prepare",
                url: tab.url
            },
            function(response) {
                // ダウンロード可能な画像の枚数の確認を行う
                $("#num_of_images").text("画像が" + response.numImages + "枚見つかりました");
                defer.resolve(response.imageUrls);
            });

            return defer.promise();

        })()

        // ダウンロードする画像の候補の一覧を表示する
        .then(function(imageUrls){
            var defer = $.Deferred();

            // 画像のプリロードを行う
            $.preloadImages(imageUrls);

            // 画像候補をテーブルに格納する
            var trTag;
            for(var i=0; i<imageUrls.length; i++) {
                if (i%3 == 0) {
                    trTag = $("<tr></tr>").appendTo("#candidates");
                }

                var tdTag = $("<td></td>").attr({
                    id: i,
                    class: "thumbnail_block"
                })
                trTag.append(tdTag);

                var imgTag = $("<img />").attr({
                    id: i,
                    class: "thumbnail",
                    src: imageUrls[i]
                })
                tdTag.append(imgTag);

            }

            // 指定サイズ未満の画像を半透明にする
            $("img").one("load", function(){

                // 画像データ
                var img = new Image();
                var src = $(this).attr("src");
                img.src = src;

                // 画像サイズ
                var height_lower = $("#height_lower").prop("value");
                var height_upper = $("#height_upper").prop("value");
                var width_lower = $("#width_lower").prop("value");
                var width_upper = $("#width_upper").prop("value");

                // 事前に設定した画像の高さ・幅で候補画像のフィルタリングを行う
                if (height_lower != "" && img.height < height_lower) {
                    $(this).css("opacity", 0.2);
                }
                else if (width_lower != "" && img.width < width_lower) {
                    $(this).css("opacity", 0.2);
                }
                else if (height_upper != "" && img.height > height_upper) {
                    $(this).css("opacity", 0.2);
                }
                else if (width_upper != "" && img.width > width_upper) {
                    $(this).css("opacity", 0.2);
                }

            }).each(function() {
                if(this.complete) $(this).load();
            });

            return defer.promise();
        })

        // URLを表示する
        $("#current_url").text("URL : " + tab.url);

    });

})

