const modal = document.getElementById('modal');
const modalForm = document.getElementById('modal-form');
const newScheduleBtn = document.getElementById('new-schedule');
const modalCloseBtn = document.getElementById('modal-close');

function openModal() {
    modal.showModal();
}

function closeModal() {
    modal.close();
    modalForm.reset();
}

function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(modalForm);
    const data = Object.fromEntries(formData);

    console.log('Dados do formulário:', data);

    closeModal();
}

function handleBackdropClick(event) {
    if (event.target === modal) {
        closeModal();
    }
}

newScheduleBtn.addEventListener('click', openModal);
modalCloseBtn.addEventListener('click', closeModal);
modal.addEventListener('click', handleBackdropClick);
modalForm.addEventListener('submit', handleSubmit);
