
$(document).ready(function () {
    "use strict";

  /*srollup button */
  var btn = $('#scrollup');

  $(window).scroll(function() {
    if ($(window).scrollTop() > 0) {
      btn.addClass('show');
    } else {
      btn.removeClass('show');
    }
  });
  
  btn.on('click', function(e) {
    e.preventDefault();
    $('html, body').animate({scrollTop:0}, '300');
  });

  AOS.init({
    once: true
  });




 // percent skill
  $(document).ready(function() {
    startAnimation();
    function startAnimation(){
    $('.progress').each(function(){
    var width = $(this).attr('data-percent');
    // console.log(width);
    $(this).find('.progress-done').css('width', width); 
    });
    }                
  });
  




    var lastId,
    topMenu = $("#top-menu"),
    topMenuHeight = topMenu.outerHeight()-220,
    menuItems = topMenu.find("a"),
    scrollItems = menuItems.map(function(){
      var item = $($(this).attr("href"));
      if (item.length) { return item; }
    });
    btn.on('click', function(e) {
      e.preventDefault();
      $('html, body').animate({scrollTop:0}, '300');
    });
    menuItems.click(function(e){
    var href = $(this).attr("href"),
      offsetTop = href === "#" ? 0 : $(href).fadeIn(); ; 
    $('html, body').stop().animate({ 
      scrollTop: offsetTop
    }, 300);
    e.preventDefault();
    });

    
    $(window).scroll(function(){
    // Get container scroll position
    var fromTop = $(this).scrollTop()+topMenuHeight;

    // Get id of current scroll item
    var cur = scrollItems.map(function(){
    if ($(this).offset().top < fromTop)
      return this;
    });
   
    cur = cur[cur.length-1];
    var id = cur && cur.length ? cur[0].id : "";

    if (lastId !== id) {
      lastId = id;
      // Set/remove active class
      menuItems
        .parent().removeClass("active")
        .end().filter("[href='#"+id+"']").parent().addClass("active");
    }                   
  });
});
