
document.querySelectorAll('.nav-button').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.nav-button').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
    });
});

window.addEventListener("load", async function score (){
    console.log("Page has reloaded!");
    try{
        const dat = await fetch('http://localhost:8000/match-data');
        
    }
    catch{(err)=>{console.log(err);}};   
});


