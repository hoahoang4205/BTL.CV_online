
$(document).ready(function () {
    "use strict";

  /*srollup button */
  var btn = $('#scrollup');

  $(window).scroll(function() {
    if ($(window).scrollTop() > 300) {
      btn.addClass('show');
    } else {
      btn.removeClass('show');
    }
  });
  
  btn.on('click', function(e) {
    e.preventDefault();
    $('html, body').animate({scrollTop:0}, '300');
  });

  

  /*--------------------- Aos animation on scroll --------------------*/
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
  




// đổi màu menu 
    var lastId,
    topMenu = $("#top-menu"),
    topMenuHeight = topMenu.outerHeight()-230,
    // All list items
    menuItems = topMenu.find("a"),
    // Anchors corresponding to menu items
    scrollItems = menuItems.map(function(){
      var item = $($(this).attr("href"));
      if (item.length) { return item; }
    });

    // Bind click handler to menu items
    // so we can get a fancy scroll animation
    menuItems.click(function(e){
    var href = $(this).attr("href"),
      offsetTop = href === "#" ? 0 : $(href).offset().top-topMenuHeight+1; // nếu href = # thì cuộn trang nếu kh thì đoạn mã này sẽ lấy phần tử trên trang mà href liên kết tới.
    $('html, body').stop().animate({ 
      scrollTop: offsetTop
    }, 300);
    e.preventDefault();
    });

    // Bind to scroll đổi màu chữ khi chuyển xuống
    $(window).scroll(function(){
    // Get container scroll position
    var fromTop = $(this).scrollTop()+topMenuHeight;

    // Get id of current scroll item
    var cur = scrollItems.map(function(){
    if ($(this).offset().top < fromTop)
      return this;
    });
    // Get the id of the current element
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