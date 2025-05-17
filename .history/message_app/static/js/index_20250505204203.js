
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
    let form = login || register;

    if (form && form.classList.contains('log')) {
        const email = form.querySelector('.email');
        const password = form.querySelector('.password');

        if (!email.value.trim() || !password.value.trim()) {
            message('Please fill in both email and password.');
            return;
        }

        form.submit();
    } 
    else if (form && form.classList.contains('reg')) {
        const email1 = form.querySelector('.email');
        const username1 = form.querySelector('.username');
        const password1 = form.querySelector('.password');

        if (!username1.value.trim() || !email1.value.trim() || !password1.value.trim()) {
            message('Please fill in all fields.');
            return;
        }

        form.submit();
    } 
    else {
        message('No valid form found.');
    }
}




window.onload = function() {
    var input =document.getElementById("focus").focus();
}