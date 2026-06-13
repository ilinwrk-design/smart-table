import {createComparison, defaultRules} from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор

// Базовый компаратор из правил проекта
const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями

    Object.keys(indexes).forEach((elementName) => {
        const select = elements[elementName];

        const options = Object.values(indexes[elementName]).map((name) => {
            const option = document.createElement('option');

            option.value = name;
            option.textContent = name;

            return option;
        });

        select.append(...options);
    });

    return (data, state, action) => {
        // @todo: #4.2 — обработать очистку поля

        if (action && action.name === 'clear') {
            const field = action.dataset.field;
            const parent = action.parentElement;
            const input = parent.querySelector('input, select');

            if (input) {
                input.value = '';
            }

            state[field] = '';
        }

        // @todo: #4.5 — отфильтровать данные используя компаратор

        return data.filter((row) => {
            // Сначала применяем стандартные правила фильтрации
            const isMatchedByDefaultRules = compare(row, state);

            // Значение суммы в строке таблицы
            const total = Number(row.total);

            // Нижняя граница суммы
            const totalFrom = state.totalFrom
                ? Number(state.totalFrom)
                : null;

            // Верхняя граница суммы
            const totalTo = state.totalTo
                ? Number(state.totalTo)
                : null;

            // Проверяем totalFrom
            if (totalFrom !== null && total < totalFrom) {
                return false;
            }

            // Проверяем totalTo
            if (totalTo !== null && total > totalTo) {
                return false;
            }

            return isMatchedByDefaultRules;
        });
    }
}