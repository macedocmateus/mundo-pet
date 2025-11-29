const newSchedule = document.getElementById('new-schedule')
let modal = null

function createModal() {
    const dialog = document.createElement('dialog')
    dialog.id = 'schedule-modal'
    dialog.classList.add('modal')

    dialog.innerHTML = `
        <div class="modal-content">
            <img src="./assets/close.svg" class="close-modal" id="close-modal" alt="Ícone de fechar janela"/>
        
            <div class="modal-header">
                <h2>Agende um atendimento</h2>
                <p>Preencha os dados do cliente para realizar o agendamento:</p>
            </div>

            <form class="modal-form" id="schedule-form">
                <div class="form-group">
                    <label for="input-customer-name">Nome do tutor</label>
                    <div class="input-wrapper">
                        <img src="./assets/user.svg" alt="Ícone de usuário">
                        <input type="text" id="input-customer-name" name="customerName" placeholder="Helena Souza" required>
                    </div>
                </div>

                <div class="form-group">
                    <label for="input-pet-name">Nome do pet</label>
                    <div class="input-wrapper">
                        <img src="./assets/pet-paw.svg" alt="Ícone de pata">
                        <input type="text" id="input-pet-name" name="petName" placeholder="Cheddar" required>
                    </div>
                </div>

                <div class="form-group">
                    <label for="input-phone-number">Telefone</label>
                    <div class="input-wrapper">
                        <img src="./assets/phone.svg" alt="Ícone de telefone">
                        <input type="tel" id="input-phone-number" name="phoneNumber" placeholder="(00) 0 0000-0000" required>
                    </div>
                </div>

                <div class="form-group">
                    <label for="input-description">Descrição do serviço</label>
                    <textarea id="input-description" name="descriptionActivity" placeholder="Banho e tosa" required></textarea>
                </div>

                <div class="form-group">
                    <label for="input-date">Data</label>
                    <div class="input-wrapper">
                        <img src="./assets/calendar.svg" alt="Ícone de calendário">
                        <input type="date" class="input-date" id="input-date" name="date" placeholder="01/01/2025" required>
                        <img src="./assets/arrow-down.svg" alt="Ícone de seta apontando para baixo">
                    </div>
                </div>

                <div class="form-group">
                    <label for="input-hour">Hora</label>
                    <div class="input-wrapper">
                        <img src="./assets/clock-circle.svg" alt="Ícone de relógio">
                        <input type="time" class="input-hour" id="input-hour" name="hour" placeholder="12:00" required>
                        <img src="./assets/arrow-down.svg" alt="Ícone de seta apontando para baixo">
                    </div>
                </div>
                <div class="modal-actions">
                    <button type="submit" class="btn-save" id="btn-save">Agendar</button>
                </div>
            </form>
        </div>
    `

    document.body.appendChild(dialog)
    return dialog
}

function openModal() {
    if (!modal) {
        modal = createModal()
        modalEvents()
    }
    modal.showModal()
}

function closeModal() {
    if (modal) {
        modal.close()
    }
}

function modalEvents() {
    const closeButton = document.getElementById('close-modal')
    const form = document.getElementById('schedule-form')

    closeButton.addEventListener('click', closeModal)

    modal.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal()
        }
    })

    form.addEventListener('submit', handleFormSubmit)
}

function handleFormSubmit(event) {
    event.preventDefault()

    const formData = new FormData(event.target)
    const scheduleData = {
        customerName: formData.get('customerName'),
        petName: formData.get('petName'),
        phoneNumber: formData.get('phoneNumber'),
        descriptionActivity: formData.get('descriptionActivity'),
        date: formData.get('date'),
        hour: formData.get('hour')
    }

    console.log('Dados do agendamento:', scheduleData)

    event.target.reset()
    closeModal()
}

newSchedule.addEventListener('click', openModal)
