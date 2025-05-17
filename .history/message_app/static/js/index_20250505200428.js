
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
    const login = document.querySelector('.log');
    const register = document.querySelector('.reg');
    let form = register || login;

    if (form) {
        const email = form.querySelector('#email');
        const password = form.querySelector('#password');

        if (!email.value.trim() || !password.value.trim()) {
            message('Please fill in all required fields!');
            return;
        }
        form.submit();
    } else {
        message('ERROR! No form found.');
    }
}



window.onload = function() {
    var input =document.getElementById("focus").focus();
}