import { getCourses, addNewCourse } from "../../utils/course.util.js";
import { showCourses } from "./courses.view.js";

export function addCourse() {
    document.getElementById('dynamic-content').innerHTML = `
        <h2>Add Course</h2>
        <form id="add-course-form">
            <div class="form-group">
                <input type="text" id="course-name" placeholder="Course Name" required><br><br>
            </div>
            <div class="form-group">
                <select id="grading-scale" required>
                    <option value="">Select Grading Scale</option>
                    <option value="10-point">10-point Scale</option>
                    <option value="7-point">7-point Scale</option>
                </select><br><br>
            </div>
            <button class="form-btn" type="submit">Submit</button>
        </form>`;

    document.getElementById('add-course-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const courseName = document.getElementById('course-name').value.toUpperCase();
        const gradingScale = document.getElementById('grading-scale').value;

        if (!gradingScale) {
            alert('Please select a grading scale');
            return;
        }

        const courses = getCourses();
        if (courses.some(course => course.name === courseName)) {
            alert(`Course "${courseName}" already exists!`);
            return;
        }

        addNewCourse({
            name: courseName,
            gradingScale: gradingScale,
            students: []
        });

        showCourses();
    });
}