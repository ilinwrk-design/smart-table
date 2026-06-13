import {rules, createComparison} from "../lib/compare.js";

export function initSearching(searchField) {
    // @todo: #5.1 — настроить компаратор

    // Создаём компаратор для поиска.
    //
    // Первый аргумент — массив базовых правил.
    // Нам нужно только правило skipEmptyTargetValues,
    // чтобы пустое поле поиска не фильтровало данные.
    //
    // Второй аргумент — правило поиска сразу по нескольким полям:
    // date, customer, seller.
    //
    // searchField — имя поля формы, из которого берём поисковую строку.
    const compare = createComparison(
        [
            rules.skipEmptyTargetValues
        ],
        [
            rules.searchMultipleFields(
                searchField,
                ['date', 'customer', 'seller'],
                false
            )
        ]
    );

    return (data, state, action) => {
        // @todo: #5.2 — применить компаратор

        // Оставляем только те строки,
        // которые подходят под поисковый запрос.
        return data.filter(row => compare(row, state));
    }
}