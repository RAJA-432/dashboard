document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    const studentsContainer = document.getElementById('studentsContainer');
    let students = JSON.parse(localStorage.getItem('students')) || [];
    // Remove duplicates based on email
    const uniqueStudents = [];
    const seenEmails = new Set();
    students.forEach(student => {
        if (!seenEmails.has(student.email)) {
            seenEmails.add(student.email);
            uniqueStudents.push(student);
        }
    });
    students = uniqueStudents;
    saveStudents(); // Save cleaned data
    let editIndex = -1;

    function displayStudents() {
        studentsContainer.innerHTML = '';
        students.forEach((student, index) => {
            const card = document.createElement('div');
            card.className = 'student-card';
            card.innerHTML = `
                <h3>${student.name}</h3>
                <p>Email: ${student.email}</p>
                <p>Phone: ${student.phone}</p>
                <p>Age: ${student.age}</p>
                <p>Gender: ${student.gender}</p>
                <p>College: ${student.college}</p>
                <p>Year: ${student.year}</p>
                <p>Course: ${student.course}</p>
                <p>Address: ${student.address}</p>
                <button class="edit-btn" data-index="${index}">Edit</button>
                <button class="delete-btn" data-index="${index}">Delete</button>
            `;
            studentsContainer.appendChild(card);
        });
    }

    function saveStudents() {
        localStorage.setItem('students', JSON.stringify(students));
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const age = document.getElementById('age').value.trim();
        const gender = document.getElementById('gender').value;
        const college = document.getElementById('college').value.trim();
        const year = document.getElementById('year').value;
        const course = document.getElementById('course').value.trim();
        const address = document.getElementById('address').value.trim();

        if (!name || !email || !phone || !age || !gender || !college || !year || !course || !address) {
            alert('All fields are required.');
            return;
        }

        const existingIndex = students.findIndex(student => student.email === email);
        if (editIndex === -1) {
            if (existingIndex !== -1) {
                alert('A student with this email already exists.');
                return;
            }
            students.push({ name, email, phone, age, gender, college, year, course, address });
        } else {
            // Allow updating, even if email same
            students[editIndex] = { name, email, phone, age, gender, college, year, course, address };
            editIndex = -1;
            document.querySelector('button[type="submit"]').textContent = 'Register';
        }

        saveStudents();
        displayStudents();
        form.reset();
    });

    studentsContainer.addEventListener('click', function(e) {
        if (e.target.classList.contains('delete-btn')) {
            const index = e.target.dataset.index;
            students.splice(index, 1);
            saveStudents();
            displayStudents();
        } else if (e.target.classList.contains('edit-btn')) {
            const index = e.target.dataset.index;
            const student = students[index];
            document.getElementById('name').value = student.name;
            document.getElementById('email').value = student.email;
            document.getElementById('phone').value = student.phone;
            document.getElementById('age').value = student.age;
            document.getElementById('gender').value = student.gender;
            document.getElementById('college').value = student.college;
            document.getElementById('year').value = student.year;
            document.getElementById('course').value = student.course;
            document.getElementById('address').value = student.address;
            editIndex = index;
            document.querySelector('button[type="submit"]').textContent = 'Update';
        }
    });

    displayStudents();
});

function exportToCSV() {
    if (students.length === 0) {
        alert('No data to export.');
        return;
    }
    const ws = XLSX.utils.json_to_sheet(students);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students');
    XLSX.writeFile(wb, 'students.xlsx');
}

document.getElementById('exportBtn').addEventListener('click', exportToCSV);