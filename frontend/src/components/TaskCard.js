import React from "react";
import API from "../services/api";

const TaskCard = ({ task, refresh, currentUserId }) => {

  // 🔥 Update Status
  const updateStatus = async (status) => {
    try {
      await API.put(`/tasks/${task.id}`, { status });
      refresh(); // no reload
    } catch {
      alert("Failed to update task");
    }
  };

  // 🎨 Status Color
  const getStatusStyle = () => {
    return task.status === "completed"
      ? { color: "green", fontWeight: "bold" }
      : { color: "orange", fontWeight: "bold" };
  };

  // 👤 Assigned User Display
  const getAssignedText = () => {
    if (!task.assigned_to) return "Unassigned";

    if (task.assigned_to === currentUserId) return "You";

    return task.assigned_user || "User";
  };

  return (
    <div style={card}>
      {/* 🔹 Title */}
      <h3>{task.title}</h3>

      {/* 🔹 Description */}
      <p>{task.description}</p>

      {/* 🔹 Assigned User */}
      <p>
        <b>Assigned To:</b> {getAssignedText()}
      </p>

      {/* 🔹 Status */}
      <p>
        <b>Status:</b>{" "}
        <span style={getStatusStyle()}>
          {task.status}
        </span>
      </p>

      {/* 🔹 Due Date */}
      <p>
        <b>Due:</b>{" "}
        {task.due_date
          ? new Date(task.due_date).toLocaleDateString()
          : "No date"}
      </p>

      {/* 🔥 Buttons (ONLY for assigned user) */}
      {task.assigned_to === currentUserId && (
        <div style={{ marginTop: "10px" }}>
          <button
            style={pendingBtn}
            onClick={() => updateStatus("pending")}
          >
            Pending
          </button>

          <button
            style={completeBtn}
            onClick={() => updateStatus("completed")}
          >
            Complete
          </button>
        </div>
      )}
    </div>
  );
};


// 🎨 Styles
const card = {
  background: "#fff",
  padding: "20px",
  margin: "10px",
  borderRadius: "10px",
  boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
};

const pendingBtn = {
  background: "orange",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  marginRight: "5px",
  cursor: "pointer",
  borderRadius: "5px",
};

const completeBtn = {
  background: "green",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  cursor: "pointer",
  borderRadius: "5px",
};

export default TaskCard;