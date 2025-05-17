
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
    if(register){
        register.submit();
    }
    else if(login){
        login.submit();
    }
    else{
        message('ERROR! in the form submition');
    }
}


window.onload = function() {
    var input =document.getElementById("focus").focus();
}