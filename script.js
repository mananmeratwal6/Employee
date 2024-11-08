let employees = JSON.parse(localStorage.getItem("employees")) || [];
let editIndex = null;

document.addEventListener("DOMContentLoaded", renderEmployees);

// Render Employee Table with Profile Pictures
function renderEmployees() {
  const employeeList = document.getElementById("employeeList");
  employeeList.innerHTML = "";
  employees.forEach((employee, index) => {
    const row = document.createElement("tr");
    const profilePhoto = employee.photo ? employee.photo : "default-profile.png";
    
    row.innerHTML = `
      <td><img src="${profilePhoto}" alt="Profile" class="profile-pic"></td>
      <td>${employee.name}</td>
      <td>${employee.position}</td>
      <td>${employee.department}</td>
      <td>${employee.hireDate}</td>
      <td>
        <button class="btn edit" onclick="editEmployee(${index})">Edit</button>
        <button class="btn delete" onclick="deleteEmployee(${index})">Delete</button>
      </td>
    `;
    employeeList.appendChild(row);
  });
}

// Open Form with Modal
function openForm() {
  document.getElementById("employeeFormModal").style.display = "block";
}

// Close Form
function closeForm() {
  document.getElementById("employeeFormModal").style.display = "none";
  document.getElementById("employeeForm").reset();
  editIndex = null;
}

// Save Employee Data including Photo
function saveEmployee() {
  const photoInput = document.getElementById("photo");
  const photoUrl = photoInput.files[0] ? URL.createObjectURL(photoInput.files[0]) : "";

  const employee = {
    photo: photoUrl,
    name: document.getElementById("name").value,
    position: document.getElementById("position").value,
    department: document.getElementById("department").value,
    hireDate: document.getElementById("hireDate").value,
    contact: document.getElementById("contact").value,
    address: document.getElementById("address").value
  };
  
  if (editIndex === null) {
    employees.push(employee);
  } else {
    employees[editIndex] = employee;
}
localStorage.setItem("employees", JSON.stringify(employees));
  renderEmployees();
  closeForm();
}

// Edit Employee Data
function editEmployee(index) {
  const employee = employees[index];
  editIndex = index;

  document.getElementById("name").value = employee.name;
  document.getElementById("position").value = employee.position;
  document.getElementById("department").value = employee.department;
  document.getElementById("hireDate").value = employee.hireDate;
  document.getElementById("contact").value = employee.contact;
  document.getElementById("address").value = employee.address;
  
  // Show current profile photo in form if it exists
  if (employee.photo) {
    const photoInput = document.getElementById("photo");
    photoInput.setAttribute("data-image-url", employee.photo); // Temporary placeholder
  }

  document.getElementById("employeeFormModal").style.display = "block";
}

// Delete Employee
function deleteEmployee(index) {
  if (confirm("Are you sure you want to delete this employee?")) {
    employees.splice(index, 1);
    localStorage.setItem("employees", JSON.stringify(employees));
    renderEmployees();
  }
}

// Search and Filter Employees
document.getElementById("search").addEventListener("input", filterEmployees);
document.getElementById("filterDepartment").addEventListener("change", filterEmployees);

function filterEmployees() {
  const searchQuery = document.getElementById("search").value.toLowerCase();
  const departmentFilter = document.getElementById("filterDepartment").value;

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchQuery);
    const matchesDepartment = departmentFilter === "" || employee.department === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  renderFilteredEmployees(filteredEmployees);
}

function renderFilteredEmployees(filteredEmployees) {
  const employeeList = document.getElementById("employeeList");
  employeeList.innerHTML = "";
  filteredEmployees.forEach((employee, index) => {
    const row = document.createElement("tr");
    const profilePhoto = employee.photo || "default-profile.png";
    
    row.innerHTML = `
      <td><img src="${profilePhoto}" alt="Profile" class="profile-pic"></td>
      <td>${employee.name}</td>
      <td>${employee.position}</td>
      <td>${employee.department}</td>
      <td>${employee.hireDate}</td>
      <td>
        <button class="btn edit" onclick="editEmployee(${index})">Edit</button>
        <button class="btn delete" onclick="deleteEmployee(${index})">Delete</button>
      </td>
    `;
    employeeList.appendChild(row);
  });
}

// Sort Table by Column
function sortTable(key) {
  employees.sort((a, b) => (a[key] > b[key] ? 1 : -1));
  renderEmployees();
}

// Export to CSV
function exportCSV() {
  const headers = ["Photo URL", "Name", "Position", "Department", "Hire Date", "Contact", "Address"];
  const rows = employees.map(employee => [
    employee.photo || "default-profile.png",
    employee.name,
    employee.position,
    employee.department,
    employee.hireDate,
    employee.contact,
    employee.address,
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map(row => row.join(","))
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "employees.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

// Responsive Pagination
const itemsPerPage = 10;
let currentPage = 1;

function renderPaginatedEmployees() {
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedEmployees = employees.slice(start, end);
  renderFilteredEmployees(paginatedEmployees);
}

function nextPage() {
  if (currentPage * itemsPerPage < employees.length) {
    currentPage++;
    renderPaginatedEmployees();
  }
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    renderPaginatedEmployees();
  }
}

// Initialize Pagination Controls
document.addEventListener("DOMContentLoaded", () => {
  renderPaginatedEmployees();
  document.getElementById("nextPage").addEventListener("click", nextPage);
  document.getElementById("prevPage").addEventListener("click", prevPage);
});
