import './fonts/ys-display/fonts.css';
import './style.css';

import { data as sourceData } from "./data/dataset_1.js";

import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";

import { initTable } from "./components/table.js";

// @todo: подключение
import { initPagination } from "./components/pagination.js";
import { initSorting } from "./components/sorting.js";


// Исходные данные используемые в render()
const { data, ...indexes } = initData(sourceData);

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
    const state = processFormData(
        new FormData(sampleTable.container)
    );

    // Количество строк на странице приходит строкой,
    // преобразуем в число
    const rowsPerPage = parseInt(state.rowsPerPage);

    // Номер страницы тоже приводим к числу
    // По умолчанию используем первую страницу
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
    // Состояние всех элементов формы
    let state = collectState();

    // Копируем исходные данные
    let result = [...data];

    // @todo: использование

    // Сначала сортируем весь массив
    result = applySorting(result, state, action);

    // Потом применяем пагинацию
    result = applyPagination(result, state, action);

    // Выводим результат в таблицу
    sampleTable.render(result);
}

const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',

    // Шаблон заголовка с кнопками сортировки
    before: ['header'],

    // Шаблон пагинации под таблицей
    after: ['pagination']
}, render);

// @todo: инициализация

// Модуль сортировки
const applySorting = initSorting([
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]);

// Модуль пагинации
const applyPagination = initPagination(
    sampleTable.pagination.elements,

    // Колбэк для создания кнопки страницы
    (el, page, isCurrent) => {
        const input = el.querySelector('input');
        const label = el.querySelector('span');

        // Номер страницы
        input.value = page;

        // Текущая страница отмечается radio-кнопкой
        input.checked = isCurrent;

        // Выводим номер страницы
        label.textContent = page;

        return el;
    }
);

const appRoot = document.querySelector('#app');

// Добавляем таблицу в приложение
appRoot.appendChild(sampleTable.container);

// Первый рендер страницы
render();