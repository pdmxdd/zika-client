export const buildLabel = ({ labelFor, labelText }) => {
  const label = document.createElement("label");

  label.setAttribute("for", labelFor);
  label.innerText = labelText; // text above input

  return label;
};

export const buildInput = ({ id, inputType }) => {
  // textarea is its own tag but behaves as a long-form text input
  const isTextAreaInput = inputType.toLowerCase() === "textarea";

  // use textarea as tag name or use generic input with type attribute
  const tagName = isTextAreaInput ? "textarea" : "input";
  const input = document.createElement(tagName);

  input.setAttribute("id", id);
  if (!isTextAreaInput) {
    // if it is a regular input provide the input type attribute
    input.setAttribute("type", inputType);
  }

  return input;
};

export const buildInputWithLabel = ({ id, inputType, labelText }) => {
  const input = buildInput({ id, inputType });
  const label = buildLabel({ labelFor: id, labelText });
  label.append(input);

  return label;
};

export const buildButton = ({ id, buttonText }) => {
  const button = document.createElement("button");
  button.setAttribute("id", id);
  button.innerText = buttonText;

  return button;
};

export const buildSelect = ({ id = "", options = [] }) => {
  const select = document.createElement("select");

  select.setAttribute("id", id);
  if (options) select.append(...options);

  return select;
};

export const buildOption = ({ id = "", value = "", optionText = "" }) => {
  const option = document.createElement("option");
  option.innerText = optionText;
  option.setAttribute("value", value);

  if (id) option.setAttribute("id", id);

  return option;
};

export const buildForm = ({ id, children }) => {
  const form = document.createElement("form");
  form.addEventListener("submit", (event) => event.preventDefault());
  form.setAttribute("id", id);
  form.append(...children);

  return form;
};

export const buildHeader = ({ id, headerSize = 1, headerText }) => {
  const header = document.createElement(`h${headerSize}`);
  header.innerText = headerText;
  header.setAttribute("id", id);

  return header;
};

export const buildParagraph = ({ id, paragraphText }) => {
  const paragraph = document.createElement("p");
  paragraph.setAttribute("id", id);
  paragraph.innerText = paragraphText;

  return paragraph;
};
