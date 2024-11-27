import { getCourses, deleteCourse} from "../../utils/course.util.js";
import { getStudentById } from "../../utils/student.util.js";
import { calculateGrade,calculateGPA,computeMean } from "../../utils/calculate.util.js";
export function showCourses() {
    const courses = getCourses();
    let content = '<h2>Courses</h2>';

    if (courses.length === 0) {
        content += '<p>No courses available. Add a course to get started.</p>';
    } else {
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
                        <h4>Enrolled Students:</h4>
            `;

            if (course.students.length === 0) {
                content += '<p>No students enrolled in this course.</p>';
            } else {
                content += '<ul>';
                course.students.forEach(student => {
                    const studentDetails = getStudentById(student.id);
                    if (studentDetails) {
                        const { gpa, letterGrade } = calculateStudentCourseGPA(studentDetails, course.name, course.gradingScale);
               
                        content += `
                            <li>
                                Student ID: ${student.id}, 
                                Student: ${studentDetails.name} ${studentDetails.surname}, 
                                GPA: ${gpa}, 
                                Grade: ${letterGrade}
                            </li>
                        `;
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

    document.getElementById('dynamic-content').innerHTML = content;

    document.querySelectorAll('.delete-course-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const courseName = e.target.dataset.course;
            if (confirm(`Are you sure you want to delete the course "${courseName}"?`)) {
                const success = deleteCourse(courseName);
                if (success) {
                    showCourses();
                } else {
                    alert('Failed to delete course');
                }
            }
        });
    });

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
}



export function showPassedStudents(courseName) {
    const courses = getCourses();
    const course = courses.find(c => c.name === courseName);
    if (course) {
        let content = `<h4>Passed Students in ${course.name}</h4>`;
        const passedStudents = course.students.filter(student => student.letterGrade !== 'F');
        if (passedStudents.length === 0) {
            content += '<p>No students passed in this course.</p>';
        } else {
            content += '<ul>';
            passedStudents.forEach(student => {
                const studentDetails = getStudentById(student.id);
                if (studentDetails) {
                    const { gpa, letterGrade } = calculateStudentCourseGPA(studentDetails, course.name, course.gradingScale);
       
                    content += `
                        <li>
                            Student ID: ${student.id}, 
                            Student: ${studentDetails.name} ${studentDetails.surname}, 
                            GPA: ${gpa}, 
                            Grade: ${letterGrade}
                        </li>
                    `;
                }
            });
            content += '</ul>';
        }
        document.getElementById(`details-${course.name.replace(/\s+/g, '-')}`).innerHTML = content;
    }
}

export function showFailedStudents(courseName) {
    const courses = getCourses();
    const course = courses.find(c => c.name === courseName);
    if (course) {
        let content = `<h4>Failed Students in ${course.name}</h4>`;
        const failedStudents = course.students.filter(student => student.letterGrade === 'F');
        if (failedStudents.length === 0) {
            content += '<p>No students failed in this course.</p>';
        } else {
            content += '<ul>';
            failedStudents.forEach(student => {
                const studentDetails = getStudentById(student.id);
                if (studentDetails) {
                    const { gpa, letterGrade } = calculateStudentCourseGPA(studentDetails, course.name, course.gradingScale);
      
                    content += `
                        <li>
                            Student ID: ${student.id}, 
                            Student: ${studentDetails.name} ${studentDetails.surname}, 
                            GPA: ${gpa}, 
                            Grade: ${letterGrade}
                        </li>
                    `;
                }
            });
            content += '</ul>';
        }
        document.getElementById(`details-${course.name.replace(/\s+/g, '-')}`).innerHTML = content;
    }
}

export function showDetailedStatistics(courseName) {
    const courses = getCourses();
    const course = courses.find(c => c.name === courseName);
    if (course) {
        const passedStudents = course.students.filter(student => student.letterGrade !== 'F');
        const failedStudents = course.students.filter(student => student.letterGrade === 'F');
        const totalStudents = course.students.length;
        const meanScore = course.students.reduce((sum, student) => sum + parseFloat(student.GPA), 0) / totalStudents;

        let content = `<h4>Detailed Statistics for ${course.name}</h4>`;
        content += `<p>Number of Passed Students: ${passedStudents.length}</p>`;
        content += `<p>Number of Failed Students: ${failedStudents.length}</p>`;
        content += `<p>Mean Score: ${meanScore.toFixed(2)}</p>`;

        document.getElementById(`details-${course.name.replace(/\s+/g, '-')}`).innerHTML = content;
    }
}

function calculateStudentCourseGPA(studentDetails, courseName, gradingScale) {
    const studentCourse = studentDetails.courses.find(c => c.courseName === courseName);
    if (!studentCourse) return { gpa: 'N/A', letterGrade: 'N/A' };
    
    const mean = computeMean(studentCourse.midtermScore, studentCourse.finalScore);
    const letterGrade = calculateGrade(mean, gradingScale);
    const gpa = calculateGPA(letterGrade);
    
    return { gpa, letterGrade };
}