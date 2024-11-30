import { showCourses } from "./public/views/courses.view.js";
import { showStudents } from "./public/views/students.view.js";
import { addCourse } from "./public/views/add-course.view.js";
import { addStudent } from "./public/views/add-student.view.js";
import { addStudentToCourseForm } from "./public/views/add-student-to-course.view.js";
import { deleteStudentFromCourseForm } from "./public/views/delete-student-from-course.view.js";
import { showStudentSearchForm } from "./public/views/search-student.view.js";

document.addEventListener('DOMContentLoaded', () => {

    document.getElementById('show-courses-btn').addEventListener('click', showCourses);
    document.getElementById('show-students-btn').addEventListener('click', showStudents);
    document.getElementById('add-course-btn').addEventListener('click', addCourse);
    document.getElementById('add-student-btn').addEventListener('click', addStudent);
    document.getElementById('add-student-to-course-btn').addEventListener('click', addStudentToCourseForm);
    document.getElementById('delete-student-from-course-btn').addEventListener('click', deleteStudentFromCourseForm);
    document.getElementById('search-student-btn').addEventListener('click', showStudentSearchForm);

});