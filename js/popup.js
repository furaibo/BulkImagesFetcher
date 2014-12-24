/*
 * popup.htmlのボタン動作、文面の変更に関する即時関数
 */

// 即時関数
$(function(){

    /*
     *  デフォルト値の設定
     */
    // 画像のサイズのデフォルト値を入れる
    $("#vertical_lower").prop("value", 100);
    //$("#vertical_upper").prop("value", 300);
    $("#horizontal_lower").prop("value", 100);
    //$("#horizontal_upper").prop("value", 300);


    /*
     *  イベント定義
     */
    // 画像の縦サイズの入力の有無の切り替え
    $("#vertical_available").click(function(){
        if ($("#vertical_available").is(":checked")) {
            $("#vertical_lower").prop("disabled", false);
            $("#vertical_upper").prop("disabled", false);
        } else {
            $("#vertical_lower").prop("disabled", true);
            $("#vertical_upper").prop("disabled", true);
        }
    });

    // 画像の横サイズの入力の有無の切り替え
    $("#horizontal_available").click(function(){
        if ($("#horizontal_available").is(":checked")) {
            $("#horizontal_lower").prop("disabled", false);
            $("#horizontal_upper").prop("disabled", false);
        } else {
            $("#horizontal_lower").prop("disabled", true);
            $("#horizontal_upper").prop("disabled", true);
        }
    });


    /*
     *  画像サイズ
     */
    //
    // $("img #thumbnail").load(function(){
    //     $("img #thumbnail").css("opacity","0.3");
    // });
    //


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

                img.onload = function() {
                    var imgWidth  = img.width,   // 画像の幅
                        imgHeight = img.height;  // 画像の高さ
                }

                img.src = arguments[i];
            });
        }
    };

    //
    /*
    $("img").one("load", function() {
        var img = new Image();
        img.onload = function() {
            var imgWidth  = img.width,   // 画像の幅
                imgHeight = img.height;  // 画像の高さ
            $(this).prop("width",  imgWidth);
            $(this).prop("height", imgHeight);
        }
        img.src = $("img").attr("src");
        if ($(this).height() > 0) {
            $(this).css("opacity", "0.2");
        }
    }).each(function() {
        if(this.complete) $(this).load();
    });
    */


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
                var img = new Image();
                img.src = $(this).attr("src");

                var vertical_lower = $("#vertical_lower").prop("value");
                var vertical_upper = $("#vertical_upper").prop("value");
                var horizontal_lower = $("#horizontal_lower").prop("value");
                var horizontal_upper = $("#horizontal_upper").prop("value");

                if (img.height < vertical_lower) {
                    $(this).css("opacity", "0.2");
                }
                if (img.width < horizontal_lower) {
                    $(this).css("opacity", "0.2");
                }
            }).each(function() {
                if(this.complete) $(this).load();
            });


            /*
            // 画像のプリロードを行う
            $.preloadImages(imageUrls);

            // imgタグを追加する
            var imageCount = 0;
            for (i=0; i<imageUrls.length; i++) {
                if (i%3 == 0) {
                    $("#candidates").append("<tr>");
                } 
                $("#candidates").append('<td class="thumbnail_block"><img id="' + i +
                    '" class="thumbnail" src="' + imageUrls[i] + '"></td>');
                if (i%3 == 2) {
                    $("#candidates").append("</tr>");
                }
            }
            */

            return defer.promise();
        })
        
        // 残りのダウンロード予定画像の数を表示する
        .done(function() {
            var defer = $.Deferred();

            chrome.runtime.sendMessage({
                msg: "proceed"
            },
            function(response) {
                // 残りのDL画像枚数を表示する
                if (response.restImages > 0) {
                    $("#status").text("残りDL画像" + response.restImages + "枚");
                } else {
                    $("#status").text("ダウンロード可能です");
                }
            });

            return defer.promise();
        })


        // URLを表示する
        $("#current_url").text("URL : " + tab.url);

        // ダウンロードボタンを押した際の処理
        $("#start_download").click(function(){
        });

    });

})

