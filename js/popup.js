/*
 * popup.htmlのボタン動作、文面の変更に関する即時関数
 */

// 即時関数
$(function(){

    // 現在開いているWebページのURLを取得する
    chrome.tabs.getSelected(window.id, function(tab){

        // ダウンロード処理前の準備
        var prepareDownload = function() {
            chrome.runtime.sendMessage({
                msg: "prepare",
                url: tab.url
            },
            function(response) {
                // ダウンロード可能な画像の枚数の確認を行う
                $("#num_of_images").text("画像が" + response.numImages + "枚見つかりました");
            });
        }

        // 画像ダウンロード処理
        var proceedDownload = function() {
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
        }
       
        // ダウンロード準備
        prepareDownload();

        // URLを表示する
        $("#current_url").text("URL : " + tab.url);

        // ダウンロードボタンを押した際の処理
        $("#start_download").click(function(){
            proceedDownload();
        });

    });

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

    // DLが終了したら音を鳴らす
    /*
    $("#start_download").click(function(){
        if ($("#notice").is(":checked")) {
            var audio = new Audio("../audio/beep.mp3");
            audio.play();
        }
    });
    */

}, window);

