import { getCourses} from "../../utils/course.util.js";
import { getStudents } from "../../utils/student.util.js";

export function showStudentSearchForm() {
    document.getElementById('dynamic-content').innerHTML = `
        <h2>Search Students</h2>
        <form id="search-form">
            <div class="form-group">
                <input type="text" id="search-input" placeholder="Search by student name" required>
            </div>
            <button class="form-btn" type="submit">Search</button>
        </form>
    `;

    document.getElementById('search-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const searchInput = document.getElementById('search-input').value;
        searchStudentsByName(searchInput);
    });
}

function searchStudentsByName(name) {
    const students = getStudents();
    const courses = getCourses();
    const filteredStudents = students.filter(student => 
        student.name.toLowerCase().includes(name.toLowerCase()) || 
        student.surname.toLowerCase().includes(name.toLowerCase())
    );

    let content = '<h2>Search Results</h2>';
    
    if (filteredStudents.length === 0) {
        content += '<p>No students found.</p>';
    } else {
        filteredStudents.forEach(student => {
            content += `
                <div class="student-container">
                    <h3>${student.name} ${student.surname} (ID: ${student.id})</h3>
                    <div class="courses-list">
                        <h4>Enrolled Courses:</h4>`;

            if (student.courses.length === 0) {
                content += '<p>No courses enrolled.</p>';
            } else {
                content += '<ul>';
                student.courses.forEach(course => {
                    const courseDetails = courses.find(c => c.name === course.courseName);
                    if (courseDetails) {
                        const studentInCourse = courseDetails.students.find(s => s.id === student.id);
                        content += `
                            <li>
                                ${course.courseName} - 
                                Midterm: ${course.midtermScore}, 
                                Final: ${course.finalScore}, 
                                GPA: ${studentInCourse?.GPA || 'N/A'}, 
                                Grade: ${studentInCourse?.letterGrade || 'N/A'}
                            </li>`;
                    }
                });
                content += '</ul>';
            }
            content += '</div></div><hr>';
        });
    }
    
    document.getElementById('dynamic-content').innerHTML = content;
}