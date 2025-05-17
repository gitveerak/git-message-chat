
const allItems = document.querySelectorAll('.user_lists');
const middleItems = Array.from(allItems);
const wrap_right = document.querySelector".wrap_right");

middleItems.forEach(item => {
    item.addEventListener('click', () => {
        console.log('Clicked:', item.textContent);
        item.style.backgroundColor = 'lightblue';
        wrap_right.style.display='flex';
    });
});