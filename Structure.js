function myFunction() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += "responsive";
  } else {
    x.className = "topnav";
  }
}

$(document).scroll(function () {
  var y = $(this).scrollTop();
  if (y > 300) {
      $('#setaCima').fadeIn();
  } else {
      $('#setaCima').fadeOut();
  }

});