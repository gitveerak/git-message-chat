
const allItems = document.querySelectorAll('.user_lists');
const middleItems = Array.from(allItems);

middleItems.forEach(item => {
    item.addEventListener('click', () => {
        console.log('Clicked:', item.textContent);
        item.style.backgroundColor = 'lightblue';
    });
});