export class Editor {
    constructor(
        private form: HTMLFormElement,
        private callback: (data: object) => any,
        private propNames: string[],
    ) {
        this.form.addEventListener('submit', this.onSubmit.bind(this));
    }

    setValue(name: string, value: any) {
        const target = this.form.querySelector(`[name="${name}"]`);

        if (target instanceof HTMLInputElement) {
            if (target.type == 'checkbox') {
                target.checked = value;
            } else {
                target.value = value;
            }
        } else if (target instanceof HTMLSelectElement || target instanceof HTMLTextAreaElement) {
            target.value = value;
        }
    }

    setValues(data: object) {
        for (let [key, value] of Object.entries(data)) {
            this.setValue(key, value);
        }
    }

    clear() {
        this.form.reset();
    }

    remove() {
        this.form.remove();
    }

    attachTo(parent: Node) {
        parent.appendChild(this.form);
    }

    private onSubmit(event: SubmitEvent) {
        event.preventDefault();
        const formData = new FormData(this.form);
        const data = Object.fromEntries(this.propNames.map(n => [n, formData.get(n)]));
        this.callback(data);
    }
}