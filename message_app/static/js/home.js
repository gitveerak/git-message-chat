// for message Notification for info
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

        // for retrive the chat_history from db & folder
        fetch(`/chat_history/${selected_user}`)
        .then(response => response.json())
        .then(data => {
            const chatBox = document.querySelector('.chat_box');
            chatBox.innerHTML = '';

            data.forEach(msg => {
                const li = document.createElement('li');
                li.id = `msg-${msg._id}`;

                if (msg.sender === current_user) {
                    li.classList.add('current_user');
                    li.addEventListener('dblclick', () => {
                        const confirmed = confirm("Do you want to delete this message?");
                        if (confirmed) {
                            socket.emit('delete_private_message', { 
                                msg_id: msg._id,
                                sender: current_user,
                                receiver: selected_user 
                            });
                        }
                    });
                } else {
                    li.classList.add('other_user');
                }
                if (msg.message) {                  // Render text message
                    li.textContent = msg.message;
    
                } else if (msg.filename) {              // Render private image
                    const img = document.createElement('img');
                    img.src = `/private_image/${msg.filename}`;
                    img.style.maxWidth = '300px';
                    img.style.borderRadius = '10px';
                    li.style.backgroundColor = 'transparent';
                    li.appendChild(img);
                }

                chatBox.appendChild(li);
            });
        });

    });
});

// for show last entry when left & load or reload function to the entire page
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

// for message input box to expand in wrap_right
messageBox.addEventListener('input', () => {
    messageBox.style.height = 'auto'; // Reset height
    messageBox.style.height = messageBox.scrollHeight + 'px'; // Expand to fit
});

// for message submition function in wrap_right
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

// for logout btn function
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

// works for laptop ( for close wrap_right)
document.addEventListener('click', function(e) {
    const a =e.target.closest('.user_lists') || e.target.closest('.wrap_right') || e.target.closest('.user_wrap');
    if(a) return
    wrap_right.classList.remove('show');
    allItems.forEach(i => i.style.backgroundColor = '');
    allItems.forEach(i => i.style.color = '');
});

// wrap_right back btn function
const x_btn = document.querySelector('.return_btn');
x_btn.addEventListener('click',()=>{
    wrap_right.classList.remove('show');
    allItems.forEach(i => i.style.backgroundColor = '');
    allItems.forEach(i => i.style.color = '');
});

// for more_btn to act as toggleBtn 
const moreBtn = document.querySelector('.more_option');
const icon = document.querySelector('.more_opt');
const more_block = document.querySelector('.more_btn');
let isOpen = false;

document.addEventListener('click', (e) => {
    if (!moreBtn.contains(e.target) && !more_block.contains(e.target)) {
        more_block.classList.remove('show');
        icon.src = moreIcon;
        icon.classList.remove('close_opt');
        isOpen = false;
    }
});
moreBtn.addEventListener('click', () => {
    isOpen = !isOpen;
    more_block.classList.toggle('show');
    icon.src = isOpen ? closeIcon : moreIcon;
    if (isOpen) {
        icon.classList.add('close_opt');
    } else {
        icon.classList.remove('close_opt');
    }
});


// for image submition to folder & show it in wrap_right
document.getElementById('imageInput').addEventListener('change', function () {
    const file = this.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);
    formData.append('sender', current_user);   // make sure defined
    formData.append('receiver', selected_user); // make sure defined

    fetch('/upload_image', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data.image_path) {
            socket.emit('send_image_url', {
                sender: current_user,
                receiver: selected_user,
                image_path: data.image_path  // only the path, not full URL
            });

            const li = document.createElement('li');
            const img = document.createElement('img');
            img.src = `/private_image/${data.filename}`; // Flask route will validate access
            img.style.maxWidth = '300px';
            img.style.borderRadius = '10px';
            li.appendChild(img);
            chatList.appendChild(li);
        }
    });
});
