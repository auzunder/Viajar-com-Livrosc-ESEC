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
            ELEMENTS_SPAN[index].style.left = e.pageX - e.offsetLeft + "px";
            ELEMENTS_SPAN[index].style.top = 100 - e.pageY - element.offsetTop + "px";
            console.log(ELEMENTS_SPAN[index])
            console.log(e)
            console.log(e.pageY)
            console.log(element.offsetTop)
            console.log(100 - e.pageY - element.offsetTop + "px")
    
            // Adicionar class de animação
            if (addAnimation) element.classList.add(ANIMATEDCLASSNAME);
        });
    
        element.addEventListener("mouseout", e => {
            ELEMENTS_SPAN[index].style.left = e.pageX - element.offsetLeft + "px";
            ELEMENTS_SPAN[index].style.top = e.pageY - element.offsetTop + "px";
        });
    });
}