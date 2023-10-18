export const inputTypes = {
    default: "text",
    password: "password",
    email: "email",
    dropDown: "dropDown"
}

export const messageTypes = {
    error: "error",
    warning: "warn",
    success: "success",
    info: "info"
}

export const logout = () => {
    localStorage.removeItem('bearer_token');
}

export const formatDate = (date) => {
    return date.split('T')[0];
}

export const formatTime = (date) => {
    return date.split('.')[0];
}

export const formatFile = (fileId) => {
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
}

export const getFormData = (form, test) => {
    const data = {};

    for (const element of form.elements) {
        if (element.tagName === "BUTTON" || element.name === "")
            continue;

        if (test) {
            if (element.checked) {
                if (data[element.name])
                    data[element.name].push(element.value);
                else
                    data[element.name] = [element.value];
            }
        } else
            data[element.name] = element.value;
    }

    return data;
}

export const getRandomId = () => {
    return 'random_' + Math.random() + Math.random() + Math.random();
}

export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
