(function () {
    // 「保存」ボタン押下時に呼び出されます。
    var btnSave_onclick = function (event) {
      var $form = $("#form");
      $form.attr("action", "/shop/regist/confirm");
      $form.submit();
    };
   
    // 「読み出し」ボタン押下時に呼び出されます。
    var btnRead_onclick = function (event) {
      var $form = $("#form");
      $form.attr("action", "/shop/regist/input");
      $form.submit();
    };
   
    // ドキュメント読み込み完了時に呼び出されます。
    var document_onready = function (event) {
      $("#btn-save").on("click", btnSave_onclick);
      $("#btn-read").on("click", btnRead_onclick).focus();
    };
   
    $(document).ready(document_onready);
  })();
