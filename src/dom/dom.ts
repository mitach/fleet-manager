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
                element.dataset[dataName] = props[propName];
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

export const table: ElementFactory<HTMLTableElement> = dom.bind(null, 'table');
export const thead: ElementFactory<HTMLTableSectionElement> = dom.bind(null, 'thead');
export const tbody: ElementFactory<HTMLTableSectionElement> = dom.bind(null, 'tbody');
export const tr: ElementFactory<HTMLTableRowElement> = dom.bind(null, 'tr');
export const th: ElementFactory<HTMLTableCellElement> = dom.bind(null, 'th');
export const td: ElementFactory<HTMLTableCellElement> = dom.bind(null, 'td');
export const button: ElementFactory<HTMLButtonElement> = dom.bind(null, 'button');
export const a: ElementFactory<HTMLButtonElement> = dom.bind(null, 'a');
export const main: ElementFactory<HTMLButtonElement> = dom.bind(null, 'main');
export const h3: ElementFactory<HTMLButtonElement> = dom.bind(null, 'h3');
export const div: ElementFactory<HTMLButtonElement> = dom.bind(null, 'div');
export const p: ElementFactory<HTMLButtonElement> = dom.bind(null, 'p');
export const span: ElementFactory<HTMLButtonElement> = dom.bind(null, 'span');
export const strong: ElementFactory<HTMLButtonElement> = dom.bind(null, 'strong');
export const form: ElementFactory<HTMLButtonElement> = dom.bind(null, 'form');
export const label: ElementFactory<HTMLButtonElement> = dom.bind(null, 'label');
export const input: ElementFactory<HTMLButtonElement> = dom.bind(null, 'input');
