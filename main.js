const modal = document.getElementById('modal');
const newSchedule = document.getElementById('new-schedule');
const closeModal = document.getElementById('close-modal')

newSchedule.addEventListener('click', () => {
    modal.showModal();
});

closeModal.addEventListener('click', () => {
    modal.close();
})

modal.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.close();
    }
})
