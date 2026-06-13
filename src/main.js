import './fonts/ys-display/fonts.css';
import './style.css';

import { data as sourceData } from "./data/dataset_1.js";

import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";

import { initTable } from "./components/table.js";

// @todo: подключение
import { initPagination } from "./components/pagination.js";
import { initSorting } from "./components/sorting.js";
import { initFiltering } from "./components/filtering.js";
import { initSearching } from "./components/searching.js";


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

    const rowsPerPage = parseInt(state.rowsPerPage);
    const page = parseInt(state.page ?? 1);

    // Фильтр "сумма от"
    // Если поле пустое, оставляем пустую строку
    const totalFrom = state.totalFrom
        ? parseFloat(state.totalFrom)
        : '';

    // Фильтр "сумма до"
    // Если поле пустое, оставляем пустую строку
    const totalTo = state.totalTo
        ? parseFloat(state.totalTo)
        : '';

    return {
        ...state,
        rowsPerPage,
        page,
        totalFrom,
        totalTo
    };
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
function render(action) {
    // Собираем текущее состояние формы
    let state = collectState();

    // Работаем с копией исходных данных
    let result = [...data];

    // @todo: использование

    // Поиск по нескольким полям
    result = applySearching(result, state, action);

    // Фильтрация
    result = applyFiltering(result, state, action);

    // Сортировка
    result = applySorting(result, state, action);

    // Пагинация
    result = applyPagination(result, state, action);

    // Отрисовка результата
    sampleTable.render(result);
}

const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',

    // Сначала поиск,
    // затем сортировка,
    // затем фильтры
    before: [
        'search',
        'header',
        'filter'
    ],

    // После таблицы выводим пагинацию
    after: [
        'pagination'
    ]
}, render);

// @todo: инициализация

// Поиск
const applySearching = initSearching('search');

// Фильтрация
const applyFiltering = initFiltering(
    sampleTable.filter.elements,
    {
        searchBySeller: indexes.sellers
    }
);

// Сортировка
const applySorting = initSorting([
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]);

// Пагинация
const applyPagination = initPagination(
    sampleTable.pagination.elements,

    // Настройка одной кнопки страницы
    (el, page, isCurrent) => {
        const input = el.querySelector('input');
        const label = el.querySelector('span');

        // Значение radio-кнопки
        input.value = page;

        // Активная страница
        input.checked = isCurrent;

        // Текст кнопки
        label.textContent = page;

        return el;
    }
);

const appRoot = document.querySelector('#app');

// Добавляем таблицу в DOM
appRoot.appendChild(sampleTable.container);

// Первая отрисовка
render();