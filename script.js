// ---------------- THEME ----------------

window.onload = function(){

  let theme = localStorage.getItem("theme");

  if(theme === "dark"){
    document.body.classList.add("dark");
  }

  updateThemeIcon();
};


function toggleTheme(){

  document.body.classList.toggle("dark");

  if(document.body.classList.contains("dark")){
    localStorage.setItem("theme","dark");
  }
  else{
    localStorage.setItem("theme","light");
  }

  updateThemeIcon();
}


function updateThemeIcon(){

  let btns = document.querySelectorAll(".theme-btn");

  btns.forEach(btn => {

    if(document.body.classList.contains("dark")){
      btn.innerHTML = "☀️";
    }
    else{
      btn.innerHTML = "🌙";
    }

  });
}


// ---------------- AUTH ----------------

function goToLogin(){
  window.location.href = "login.html";
}


document.getElementById("loginForm")?.addEventListener("submit", function(e){

  e.preventDefault();

  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  if(email && password){

    localStorage.setItem("loggedIn","true");

    window.location.href = "dashboard.html";
  }

});


function logout(){

  localStorage.removeItem("loggedIn");

  window.location.href = "index.html";
}


// Protect dashboard
if(window.location.pathname.includes("dashboard")){

  if(localStorage.getItem("loggedIn") !== "true"){
    window.location.href = "login.html";
  }

}


// ---------------- LANGUAGE ----------------

let selectedLanguage = "english";


function setLanguage(lang){

  selectedLanguage = lang;

  document.getElementById("enBtn")?.classList.remove("active");
  document.getElementById("hiBtn")?.classList.remove("active");

  if(lang === "english"){
    document.getElementById("enBtn")?.classList.add("active");
  }
  else{
    document.getElementById("hiBtn")?.classList.add("active");
  }

}


// ---------------- FILE UPLOAD ----------------

async function uploadFile(){

  let file = document.getElementById("fileUpload").files[0];
  let result = document.getElementById("result");

  if(!file){
    alert("Please upload PDF file");
    return;
  }

  if(file.type !== "application/pdf"){
    alert("Only PDF allowed");
    return;
  }

  result.innerHTML = "🤖 AI is analyzing your report...";


  let formData = new FormData();

  formData.append("file", file);
  formData.append("language", selectedLanguage);


  try{

    let response = await fetch("http://127.0.0.1:8000/analyze", {
      method: "POST",
      body: formData
    });

    let data = await response.json();


    if(data.status === "success"){

      result.innerHTML = `
        ✅ AI Analysis Complete<br><br>

        <pre style="text-align:left;white-space:pre-wrap;">
${data.analysis}
        </pre>
      `;

    }
    else{
      result.innerHTML = "❌ Analysis Failed";
    }

  }
  catch(err){

    console.error(err);

    result.innerHTML = "⚠️ Server Error";

  }

}
