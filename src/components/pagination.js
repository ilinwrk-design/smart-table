export function initPagination(elements, createPage) {
    const {
        pages,
        fromRow,
        toRow,
        totalRows
    } = elements;

    const getPages = (currentPage, pageCount, visibleCount) => {
        const pages = [];

        let start = Math.max(1, currentPage - Math.floor(visibleCount / 2));
        let end = start + visibleCount - 1;

        if (end > pageCount) {
            end = pageCount;
            start = Math.max(1, end - visibleCount + 1);
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        return pages;
    };

    const pageTemplate = pages.firstElementChild.cloneNode(true);

    pages.firstElementChild.remove();

    return function applyPagination(data, state, action) {
        const rowsPerPage = state.rowsPerPage;
        const pageCount = Math.ceil(data.length / rowsPerPage);

        let page = state.page;

        if (action) {
            switch (action.name) {
                case 'prev':
                    page = Math.max(1, page - 1);
                    break;

                case 'next':
                    page = Math.min(pageCount, page + 1);
                    break;

                case 'first':
                    page = 1;
                    break;

                case 'last':
                    page = pageCount;
                    break;
            }
        }

        const visiblePages = getPages(page, pageCount, 5);

        pages.replaceChildren(
            ...visiblePages.map((pageNumber) => {
                const el = pageTemplate.cloneNode(true);

                return createPage(
                    el,
                    pageNumber,
                    pageNumber === page
                );
            })
        );

        fromRow.textContent = (page - 1) * rowsPerPage + 1;
        toRow.textContent = Math.min(page * rowsPerPage, data.length);
        totalRows.textContent = data.length;

        const skip = (page - 1) * rowsPerPage;

        return data.slice(skip, skip + rowsPerPage);
    };
}