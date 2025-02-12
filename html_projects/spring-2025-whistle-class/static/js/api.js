async function submitFormData() {
    const url = 'https://script.google.com/macros/s/AKfycbzBai0B5c8a4TwxmRC9Cu__LNOXhSMVP8ce3EdSMDA-NR6lyTJdTIcweYHEvKc7huSHvw/exec';
    const formData = new URLSearchParams();
    const dimmer = document.getElementById('dimmer');
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    formData.append('name', name);
    formData.append('email', email);
    formData.append('message', message);

    try {
        dimmer.style.visibility = "visible";
        const response = await fetch(url, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            dimmer.style.visibility = "hidden";
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Success:', data);
        formSuccess();
        dimmer.style.visibility = "hidden";
    } catch (error) {
        console.error('Error:', error);
        dimmer.style.visibility = "hidden";
    }
}

function formSuccess() {
    alert('From Submitted Successfully!');
    document.getElementById('myForm').reset();
    document.getElementById('contact-success').style.visibility = "visible";
    document.getElementById('all-content').hidden = true;
}