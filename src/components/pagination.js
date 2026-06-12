/**
 * Инициализирует пагинацию
 *
 * @param {Object} elements
 * @param {(el: HTMLElement, page: number, isCurrent: boolean) => HTMLElement} createPage
 * @returns {(data: Array, state: Object, action?: HTMLButtonElement) => Array}
 */
export function initPagination(elements, createPage) {
    const {
        pages,
        fromRow,
        toRow,
        totalRows
    } = elements;

    // Функция возвращает массив номеров страниц,
    // которые нужно показать пользователю
    function getPages(currentPage, pageCount, visibleCount) {
        const result = [];

        // Начинаем показывать страницы так,
        // чтобы текущая была примерно посередине
        let start = Math.max(
            1,
            currentPage - Math.floor(visibleCount / 2)
        );

        let end = start + visibleCount - 1;

        // Если ушли дальше последней страницы,
        // сдвигаем диапазон назад
        if (end > pageCount) {
            end = pageCount;
            start = Math.max(1, end - visibleCount + 1);
        }

        for (let i = start; i <= end; i++) {
            result.push(i);
        }

        return result;
    }

    // @todo: #2.3 — подготовить шаблон страницы

    // Берём первый элемент внутри контейнера страниц как шаблон
    const pageTemplate = pages.firstElementChild.cloneNode(true);

    // Удаляем исходный шаблон из DOM,
    // дальше будем вставлять только его клоны
    pages.firstElementChild.remove();

    return function applyPagination(data, state, action) {
        // @todo: #2.1 — посчитать число страниц

        // Количество строк на одной странице
        const rowsPerPage = state.rowsPerPage;

        // Общее количество страниц
        // Math.ceil округляет вверх
        const pageCount = Math.ceil(data.length / rowsPerPage);

        // Текущая страница
        // page — let, потому что кнопки prev/next/first/last могут её менять
        let page = state.page;

        // @todo: #2.6 — обработать действия кнопок пагинации

        // Если render был вызван кнопкой,
        // action будет HTMLButtonElement
        if (action) {
            switch (action.name) {
                case 'prev':
                    // Переход на предыдущую страницу,
                    // но не меньше первой
                    page = Math.max(1, page - 1);
                    break;

                case 'next':
                    // Переход на следующую страницу,
                    // но не дальше последней
                    page = Math.min(pageCount, page + 1);
                    break;

                case 'first':
                    // Переход на первую страницу
                    page = 1;
                    break;

                case 'last':
                    // Переход на последнюю страницу
                    page = pageCount;
                    break;
            }
        }

        // @todo: #2.4 — вывести кнопки страниц

        // Получаем массив номеров страниц,
        // которые нужно показать
        const visiblePages = getPages(page, pageCount, 5);

        // Очищаем старые кнопки страниц
        // и вставляем новые
        pages.replaceChildren(
            ...visiblePages.map(pageNumber => {
                const el = pageTemplate.cloneNode(true);

                return createPage(
                    el,
                    pageNumber,
                    pageNumber === page
                );
            })
        );

        // @todo: #2.5 — вывести статус пагинации

        // Номер первой строки на текущей странице
        fromRow.textContent = (page - 1) * rowsPerPage + 1;

        // Номер последней строки на текущей странице
        // На последней странице строк может быть меньше rowsPerPage
        toRow.textContent = Math.min(
            page * rowsPerPage,
            data.length
        );

        // Всего строк
        totalRows.textContent = data.length;

        // @todo: #2.2 — вернуть только строки текущей страницы

        // Сколько строк нужно пропустить
        const skip = (page - 1) * rowsPerPage;

        // Возвращаем только кусок массива,
        // который относится к текущей странице
        return data.slice(skip, skip + rowsPerPage);
    };
}