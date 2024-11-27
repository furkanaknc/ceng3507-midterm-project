import { getCourses, deleteStudentFromCourse} from "../../utils/course.util.js";
import { getStudentById } from "../../utils/student.util.js";
import { showCourses } from "./courses.view.js";

export function deleteStudentFromCourseForm() {
    const courses = getCourses();

    document.getElementById('dynamic-content').innerHTML = `
        <h2>Delete Student from Course</h2>
        <form id="delete-student-from-course-form">
            <div class="form-group">
                <select id="course-select" required>
                    <option value="">Select Course</option>
                    ${courses.map(course =>
        `<option value="${course.name}">${course.name}</option>`
    ).join('')}
                </select>
            </div>
            <div class="form-group">
                <select id="student-select" required disabled>
                    <option value="">Select Student</option>
                </select>
            </div>
            <button class="form-btn" type="submit">Delete Student from Course</button>
        </form>`;

    document.getElementById('course-select').addEventListener('change', function () {
        const studentSelect = document.getElementById('student-select');
        const selectedCourse = courses.find(c => c.name === this.value);

        if (selectedCourse) {
            studentSelect.disabled = false;
            studentSelect.innerHTML = '<option value="">Select Student</option>';

            const enrolledStudents = selectedCourse.students.map(student => {
                const studentDetails = getStudentById(student.id);
                return `<option value="${student.id}">
                    ${studentDetails.name} ${studentDetails.surname} (ID: ${student.id})
                </option>`;
            }).join('');

            studentSelect.innerHTML += enrolledStudents;
        } else {
            studentSelect.disabled = true;
            studentSelect.innerHTML = '<option value="">Select Student</option>';
        }
    });

    document.getElementById('delete-student-from-course-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const courseName = document.getElementById('course-select').value;
        const studentId = document.getElementById('student-select').value;

        if (!courseName || !studentId) {
            alert('Please select both course and student');
            return;
        }

        const success = deleteStudentFromCourse(studentId, courseName);
        
        if (success) {
            showCourses(); 
        } else {
            alert('Failed to remove student from course.');
        }
    });
}