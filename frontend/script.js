fetch("http://localhost:3000/api/stores")
  .then((res) => res.json())
  .then((data) => {
    const list = document.getElementById("storeList");
    list.innerHTML = "";

    data.forEach((store) => {
      const li = document.createElement("li");
      li.innerText = `${store.name} - ${store.district ?? "Not Specified"}`;

      const btn = document.createElement("button");
      btn.innerText = "Delete";
      btn.onclick = () => deleteStore(store.id);

      li.appendChild(btn);
      list.appendChild(li);
    });
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
