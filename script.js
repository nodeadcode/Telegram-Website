let groups = [];
let accounts = JSON.parse(localStorage.getItem('telegramAccounts')) || [];

function login(){
  let name = document.getElementById("nameInput").value.trim();
  if(!name) return alert("Please enter your name");
  
  localStorage.setItem('profileName', name);
  location.href = 'dashboard.html';
}

function show(id){
  // Hide all sections
  document.querySelectorAll("main section").forEach(s=>s.style.display="none");
  // Show selected section
  document.getElementById(id).style.display="block";
  
  // Update active nav link
  document.querySelectorAll(".sidebar nav a").forEach(a=>a.classList.remove("active"));
  event.target.classList.add("active");
}

function addGroup(){
  let link=document.getElementById("groupLink").value;
  let exp=document.getElementById("expiry").value;
  if(!link||!exp)return alert("Missing fields");

  groups.push({link,exp});
  renderGroups();
}

function renderAccounts(){
  let html = '';
  accounts.forEach((acc, index) => {
    html += `
      <div class="account-item">
        <span>${acc.phone}</span>
        <span>Status: ${acc.status}</span>
        <button class="secondary-btn" onclick="startAccount(${index})">Start</button>
        <button class="secondary-btn" onclick="stopAccount(${index})">Stop</button>
      </div>
    `;
  });
  document.getElementById('accountsList').innerHTML = html;
}

setInterval(renderGroups,30000);

function saveMessage(){
  let message = document.getElementById("messageText").value;
  if(!message.trim()) return alert("Please enter a message");
  alert("Message saved successfully!");
  // In real app, would save to backend
}

function previewMessage(){
  let message = document.getElementById("messageText").value;
  if(!message.trim()) return alert("Please enter a message first");
  alert("Preview:\n\n" + message);
}

function start(){
  let d=document.getElementById("delay").value;
  if(d<20)return alert("Min 20 minutes");
  document.getElementById("statusText").innerText="Forwarding started - Active";
  // In real app, would start the forwarding process
}

function stop(){
  document.getElementById("statusText").innerText="Stopped";
  // In real app, would stop the forwarding process
}
}

function logout(){
  location.href="index.html";
}

function toggleSidebar(){
  document.querySelector('.sidebar').classList.toggle('open');
}

// Add Account Modal
function showAddAccountModal(){
  // Create modal
  let modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close" onclick="closeModal()">&times;</span>
      <h2>Add Telegram Ads Account</h2>
      <form id="addAccountForm">
        <input type="text" placeholder="API ID" required>
        <input type="password" placeholder="API Hash" required>
        <input type="tel" placeholder="+91 Phone number" required>
        <button type="button" class="primary-btn" onclick="sendAccountOTP()">Send OTP</button>
      </form>
      <div class="divider" id="accountOtpDivider" style="display:none;">Enter OTP</div>
      <div id="accountOtpBox" style="display:none;">
        <input type="text" placeholder="Enter 6-digit OTP" maxlength="6" id="accountOtpInput">
        <button class="primary-btn" onclick="verifyAccountOTP()">Verify OTP</button>
      </div>
      <div class="divider" id="account2FADivider" style="display:none;">Enter 2FA Password</div>
      <div id="account2FABox" style="display:none;">
        <input type="password" placeholder="Enter 2FA Password" id="account2FAInput">
        <button class="primary-btn" onclick="verifyAccount2FA()">Verify & Add</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  modal.style.display = 'block';
}

function closeModal(){
  let modal = document.querySelector('.modal');
  if(modal) modal.remove();
}

function sendAccountOTP(){
  let form = document.getElementById("addAccountForm");
  let inputs = form.querySelectorAll("input");
  let allFilled = true;
  
  inputs.forEach(input => {
    if(!input.value.trim()) {
      input.style.borderColor = "#ef4444";
      allFilled = false;
    } else {
      input.style.borderColor = "#1e293b";
    }
  });
  
  if(!allFilled) return alert("Please fill all fields");
  
  let apiId = inputs[0].value;
  let apiHash = inputs[1].value;
  let phone = inputs[2].value;
  
  // Prepare API call to backend
  fetch('/api/send-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiId, apiHash, phone })
  })
  .then(response => response.json())
  .then(data => {
    if(data.success) {
      document.getElementById("accountOtpBox").style.display="block";
      document.getElementById("accountOtpDivider").style.display="block";
      alert("OTP sent to your phone!");
    } else {
      alert("Failed to send OTP: " + data.message);
    }
  })
  .catch(error => alert("Error: " + error));
}

