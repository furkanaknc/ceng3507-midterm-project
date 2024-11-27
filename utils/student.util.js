import { get, save } from "../storage/local-storage.js";
import { dataOfStudents } from "../storage/dummy-data/students.js";
import { COURSES_KEY, getCourses } from "./course.util.js";
import { computeMean, calculateGrade } from "./calculate.util.js";

const STUDENTS_KEY = 'students';

export function initStudents() {
    const storedStudents = get(STUDENTS_KEY);
    const combinedStudents = [...dataOfStudents.students];

    storedStudents.forEach(storedStudent => {
        if (!combinedStudents.some(s => s.id === storedStudent.id)) {
            combinedStudents.push(storedStudent);
        }
    });

    save(STUDENTS_KEY, combinedStudents);
    return combinedStudents;
}

export function getStudents() {
    const storedStudents = get(STUDENTS_KEY);
    return storedStudents.length > 0 ? storedStudents : dataOfStudents.students;
}

export function getStudentById(studentId) {
    const students = getStudents();
    return students.find(student => student.id === studentId);
}

export function addNewStudent(student) {
    const currentStudents = getStudents();
    currentStudents.push(student);
    save(STUDENTS_KEY, currentStudents);
    return currentStudents;
}

export function updateGrades(studentId, courseName, midtermGrade, finalGrade) {
    const students = get(STUDENTS_KEY);
    const courses = get(COURSES_KEY);

    const student = students.find(s => s.id === studentId);
    if (student) {
        const courseToUpdate = student.courses.find(c => c.courseName === courseName);
        if (courseToUpdate) {
            courseToUpdate.midtermScore = midtermGrade;
            courseToUpdate.finalScore = finalGrade;
        }
    }

    const course = courses.find(c => c.name === courseName);
    if (course) {
        const studentInCourse = course.students.find(s => s.id === studentId);
        if (studentInCourse) {
            const gpa = computeMean(midtermGrade, finalGrade);
            const letterGrade = calculateGrade(gpa, course.gradingScale);

            studentInCourse.GPA = gpa;
            studentInCourse.letterGrade = letterGrade;
        }
    }

    save(STUDENTS_KEY, students);
    save(COURSES_KEY, courses);

    return true;
}

export function updateStudent(oldId, updatedStudent) {
    const students = getStudents();
    const studentIndex = students.findIndex(s => s.id === oldId);

    if (studentIndex === -1) return false;

    students[studentIndex] = {
        ...students[studentIndex],
        ...updatedStudent
    };

    save(STUDENTS_KEY, students);
    return true;
}

export function deleteStudent(studentId) {
    const students = getStudents();
    const filteredStudents = students.filter(s => s.id !== studentId);

    const courses = getCourses();
    courses.forEach(course => {
        course.students = course.students.filter(s => s.id !== studentId);
    });

    save(STUDENTS_KEY, filteredStudents);
    save(COURSES_KEY, courses);
    return true;
}