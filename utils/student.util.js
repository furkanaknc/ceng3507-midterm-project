import { dataOfStudents } from "../storage/dummy-data/students.js";
import { computeMean, calculateGrade } from "./calculate.util.js";
import { dataOfCourses } from "../storage/dummy-data/courses.js";


// Simply returns all students in our system
// Used when we need to display or work with the full student list
export function getStudents() {
    return dataOfStudents.students;
}

// Finds a specific student by their ID
// Useful when we need details of just one student
// Returns undefined if student isn't found
export function getStudentById(studentId) {
    return dataOfStudents.students.find(student => student.id === studentId);
}

// Takes a student object with id, name, surname and empty courses array
// Just pushes to our data since we're not us
export function addNewStudent(student) {
    dataOfStudents.students.push(student);
}

// Updates a student's grades in a specific course
// Takes care of updating both student's record and course's record
// Returns true if update was successful, false if something went wrong
export function updateGrades(studentId, courseName, midtermGrade, finalGrade) {
    // First find the student
    const student = dataOfStudents.students.find(s => s.id === studentId);
    
    if (student) {
        // Find the specific course in student's courses
        const courseToUpdate = student.courses.find(c => c.courseName === courseName);
        
        if (courseToUpdate) {
            // Update student's course grades
            courseToUpdate.midtermScore = midtermGrade;
            courseToUpdate.finalScore = finalGrade;
            
            // Now update the course's record of this student
            const course = dataOfCourses.courses.find(c => c.name === courseName);
            
            if (course) {
                const studentInCourse = course.students.find(s => s.id === studentId);
                
                // Recalculate everything based on new grades
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

// Updates a student's basic info (name, ID, etc)
// Keeps their course enrollments and grades intact
// Returns true if update successful, false if student not found
export function updateStudent(oldId, updatedStudent) {
    const studentIndex = dataOfStudents.students.findIndex(s => s.id === oldId);
    
    if (studentIndex !== -1) {
         // Spread operator preserves existing data while updating new info
        dataOfStudents.students[studentIndex] = {
            ...dataOfStudents.students[studentIndex],
            ...updatedStudent
        };
        
        return true;
    }
    
    return false;
}


// Completely removes a student from the system
// Also removes them from all courses they were enrolled in
// Returns true after successful deletion
export function deleteStudent(studentId) {
    const studentIndex = dataOfStudents.students.findIndex(s => s.id === studentId);
    
    if (studentIndex !== -1) {
        // Remove student from main list
        dataOfStudents.students.splice(studentIndex, 1);
        
        // Clean up all courses this student was in
        dataOfCourses.courses.forEach(course => {
            course.students = course.students.filter(s => s.id !== studentId);
        });
        
        return true;
    }
    
    return false;
}