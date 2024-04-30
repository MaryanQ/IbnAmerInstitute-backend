import { Router } from "express";
import dbConfig from "../../db-connect.js";

const attendanceRouter = Router();

attendanceRouter.get("/", (req, res) => {
  const queryString = `
    SELECT * FROM Attendance
  `;

  dbConfig.query(queryString, (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred" });
    } else {
      res.json(results);
    }
  });
});

attendanceRouter.get("/:id", (req, res) => {
  const studentId = req.params.id;
  const queryString =
    "SELECT * FROM Attendance WHERE student_id = ? ORDER BY attendance_date DESC";
  dbConfig.query(queryString, [studentId], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred" });
    } else {
      res.json(results);
    }
  });
});

attendanceRouter.post("/", (req, res) => {
  const { student_id, attendance_date, is_present } = req.body;

  const isPresentBoolean = is_present === true || is_present === "true";

  if (!student_id || !attendance_date || is_present === undefined) {
    return res.status(400).json({
      error: "Student ID, attendance date, and presence status are required",
    });
  }

  const query =
    "INSERT INTO Attendance (student_id, attendance_date, is_present) VALUES (?, ?, ?)";
  dbConfig.query(
    query,
    [student_id, attendance_date, isPresentBoolean],
    (error, results) => {
      if (error) {
        console.error("Failed to insert attendance data:", error);
        res.status(500).json({
          error: "Database error during the insertion of attendance data",
        });
      } else {
        res.status(201).json({
          message: "Attendance recorded successfully",
          attendance_id: results.insertId,
        });
      }
    }
  );
});

attendanceRouter.put("/:student_id", (req, res) => {
  const { student_id, attendance_id } = req.params;
  const { class_id, attendance_date, is_present } = req.body;

  const isPresentBoolean = is_present === true || is_present === "true";

  if (!attendance_date || is_present === undefined) {
    return res
      .status(400)
      .json({ error: "Attendance date and presence status are required" });
  }

  const updateQuery =
    "UPDATE Attendance SET class_id = ?, attendance_date = ?, is_present = ? WHERE student_id = ? AND attendance_id = ?";
  dbConfig.query(
    updateQuery,
    [class_id, attendance_date, isPresentBoolean, student_id, attendance_id],
    (error, results) => {
      if (error) {
        console.error("Error updating attendance:", error);
        res
          .status(500)
          .json({ error: "An error occurred while updating attendance" });
      } else {
        res.json({ message: "Attendance updated successfully" });
      }
    }
  );
});

attendanceRouter.delete("/:id", (req, res) => {
  const { student_id, attendance_id } = req.params;

  const deleteQuery = `
    DELETE FROM Attendance
    WHERE student_id = ? AND attendance_id = ?
  `;

  const values = [student_id, attendance_id];

  dbConfig.query(deleteQuery, values, (error, results) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ error: "An error occurred" });
    }
    if (results.affectedRows === 0) {
      res.status(404).json({ message: "Attendance record not found" });
    } else {
      res.json({ message: "Attendance record deleted successfully" });
    }
  });
});

export default attendanceRouter;
