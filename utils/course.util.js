import { dataOfCourses } from "../storage/dummy-data/courses.js";
import { computeMean, calculateGrade } from "./calculate.util.js";
import { dataOfStudents } from "../storage/dummy-data/students.js";


export function getCourses() {
    return dataOfCourses.courses;
}

export function addNewCourse(course) {
    dataOfCourses.courses.push(course);
}

export function addStudentToCourse(studentId, courseName, midterm, final) {
    const course = dataOfCourses.courses.find(c => c.name === courseName);
    const student = dataOfStudents.students.find(s => s.id === studentId);

    if (!course || !student) return false;

    const gpa = computeMean(midterm, final);
    const letterGrade = calculateGrade(gpa, course.gradingScale);

    if (!course.students.some(s => s.id === studentId)) {
        course.students.push({
            id: studentId,
            GPA: gpa,
            letterGrade: letterGrade
        });
        
        student.courses.push({
            courseName: courseName,
            midtermScore: midterm,
            finalScore: final
        });
        return true;
    }
    return false;
}

export function deleteStudentFromCourse(studentId, courseName) {
    const course = dataOfCourses.courses.find(c => c.name === courseName);
    if (!course) return false;

    const studentIndex = course.students.findIndex(s => s.id === studentId);
    if (studentIndex !== -1) {
        course.students.splice(studentIndex, 1);
        
        const student = dataOfStudents.students.find(s => s.id === studentId);
        if (student) {
            student.courses = student.courses.filter(c => c.courseName !== courseName);
            return true;
        }
    }
    return false;
}

export function deleteCourse(courseName) {
    const courseIndex = dataOfCourses.courses.findIndex(c => c.name === courseName);
    if (courseIndex !== -1) {
        dataOfCourses.courses.splice(courseIndex, 1);
        
        dataOfStudents.students.forEach(student => {
            student.courses = student.courses.filter(c => c.courseName !== courseName);
        });
        return true;
    }
    return false;
}