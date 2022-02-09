function myFunction() {
  var nav_element = document.getElementById("myTopnav");
  var ghost_element = document.getElementById("ghost")
  if (nav_element.className === "topnav") {
    nav_element.className += " responsiveNavBar";
    //ghost_element.style.height = "0px";
  } 
  else {
    nav_element.className = "topnav";
    ghost_element.style = "";
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


// Tentativa de corrigir pos navbar em hyperlink
//window.addEventListener('load', function () {
//  if (String(window.location.href).includes("#")){
//    console.log("structure loaded")
//    window.scrollBy(0, -100)
//  };
//})