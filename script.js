/* ==========================
   DROPDOWN MENU
========================== */
document.addEventListener("DOMContentLoaded", () => {
  const dropdowns = document.querySelectorAll(".dropdown");

  dropdowns.forEach(drop => {
    const menu = drop.querySelector(".dropdown-menu");
    let hideTimer = null;

    drop.addEventListener("mouseenter", () => {
      if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
      menu.style.display = "block";
    });

    drop.addEventListener("mouseleave", () => {
      hideTimer = setTimeout(() => { menu.style.display = "none"; }, 50);
    });

    menu.addEventListener("mouseenter", () => {
      if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
      menu.style.display = "block";
    });

    menu.addEventListener("mouseleave", () => {
      hideTimer = setTimeout(() => { menu.style.display = "none"; }, 250);
    });
  });
});
/////////////////////////////////////////////////

////////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const errorMsg = document.getElementById("errorMsg");

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const username = document.getElementById("loginUsername").value.trim();
      const password = document.getElementById("loginPassword").value.trim();

      if (username === "" || password === "") {
        errorMsg.textContent = "الرجاء ملء جميع الحقول!";
        return;
      }

      let users = JSON.parse(localStorage.getItem("users")) || [];
      const found = users.find(user => user.username === username && user.password === password);

      if (found) {
        errorMsg.textContent = "";
        // alert("تم تسجيل الدخول بنجاح 🎉");
        window.location.href = "../HTML/Control.html";
      } else {
        errorMsg.textContent = "اسم المستخدم أو كلمة المرور غير صحيحة!";
      }
    });
  }

  const addUserForm = document.getElementById("addUserForm");
  const msg = document.getElementById("msg");

  if (addUserForm) {
    addUserForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const username = document.getElementById("addUsername").value.trim();
      const password = document.getElementById("addPassword").value.trim();

      if (username === "" || password === "") {
        msg.textContent = "الرجاء ملء جميع الحقول!";
        msg.style.color = "red";
        return;
      }

      const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{6,}$/;
      if (!passwordPattern.test(password)) {
        msg.textContent = "كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل، أرقام، حروف ورموز!";
        msg.style.color = "red";
        return;
      }

      let users = JSON.parse(localStorage.getItem("users")) || [];
      const exists = users.some(user => user.username === username);

      if (exists) {
        msg.textContent = "المستخدم موجود مسبقًا!";
        msg.style.color = "red";
        return;
      }

      users.push({ username, password });
      localStorage.setItem("users", JSON.stringify(users));

      msg.textContent = "تمت إضافة المستخدم بنجاح ✅";
      msg.style.color = "green";

      addUserForm.reset();
      renderUsers();
    });
  }

  function renderUsers() {
    const tbody = document.querySelector("#usersTable tbody");
    tbody.innerHTML = "";
    let users = JSON.parse(localStorage.getItem("users")) || [];
    users.forEach((user, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${user.username}</td>
        <td>${"*".repeat(user.password.length)}</td>
        <td><button onclick="deleteUser(${index})">حذف</button></td>
      `;
      tbody.appendChild(tr);
    });
  }

  
  window.deleteUser = function(index) {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    users.splice(index, 1);
    localStorage.setItem("users", JSON.stringify(users));
    renderUsers();
  }


  if (document.getElementById("usersTable")) renderUsers();
});
