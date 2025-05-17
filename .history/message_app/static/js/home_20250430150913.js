
const allItems = document.querySelectorAll('.user_lists');
const middleItems = Array.from(allItems);
const wrap_right = document.querySelector(".wrap_right");
const to_user = document.querySelector(".to_user");
const messageBox = document.getElementById('messageBox');
const chatForm = document.querySelector('.chat_container');
const chatList = document.querySelector('.chat_box');
let selected_user = null;

middleItems.forEach(item => {
    item.addEventListener('click', () => {
        console.log('Clicked:', item.textContent);
        selected_user = item.textContent.trim().toLowerCase(); 
        localStorage.setItem("selected_user", selected_user);
        allItems.forEach(i => i.style.backgroundColor = '');
        allItems.forEach(i => i.style.color = '');
        item.style.backgroundColor = 'white';
        item.style.color = 'black';
        wrap_right.classList.remove('show');
        void wrap_right.offsetWidth; 

        wrap_right.classList.add('show');
        to_user.innerHTML = item.textContent;

        fetch(`/chat_history/${selected_user}`)
            .then(response => response.json())
            .then(data => {
                data.forEach(msg => {
                    const li = document.createElement('li');
                    li.textContent = msg.message;

                    if (msg.sender === "{{ username }}") {
                        li.classList.add('current_user');
                        console.log( "{{ username }}");
                    } else {
                        li.classList.add('other_user');
                        console.log( "no");
                        console.log( `{{ username }}`);
                    }

                    chatList.appendChild(li);
                });
            });
    });
});
window.addEventListener('load', () => {
    const savedUser = localStorage.getItem("selected_user");
    if (savedUser) {
        // Simulate click on that user
        middleItems.forEach(item => {
            if (item.textContent.trim().toLowerCase() === savedUser) {
                item.click(); // triggers all the same logic
            }
        });
    }
});


messageBox.addEventListener('input', () => {
    messageBox.style.height = 'auto'; // Reset height
    messageBox.style.height = messageBox.scrollHeight + 'px'; // Expand to fit
});

function current_user_sent() {
    const message = messageBox.value.trim();
    if (message && selected_user) {
        socket.emit('send_private_message', {
            message: message,
            sender: current_user,
            receiver: selected_user
        });
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

