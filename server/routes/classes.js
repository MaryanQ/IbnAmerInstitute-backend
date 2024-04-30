import { Router } from "express";
import mysql from "mysql2";
import dbConfig from "../../db-connect.js";

const classesRouter = Router();

// Fetch all classes
// Fetch all classes
classesRouter.get("/", (req, res) => {
  dbConfig.query("SELECT * FROM Classes", (err, results) => {
    if (err) {
      console.error("Error fetching classes:", err);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(results);
    }
  });
});

// Get a class by ID
classesRouter.get("/:id", (req, res) => {
  const { id } = req.params;
  dbConfig.query(
    "SELECT * FROM Classes WHERE class_id = ?",
    [id],
    (err, result) => {
      if (err) {
        console.error("Error fetching class by ID:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else if (result.length === 0) {
        res.status(404).json({ message: "Class not found" });
      } else {
        res.json(result[0]);
      }
    }
  );
});

// Add a new class
classesRouter.post("/", (req, res) => {
  const { courseName, teacherName, email, duration } = req.body;

  // Check if required fields are provided
  if (!courseName || !teacherName || !email || !duration) {
    return res.status(400).json({
      error: "Course name, teacher name, email, and duration are required",
    });
  }

  const [firstname, lastname] = teacherName.split(" ");

  dbConfig.query(
    "INSERT INTO Teachers (firstname, lastname, email) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE firstname=VALUES(firstname), lastname=VALUES(lastname), email=VALUES(email)",
    [firstname, lastname, email],
    (teacherErr, teacherResult) => {
      if (teacherErr) {
        console.error("Error adding or updating teacher:", teacherErr);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      const teacher_id = teacherResult.insertId || teacherResult.insertId;

      dbConfig.query(
        "INSERT INTO Courses (course_name) VALUES (?) ON DUPLICATE KEY UPDATE course_name=VALUES(course_name)",
        [courseName],
        (courseErr, courseResult) => {
          if (courseErr) {
            console.error("Error adding or updating course:", courseErr);
            return res.status(500).json({ error: "Internal Server Error" });
          }

          const course_id = courseResult.insertId || courseResult.insertId;

          dbConfig.query(
            "INSERT INTO Classes (course_id, teacher_id, duration) VALUES (?, ?, ?)",
            [course_id, teacher_id, duration],
            (classErr, classResult) => {
              if (classErr) {
                console.error("Error adding class:", classErr);
                return res.status(500).json({ error: "Internal Server Error" });
              }

              res.status(201).json({
                class_id: classResult.insertId,
                course_id,
                course_name: courseName,
                teacher_id,
                teacher_name: teacherName,
                email,
                duration,
              });
            }
          );
        }
      );
    }
  );
});

// Update an existing class
classesRouter.put("/:id", (req, res) => {
  const { id } = req.params;
  const { course_id, teacher_id, duration } = req.body;
  if (!course_id || !teacher_id || !duration) {
    return res
      .status(400)
      .json({ error: "Course ID, teacher ID, and duration are required" });
  }

  dbConfig.query(
    "UPDATE Classes SET course_id = ?, teacher_id = ?, duration = ? WHERE class_id = ?",
    [course_id, teacher_id, duration, id],
    (err, result) => {
      if (err) {
        console.error("Error updating class:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else if (result.affectedRows === 0) {
        res.status(404).json({ message: "Class not found" });
      } else {
        res.json({ success: true, message: "Class updated successfully" });
      }
    }
  );
});

// Delete a class
classesRouter.delete("/:id", (req, res) => {
  const { id } = req.params;
  dbConfig.query(
    "DELETE FROM Classes WHERE class_id = ?",
    [id],
    (err, result) => {
      if (err) {
        console.error("Error deleting class:", err);
        res.status(500).json({ error: "Internal Server Error" });
      } else if (result.affectedRows === 0) {
        res.status(404).json({ message: "Class not found" });
      } else {
        res.json({ success: true, message: "Class deleted successfully" });
      }
    }
  );
});
export default classesRouter;
