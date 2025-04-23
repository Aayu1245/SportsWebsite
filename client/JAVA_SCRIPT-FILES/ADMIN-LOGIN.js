const username = document.getElementById("username");
const pass = document.getElementById("password");


const cbutton = document.getElementById("cbutton");


async function senddata(event){
    event.preventDefault();
    console.log("button clicked");
    const resp = await fetch('http://localhost:8000/ADMIN-LOGIN-PAGE.html', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
          },
        body:  JSON.stringify({
            Username: username.value,
            Pass: pass.value
        })
    });
    const dat = await resp.json();
    if (dat.status==="Good"){
        window.location.href = "../HTML-FILES/ADMIN-DASHBOARD.html";
    }
}

cbutton.addEventListener('click', senddata);
