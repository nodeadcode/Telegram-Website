const API_URL = "http://localhost:8000";

const profile = {
  name: "Philo",
  accounts: []
};

document.getElementById("userName").innerText = profile.name;
document.getElementById("profileName").innerText = profile.name;

function renderAccounts() {
  const container = document.getElementById("accountsContainer");
  container.innerHTML = "";

  profile.accounts.forEach(acc => {
    const div = document.createElement("div");
    div.className = "account-card fade-slide";

    div.innerHTML = `
      <h3>📱 ${acc.phone}</h3>
      <p class="status ${acc.running ? "running" : "stopped"}">
        ${acc.running ? "🟢 Running" : "🔴 Stopped"}
      </p>
      <p>Groups: ${acc.groups}/10</p>
      <p>Sent today: ${acc.today}</p>
      <button onclick="toggleBot('${acc.phone}')">
        ${acc.running ? "Stop" : "Start"}
      </button>
    `;

    container.appendChild(div);
  });

  document.getElementById("totalAccounts").innerText = profile.accounts.length;
}

function openAddAccount() {
  alert("Next: OTP modal will open");
}

/* Dummy data for now */
profile.accounts.push({
  phone: "+91xxxxxx",
  groups: 7,
  today: 18,
  running: true
});

renderAccounts();


