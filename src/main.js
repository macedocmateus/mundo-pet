"use strict"

import "./styles/global.css"
import "./styles/page.css"
import "./styles/form-modal.css"

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

// Determina o período do dia baseado no horário informado
// Recebe o horário no formato "HH:MM" e retorna: 'morning', 'afternoon' ou 'evening'
function getPeriodByHour(hour) {
    // Extrai apenas a hora (antes dos ":") e converte para número
    // Exemplo: "09:30" → split(':') → ["09", "30"] → [0] → "09" → parseInt → 9
    const hourNumber = parseInt(hour.split(':')[0]);

    // Classifica o período baseado no intervalo de horas
    if (hourNumber >= 9 && hourNumber < 13) {
        return 'morning';   // Manhã: 09h às 12h
    } else if (hourNumber >= 13 && hourNumber < 19) {
        return 'afternoon'; // Tarde: 13h às 18h
    } else {
        return 'evening';   // Noite: 19h às 21h
    }
}

// Cria o elemento HTML do agendamento
// Recebe um objeto com os dados do formulário via desestruturação
function createScheduleElement({ hour, petName, clientName, service }) {
    // Cria uma div que será o container do agendamento
    const clientDiv = document.createElement('div');
    clientDiv.classList.add('client');

    // Define o conteúdo HTML interno seguindo a estrutura do index.html
    // Se 'service' estiver vazio, exibe "Sem descrição" como fallback
    clientDiv.innerHTML = `
        <div class="client-information">
            <div class="client-description">
                <small class="hour">${hour}</small>
                <span class="pet-name">${petName}</span>
                /
                <span class="client-name">${clientName}</span>
            </div>
            <span class="activity">${service || 'Sem descrição'}</span>
        </div>

        <button type="button" class="delete-client">Remover agendamento</button>
        <div class="divider"></div>
    `;

    return clientDiv;
}

// Adiciona o elemento de agendamento na lista correta do DOM
// Recebe o elemento criado e o período ('morning', 'afternoon' ou 'evening')
function addScheduleToList(scheduleElement, period) {
    // Mapeia cada período para o seletor CSS da sua lista de clientes
    const periodSelectors = {
        morning: '.morning-card .clients',
        afternoon: '.afternoon-card .clients',
        evening: '.evening-card .clients'
    };

    // Busca a lista correspondente ao período e adiciona o elemento
    const clientsList = document.querySelector(periodSelectors[period]);
    clientsList.appendChild(scheduleElement);
}

// Manipula o envio do formulário de agendamento
function handleSubmit(event) {
    // Previne o comportamento padrão do formulário (recarregar a página)
    event.preventDefault();

    // Captura todos os valores dos inputs do formulário
    // FormData coleta automaticamente todos os campos que possuem atributo 'name'
    const formData = new FormData(modalForm);

    // Converte o FormData para um objeto JavaScript simples
    // Resultado: { clientName: "...", petName: "...", phone: "...", service: "...", date: "...", hour: "..." }
    const data = Object.fromEntries(formData);

    // 1. Identifica em qual período o agendamento deve ser inserido
    const period = getPeriodByHour(data.hour);

    // 2. Cria o elemento HTML com os dados do agendamento
    const scheduleElement = createScheduleElement(data);

    // 3. Insere o elemento na lista correta (manhã, tarde ou noite)
    addScheduleToList(scheduleElement, period);

    // 4. Fecha o modal e limpa o formulário
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
