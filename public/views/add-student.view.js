import {getStudents, addNewStudent } from "../../utils/student.util.js";
import { showStudents } from "./students.view.js";

export function addStudent() {
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

    document.getElementById('add-student-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const studentName = document.getElementById('student-name').value;
        const studentSurname = document.getElementById('student-surname').value;
        const studentID = document.getElementById('student-id').value;

        const students = getStudents();
        if (students.some(student => student.id === studentID)) {
            alert(`Student ID "${studentID}" already exists!`);
            return;
        }

        addNewStudent({
            id: studentID,
            name: studentName,
            surname: studentSurname,
            courses: []
        });

        showStudents();
    });
}