import './fonts/ys-display/fonts.css'
import './style.css'

import {data as sourceData} from "./data/dataset_1.js";

import {initData} from "./data.js";
import {processFormData} from "./lib/utils.js";

import {initTable} from "./components/table.js";
// @todo: подключение

// Подключаем модуль пагинации
import {initPagination} from "./components/pagination.js";


// Исходные данные используемые в render()
const {data, ...indexes} = initData(sourceData);

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
    const state = processFormData(new FormData(sampleTable.container));

    // rowsPerPage приходит из формы строкой, например "10"
    // приводим к числу, чтобы потом можно было делать математические расчёты
    const rowsPerPage = parseInt(state.rowsPerPage);

    // page тоже приходит строкой
    // если страницы ещё нет, используем 1 по умолчанию
    const page = parseInt(state.page ?? 1);

    return {
        ...state,
        rowsPerPage,
        page
    };
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
function render(action) {
    let state = collectState(); // состояние полей из таблицы
    let result = [...data]; // копируем для последующего изменения

    // @todo: использование

    // Применяем пагинацию:
    // берём все данные, состояние формы и кнопку действия, если она была
    result = applyPagination(result, state, action);

    sampleTable.render(result)
}

const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: [],

    // Добавляем шаблон пагинации после таблицы
    after: ['pagination']
}, render);

// @todo: инициализация

// Инициализируем модуль пагинации
// sampleTable.pagination.elements — элементы из шаблона пагинации
const applyPagination = initPagination(
    sampleTable.pagination.elements,

    // Колбэк, который настраивает одну кнопку страницы
    (el, page, isCurrent) => {
        const input = el.querySelector('input');
        const label = el.querySelector('span');

        // Значение radio-кнопки
        input.value = page;

        // Отмечаем текущую страницу
        input.checked = isCurrent;

        // Показываем номер страницы пользователю
        label.textContent = page;

        return el;
    }
);

const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

render();