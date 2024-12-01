import { calculateGrade,computeMean, calculateGPA, calculateTotalGPA} from "../../utils/calculate.util.js";
import { getCourses } from "../../utils/course.util.js";
import { getStudents, updateGrades, deleteStudent, updateStudent } from "../../utils/student.util.js";


// Main function that renders the student dashboard
// Shows all students, their GPAs, and enrolled courses
export function showStudents() {
    const students = getStudents();
    const courses = getCourses();

    let content = '<h2>Students</h2>';

    if (students.length === 0) {
        content += '<p>No students available. Add a student to get started.</p>';
    } else {
        students.forEach(student => {
            const totalGPA = calculateTotalGPA(student);

            // Build student info card with update/delete actions
            content += `
                <div class="student-container">
                     <h3>${student.name} ${student.surname} (ID: ${student.id})</h3>
                     <p>Total GPA: ${totalGPA}</p>
                    <div class="student-actions">
                        <button class="form-btn update-student-btn" 
                            data-id="${student.id}"
                            data-name="${student.name}"
                            data-surname="${student.surname}">
                            Update
                        </button>
                        <button class="form-btn delete-student-btn" 
                            data-id="${student.id}">
                            Delete
                        </button>
                    </div>
                    <div class="courses-list">
                        <h4>Enrolled Courses:</h4>`;

            if (student.courses.length === 0) {
                content += '<p>No courses enrolled.</p>';
            } else {
                content += '<ul>';

                // For each course, calculate and display grades
                student.courses.forEach(course => {
                    const courseDetails = courses.find(c => c.name === course.courseName);
                    if (courseDetails) {

                        // Calculate mean score, letter grade and GPA for this course
                        const mean = computeMean(course.midtermScore, course.finalScore);
                        const letterGrade = calculateGrade(mean, courseDetails.gradingScale);
                        const gpa = calculateGPA(letterGrade);
                        
                        content += `
                            <li>
                                ${course.courseName} - 
                                Midterm: ${course.midtermScore}, 
                                Final: ${course.finalScore}, 
                                GPA: ${gpa}, 
                                Grade: ${letterGrade}
                                <button class="form-btn update-grade-btn">Update</button>
                            </li>
                        `;
                    }
                });
                content += '</ul>';
            }

            content += '</div></div><hr>';
        });
    }

    document.getElementById('dynamic-content').innerHTML = content;

    // Watch for clicks on our action buttons
    // These handle updating student info, deleting students, and changing grades
    document.querySelectorAll('.update-student-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const btn = e.target;
            showUpdateStudentForm(
                btn.dataset.id,
                btn.dataset.name,
                btn.dataset.surname
            );
        });
    });

    document.querySelectorAll('.delete-student-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const studentId = e.target.dataset.id;
            
            if (confirm('Are you sure you want to delete this student?')) {
                deleteStudent(studentId);
                showStudents();
            }
        });
    });

    document.querySelectorAll('.update-grade-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const li = e.target.closest('li');
            updateGrades(
                li.dataset.studentId,
                li.dataset.courseName,
                Number(li.dataset.midterm),
                Number(li.dataset.final)
            );
        });
    });
}

// Shows a form to edit a student's basic info
// We use this when someone clicks the "Update" button
export function showUpdateStudentForm(studentId, currentName, currentSurname) {
    document.getElementById('dynamic-content').innerHTML = `
        <h2>Update Student Information</h2>
        <form id="update-student-form">
            <div class="form-group">
                <label for="student-name">First Name:</label>
                <input type="text" id="student-name" value="${currentName}" required>
            </div>
            <div class="form-group">
                <label for="student-surname">Last Name:</label>
                <input type="text" id="student-surname" value="${currentSurname}" required>
            </div>
            <div class="form-group">
                <label for="student-id">Student ID:</label>
                <input type="text" id="student-id" value="${studentId}" required>
            </div>
            <div class="form-group">
                <button class="form-btn" type="submit">Save</button>
            </div>
        </form>`;

    document.getElementById('update-student-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const newName = document.getElementById('student-name').value;
        const newSurname = document.getElementById('student-surname').value;
        const newId = document.getElementById('student-id').value;

        // Make sure we're not trying to use an ID that belongs to someone else
        if (newId !== studentId) {
            const students = getStudents();
            if (students.some(s => s.id === newId)) {
                alert(`Student ID "${newId}" already exists!`);
                
                return;
            }
        }

        // Try to update their info and show a message if something goes wrong
        const success = updateStudent(studentId, {
            id: newId,
            name: newName,
            surname: newSurname
        });

        if (success) {
            showStudents();
        } else {
            alert('Failed to update student information.');
        }
    });
}

// This handles all our grade updates
// It's separate from the other click handlers because it's more complex
document.addEventListener('click', function(e) {

    // Handle updating grades when the update button is clicked
    if (e.target.classList.contains('update-grade-btn')) {
        const listItem = e.target.closest('li');
        const studentContainer = e.target.closest('.student-container');
        const studentId = studentContainer.querySelector('h3').textContent.match(/ID: (\w+)/)[1];
        const courseName = listItem.textContent.split('-')[0].trim();
        const currentMidterm = listItem.textContent.match(/Midterm: (\d+)/)[1];
        const currentFinal = listItem.textContent.match(/Final: (\d+)/)[1];

        // Create inline form for updating grades
        const form = `
            <div class="update-grade-form">
                <h4>Update Grades for ${courseName}</h4>
                <input type="number" id="new-midterm" value="${currentMidterm}" min="0" max="100" required>
                <input type="number" id="new-final" value="${currentFinal}" min="0" max="100" required>
                <button class="form-btn save-grades-btn" 
                    data-student-id="${studentId}" 
                    data-course-name="${courseName}">Save</button>
            </div>
        `;
        listItem.innerHTML = form;
    }
    
    // Handle saving updated grades
    if (e.target.classList.contains('save-grades-btn')) {
        const btn = e.target;
        const studentId = btn.dataset.studentId;
        const courseName = btn.dataset.courseName;
        
        // Convert input values to numbers
        const newMidterm = Number(document.getElementById('new-midterm').value);
        const newFinal = Number(document.getElementById('new-final').value);

        if (newMidterm < 0 || newMidterm > 100 || newFinal < 0 || newFinal > 100) {
            return;
        }

        // Update grades and refresh the view
        updateGrades(studentId, courseName, newMidterm, newFinal);
        showStudents();
    }
});