function verifyAccountOTP(){
  let otp = document.getElementById("accountOtpInput").value;
  if(otp.length !== 6) return alert("Enter 6-digit OTP");
  
  let form = document.getElementById("addAccountForm");
  let inputs = form.querySelectorAll("input");
  let apiId = inputs[0].value;
  let apiHash = inputs[1].value;
  let phone = inputs[2].value;
  
  // Prepare API call to backend
  fetch('/api/verify-otp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiId, apiHash, phone, otp })
  })
  .then(response => response.json())
  .then(data => {
    if(data.success) {
      if(data.requires2FA) {
        document.getElementById("account2FABox").style.display="block";
        document.getElementById("account2FADivider").style.display="block";
      } else {
        addAccount(apiId, apiHash, phone);
      }
    } else {
      alert("OTP verification failed: " + data.message);
    }
  })
  .catch(error => alert("Error: " + error));
}

function verifyAccount2FA(){
  let password = document.getElementById("account2FAInput").value;
  if(!password) return alert("Enter 2FA password");
  
  let form = document.getElementById("addAccountForm");
  let inputs = form.querySelectorAll("input");
  let apiId = inputs[0].value;
  let apiHash = inputs[1].value;
  let phone = inputs[2].value;
  
  // Prepare API call to backend
  fetch('/api/verify-2fa', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiId, apiHash, phone, password })
  })
  .then(response => response.json())
  .then(data => {
    if(data.success) {
      addAccount(apiId, apiHash, phone);
    } else {
      alert("2FA verification failed: " + data.message);
    }
  })
  .catch(error => alert("Error: " + error));
}

function addAccount(apiId, apiHash, phone){
  accounts.push({ apiId, apiHash, phone, status: 'stopped' });
  localStorage.setItem('telegramAccounts', JSON.stringify(accounts));
  renderAccounts();
  alert("Account added successfully!");
  closeModal();
}

function startAccount(index){
  let acc = accounts[index];
  // Prepare API call to backend
  fetch('/api/start-account', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiId: acc.apiId, apiHash: acc.apiHash, phone: acc.phone })
  })
  .then(response => response.json())
  .then(data => {
    if(data.success) {
      accounts[index].status = 'running';
      localStorage.setItem('telegramAccounts', JSON.stringify(accounts));
      renderAccounts();
      alert("Account started!");
    } else {
      alert("Failed to start account: " + data.message);
    }
  })
  .catch(error => alert("Error: " + error));
}

function stopAccount(index){
  let acc = accounts[index];
  // Prepare API call to backend
  fetch('/api/stop-account', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiId: acc.apiId, apiHash: acc.apiHash, phone: acc.phone })
  })
  .then(response => response.json())
  .then(data => {
    if(data.success) {
      accounts[index].status = 'stopped';
      localStorage.setItem('telegramAccounts', JSON.stringify(accounts));
      renderAccounts();
      alert("Account stopped!");
    } else {
      alert("Failed to stop account: " + data.message);
    }
  })
  .catch(error => alert("Error: " + error));
}

// Add nav link on load
window.addEventListener('load', function(){
  let nav = document.querySelector('.sidebar nav');
  let accountsLink = document.createElement('a');
  accountsLink.innerHTML = '📱 Accounts';
  accountsLink.onclick = () => show('accounts');
  nav.insertBefore(accountsLink, nav.lastElementChild);
  
  let addAccountLink = document.createElement('a');
  addAccountLink.innerHTML = '📱 Add Telegram Ads Account';
  addAccountLink.onclick = showAddAccountModal;
  nav.appendChild(addAccountLink);
  
  // Add accounts section
  let main = document.querySelector('main');
  let accountsSection = document.createElement('section');
  accountsSection.className = 'card';
  accountsSection.id = 'accounts';
  accountsSection.style.display = 'none';
  accountsSection.innerHTML = '<h4>Telegram Accounts</h4><div id="accountsList"></div>';
  main.appendChild(accountsSection);
  
  renderAccounts();
});
