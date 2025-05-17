
const allItems = document.querySelectorAll('.user_lists');
const middleItems = Array.from(allItems);

middleItems.forEach(item => {
    item.addEventListener('click', () => {
        item.style.backgroundColor = 'lightblue';
    });
});