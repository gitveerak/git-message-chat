
const allItems = document.querySelectorAll('.user_lists');
const middleItems = Array.from(allItems);
const wrap_right = document.querySelector(".wrap_right");

middleItems.forEach(item => {
    item.addEventListener('click', () => {
        console.log('Clicked:', item.textContent);
        allItems.forEach(i => i.style.backgroundColor = '',i.style.color = '');
        item.style.backgroundColor = 'white';
        item.style.color = 'black';

        wrap_right.classList.add('show');
        wrap_right.textContent = item.textContent;
    });
});