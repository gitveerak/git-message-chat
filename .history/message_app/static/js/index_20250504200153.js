
let messageBar = document.querySelector(".message");
function message(info){
    if (info){
        messageBar.style.display= "flex";
        messageBar.textContent = info;
        setTimeout(() => { 
            messageBar.style.display= "none";
        }, 6000);
    }
}

function login_submit() {
    document.querySelector('.log').submit();
}


window.onload = function() {
    var input =document.getElementById("focus").focus();
}