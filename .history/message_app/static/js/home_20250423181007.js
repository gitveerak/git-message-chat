
const allItems = document.querySelectorAll('.user_lists');
const middleItems = Array.from(allItems);

middleItems.forEach(item => {
    item.addEventListener('click', () => {
        output.textContent = 'You clicked: ' + item.textContent;
        item.style.backgroundColor = 'lightblue';
    });
});