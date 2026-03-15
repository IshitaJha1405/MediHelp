let selectedLanguage="english";
let selectedReportType="summary";

let lastResult="";


// language

function setLanguage(lang){

selectedLanguage=lang;

document.getElementById("enBtn").classList.remove("active");
document.getElementById("hiBtn").classList.remove("active");

if(lang==="english"){
document.getElementById("enBtn").classList.add("active");
}
else{
document.getElementById("hiBtn").classList.add("active");
}

}


// report type

function setReportType(type){

selectedReportType=type;

document.getElementById("sumBtn").classList.remove("active");
document.getElementById("detBtn").classList.remove("active");

if(type==="summary"){
document.getElementById("sumBtn").classList.add("active");
}
else{
document.getElementById("detBtn").classList.add("active");
}

}



// upload

async function uploadFile(){

let file=document.getElementById("fileUpload").files[0];

let result=document.getElementById("result");

if(!file){
alert("Upload PDF");
return;
}

result.innerHTML="Analyzing report...";


let formData=new FormData();

formData.append("file",file);
formData.append("language",selectedLanguage);
formData.append("report_type",selectedReportType);


try{

let response=await fetch("https://medihelp-1jcf.onrender.com/analyze",{
method:"POST",
body:formData
});

let data=await response.json();

if(data.status==="success"){

lastResult=data.analysis;

result.innerHTML=data.analysis;

document.getElementById("downloadBtn").style.display="block";

}

else{
result.innerHTML="Analysis failed";
}

}
catch(err){

result.innerHTML="Server Error";

}

}



// download pdf

function downloadPDF(){

let blob=new Blob([lastResult],{type:"application/pdf"});

let url=URL.createObjectURL(blob);

let a=document.createElement("a");

a.href=url;
a.download="MediHelp_Report.pdf";

a.click();

}


// theme toggle

document.getElementById("themeBtn").onclick=function(){

document.body.classList.toggle("dark");

}