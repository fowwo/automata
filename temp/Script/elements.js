/**
 * Creates an HTML element with the given properties, attributes, and children.
 * @param {String} type - The tag name of the element.
 * @param {Object} options - TODO: The properties, attributes, and children of the element.
 * @param {Object} options.properties - The properties of the element.
 * @param {Object} options.attributes - The attributes of the element.
 * @param {Node[]} options.children - The children of the element.
 */
export function createElement(type, options = {}) {
    const element = document.createElement(type);
    setOptions(element, options);
    return element;
}

function setOptions(element, { properties = {}, attributes = {}, eventListeners = [], children = [] }) {
    for (const [ property, value ] of Object.entries(properties)) {
        element[property] = value;
    }
    for (const [ attribute, value ] of Object.entries(attributes)) {
        element.setAttribute(attribute, value);
    }
    for (const [ event, listener ] of eventListeners) {
        element.addEventListener(event, listener);
    }
    for (const child of children) {
        element.appendChild(child);
    }
}

/**
 * Creates a checkbox.
 * @param {Options} options - TODO:
 */
export function checkbox({ onchange, containerOptions = {}, inputOptions = {} } = {}) {
    const input = createElement("input", {
        properties: {
            type: "checkbox",
            onchange
        }
    });
    const container = createElement("div", {
        properties: { classList: "checkbox symbol" },
        children: [ input ]
    });
    setOptions(container, containerOptions);
    setOptions(input, inputOptions);
    return container;
}

/**
 * Creates a radio.
 * @param {Options} options - TODO:
 */
export function radio({ onchange, containerOptions = {}, inputOptions = {} } = {}) {
    const input = createElement("input", {
        properties: {
            type: "radio",
            name: "start",
            onchange
        }
    });
    const container = createElement("div", {
        properties: { classList: "radio symbol" },
        children: [ input ]
    });
    setOptions(container, containerOptions);
    setOptions(input, inputOptions);
    return container;
}

/**
 * Creates a text input field.
 * @param {String} value - The initial value.
 * @param {Object} options - TODO: The properties, attributes, and children of the element.
 */
export function textInput({ value, onchange, options = {} } = {}) {
    const element = createElement("input", {
        properties: {
            type: "text",
            value,
            onchange: () => element.blur()
        },
        eventListeners: [ [ "change", onchange ] ]
    });
    setOptions(element, options);
    return element;
}
