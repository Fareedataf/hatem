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

/* ==========================
   DYNAMIC PHONE INPUTS
========================== */
function addPhone() {
  const container = document.getElementById("phoneContainer");
  const inputs = container.querySelectorAll('input[name="phone[]"]');
  
  if (inputs.length >= 3) return;
  
  const input = document.createElement("input");
  input.type = "text";
  input.name = "phone[]";

  const addBtn = container.querySelector('.add-phone');
  container.insertBefore(input, addBtn);
}

function addParentPhone() {
  const container = document.getElementById("parentPhoneContainer");
  const inputs = container.querySelectorAll('input[name="parent_phone[]"]');
  
  if (inputs.length >= 3) return; 
  
  const input = document.createElement("input");
  input.type = "text";
  input.name = "parent_phone[]";

  const addBtn = container.querySelector('.add-phone');
  container.insertBefore(input, addBtn);
}

/* ==========================
   ADD STUDENT
========================== */
if(document.querySelector("form")){
  document.querySelector("form").addEventListener("submit", function(e){
    e.preventDefault();
    const form = e.target;

    const student = {
      first_name: form.first_name.value,
      father_name: form.father_name.value,
      grandfather_name: form.grandfather_name.value,
      last_name: form.last_name.value,
      roll_number: form.roll_number.value,
      birth_date: form.birth_date.value,
      gender: form.gender.value,
      city: form.city.value,
      district: form.district.value,
      street: form.street.value,
      phones: Array.from(form.querySelectorAll('input[name="phone[]"]')).map(i => i.value),
      parent_first_name: form.p_first_name.value,
      parent_father_name: form.p_father_name.value,
      parent_grandfather_name: form.p_grandfather_name.value,
      parent_last_name: form.p_last_name.value,
      parent_phones: Array.from(form.querySelectorAll('input[name="parent_phone[]"]')).map(i => i.value)
    };

    const students = JSON.parse(localStorage.getItem('students') || '[]');
    students.push(student);
    localStorage.setItem('students', JSON.stringify(students));

    alert("✅ تم إضافة الطالب بنجاح!");
    form.reset();
  });
}

/* ==========================
   LIST & SEARCH STUDENTS
========================== */
function renderStudents(filter = null){
  const students = JSON.parse(localStorage.getItem('students') || '[]');
  const tbody = document.querySelector("#studentsTable tbody");
  tbody.innerHTML = '';

  let filtered = students;

  if(filter){
    const {field, condition, value} = filter;
    filtered = students.filter(student => {
      let studentValue = '';
      if(field === 'address') studentValue = `${student.city} ${student.district} ${student.street}`;
      else if(field === 'parent_id') studentValue = student.parent_phones.join(' ');
      else studentValue = student[field] || '';

      studentValue = studentValue.toString().toLowerCase();
      const val = value.toLowerCase();

      if(condition === 'equals') return studentValue === val;
      if(condition === 'contains') return studentValue.includes(val);
      if(condition === 'greater') return studentValue > val;
      if(condition === 'less') return studentValue < val;
      return false;
    });
  }

  if(filtered.length === 0){
    tbody.innerHTML = '<tr><td colspan="9">لا يوجد طلاب</td></tr>';
    return;
  }

  filtered.forEach((student, index)=>{
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${student.roll_number}</td>
      <td>${student.first_name}</td>
      <td>${student.father_name}</td>
      <td>${student.grandfather_name}</td>
      <td>${student.last_name}</td>
      <td>${student.birth_date}</td>
      <td>${student.gender}</td>
      <td>${student.city} - ${student.district} - ${student.street}</td>
      <td>${student.parent_phones.join(", ")}</td>
      <td><button onclick="deleteStudent(${index})">حذف</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function deleteStudent(index){
  let students = JSON.parse(localStorage.getItem('students') || '[]');
  students.splice(index,1);
  localStorage.setItem('students', JSON.stringify(students));
  renderStudents(); 
}

document.addEventListener("DOMContentLoaded", ()=>{
  renderStudents();

  const searchBtn = document.getElementById("searchBtn");
  if(searchBtn){
    searchBtn.addEventListener("click", (e)=>{
      e.preventDefault();
      const field = document.getElementById("searchField").value;
      const condition = document.getElementById("searchCondition").value;
      const value = document.getElementById("searchInput").value;
      renderStudents({field, condition, value});
    });
  }
});
