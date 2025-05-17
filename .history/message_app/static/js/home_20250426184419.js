
const allItems = document.querySelectorAll('.user_lists');
const middleItems = Array.from(allItems);
const wrap_right = document.querySelector(".wrap_right");
const to_user = document.querySelector(".to_user");

middleItems.forEach(item => {
    item.addEventListener('click', () => {
        console.log('Clicked:', item.textContent);
        allItems.forEach(i => i.style.backgroundColor = '');
        allItems.forEach(i => i.style.color = '');
        item.style.backgroundColor = 'white';
        item.style.color = 'black';
        wrap_right.classList.remove('show');
        void wrap_right.offsetWidth; 

        wrap_right.classList.add('show');
        to_user.innerHTML = item.textContent;
    });
});

const messageBox = document.getElementById('messageBox');

messageBox.addEventListener('input', () => {
    messageBox.style.height = 'auto'; // Reset height
    messageBox.style.height = messageBox.scrollHeight + 'px'; // Expand to fit
});

const chatForm = document.querySelector('.chat_container');
const chatList = document.querySelector('.chat_box');

function current_user_sent() {
    const message = messageBox.value.trim();
    if (message !== '') {
        // Create new li for the message
        const newMessage = document.createElement('li');
        newMessage.textContent = message;
        newMessage.classList.add('current_user'); 
        chatList.appendChild(newMessage);

        // Clear the message box
        messageBox.value = '';

        // Auto-scroll to the latest message
        chatList.scrollTop = chatList.scrollHeight;
    }
}

function logout_btn(){
    fetch('/logout', {
        method: 'post',
        header: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'  
        },
    })
    .then(response => response.json())
    .then( data => {
        if (data.success){
            window.location.href ='/logout';
        }
    })
    .catch(error => console.error('Error' , error));
}


// Optional: prevent form from reloading page on submit
chatForm.addEventListener('submit', function(e) {
    e.preventDefault();
    current_user_sent();
});


let al = document.querySelector(".message");
function message(info){
    if (info){
        al.textContent = 'hai';
    }
}
message(true)