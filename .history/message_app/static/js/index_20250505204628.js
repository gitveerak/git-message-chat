
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

function log_submit() {
    const login = document.querySelector('.log');

    if (login) {
        const email = form.querySelector('.email');
        const password = form.querySelector('.password');

        if (!email.value.trim() || !password.value.trim()) {
            message('Please fill in both email and password.');
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email.value)) {
            message('Invalid email format.');
            return;
        }

        login.submit();
    } else {
        message('ERROR! No form found.');
    }
}

function reg_submit() {
    const register = document.querySelector('.reg');

    if (register) {
        const email = form.querySelector('.email');
        const username = form.querySelector('.username');
        const password = form.querySelector('.password');

        if (!email.value.trim() && !password.value.trim() && !username.value.trim()) {
            message('Please fill in both email and password.');
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email.value)) {
            message('Invalid email format.');
            return;
        }

        register.submit();
    } else {
        message('ERROR! No form found.');
    }
}


window.onload = function() {
    var input =document.getElementById("focus").focus();
}