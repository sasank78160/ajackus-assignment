  let employees = [];
  let currentPage = 1;
  const itemsPerPage = 10;

  function toggleTheme() {
      document.body.classList.toggle("dark-mode");
      const icon = document.getElementById("themeIcon");
      if (document.body.classList.contains("dark-mode")) {
          icon.classList.remove("bi-moon-fill");
          icon.classList.add("bi-sun-fill");
      } else {
          icon.classList.remove("bi-sun-fill");
          icon.classList.add("bi-moon-fill");
      }
  }

  function openForm() {
      document.getElementById("employeeForm").style.display = "flex";
  }

  function closeForm() {
      document.getElementById("employeeForm").style.display = "none";
      document.getElementById("form").reset();
      document.getElementById("employeeId").value = "";
  }

  function submitForm(event) {
      event.preventDefault();
      const id = document.getElementById("employeeId").value;
      const firstName = document.getElementById("firstName").value;
      const lastName = document.getElementById("lastName").value;
      const email = document.getElementById("email").value;
      const department = document.getElementById("department").value;
      const role = document.getElementById("role").value;

      if (!firstName || !lastName || !email || !department || !role) {
          alert("All fields are required.");
          return;
      }

      if (id) {
          const index = employees.findIndex(emp => emp.id === id);
          employees[index] = {
              id,
              firstName,
              lastName,
              email,
              department,
              role
          };
      } else {
          employees.push({
              id: Date.now().toString(),
              firstName,
              lastName,
              email,
              department,
              role
          });
      }

      closeForm();
      renderEmployeeList();
  }

  function renderEmployeeList() {
      const employeeList = document.getElementById("employeeList");
      employeeList.innerHTML = "";
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const paginatedEmployees = employees.slice(start, end);

      if (employees.length === 0) {
          employeeList.innerHTML = "<p class='loading'>No employees found.</p>";
          return;
      }

      paginatedEmployees.forEach(emp => {
          const card = document.createElement("div");
          card.className = "employee-card";
          card.innerHTML = `
          <p>${emp.firstName} ${emp.lastName}</p>
          <p>${emp.email}</p>
          <p>${emp.department}</p>
          <p>${emp.role}</p>
          <button onclick="editEmployee('${emp.id}')">Edit</button>
          <button onclick="deleteEmployee('${emp.id}')">Delete</button>
        `;
          employeeList.appendChild(card);
      });

      renderPagination();
  }

  function editEmployee(id) {
      const emp = employees.find(emp => emp.id === id);
      document.getElementById("employeeId").value = emp.id;
      document.getElementById("firstName").value = emp.firstName;
      document.getElementById("lastName").value = emp.lastName;
      document.getElementById("email").value = emp.email;
      document.getElementById("department").value = emp.department;
      document.getElementById("role").value = emp.role;
      openForm();
  }

  function deleteEmployee(id) {
      employees = employees.filter(emp => emp.id !== id);
      renderEmployeeList();
  }

  function renderPagination() {
      const pagination = document.getElementById("pagination");
      pagination.innerHTML = "";
      const totalPages = Math.ceil(employees.length / itemsPerPage);

      for (let i = 1; i <= totalPages; i++) {
          const pageButton = document.createElement("button");
          pageButton.innerText = i;
          pageButton.onclick = () => {
              currentPage = i;
              renderEmployeeList();
          };
          pagination.appendChild(pageButton);
      }
  }

  function applyFilters() {
      const department = document.getElementById("departmentFilter").value;
      const filteredEmployees = employees.filter(emp =>
          !department || emp.department === department
      );
      renderFilteredEmployeeList(filteredEmployees);
  }

  function renderFilteredEmployeeList(filteredEmployees) {
      const employeeList = document.getElementById("employeeList");
      employeeList.innerHTML = "";

      if (filteredEmployees.length === 0) {
          employeeList.innerHTML = "<p class='loading'>No matching employees found.</p>";
          return;
      }

      filteredEmployees.forEach(emp => {
          const card = document.createElement("div");
          card.className = "employee-card";
          card.innerHTML = `
          <p>${emp.firstName} ${emp.lastName}</p>
          <p>${emp.email}</p>
          <p>${emp.department}</p>
          <p>${emp.role}</p>
          <button onclick="editEmployee('${emp.id}')">Edit</button>
          <button onclick="deleteEmployee('${emp.id}')">Delete</button>
        `;
          employeeList.appendChild(card);
      });
  }

  function resetFilters() {
      document.getElementById("departmentFilter").value = "";
      document.getElementById("searchBar").value = "";
      renderEmployeeList();
  }

  document.getElementById("searchBar").addEventListener("input", function() {
      const query = this.value.toLowerCase();
      const filtered = employees.filter(emp =>
          emp.firstName.toLowerCase().includes(query) ||
          emp.lastName.toLowerCase().includes(query) ||
          emp.email.toLowerCase().includes(query)
      );
      renderFilteredEmployeeList(filtered);
  });

  document.getElementById("clearSearch").addEventListener("click", function() {
      document.getElementById("searchBar").value = "";
      renderEmployeeList();
  });