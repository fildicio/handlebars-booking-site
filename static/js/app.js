(function ($) {
  "use strict";

  $(function () {
    $("#footer-year").text(new Date().getFullYear());

    $("#home-subscription").on("click", function (e) {
       e.preventDefault();

      var inputTyped = $("#footer-email").val();
      var status = $(".footer__status");


      status.text("")
      setTimeout( function () {
        status.text("Thanks! Confirmation sent to " + inputTyped);
      }, 100);
       $("#footer-email").val("");
    });
  });
})(jQuery);
