import {getStudents, addNewStudent } from "../../utils/student.util.js";
import { showStudents } from "./students.view.js";

// This creates a form for adding new students to our system
export function addStudent() {
    // Create a simple form with fields for student info
    document.getElementById('dynamic-content').innerHTML = `
        <h2>Add Student</h2>
        <form id="add-student-form">
            <div class="form-group">
                <input type="text" id="student-name" placeholder="First Name" required>
            </div>
            <div class="form-group">
                <input type="text" id="student-surname" placeholder="Last Name" required>
            </div>
            <div class="form-group">
                <input type="text" id="student-id" placeholder="Student ID" required>
            </div>
            <button class="form-btn" type="submit">Submit</button>
        </form>`;

    // When they submit the form:
    document.getElementById('add-student-form').addEventListener('submit', (e) => {
        // Stop the form from actually submitting (we'll handle it ourselves)
        e.preventDefault();

        // Get all the values they entered
        const studentName = document.getElementById('student-name').value;
        const studentSurname = document.getElementById('student-surname').value;
        const studentID = document.getElementById('student-id').value;

        // Check if this ID is already taken
        const students = getStudents();
        if (students.some(student => student.id === studentID)) {
            alert(`Student ID "${studentID}" already exists!`);
            return;
        }

        // Create the new student with an empty course list
        addNewStudent({
            id: studentID,
            name: studentName,
            surname: studentSurname,
            courses: [] // They'll enroll in courses later
        });

        // Show the updated student list
        showStudents();
    });
}