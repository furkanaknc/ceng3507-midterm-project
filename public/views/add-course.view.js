import { getCourses, addNewCourse } from "../../utils/course.util.js";
import { showCourses } from "./courses.view.js";

// This function creates a form for adding new courses to our system
export function addCourse() {
    
    // Create a simple form with fields for course name and grading scale
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

    // When user submit the form:
    document.getElementById('add-course-form').addEventListener('submit', (e) => {
        e.preventDefault(); // Stop the form from actually submitting (we'll handle it ourselves)
        
        // Get the values they entered
        const courseName = document.getElementById('course-name').value.toUpperCase();
        const gradingScale = document.getElementById('grading-scale').value;

        // Make sure they selected a grading scale
        if (!gradingScale) {
            alert('Please select a grading scale');
            return;
        }

        // Check if this course already exists
        const courses = getCourses();
        
        if (courses.some(course => course.name === courseName)) {
            alert(`Course "${courseName}" already exists!`);
            return;
        }

        // Add the new course to our system
        addNewCourse({
            name: courseName,
            gradingScale: gradingScale,
            students: []  // Start with no students enrolled
        });

        showCourses();
    });
}