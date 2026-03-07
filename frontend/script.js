fetch("http://localhost:3000/checkLoggedIn",{credentials: "include"})
.then(res=> res.json())
.then(isLoggedIn => {
  fetch("http://localhost:3000/api/stores")
    .then((res) => res.json())
    .then((data) => {
      const list = document.getElementById("storeList");
      list.innerHTML = "";

      data.forEach((store) => {
        const li = document.createElement("li");
        li.innerText = `${store.name} - ${store.district ?? "Not Specified"}`

            if(isLoggedIn.isLoggedIn){
        
              const btn = document.createElement("button");
          
              btn.innerText = "Delete";
              btn.onclick = () => deleteStore(store.id)
              li.appendChild(btn);

            }
            list.appendChild(li);
          })
          
      });
      const hideAddStore= document.getElementById("addStore")
      const hideupdateStore= document.getElementById("updateStore")
      const adminLogin = document.getElementById("adminLoginDiv")
      const logout = document.getElementById("logoutDiv")
      if(isLoggedIn.isLoggedIn){

        hideAddStore.style.display = 'block'
        hideupdateStore.style.display = 'block'

        logout.style.display = 'block'
        adminLogin.style.display = 'none'
      }else {
        logout.style.display = 'none'
        hideAddStore.style.display = 'none'
        hideupdateStore.style.display = 'none'
        adminLogin.style.display = 'block'
      }
    
    })
    .catch((err) => console.error("Fetch error:", err));
function addStore() {
  const name = document.getElementById("name").value;
  const district = document.getElementById("district").value;
  const url = document.getElementById("url").value;

  fetch("http://localhost:3000/api/stores", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, district, url }),
  })
    .then((res) => res.json())
    .then((data) => {
      alert("Store added!");
      location.reload();
    })
    .catch((err) => console.error(err));
}
function updateStore() {
  const id = document.getElementById("updateId").value;
  const name = document.getElementById("updateName").value;
  const district = document.getElementById("updateDistrict").value;

  fetch(`http://localhost:3000/api/stores/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, district }),
  })
    .then((res) => res.json())
    .then((data) => {
      alert("Store updated!");
      location.reload();
    })
    .catch((err) => console.error(err));
}
function deleteStore(id) {
  fetch(`http://localhost:3000/api/stores/${id}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then(() => {
      alert("Store deleted!");
      location.reload();
    })
    .catch((err) => console.error("Delete error:", err));
}

function adminLogin(){
  const name = document.getElementById("adminName").value;
  const password = document.getElementById("adminPassword").value;

    fetch(`http://localhost:3000/Login`, {
      method: "POST",
      credentials: "include", 
      headers: {
      "Content-Type": "application/json",
    },
     body: JSON.stringify({ name,  password }),
  })
    .then((res) => res.json())
    .then((data) => {
      if(data.success){
        alert("admin is logged in")
        location.reload();
      }else {
        alert("Wrong username or password")
      }
    })
    .catch((err) => console.error("adminLogin error: ", err));
}
function adminLogout(){
  fetch(`http://localhost:3000/logout`, {
      method: "GET",
      credentials: "include", 
      headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      if(data){
        alert("admin is logged out")
        location.reload();
      }else{
        alert("log out failed")
      }
    })
    .catch((err) => console.error("adminLogin error: ", err));
}
