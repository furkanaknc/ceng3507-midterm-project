import { getCourses, deleteCourse, deleteStudentFromCourse} from "../../utils/course.util.js";
import { getStudentById } from "../../utils/student.util.js";
import { calculateGrade,computeMean, calculateTotalGPA } from "../../utils/calculate.util.js";

// This is our main course view - shows all courses and their students
export function showCourses() {
    const courses = getCourses();
    let content = '<h2>Courses</h2>';

    // If we have no courses yet, show a helpful message
    if (courses.length === 0) {
        content += '<p>No courses available. Add a course to get started.</p>';
    } else {
        // Create a card for each course
        courses.forEach(course => {
            content += `
                <div class="course-container">
                    <h3>${course.name}</h3>
                    <p>Grading Scale: ${course.gradingScale}</p>
                    <div class="course-actions">
                        <button class="form-btn delete-course-btn" data-course="${course.name}">Delete Course</button>
                        <button class="form-btn show-passed-students-btn" data-course="${course.name}">Passed Students</button>
                        <button class="form-btn show-failed-students-btn" data-course="${course.name}">Failed Students</button>
                        <button class="form-btn show-detailed-stats-btn" data-course="${course.name}">Detailed Statistics</button>
                    </div>
                    <div class="students-list">
                        <h4>Enrolled Students:</h4>`;

            // Show enrolled students or a message if none
            if (course.students.length === 0) {
                content += '<p>No students enrolled in this course.</p>';
            } else {
                // Show each student's details and grades
                content += '<ul>';
                course.students.forEach(student => {
                    const studentDetails = getStudentById(student.id);
                   
                    if (studentDetails) {
                         // Calculate their grades for this course
                        const studentCourse = studentDetails.courses.find(c => c.courseName === course.name);
                        const mean = computeMean(studentCourse.midtermScore, studentCourse.finalScore);
                        const letterGrade = calculateGrade(mean, course.gradingScale);
                        
                        content += `
                            <li>
                                Student ID: ${student.id}, 
                                Student: ${studentDetails.name} ${studentDetails.surname}, 
                                Midterm: ${studentCourse.midtermScore}, 
                                Final: ${studentCourse.finalScore}, 
                                Mean: ${mean}, 
                                Grade: ${letterGrade}
                                <button class="form-btn delete-student-btn" 
                                    data-student-id="${student.id}"
                                    data-course-name="${course.name}">
                                    Delete student
                                </button>
                            </li>`;
                    }
                });
                content += '</ul>';
            }
            content += `
                    </div>
                    <div class="course-details" id="details-${course.name.replace(/\s+/g, '-')}"></div>
                </div><hr>`;
        });
    }

    // Put everything on the page
    document.getElementById('dynamic-content').innerHTML = content;


    // Handle deleting an entire course
    document.querySelectorAll('.delete-course-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const courseName = e.target.dataset.course;
            if (confirm(`Are you sure you want to delete the course "${courseName}"?`)) {
                const success = deleteCourse(courseName);
                if (success) {
                    showCourses(); // Refresh the view
                } else {
                    alert('Failed to delete course');
                }
            }
        });
    });

    // Setup handlers for viewing different student lists
    document.querySelectorAll('.show-passed-students-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const courseName = e.target.dataset.course;
            showPassedStudents(courseName);
        });
    });

    document.querySelectorAll('.show-failed-students-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const courseName = e.target.dataset.course;
            showFailedStudents(courseName);
        });
    });

    document.querySelectorAll('.show-detailed-stats-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const courseName = e.target.dataset.course;
            showDetailedStatistics(courseName);
        });
    });

    // Handle removing individual students from a course
    document.querySelectorAll('.delete-student-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const studentId = e.target.dataset.studentId;
            const courseName = e.target.dataset.courseName;
            
            if (confirm(`Are you sure you want to remove this student from ${courseName}?`)) {
                const success = deleteStudentFromCourse(studentId, courseName);
                if (success) {
                    showCourses();
                } else {
                    alert('Failed to remove student from course.');
                }
            }
        });
    });
}


// Shows a list of students who passed (got better than F)
export function showPassedStudents(courseName) {
    const courses = getCourses();
    const course = courses.find(c => c.name === courseName);
    
    if (course) {
        // Filter for passing students and show their info
        let content = `<h4>Passed Students in ${course.name}</h4>`;
        const passedStudents = course.students.filter(student => student.letterGrade !== 'F');

        if (passedStudents.length === 0) {
            content += '<p>No students passed in this course.</p>';
        } else {
            content += '<ul>';
            passedStudents.forEach(student => {
                const studentDetails = getStudentById(student.id);
                if (studentDetails) {
                    const totalGPA = calculateTotalGPA(studentDetails);
                    content += `
                        <li>
                            Student ID: ${student.id}, 
                            Student: ${studentDetails.name} ${studentDetails.surname}, 
                            Total GPA: ${totalGPA}
                        </li>`;
                }
            });
            content += '</ul>';
        }
        // Replace any whitespace with hyphens in course name and update the details section with passed students content
        document.getElementById(`details-${course.name.replace(/\s+/g, '-')}`).innerHTML = content;
    }
}

// Shows a list of students who failed (got F)
export function showFailedStudents(courseName) {
    const courses = getCourses();
    const course = courses.find(c => c.name === courseName);
    
    if (course) {
        // Similar to showPassedStudents but filters for F grades
        let content = `<h4>Failed Students in ${course.name}</h4>`;
        const failedStudents = course.students.filter(student => student.letterGrade === 'F');
       
        if (failedStudents.length === 0) {
            content += '<p>No students failed in this course.</p>';
        } else {
            content += '<ul>';
            failedStudents.forEach(student => {
                const studentDetails = getStudentById(student.id);
                if (studentDetails) {
                    const totalGPA = calculateTotalGPA(studentDetails);
                    content += `
                        <li>
                            Student ID: ${student.id}, 
                            Student: ${studentDetails.name} ${studentDetails.surname}, 
                            Total GPA: ${totalGPA}
                        </li>`;
                }
            });
            content += '</ul>';
        }
        document.getElementById(`details-${course.name.replace(/\s+/g, '-')}`).innerHTML = content;
    }
}

// Shows overall statistics for the course:
// - How many passed/failed
// - Average score
export function showDetailedStatistics(courseName) {
    const courses = getCourses();
    const course = courses.find(c => c.name === courseName);
    
    if (course) {
        // Count passed/failed students
        const passedStudents = course.students.filter(student => student.letterGrade !== 'F');
        const failedStudents = course.students.filter(student => student.letterGrade === 'F');
        
        // Calculate class average
        const totalStudents = course.students.length;
        const meanScore = course.students.reduce((sum, student) => sum + parseFloat(student.mean), 0) / totalStudents;

        // Display the stats
        let content = `<h4>Detailed Statistics for ${course.name}</h4>`;
        content += `<p>Number of Passed Students: ${passedStudents.length}</p>`;
        content += `<p>Number of Failed Students: ${failedStudents.length}</p>`;
        content += `<p>Mean Score: ${meanScore.toFixed(2)}</p>`;

        document.getElementById(`details-${course.name.replace(/\s+/g, '-')}`).innerHTML = content;
    }
}
