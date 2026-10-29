import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import "./Checklist.css";

export default function Checklist() {
  const [task, setTask] = useState([]);

  const [text, setText] = useState("");
  const [resource, setResource] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("todo");

  const [editIndex, setEditIndex] = useState(null);

  function getColor(s) {
    if (s === "done") {
      return "#4a8f5f";
    }
    if (s === "in progress") {
      return "#d4943a";
    }
    return "#7a8b9c";
  }

  function resetForm() {
    setText("");
    setResource("");
    setStartDate("");
    setEndDate("");
    setStatus("todo");
    setEditIndex(null);
  }

  function addItem() {
    if (text.trim() === "") {
      return;
    }

    if (startDate !== "" && endDate !== "" && endDate < startDate) {
      alert("End date can't be before start date");
      return;
    }

    const newTask = {
      text: text,
      resource: resource,
      startDate: startDate,
      endDate: endDate,
      status: status,
    };

    if (editIndex === null) {
      setTask([...task, newTask]);
    } else {
      const updatedtask = task.map((item, index) => {
        if (index === editIndex) {
          return newTask;
        }
        return item;
      });
      setTask(updatedtask);
    }

    resetForm();
  }

  function modifyItem(indexToModify) {
    const item = task[indexToModify];

    setText(item.text);
    setResource(item.resource);
    setStartDate(item.startDate);
    setEndDate(item.endDate);
    setStatus(item.status);
    setEditIndex(indexToModify);
  }

  function deleteItem(indexToDelete) {
    const updatedtask = task.filter((item, index) => {
      return index !== indexToDelete;
    });

    setTask(updatedtask);

    resetForm();
  }

  function enRetard(item){
    const current = new Date();
    return current > item.endDate;
  }


  // for pie chart

  let todoCount = 0;
  let progressCount = 0;
  let doneCount = 0;

  for (let i = 0; i < task.length; i++) {
    if (task[i].status === "todo") {
      todoCount = todoCount + 1;
    }
    if (task[i].status === "in progress") {
      progressCount = progressCount + 1;
    }
    if (task[i].status === "done") {
      doneCount = doneCount + 1;
    }
  }

  const data = [
    { name: "todo", value: todoCount },
    { name: "in progress", value: progressCount },
    { name: "done", value: doneCount },
  ];

  return (
    <div className="box">
      <h2>Checklist</h2>

      <div className="form">
        <table>
          <tbody>
            <tr>
              <td>Task:</td>
              <td>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>Resource:</td>
              <td>
                <input
                  type="text"
                  value={resource}
                  onChange={(e) => setResource(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>Start date:</td>
              <td>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>End date:</td>
              <td>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </td>
            </tr>
            <tr>
              <td>Status:</td>
              <td>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="todo">todo</option>
                  <option value="in progress">in progress</option>
                  <option value="done">done</option>
                </select>
              </td>
            </tr>
          </tbody>
        </table>

        <button onClick={addItem}>{editIndex === null ? "Add" : "Save"}</button>
        <button onClick={resetForm}>Cancel</button>
      </div>

      <div className="row">
        <div className="tasks">
          <h3>Tasks</h3>
          {task.map((item, index) => (
              <div
                className="item"
                key={index}
                style={{
                  backgroundColor: enRetard(item) ? getColor(item.status) : "red" ,
                  color: enRetard(item) ? "black" : "white",
                }}
              >
              <b>{item.text}</b>
              <span 
              className="info"
              style = {{
                color: enRetard(item) ? "black" : "white"
              }}
              >
                Resource: {item.resource} | Start: {item.startDate} | End: {item.endDate}
              </span>

              <span className="status" style={{ backgroundColor: getColor(item.status) }}>
                {item.status}
              </span>

              <button onClick={() => modifyItem(index)}>modify</button>
              <button onClick={() => deleteItem(index)}>delete</button>
            </div>
          ))}
        </div>

        <div className="chart">
          <h3>Tasks by status</h3>
          <PieChart width={300} height={250}>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
              <Cell fill={getColor("todo")} />
              <Cell fill={getColor("in progress")} />
              <Cell fill={getColor("done")} />
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </div>
      </div>
    </div>
  );
}