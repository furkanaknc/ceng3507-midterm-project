import { dataOfCourses } from "../storage/dummy-data/courses.js";

export function calculateGrade(gpa, gradingScale) {
    gpa = parseFloat(gpa);
    if (gradingScale === "10-point") {
        if (gpa >= 90) return "A";
        if (gpa >= 80) return "B";
        if (gpa >= 70) return "C";
        if (gpa >= 60) return "D";
        return "F";
    } else {
        if (gpa >= 93) return "A";
        if (gpa >= 85) return "B";
        if (gpa >= 77) return "C";
        if (gpa >= 70) return "D";
        return "F";
    }
}

export function computeMean(midterm, final) {
    return (midterm * 0.4 + final * 0.6).toFixed(2);
}


export function calculateGPA(letterGrade) {
    switch (letterGrade) {
        case "A": return "4.00";
        case "B": return "3.00";
        case "C": return "2.00";
        case "D": return "1.00";
        default: return "0.00";
    }
}

// Figures out a student's overall GPA across all their courses
// If they're not taking any courses, can't calculate a GPA
// The ',0' at the end of reduce() sets the initial value of 'sum' to 0.
export function calculateTotalGPA(student) {
    const courses = student.courses;

    if (courses.length === 0) {
        return "N/A";
    }

    // Add up GPA points from each course
    const totalGPA = courses.reduce((sum, course) => {
        // Find the course details to get its grading scale
        const courseInfo = dataOfCourses.courses.find(c => c.name === course.courseName);

        // Calculate their grade step by step:
        const mean = computeMean(course.midtermScore, course.finalScore);
        const letterGrade = calculateGrade(mean, courseInfo?.gradingScale);
        const courseGPA = parseFloat(calculateGPA(letterGrade));

        return sum + courseGPA;
    }, 0);

    // Get the average by dividing by number of courses
    // Keep 2 decimal places (like 3.50)
    return (totalGPA / courses.length).toFixed(2);
}