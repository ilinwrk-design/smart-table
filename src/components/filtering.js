import {createComparison, defaultRules} from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор

// Создаём функцию сравнения.
// Она будет проверять, подходит ли строка таблицы под текущее состояние фильтров.
const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями

    // indexes — это объект с наборами значений для фильтров.
    
    Object.keys(indexes).forEach((elementName) => {

        // Берём конкретный select по имени из elements.
       
        const select = elements[elementName];

        // Из массива значений создаём option-элементы.
        const options = Object.values(indexes[elementName]).map((name) => {
            const option = document.createElement('option');

            // value — значение, которое попадёт в FormData
            option.value = name;

            // textContent — то, что увидит пользователь
            option.textContent = name;

            return option;
        });

        // Добавляем все option внутрь select
        select.append(...options);
    });

    return (data, state, action) => {
        // @todo: #4.2 — обработать очистку поля

        // Если action есть и это кнопка очистки фильтра
        if (action && action.name === 'clear') {

            // В data-field лежит имя поля, которое нужно очистить
            const field = action.dataset.field;

            // Находим родителя кнопки
            const parent = action.parentElement;

            // Внутри родителя ищем поле ввода или select
            const input = parent.querySelector('input, select');

            // Если поле найдено — очищаем его значение
            if (input) {
                input.value = '';
            }

            // Также очищаем значение в объекте state,
            // чтобы фильтрация сразу пересчиталась правильно
            state[field] = '';
        }

        // @todo: #4.5 — отфильтровать данные используя компаратор

        // Оставляем только те строки,
        // которые подходят под текущее состояние фильтров
        return data.filter(row => compare(row, state));
    }
}