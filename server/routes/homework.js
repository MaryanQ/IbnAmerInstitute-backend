import { Router } from "express";
import mysql from "mysql2";
import dbConfig from "../../db-connect.js";

const homeworkRouter = Router();

// Fetch all homework assignments
homeworkRouter.get("/", (req, res) => {
  const queryString = "SELECT * FROM Homework";
  dbConfig.query(queryString, (error, results) => {
    if (error) {
      console.error("Error fetching homework assignments:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } else {
      res.json(results);
    }
  });
});

// Fetch a specific homework assignment by ID
homeworkRouter.get("/:id", (req, res) => {
  const homeworkId = req.params.id;
  const queryString = "SELECT * FROM Homework WHERE homework_id = ?";
  dbConfig.query(queryString, [homeworkId], (error, results) => {
    if (error) {
      console.error("Error fetching homework assignment:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } else if (results.length === 0) {
      res.status(404).json({ message: "Homework assignment not found" });
    } else {
      res.json(results[0]); // Return the first and only homework assignment in the array
    }
  });
});

homeworkRouter.post("/", (req, res) => {
  const { studentId, courseId } = req.params;
  const {
    assignment_name,
    description,
    due_date,
    is_completed,
    completion_date,
  } = req.body;

  // Basic validation to ensure required fields are present
  if (!assignment_name || !description || !due_date) {
    return res.status(400).json({
      error: "Assignment name, description, and due date are required.",
    });
  }

  // Convert is_completed to a boolean value if it's not already
  const isCompletedBoolean = is_completed === true || is_completed === "true";

  // Insert the homework entry now that we have student_id and course_id from URL
  const insertQuery = `
        INSERT INTO Homework
        (course_id, student_id, assignment_name, description, due_date, is_completed, completion_date)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
  dbConfig.query(
    insertQuery,
    [
      courseId,
      studentId,
      assignment_name,
      description,
      due_date,
      isCompletedBoolean,
      completion_date,
    ],
    (error, results) => {
      if (error) {
        console.error("Failed to insert homework data:", error);
        return res.status(500).json({
          error: "Database error during the insertion of homework data",
        });
      }
      res.status(201).json({
        message: "Homework recorded successfully",
        homework_id: results.insertId,
      });
    }
  );
});

// Update an existing homework assignment
homeworkRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    assignment_name,
    description,
    due_date,
    is_completed,
    completion_date,
    grade,
  } = req.body;

  // Validate required fields
  if (!assignment_name || !description || !due_date || !grade) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const updateQuery = `
      UPDATE Homework 
      SET assignment_name = ?, description = ?, due_date = ?, is_completed = ?, completion_date = ?, grade = ? 
      WHERE homework_id = ?`;

    // Execute the update query
    await dbConfig
      .promise()
      .query(updateQuery, [
        assignment_name,
        description,
        due_date,
        is_completed,
        completion_date,
        grade,
        id,
      ]);

    // Send success response
    res.json({ message: "Homework updated successfully" });
  } catch (error) {
    console.error("Error updating homework:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Delete a homework assignment
homeworkRouter.delete("/:id", (req, res) => {
  const homeworkId = req.params.id;
  const deleteQuery = "DELETE FROM Homework WHERE homework_id = ?";
  dbConfig.query(deleteQuery, [homeworkId], (error, result) => {
    if (error) {
      console.error("Error deleting homework assignment:", error);
      res.status(500).json({ error: "Internal Server Error" });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ message: "Homework assignment not found" });
    } else {
      res.json({ message: "Homework assignment deleted successfully" });
    }
  });
});

export default homeworkRouter;
