function myFunction() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += "responsive";
  } else {
    x.className = "topnav";
  }
}

window.onload = function () {
}
var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.4.1.min.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

$(document).scroll(function () {
  var y = $(this).scrollTop();
  if (y > 300) {
      $('#setaCima').fadeIn();
  } else {
      $('#setaCima').fadeOut();
  }

});