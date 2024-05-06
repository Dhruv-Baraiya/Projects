// Email validation
function validateEmail(email) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/;
    return regex.test(email);
}

document.getElementById('csvfile').addEventListener('change', function (event) {

    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const csv = e.target.result;
        const lines = csv.split(/\r?\n/);
        const validEmails = [];
        const invalidEmails = [];

        lines.forEach(line => {
            const email = line.trim();
            if (validateEmail(email)) {
                validEmails.push(email);
            } else {
                invalidEmails.push(email);
            }
        });
        // Display the counts of valid and invalid emails
        document.getElementById('valCount').textContent = validEmails.length;
        document.getElementById('invalCount').textContent = invalidEmails.length - 1;

        // Display the lists of valid and invalid emails
        document.getElementById('validEmails').textContent = validEmails.join('\n');
        document.getElementById('invalidEmails').textContent = invalidEmails.join('\n');

        // Display the valid and invalid emails separately
        document.getElementById('validEmailsSection').style.display = 'block';
        document.getElementById('invalidEmailsSection').style.display = 'block';
    }
    // console.log(validEmails);
    reader.readAsText(file);
})

document.getElementById('submit').addEventListener('click', function (event) {
    event.preventDefault();
    const subject = document.getElementById('subject').value;
    const msg = document.getElementById('msg').value;
    const fileInput = document.getElementById('csvfile');
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const csv = e.target.result;
        const lines = csv.split(/\r?\n/);
        const validEmails = [];
        const invalidEmails = [];

        lines.forEach(line => {
            const email = line.trim();
            if (validateEmail(email)) {
                validEmails.push(email);
            } else {
                invalidEmails.push(email);
            }
        });
        sendEmails(subject, msg, validEmails);
    }
    reader.readAsText(file);
})

function sendEmails(subject, msg, emails) {
    // Send the valid emails to the server for further processing
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://localhost:8080/send-emails', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                displaySuccess("Emails sent successfully.");
            } else {
                displayError("Failed to send emails.");
            }
        }
    };
    xhr.send(JSON.stringify({ subject: subject, msg: msg, emails: emails }));
}

function displaySuccess(message) {
    document.getElementById('resultvalid').innerHTML = `<p class="valid">${message}</p>`;
    document.getElementById('loader').innerHTML = `<span></span>`;
}

function displayError(message) {
    document.getElementById('resultinvalid').innerHTML = `<p class="error">${message}</p>`;
    document.getElementById('loader').innerHTML = `<span></span>`;
}
