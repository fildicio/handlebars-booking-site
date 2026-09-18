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

    $("#nav-toggle").on("click", function () {
      var $btn = $(this);
      var isOpen = $btn.attr("aria-expanded") === "true";
      var next = !isOpen;

      $btn.attr("aria-expanded", next);
      $("#navbar-wrapper").toggleClass("navbar-links__wrapper-mobile", next);
    });
  });
})(jQuery);
