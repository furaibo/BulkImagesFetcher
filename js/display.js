/*
 * popup.htmlのボタン動作、文面の変更に関する即時関数
 */

$(function(){

    //var sourceUrl = "http://www.yahoo.co.jp";
    var sourceUrl = "http://js.studio-kingdom.com/jquery/ajax/ajax"

    // 現在開いているWebページのURLを取得する
    chrome.tabs.getSelected(window.id, function(tab) {
        $("#current_url").text("URL : " + tab.url);
    });

    // ダウンロード可能な画像の枚数の確認を行う
    $("#num_of_images").text("画像が00枚見つかりました");

    // ダウンロードの状態について確認
    $("#status").text("ダウンロード可能です");

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
    $("#start_download").click(function(){
        if ($("#notice").is(":checked")) {
            var audio = new Audio("../audio/beep.mp3");
            audio.play();
        }
    });

}, window);

