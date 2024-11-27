export class Course {
    //If we don't provide a value for student, it will default to an empty array
    //If we want to add a course to a student, we can simply push the student object to the students array
    constructor(name, gradingScale, students = []) {
        this.name = name;
        this.gradingScale = gradingScale;
        this.students = students;
    }
}