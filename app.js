import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";

import authRouter from "./server/routes/auth/index.js";
import studentsRouter from "./server/routes/students.js";
import teachersRouter from "./server/routes/teachers.js";
import attendanceRouter from "./server/routes/attendance.js";
import homeworkRouter from "./server/routes/homework.js";
import coursesRouter from "./server/routes/courses.js";
import classesRouter from "./server/routes/classes.js";

import { authController } from "./server/controllers/authController.js";

import {
  getAllAttendances,
  getAttendanceById,
  createAttendance,
  updateAttendanceById,
  deleteAttendanceById,
} from "./server/controllers/attendanceController.js";
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourseById,
  deleteCourseById,
} from "./server/controllers/coursesController.js";

import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudentById,
  deleteStudentById,
} from "./server/controllers/studentsController.js";

import {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacherById,
  deleteTeacherById,
} from "./server/controllers/teachersController.js";

const app = express();
const port = 8080;

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(
  cors({
    origin: "https://proud-stone-0ef859703.5.azurestaticapps.net",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use("/auth", authRouter);
app.use("/students", studentsRouter);
app.use("/teachers", teachersRouter);
app.use("/attendance", attendanceRouter);
app.use("/homework", homeworkRouter);
app.use("/courses", coursesRouter);
app.use("/classes", classesRouter);

app.post("/login", authController.login);
app.post("/logout", authController.logout);

app.get("/attendance", getAllAttendances);
app.get("/attendance/:id", getAttendanceById);
app.post("/attendance", createAttendance);
app.put("/attendance/:id", updateAttendanceById);
app.delete("/attendance/:id", deleteAttendanceById);

app.get("/courses", getAllCourses);
app.get("/courses/:id", getCourseById);
app.post("/courses", createCourse);
app.put("/courses/:id", updateCourseById);
app.delete("/courses/:id", deleteCourseById);

app.get("/students", getAllStudents);
app.get("/students/:id", getStudentById);
app.post("/students", createStudent);
app.put("/students/:id", updateStudentById);
app.delete("/students/:id", deleteStudentById);

app.get("/", getAllTeachers);
app.get("/:id", getTeacherById);
app.post("/", createTeacher);
app.put("/:id", updateTeacherById);
app.delete("/:id", deleteTeacherById);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

app.get("/", (req, res) => {
  res.send("Hello, this is the backend.");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
