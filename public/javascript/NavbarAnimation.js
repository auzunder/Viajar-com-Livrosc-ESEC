var ANIMATEDCLASSNAME = "animated";
var ELEMENTS_SPAN = [];
var ELEMENTS = document.querySelectorAll(".HOVER");

window.onload = function () {
    ELEMENTS = document.querySelectorAll(".HOVER");
    ELEMENTS.forEach((element, index) => {
        let addAnimation = false;
        // Elements that contain the "FLASH" class, add a listener to remove
        // animation-class when the animation ends
        if (element.classList[1] == "FLASH") {
            element.addEventListener("animationend", e => {
                element.classList.remove(ANIMATEDCLASSNAME);
            });
            addAnimation = true;
        }

        // If The span element for this element does not exist in the array, add it.
        if (!ELEMENTS_SPAN[index])
            ELEMENTS_SPAN[index] = element.querySelector("span");
    
        element.addEventListener("mouseover", e => {
            ELEMENTS_SPAN[index].style.top = e.pageY - element.offsetTop - scrollY + "px";
            ELEMENTS_SPAN[index].style.left = e.pageX - element.offsetLeft + "px";
    
            // Adicionar class de animação
            if (addAnimation) element.classList.add(ANIMATEDCLASSNAME);
        });
    
        element.addEventListener("mouseout", e => {
            ELEMENTS_SPAN[index].style.top = e.pageY - element.offsetTop - scrollY + "px";
            ELEMENTS_SPAN[index].style.left = e.pageX - element.offsetLeft + "px";
        });
    });
}
