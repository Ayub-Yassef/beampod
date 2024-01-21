const getById = (id) => {
    return document.getElementById(id);
}

const password = getById('password')
const confirmPassword = getById('confirm-password')
const form = getById('form')
const container = getById('container')
const loader = getById('loader')
const button = getById('submit')
const error = getById("error");
const success = document.getElementById("success");



error.style.display = "none";
success.style.display = "none";
