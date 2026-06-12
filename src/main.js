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
    // преобразуем к числу
    const rowsPerPage = parseInt(state.rowsPerPage);

    // Номер страницы тоже приводим к числу
    // Если страница не выбрана — используем первую
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
    // Собираем текущее состояние формы
    let state = collectState();

    // Работаем с копией исходного массива
    let result = [...data];

    // @todo: использование

    // Сначала фильтрация
    result = applyFiltering(result, state, action);

    // Потом сортировка
    result = applySorting(result, state, action);

    // Потом пагинация
    result = applyPagination(result, state, action);

    // Выводим итоговые данные
    sampleTable.render(result);
}

const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',

    // Сначала выводим заголовок с сортировками,
    // затем блок фильтров
    before: ['header', 'filter'],

    // После таблицы выводим пагинацию
    after: ['pagination']
}, render);

// @todo: инициализация

// Инициализация фильтрации
const applyFiltering = initFiltering(
    sampleTable.filter.elements,
    {
        // Заполняем список продавцов
        searchBySeller: indexes.sellers
    }
);

// Инициализация сортировки
const applySorting = initSorting([
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]);

// Инициализация пагинации
const applyPagination = initPagination(
    sampleTable.pagination.elements,

    // Настройка одной кнопки страницы
    (el, page, isCurrent) => {
        const input = el.querySelector('input');
        const label = el.querySelector('span');

        // Номер страницы
        input.value = page;

        // Активная страница
        input.checked = isCurrent;

        // Текст кнопки
        label.textContent = page;

        return el;
    }
);

const appRoot = document.querySelector('#app');

// Добавляем таблицу на страницу
appRoot.appendChild(sampleTable.container);

// Первый рендер
render();