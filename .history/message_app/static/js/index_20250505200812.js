
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
    const login =document.querySelector('form.log');
    const register =document.querySelector('form.reg');
    if(register){
        register.submit();
    }
    else if(login){
        const email = form.querySelector('.email');
        const password = form.querySelector('.password');

        if (!email.value.trim() || !password.value.trim()) {
            message('Please fill in all required fields!');
            return;
        }
        form.submit();
    }
    else{
        message('ERROR! in the form submition');
    }
}


window.onload = function() {
    var input =document.getElementById("focus").focus();
}