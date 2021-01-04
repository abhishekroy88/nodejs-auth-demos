const form = document.querySelector('form');
const submitBtn = document.querySelector('button[type="submit"]');

const emailField = document.querySelector('#inputEmail');
const passwordField = document.querySelector('#inputPassword');
let captcha;


form.addEventListener('input', () => {
    enableSubmit();
});


form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = emailField.value;
    const password = passwordField.value;

    fetch('/verify', {
        method: 'POST',
        headers: {
            'Accept': 'application.json, text/plain, */*',
            'Content-type': 'application/json'
        },
        body: JSON.stringify({ email, password, captcha })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        if (data.success) {
            window.location.href = '/home';
        }
    });
    
});


function recaptchaExpired() {
    disableSubmit();
}


function enableSubmit() {
    captcha = document.querySelector('#g-recaptcha-response').value;

    if (emailField.value && passwordField.value && captcha) {
        submitBtn.disabled = false;
    } else {
        submitBtn.disabled = true;
    }
}

function disableSubmit() {
    submitBtn.disabled = true;
}
