
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

function submit() {
    const login =document.querySelector('.log');
    const register =document.querySelector('.reg');
    if(login){
        login.submit();
    }
    if(register){
        register.submit();
    }
}


window.onload = function() {
    var input =document.getElementById("focus").focus();
}