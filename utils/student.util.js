import { dataOfStudents } from "../storage/dummy-data/students.js";
import { computeMean, calculateGrade } from "./calculate.util.js";
import { dataOfCourses } from "../storage/dummy-data/courses.js";


export function getStudents() {
    return dataOfStudents.students;
}

export function getStudentById(studentId) {
    return dataOfStudents.students.find(student => student.id === studentId);
}

export function addNewStudent(student) {
    dataOfStudents.students.push(student);
}

export function updateGrades(studentId, courseName, midtermGrade, finalGrade) {
    const student = dataOfStudents.students.find(s => s.id === studentId);
    if (student) {
        const courseToUpdate = student.courses.find(c => c.courseName === courseName);
        if (courseToUpdate) {
            courseToUpdate.midtermScore = midtermGrade;
            courseToUpdate.finalScore = finalGrade;
            
            const course = dataOfCourses.courses.find(c => c.name === courseName);
            if (course) {
                const studentInCourse = course.students.find(s => s.id === studentId);
                if (studentInCourse) {
                    const gpa = computeMean(midtermGrade, finalGrade);
                    const letterGrade = calculateGrade(gpa, course.gradingScale);
                    studentInCourse.GPA = gpa;
                    studentInCourse.letterGrade = letterGrade;
                }
            }
            return true;
        }
    }
    return false;
}

export function updateStudent(oldId, updatedStudent) {
    const studentIndex = dataOfStudents.students.findIndex(s => s.id === oldId);
    if (studentIndex !== -1) {
        dataOfStudents.students[studentIndex] = {
            ...dataOfStudents.students[studentIndex],
            ...updatedStudent
        };
        return true;
    }
    return false;
}

export function deleteStudent(studentId) {
    const studentIndex = dataOfStudents.students.findIndex(s => s.id === studentId);
    if (studentIndex !== -1) {
        dataOfStudents.students.splice(studentIndex, 1);
        
        dataOfCourses.courses.forEach(course => {
            course.students = course.students.filter(s => s.id !== studentId);
        });
        return true;
    }
    return false;
}