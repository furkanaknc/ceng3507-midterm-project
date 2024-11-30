import { calculateGrade, computeMean, calculateGPA, calculateTotalGPA } from "../../utils/calculate.util.js";
import { getCourses } from "../../utils/course.util.js";
import { getStudents } from "../../utils/student.util.js";

export function showStudentSearchForm() {
    document.getElementById('dynamic-content').innerHTML = `
        <h2>Search Students</h2>
        <div class="form-group">
            <input type="text" id="search-input" placeholder="Enter student name...">
        </div>`;

    document.getElementById('search-input').addEventListener('input', (e) => {
        if (e.target.value.trim()) {
            searchStudentsByName(e.target.value);
        } else {
            document.getElementById('dynamic-content').innerHTML = `
                <h2>Search Students</h2>
                <div class="form-group">
                    <input type="text" id="search-input" placeholder="Enter student name...">
                </div>`;
        }
    });
    document.getElementById('dynamic-content').innerHTML += `
    <button id="search-button" class="form-btn btn">Search</button>`;

    document.getElementById('search-button').addEventListener('click', () => {
        const searchValue = document.getElementById('search-input').value;
        if (searchValue.trim()) {
            searchStudentsByName(searchValue);
        }
    });
}

function searchStudentsByName(name) {
    const students = getStudents();
    const courses = getCourses();

    const searchTerms = name.toLowerCase().split(/\s+/);

    const filteredStudents = students.filter(student => {
        const fullName = `${student.name} ${student.surname}`.toLowerCase();
        return searchTerms.every(term => fullName.includes(term));
    });

    let content = '<h2>Search Results</h2>';

    if (filteredStudents.length === 0) {
        content += '<p>No students found.</p>';
    } else {
        filteredStudents.forEach(student => {
            const totalGPA = calculateTotalGPA(student);
            content += `
                <div class="student-container">
                    <h3>${student.name} ${student.surname} (ID: ${student.id})</h3>
                    <p>Total GPA: ${totalGPA}</p>
                    <div class="courses-list">
                        <h4>Enrolled Courses:</h4>`;

            if (student.courses.length === 0) {
                content += '<p>No courses enrolled.</p>';
            } else {
                content += '<ul>';
                student.courses.forEach(course => {
                    const courseDetails = courses.find(c => c.name === course.courseName);
                    if (courseDetails) {
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