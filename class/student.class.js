export class Student {
  //If we don't provide a value for courses, it will default to an empty array
  //If we want to add a student to a course, we can simply push the course object to the courses array
  constructor(id, name, surname, courses = []) {
    this.id = id;
    this.name = name;
    this.surname = surname;
    this.courses = courses;
  }
}