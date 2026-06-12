import {sortCollection, sortMap} from "../lib/sort.js";

export function initSorting(columns) {
    return (data, state, action) => {
        let field = null;
        let order = null;

        if (action && action.name === 'sort') {
            // @todo: #3.1 — запомнить выбранный режим сортировки

            // У кнопки сортировки есть data-value.
            // В нём хранится текущее состояние сортировки:
            // например: none, asc или desc.
            //
            // sortMap — это карта переходов.
            // Она говорит, какое состояние должно быть следующим.
            //
            // Например:
            // none -> asc
            // asc -> desc
            // desc -> none
            action.dataset.value = sortMap[action.dataset.value];

            // В data-field хранится имя поля,
            // по которому нужно сортировать данные.
            //
            // Например:
            // data-field="date"
            // data-field="total"
            field = action.dataset.field;

            // После переключения data-value
            // забираем новое направление сортировки.
            order = action.dataset.value;

            // @todo: #3.2 — сбросить сортировки остальных колонок

            // Так как активной должна быть только одна сортировка,
            // перебираем все кнопки сортировки.
            columns.forEach(column => {

                // Если это не та кнопка, по которой нажали,
                // сбрасываем её состояние в none.
                if (column.dataset.field !== action.dataset.field) {
                    column.dataset.value = 'none';
                }
            });
        } else {
            // @todo: #3.3 — получить выбранный режим сортировки

            // Этот блок нужен для повторных перерисовок,
            // которые были вызваны не кнопкой сортировки.
            //
            // Например:
            // - поменяли страницу пагинации;
            // - поменяли количество строк;
            // - изменили фильтр;
            // - сработал reset.
            //
            // В этих случаях action либо нет,
            // либо это не кнопка сортировки.
            //
            // Поэтому мы смотрим на все кнопки сортировки
            // и ищем ту, у которой data-value не равно none.
            columns.forEach(column => {
                if (column.dataset.value !== 'none') {
                    field = column.dataset.field;
                    order = column.dataset.value;
                }
            });
        }

        // sortCollection получает:
        // data  — массив строк таблицы,
        // field — поле сортировки,
        // order — направление сортировки.
        //
        // Если field и order равны null,
        // сортировка не применяется.
        return sortCollection(data, field, order);
    }
}