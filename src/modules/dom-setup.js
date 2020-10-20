import { validDates } from "./valid-dates";
import { operators } from "./search-operators";

const setupDateSelects = (dateSelects) => {
    for (const date of validDates) {
        for(const dateSelect of dateSelects) {
            const option = document.createElement("option");
            option.text = date;
            dateSelect.appendChild(option);
        }
    }
}

const setupOperatorSelect = (operatorSelect) => {
    for(const operator in operators) {
        const option = document.createElement("option");
        option.text = operator;
        operatorSelect.appendChild(option);
    }    
}

export { setupDateSelects, setupOperatorSelect };