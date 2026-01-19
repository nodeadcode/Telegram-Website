let groups = [];

function sendOTP(){
  document.getElementById("otpBox").style.display="block";
  // fetch(API /login)
}

function verifyOTP(){
  location.href="dashboard.html";
  // fetch(API /verify)
}

function show(id){
  document.querySelectorAll("section").forEach(s=>s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

function addGroup(){
  let link=document.getElementById("groupLink").value;
  let exp=document.getElementById("expiry").value;
  if(!link||!exp)return alert("Missing fields");

  groups.push({link,exp});
  renderGroups();
}

function renderGroups(){
  let html="";
  let now=new Date();
  groups=groups.filter(g=>new Date(g.exp)>now);
  groups.forEach(g=>{
    html+=`<tr><td>${g.link}</td><td>${g.exp}</td></tr>`;
  });
  document.getElementById("groupList").innerHTML=html;
}

setInterval(renderGroups,30000);

function saveMessage(){
  alert("Message saved (UI)");
}

function start(){
  let d=document.getElementById("delay").value;
  if(d<20)return alert("Min 20 minutes");
  document.getElementById("status").innerText="Forwarding started";
}

function stop(){
  document.getElementById("status").innerText="Stopped";
}

function logout(){
  location.href="index.html";
}
