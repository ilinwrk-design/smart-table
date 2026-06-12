import {cloneTemplate} from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
    const {tableTemplate, rowTemplate, before, after} = settings;

    // Клонируем основной шаблон таблицы
    const root = cloneTemplate(tableTemplate);

    // @todo: #1.2 — вывести дополнительные шаблоны до и после таблицы

    // before выводим через prepend,
    // поэтому сначала разворачиваем массив,
    // иначе порядок будет обратным
    before.reverse().forEach(subName => {

        // сохраняем клон шаблона в объект root
        root[subName] = cloneTemplate(subName);

        // вставляем перед таблицей
        root.container.prepend(root[subName].container);
    });

    // шаблоны после таблицы
    after.forEach(subName => {

        // сохраняем ссылку на клон
        root[subName] = cloneTemplate(subName);

        // вставляем после таблицы
        root.container.append(root[subName].container);
    });

    // @todo: #1.3 — обработать события и вызвать onAction()

    // любое изменение поля формы
    root.container.addEventListener('change', () => {
        onAction();
    });

    // reset срабатывает раньше очистки формы,
    // поэтому используем небольшую задержку
    root.container.addEventListener('reset', () => {
        setTimeout(onAction);
    });

    // отправка формы
    root.container.addEventListener('submit', (e) => {

        // отменяем перезагрузку страницы
        e.preventDefault();

        // передаём кнопку, которая вызвала submit
        onAction(e.submitter);
    });

    const render = (data) => {

        // @todo: #1.1 — преобразовать данные в массив строк на основе шаблона rowTemplate

        const nextRows = data.map(item => {

            // создаём новую строку таблицы
            const row = cloneTemplate(rowTemplate);

            // перебираем все поля объекта данных
            Object.keys(item).forEach(key => {

                // если для поля существует элемент в шаблоне
                if (key in row.elements) {

                    // выводим значение в элемент
                    row.elements[key].textContent = item[key];
                }
            });

            // возвращаем DOM-элемент строки
            return row.container;
        });

        // полностью заменяем старые строки новыми
        root.elements.rows.replaceChildren(...nextRows);
    }

    return {
        ...root,
        render
    };
}