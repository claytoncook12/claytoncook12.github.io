
const dataHolder = document.getElementById("data");
const userID = document.getElementById("userId");
const btn = document.getElementById("loadUsers");

function addDataElement(id, email, name, image) {
  const dataDiv = document.createElement("div");
  dataDiv.classList.add("users")
  dataDiv.innerHTML += `
    <div class="left">
        <img src="${image}" alt="User ${id} avatar image">
    </div>
    <div class="right">
        <div class="rightText">Id: ${id}<br>${name}<br>${email}<br>
        </div>
    </div>`;
  dataHolder.appendChild(dataDiv);
}

function makeRequest() {
    rxjs.ajax.ajax.getJSON(`https://reqres.in/api/users/${userID.value}`)
    .subscribe({
        next: (response) => {
            addDataElement(
                response.data.id,
                response.data.email,
                `${response.data.first_name} ${response.data.last_name}`,
                response.data.avatar
            )
        },
        error: (error) => window.alert('Users Lookup Failed'),
        complete: () => console.log("Complete!"),
    });
}