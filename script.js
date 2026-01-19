let groups = [];
let MAX_GROUPS = 2; // free user

function addGroup(){
  if(groups.length >= MAX_GROUPS){
    alert("Group limit reached. Upgrade required.");
    return;
  }

  let link = document.getElementById("groupLink").value;
  let expiry = document.getElementById("expiry").value;

  if(!link || !expiry){
    alert("Enter group link and expiry");
    return;
  }

  groups.push({
    link,
    expiry: new Date(expiry)
  });

  document.getElementById("groupLink").value="";
  render();
}

function render(){
  let now = new Date();
  groups = groups.filter(g => g.expiry > now); // AUTO REMOVE EXPIRED

  let html="";
  groups.forEach(g=>{
    html+=`
      <tr>
        <td>${g.link}</td>
        <td>${g.expiry.toLocaleString()}</td>
        <td class="status-active">Active</td>
      </tr>`;
  });

  document.getElementById("groupList").innerHTML = html;
}

// check every 30 seconds
setInterval(render,30000);
