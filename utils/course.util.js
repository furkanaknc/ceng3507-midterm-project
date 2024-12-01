import { dataOfCourses } from "../storage/dummy-data/courses.js";
import { computeMean, calculateGrade } from "./calculate.util.js";
import { dataOfStudents } from "../storage/dummy-data/students.js";

// Function that manages courses in our system
// Simply returns our list of courses - nothing fancy!
export function getCourses() {
    return dataOfCourses.courses;
}

// Adds a new course to our school system
// Just pushes the new course into our list - pretty straightforward
export function addNewCourse(course) {
    dataOfCourses.courses.push(course);
}

// The interesting part - adding a student to a course!
export function addStudentToCourse(studentId, courseName, midterm, final) {
    // First, let's find the course and student we're working with
    const course = dataOfCourses.courses.find(c => c.name === courseName);
    const student = dataOfStudents.students.find(s => s.id === studentId);

    if (!course || !student) return false;

    // Calculate their grades 
    const mean = computeMean(midterm, final);
    const letterGrade = calculateGrade(mean, course.gradingScale);

    // Make sure we don't add the same student twice
    if (!course.students.some(s => s.id === studentId)) {
        course.students.push({
            id: studentId,
            mean: mean,
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

// Removing a student from a course - like dropping a class
export function deleteStudentFromCourse(studentId, courseName) {
    const course = dataOfCourses.courses.find(c => c.name === courseName);
    
    if (!course) return false;

     // Find and remove student from course
    const studentIndex = course.students.findIndex(s => s.id === studentId);
    
    if (studentIndex !== -1) {
        course.students.splice(studentIndex, 1);
        
        // Also remove course from student's record
        const student = dataOfStudents.students.find(s => s.id === studentId);
        
        if (student) {
            student.courses = student.courses.filter(c => c.courseName !== courseName);
    
            return true;
        }
    }
    
    return false;
}

// When a course is deleted entirely
export function deleteCourse(courseName) {
    const courseIndex = dataOfCourses.courses.findIndex(c => c.name === courseName);
    
    // Find and remove the course
    if (courseIndex !== -1) {
        dataOfCourses.courses.splice(courseIndex, 1);
        
        // Clean up - remove this course from all students' records
        dataOfStudents.students.forEach(student => {
            student.courses = student.courses.filter(c => c.courseName !== courseName);
        });
    
        return true;
    }
    
    return false;
}