
const allItems = document.querySelectorAll('.user-lists');
const middleItems = Array.from(allItems).slice(1, -1);  // Skip first and last

middleItems.forEach(item => {
    item.addEventListener('click', () => {
        console.log('Clicked:', item.textContent);
    });
});