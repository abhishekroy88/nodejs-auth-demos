const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    grecaptcha.ready(() => {
        grecaptcha.execute('<Your Google reCaptcha client secret here>', {action: 'submit'})
        .then((token) => {
            const email = document.querySelector('#inputEmail').value;
            const password = document.querySelector('#inputPassword').value;
            const captcha = token;

            const formData = JSON.stringify({ 
                email, 
                password,
                captcha 
            });

            fetch('/verify', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: formData
            })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    window.location.href = '/home';
                }
            });
        });
    });
});

