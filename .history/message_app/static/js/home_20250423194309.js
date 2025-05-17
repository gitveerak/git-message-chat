
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
const wrapper = document.querySelector('.input-wrapper');

messageBox.addEventListener('input', () => {
    messageBox.style.height = 'auto';
    const newHeight = messageBox.scrollHeight;
    messageBox.style.height = newHeight + 'px';
    messageBox.style.transform = `translateY(-${newHeight - 40}px)`; // move it upward (40 = initial height)
});

