
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
    let form = login; // your current form is the login form

    if (form) {
        const email = form.querySelector('.email');
        const password = form.querySelector('.password');

        if (!email.value.trim() || !password.value.trim()) {
            message('Please fill in both email and password.');
            return;
        }

        // Optional: check for valid email format
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email.value)) {
            message('Invalid email format.');
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