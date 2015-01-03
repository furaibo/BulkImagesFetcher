/*
 * popup.htmlのボタン動作、文面の変更、画像ダウンロードに関する即時関数
 */

// 即時関数
$(function(){

    // 現在開いているChromeタブについての処理
    chrome.tabs.getSelected(window.id, function(tab){

        // 画像URLを格納する配列
        var imageUrls = [];


        /*
         *  画像サイズフィルタでのデフォルト値の設定
         */

        // localStorageのキー
        var key = "BulkImagesFetcherConfig"; 

        // localstorageに値が設定されている場合の処理
        var str = localStorage.getItem(key)
        if (str !== null) {
            
            // 保存されている内容を取得する
            var obj = JSON.parse(str);

            // テキストボックスへ値を入れる
            if (obj["height_lower"] !== null) { $("#height_lower").val(obj["height_lower"]); }
            if (obj["height_upper"] !== null) { $("#height_upper").val(obj["height_upper"]); }
            if (obj["width_lower"]  !== null) { $("#width_lower").val(obj["width_lower"]); }
            if (obj["width_lower"]  !== null) { $("#width_upper").val(obj["width_upper"]); }

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
            $("#height_lower").val(obj["height_lower"]);
            $("#height_upper").val(obj["height_upper"]);
            $("#width_lower").val(obj["width_lower"]);
            $("#width_upper").val(obj["width_upper"]);
        }


        /*
         *  関数定義
         */

        // 画像をプリロードする
        jQuery.preloadImages = function() {
            for(var i=0; i<arguments.length; i++){
                $("img", self).each(function(){
                    var img = new Image();
                    img.src = arguments[i];
                });
            }
        };

        // 全角数字でない不正な文字を削除する
        jQuery.removeInvalidChar = function() {

            // 正規表現
            var reg_zero = new RegExp("^0*([1-9]*[0-9]+)$");

            // 画像の幅・高さ
            var height_lower = $("#height_lower").val();
            var height_upper = $("#height_upper").val();
            var width_lower  = $("#width_lower").val();
            var width_upper  = $("#width_upper").val();

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
            $("#height_lower").val(height_lower);
            $("#height_upper").val(height_upper);
            $("#width_lower").val(width_lower);
            $("#width_upper").val(width_upper);

        };

        // サイズによるダウンロード候補画像のフィルタリング
        jQuery.filterCandidates = function() {

            // 画像の幅・高さ
            var height_lower = parseInt($("#height_lower").val());
            var height_upper = parseInt($("#height_upper").val());
            var width_lower  = parseInt($("#width_lower").val());
            var width_upper  = parseInt($("#width_upper").val());

            // 透明度を一旦元に戻す
            $("img.thumbnail").each(function(){
                $(this).css("opacity", 1.0);
            });

            // サイズによるフィルタリング
            $("img.thumbnail").each(function(){
                var img = new Image();
                var src = $(this).attr("src");
                img.src = src;

                // 縦サイズでのフィルタリング
                if ($("#height_available").is(":checked")) {
                    if (height_lower !== "" && img.height < height_lower) {
                        $(this).css("opacity", 0.2);
                    }
                    if (height_upper !== "" && img.height > height_upper) {
                        $(this).css("opacity", 0.2);
                    }
                }

                // 横サイズでのフィルタリング
                if ($("#width_available").is(":checked")) {
                    if (width_lower !== "" && img.width < width_lower) {
                        $(this).css("opacity", 0.2);
                    }
                    if (width_upper !== "" && img.width > width_upper) {
                        $(this).css("opacity", 0.2);
                    }
                }
            });

        };
 

        /*
         * 画像ダウンロード処理を行う即時関数
         */
        (function() {
            var defer = $.Deferred();

            // 現在のURLの表示
            $("#current_url").text("URL : " + tab.url);

            // ダウンロード準備
            chrome.runtime.sendMessage({
                msg: "prepare",
                url: tab.url
            },
            function(response) {
                // ダウンロード可能な画像の枚数の確認を行う
                $("#num_of_images").text("画像が" + response.numImages + "枚見つかりました");
                if (response.numImages == 0) {
                    $("#status").text("ダウンロード可能な画像がありません");
                }
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

                // 画像の幅・高さ
                var height_lower = parseInt($("#height_lower").val());
                var height_upper = parseInt($("#height_upper").val());
                var width_lower  = parseInt($("#width_lower").val());
                var width_upper  = parseInt($("#width_upper").val());

                // 縦サイズでのフィルタリング
                if ($("#height_available").is(":checked")) {
                    if (height_lower != "" && img.height < height_lower) {
                        $(this).css("opacity", 0.2);
                    }
                    if (height_upper != "" && img.height > height_upper) {
                        $(this).css("opacity", 0.2);
                    }
                }

                // 横サイズでのフィルタリング
                if ($("#width_available").is(":checked")) {
                    if (width_lower != "" && img.width < width_lower) {
                        $(this).css("opacity", 0.2);
                    }
                    if (width_upper != "" && img.width > width_upper) {
                        $(this).css("opacity", 0.2);
                    }
                }

            }).each(function() {
                if(this.complete) $(this).load();
            });

            return defer.promise();

        });


        /*
         *  イベント定義
         */
        // 画像の縦サイズの値が変化した時の処理
        $("#height_lower").change(function(){

            // 画像の高さの下限・上限
            var height_lower = parseInt($("#height_lower").val());
            var height_upper = parseInt($("#height_upper").val());

            // 画像の高さについてチェック
            if (height_lower < 0) {
                $(this).val(0);
                $("#size_error").text("下限値に0以下の値は指定できません");
            }
            if (height_lower > height_upper) {
                $(this).val(height_upper);
                $("#size_error").text("下限値に上限値を超える値は指定できません");
            }

            // 不正な文字を取り除く
            $.removeInvalidChar();

            // 事前に設定した画像の高さ・幅で候補画像のフィルタリングを行う
            $.filterCandidates();
        });

        $("#height_upper").change(function(){

            // 画像の高さの下限・上限
            var height_lower = parseInt($("#height_lower").val());
            var height_upper = parseInt($("#height_upper").val());

            // 画像の高さについてチェック
            if (height_upper < 0) {
                $(this).val(0);
                $("#size_error").text("上限値に0以下の値は指定できません");
            }
            if (height_lower > height_upper) {
                $(this).val(height_lower);
                $("#size_error").text("上限値に下限値を下回る値は指定できません");
            }

            // 不正な文字を取り除く
            $.removeInvalidChar();

            // 事前に設定した画像の高さ・幅で候補画像のフィルタリングを行う
            $.filterCandidates();
        });

        $("#width_lower").change(function(){

            // 画像の幅の下限・上限
            var width_lower  = parseInt($("#width_lower").val());
            var width_upper  = parseInt($("#width_upper").val());

            // 画像の幅についてチェック
            if (width_lower < 0) {
                $(this).val(0);
                $("#size_error").text("下限値に0以下の値は指定できません");
            }
            if (width_lower > width_upper) {
                $(this).val(width_upper);
                $("#size_error").text("下限値に上限値を超える値は指定できません");
            }

            // 不正な文字を取り除く
            $.removeInvalidChar();

            // 事前に設定した画像の高さ・幅で候補画像のフィルタリングを行う
            $.filterCandidates();
        });

        $("#width_upper").change(function(){

            // 画像の幅の下限・上限
            var width_lower  = parseInt($("#width_lower").val());
            var width_upper  = parseInt($("#width_upper").val());

            // 画像の幅についてチェック
            if (width_upper < 0) {
                $(this).val(0);
                $("#size_error").text("上限値に0以下の値は指定できません");
            }
            if (width_lower > width_upper) {
                $(this).val(width_lower);
                $("#size_error").text("上限値に下限値を下回る値は指定できません");
            }

            // 不正な文字を取り除く
            $.removeInvalidChar();

            // 事前に設定した画像の高さ・幅で候補画像のフィルタリングを行う
            $.filterCandidates();
        });


        // 画像の縦サイズの入力の有無の切り替え
        $("#height_available").click(function(){
            // チェックボックスがチェックされているかで処理を分岐
            if ($("#height_available").is(":checked")) {
                $("#height_lower").prop("disabled", false);
                $("#height_upper").prop("disabled", false);
            } else {
                $("#height_lower").prop("disabled", true);
                $("#height_upper").prop("disabled", true);
            }

            // 不正な文字を取り除く
            $.removeInvalidChar();

            // 事前に設定した画像の高さ・幅で候補画像のフィルタリングを行う
            $.filterCandidates();
        });

        // 画像の横サイズの入力の有無の切り替え
        $("#width_available").click(function(){
            // チェックボックスがチェックされているかで処理を分岐
            if ($("#width_available").is(":checked")) {
                $("#width_lower").prop("disabled", false);
                $("#width_upper").prop("disabled", false);
            } else {
                $("#width_lower").prop("disabled", true);
                $("#width_upper").prop("disabled", true);
            }

            // 不正な文字を取り除く
            $.removeInvalidChar();

            // 事前に設定した画像の高さ・幅で候補画像のフィルタリングを行う
            $.filterCandidates();
        });

        // DL候補画像のDLの切り替え
        $(document).on("click", "img.thumbnail", function(imageUrls){
            // 画像元のURL
            var src = $(this).prop("src");

            // 透明度の設定
            if ($(this).css("opacity") == 1.0) {
                $(this).fadeTo(500, 0.2);  // フェードアウト
            } else {
                $(this).fadeTo(500, 1.0);  // フェードイン
            }
        });

        // ダウンロードボタンを押した際の処理
        $("#start_download").click(function(){

            // DLが終了したら音を鳴らす
            /*
            $("#start_download").click(function(){
                if ($("#notice").is(":checked")) {
                    var audio = new Audio("../audio/beep.mp3");
                    audio.play();
                }
            });
            */

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

    });

})();
