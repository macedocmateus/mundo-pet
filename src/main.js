"use strict"

import "./styles/global.css"
import "./styles/page.css"
import "./styles/form-modal.css"
import "./styles/responsivity.css"

import dayjs from "dayjs"

const modal = document.getElementById('modal');
const modalForm = document.getElementById('modal-form');
const newScheduleBtn = document.getElementById('new-schedule');
const modalCloseBtn = document.getElementById('modal-close');
const filterDateInput = document.getElementById('filter-date');
const inputDate = document.getElementById('input-date');

// Array para armazenar todos os agendamentos
let schedules = [];

// Retorna a data de hoje formatada para o input date (YYYY-MM-DD)
function getTodayDate() {
    return dayjs().format('YYYY-MM-DD');
}

// Define a data mínima permitida nos inputs de data
// Impede que o usuário selecione datas no passado via navegador
function setMinDate() {
    const today = getTodayDate();
    inputDate.setAttribute('min', today);
    filterDateInput.setAttribute('min', today);
}

function openModal() {
    setMinDate();
    updateAvailableHours();
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

// Limpa todas as listas de clientes antes de renderizar
function clearScheduleLists() {
    const clientsLists = document.querySelectorAll('.clients');
    clientsLists.forEach(list => list.innerHTML = '');
}

// Renderiza os agendamentos filtrados por data
function renderSchedulesByDate(date) {
    // Limpa as listas antes de renderizar
    clearScheduleLists();

    // Filtra os agendamentos pela data selecionada
    const filteredSchedules = schedules.filter(schedule => schedule.date === date);

    // Renderiza cada agendamento filtrado
    filteredSchedules.forEach(schedule => {
        const period = getPeriodByHour(schedule.hour);
        const scheduleElement = createScheduleElement(schedule);
        addScheduleToList(scheduleElement, period);
    });
}

// Manipula a mudança no filtro de data
function handleFilterDate(event) {
    const selectedDate = event.target.value;

    if (selectedDate) {
        renderSchedulesByDate(selectedDate);
    }
}

// Valida se a data selecionada não está no passado
function isDateInPast(date) {
    const selectedDate = dayjs(date);
    const today = dayjs().startOf('day');
    return selectedDate.isBefore(today);
}

// Verifica se o horário já está ocupado para uma determinada data
// Retorna true se o horário estiver ocupado, false se estiver disponível
function isHourOccupied(date, hour) {
    return schedules.some(schedule =>
        schedule.date === date && schedule.hour === hour
    );
}

// Atualiza o select de horários, desabilitando os horários já ocupados
// para a data selecionada no formulário
function updateAvailableHours() {
    const selectedDate = inputDate.value;
    const hourSelect = document.getElementById('input-hour');
    const options = hourSelect.querySelectorAll('option');

    // Se não houver data selecionada, habilita todos os horários
    if (!selectedDate) {
        options.forEach(option => {
            if (option.value) {
                option.disabled = false;
            }
        });
        return;
    }

    // Percorre todas as opções de horário e desabilita as ocupadas
    options.forEach(option => {
        if (option.value) {
            option.disabled = isHourOccupied(selectedDate, option.value);
        }
    });
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

    // Validação extra: impede agendamentos em datas passadas
    if (isDateInPast(data.date)) {
        alert('Não é possível criar agendamentos em datas passadas.');
        return;
    }

    // Validação: impede agendamentos duplicados no mesmo horário e data
    if (isHourOccupied(data.date, data.hour)) {
        alert(`O horário ${data.hour} já está ocupado para o dia ${dayjs(data.date).format('DD/MM/YYYY')}. Por favor, escolha outro horário.`);
        return;
    }

    // 1. Armazena o agendamento no array
    schedules.push(data);

    // 2. Se há uma data selecionada no filtro, renderiza apenas os agendamentos dessa data
    // Caso contrário, adiciona diretamente na lista
    const selectedFilterDate = filterDateInput.value;

    if (selectedFilterDate) {
        // Re-renderiza apenas se a data do novo agendamento corresponde ao filtro
        if (data.date === selectedFilterDate) {
            const period = getPeriodByHour(data.hour);
            const scheduleElement = createScheduleElement(data);
            addScheduleToList(scheduleElement, period);
        }
    } else {
        // Sem filtro ativo: adiciona diretamente na lista
        const period = getPeriodByHour(data.hour);
        const scheduleElement = createScheduleElement(data);
        addScheduleToList(scheduleElement, period);
    }

    // 3. Fecha o modal e limpa o formulário
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
filterDateInput.addEventListener('change', handleFilterDate);
inputDate.addEventListener('change', updateAvailableHours);

// Inicializa a data mínima nos inputs ao carregar a página
setMinDate();

// Define a data atual como valor padrão no filtro de pesquisa
filterDateInput.value = getTodayDate();
