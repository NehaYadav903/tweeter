$(document).ready(function() {

  $('textarea').keyup(function() {
    
    let count = $(this).val().length;

    if (count <= 140) {
      $(this)
        .closest(".new-tweet")
        .find(".counter")
        .removeClass("negative-count")
        .text(140 - count);
    } else {
      $(this)
        .closest(".new-tweet")
        .find(".counter")
        .addClass("negative-count")
        .text(140 - count);
    }
  });

  const buttonToTriggerScroll = '.scroll-to-top button';
  //For toggle button to scroll upwards
  $(window).scroll(function() {
    if ($(this).scrollTop() > 20) {
      $(buttonToTriggerScroll).fadeIn();
    } else {
      $(buttonToTriggerScroll).fadeOut();
    }
  });

  $(buttonToTriggerScroll).click(function() {
    $(window).scrollTop(0);
    if ($('.new-tweet').is(':hidden')) {
      $('.new-tweet').show();
    }
    $('textarea').focus();
  });
});