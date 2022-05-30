
// Função para colapsar a navbar (adicionar a class "responsiveNavBar")
function myFunction() {
  var nav_element = document.getElementById("myTopnav");
  if (nav_element.className === "topnav") {
    nav_element.className += " responsiveNavBar";
  } 
  else {
    nav_element.className = "topnav";
    ghost_element.style = "";
  }
}


// jQuery para aparecer e desapareçer a seta de voltar ao topo aos 300px de scroll
$(document).scroll(function () {
  var y = $(this).scrollTop();
  if (y > 300) {
      $('#setaCima').fadeIn();
  } else {
      $('#setaCima').fadeOut();
  }

});
