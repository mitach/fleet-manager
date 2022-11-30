type DomContent = string | Node;

type ElementFactory<T extends HTMLElement> = (props?: object, ...content: DomContent[]) => T;

export function dom(type: string, props?: object, ...content: DomContent[]) {
    const element = document.createElement(type);

    if (props) {
        for (let propName in props) {
            if (propName.startsWith('on')) {
                const eventName = propName.slice(2).toLowerCase();
                element.addEventListener(eventName, props[propName]);
            } else if (propName.startsWith('data')) {
                const dataName = propName.slice(4, 5).toLowerCase() + propName.slice(5);
                element.dataset[dataName] = props[dataName];
            } else {
                element[propName] = props[propName];
            }
        }
    }

    for (let item of content) {
        element.append(item);
    }

    return element;
}

export const table: ElementFactory<HTMLTableElement> = dom.bind('table');
export const thead: ElementFactory<HTMLTableSectionElement> = dom.bind('thead');
export const tbody: ElementFactory<HTMLTableSectionElement> = dom.bind('tbody');
export const tr: ElementFactory<HTMLTableRowElement> = dom.bind('tr');
export const th: ElementFactory<HTMLTableCellElement> = dom.bind('th');
export const td: ElementFactory<HTMLTableCellElement> = dom.bind('td');
export const button: ElementFactory<HTMLButtonElement> = dom.bind('button');
