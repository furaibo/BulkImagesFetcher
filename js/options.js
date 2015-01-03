/*
 * options.htmlの設定画面に関する即時関数
 */

// 即時関数
$(function(){

    // localStorageのキー
    var key = "BulkImagesFetcherConfig"; 

    // localstorageに値が設定されている場合の処理
    var str = localStorage.getItem(key)
    if (str !== null) {

        // 保存されている内容を取得する
        var obj = JSON.parse(str);

        // テキストボックスへ値を入れる
        if (obj["height_lower"] !== null) { $("#default_height_lower").val(obj["height_lower"]); }
        if (obj["height_upper"] !== null) { $("#default_height_upper").val(obj["height_upper"]); }
        if (obj["width_lower"]  !== null) { $("#default_width_lower").val(obj["width_lower"]); }
        if (obj["width_lower"]  !== null) { $("#default_width_upper").val(obj["width_upper"]); }

        // localstorageに値が設定されていない場合の処理
    } else {

        // 初期設定
        var obj = {
            "height_lower" : 100,
            "height_upper" : 1000,
            "width_lower"  : 100,
            "width_upper"  : 1000
        }

        // localStorageへ設定を保存する
        var local_str = JSON.stringify(obj);
        localStorage.setItem(key, local_str);

        // 画像のサイズのデフォルト値を入れる
        $("#default_height_lower").val(obj["height_lower"]);
        $("#default_height_upper").val(obj["height_upper"]);
        $("#default_width_lower").val(obj["width_lower"]);
        $("#default_width_upper").val(obj["width_upper"]);
    }


    /*
     *  関数定義
     */

    // 全角数字でない不正な文字を削除する
    jQuery.removeInvalidChar = function() {

        // 正規表現
        var reg_zero = new RegExp("^0*([1-9]*[0-9]+)$");

        // 画像の幅・高さ
        var height_lower = $("#default_height_lower").val();
        var height_upper = $("#default_height_upper").val();
        var width_lower  = $("#default_width_lower").val();
        var width_upper  = $("#default_width_upper").val();

        // 数値が指定されていない場合
        if (height_lower == "") {
            height_lower = "0";
        }
        if (width_lower == "") {
            width_lower = "0";
        }

        // 半角数字以外の文字を削除する
        height_lower = height_lower.match(/\d/g).join("");
        height_upper = height_upper.match(/\d/g).join("");
        width_lower  = width_lower.match(/\d/g).join("");
        width_upper  = width_upper.match(/\d/g).join("");

        // 先頭の0を削除する
        if (height_lower !== "" && height_lower.match(reg_zero)) {
            height_lower = RegExp.$1;
        }
        if (height_upper !== "" && height_upper.match(reg_zero)) {
            height_upper = RegExp.$1;
        }
        if (width_lower !== "" && width_lower.match(reg_zero)) {
            width_lower = RegExp.$1;
        }
        if (width_upper !== "" && width_upper.match(reg_zero)) {
            width_upper = RegExp.$1;
        }

        // 値を代入する
        $("#default_height_lower").val(height_lower);
        $("#default_height_upper").val(height_upper);
        $("#default_width_lower").val(width_lower);
        $("#default_width_upper").val(width_upper);

    };


    /*
     *  イベント定義
     */
    // 画像の縦サイズの値が変化した時の処理
    $("#default_height_lower").change(function(){

        // 画像の高さの下限・上限
        var height_lower = parseInt($("#default_height_lower").val());
        var height_upper = parseInt($("#default_height_upper").val());

        // 画像の高さについてチェック
        if (height_lower < 0) {
            $(this).val(0);
        }
        if (height_lower > height_upper) {
            $(this).val(height_upper);
        }

        // 不正な文字を取り除く
        $.removeInvalidChar();

    });

    $("#default_height_upper").change(function(){

        // 画像の高さの下限・上限
        var height_lower = parseInt($("#default_height_lower").val());
        var height_upper = parseInt($("#default_height_upper").val());

        // 画像の高さについてチェック
        if (height_upper < 0) {
            $(this).val(0);
        }
        if (height_lower > height_upper) {
            $(this).val(height_lower);
        }

        // 不正な文字を取り除く
        $.removeInvalidChar();

    });

    $("#default_width_lower").change(function(){

        // 画像の幅の下限・上限
        var width_lower  = parseInt($("#default_width_lower").val());
        var width_upper  = parseInt($("#default_width_upper").val());

        // 画像の幅についてチェック
        if (width_lower < 0) {
            $(this).val(0);
        }
        if (width_lower > width_upper) {
            $(this).val(width_upper);
        }

        // 不正な文字を取り除く
        $.removeInvalidChar();

    });

    $("#default_width_upper").change(function(){

        // 画像の幅の下限・上限
        var width_lower  = parseInt($("#default_width_lower").val());
        var width_upper  = parseInt($("#default_width_upper").val());

        // 画像の幅についてチェック
        if (width_upper < 0) {
            $(this).val(0);
        }
        if (width_lower > width_upper) {
            $(this).val(width_lower);
        }

        // 不正な文字を取り除く
        $.removeInvalidChar();

    });

    // 変更ボタン押下時の実行内容
    $("#default_change_size").click(function(){

        // localStorageのキー
        var key = "BulkImagesFetcherConfig"; 

        // 不正な文字を取り除く
        $.removeInvalidChar();

        // JSONオブジェクト
        var obj = {};

        // フォーム内の値の取得
        obj["height_lower"] = $("#default_height_lower").val();
        obj["height_upper"] = $("#default_height_upper").val();
        obj["width_lower"]  = $("#default_width_lower").val();
        obj["width_upper"]  = $("#default_width_upper").val();

        // localStorageへ設定を保存する
        var local_str = JSON.stringify(obj);
        localStorage.setItem(key, local_str);
    });

})();
