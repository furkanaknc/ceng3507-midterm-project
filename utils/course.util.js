import { get, save } from "../storage/local-storage.js";
import { dataOfCourses } from "../storage/dummy-data/courses.js";
import { computeMean, calculateGrade } from "./calculate.util.js";
import { STUDENTS_KEY, getStudents } from "./student.util.js";

export const COURSES_KEY = 'courses';

export function initCourses() {
    const storedCourses = get(COURSES_KEY);
    const combinedCourses = [...dataOfCourses.courses];

    storedCourses.forEach(storedCourse => {
        if (!combinedCourses.some(c => c.name === storedCourse.name)) {
            combinedCourses.push(storedCourse);
        }
    });

    save(COURSES_KEY, combinedCourses);
    return combinedCourses;
}

export function getCourses() {
    const storedCourses = get(COURSES_KEY);
    return storedCourses.length > 0 ? storedCourses : dataOfCourses.courses;
}

export function addNewCourse(course) {
    dataOfCourses.courses.push(course);
    save(COURSES_KEY, dataOfCourses.courses);
}


export function addStudentToCourse(studentId, courseName, midterm, final) {
    const courses = getCourses();
    const course = courses.find(c => c.name === courseName);

    if (!course) return false;

    const gpa = computeMean(midterm, final);
    const letterGrade = calculateGrade(gpa, course.gradingScale);

    if (!course.students.some(s => s.id === studentId)) {
        course.students.push({
            id: studentId,
            GPA: gpa,
            letterGrade: letterGrade
        });
        save(COURSES_KEY, courses);
        return true;
    }
    return false;
}

export function deleteStudentFromCourse(studentId, courseName) {
    const courses = getCourses();
    const students = getStudents();
    
    const course = courses.find(c => c.name === courseName);
    if (!course) return false;

    const studentIndex = course.students.findIndex(s => s.id === studentId);
    if (studentIndex !== -1) {
        course.students.splice(studentIndex, 1);
        
        const student = students.find(s => s.id === studentId);
        if (student) {
            student.courses = student.courses.filter(c => c.courseName !== courseName);
            
            save(COURSES_KEY, courses);
            save(STUDENTS_KEY, students);
            return true;
        }
    }
    return false;
}

export function deleteCourse(courseName) {
    const courses = getCourses();
    const updatedCourses = courses.filter(course => course.name !== courseName);
    save(COURSES_KEY, updatedCourses);
    return true;
}