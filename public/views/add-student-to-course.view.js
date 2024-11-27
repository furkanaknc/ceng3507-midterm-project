import { getCourses,addStudentToCourse } from "../../utils/course.util.js";
import { getStudents } from "../../utils/student.util.js";
import { showCourses } from "./courses.view.js";

export function addStudentToCourseForm() {
    const students = getStudents();
    const courses = getCourses();

    document.getElementById('dynamic-content').innerHTML = `
        <h2>Add Student to Course</h2>
        <form id="add-student-to-course-form">
            <div class="form-group">
                <select id="student-select" required>
                    <option value="">Select Student</option>
                    ${students.map(student =>
        `<option value="${student.id}">${student.name} ${student.surname} (ID: ${student.id})</option>`
    ).join('')}
                </select>
            </div>
            <div class="form-group">
                <select id="course-select" required>
                    <option value="">Select Course</option>
                    ${courses.map(course =>
        `<option value="${course.name}">${course.name} (${course.gradingScale})</option>`
    ).join('')}
                </select>
            </div>
            <div class="form-group">
                <input type="number" id="midterm-grade" 
                    placeholder="Midterm Grade (0-100)" 
                    min="0" max="100" required>
            </div>
            <div class="form-group">
                <input type="number" id="final-grade" 
                    placeholder="Final Grade (0-100)" 
                    min="0" max="100" required>
            </div>
            <button class="form-btn" type="submit">Add Student to Course</button>
        </form>`;

    document.getElementById('add-student-to-course-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const studentId = document.getElementById('student-select').value;
        const courseName = document.getElementById('course-select').value;
        const midtermGrade = Number(document.getElementById('midterm-grade').value);
        const finalGrade = Number(document.getElementById('final-grade').value);

        if (midtermGrade < 0 || midtermGrade > 100 || finalGrade < 0 || finalGrade > 100) {
            alert('Grades must be between 0 and 100');
            return;
        }

        const course = courses.find(c => c.name === courseName);
        if (course.students.some(s => s.id === studentId)) {
            alert('Student is already enrolled in this course!');
            return;
        }

        const success = addStudentToCourse(studentId, courseName, midtermGrade, finalGrade);

        if (success) {
            showCourses();
        } else {
            alert('Failed to add student to course.');
        }
    });
}