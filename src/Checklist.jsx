import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import "./Checklist.css";

export default function Checklist() {
  // localStorage when the page starts
  const [task, setTask] = useState(() => {
    const saved = localStorage.getItem("tasks");
    if (saved === null) {
      return [];
    }
    return JSON.parse(saved);
  });

  const [text, setText] = useState("");
  const [resource, setResource] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [status, setStatus] = useState("todo");

  const [editIndex, setEditIndex] = useState(null);
  const [search, setSearch] = useState("");

  function getColor(s) {
    if (s === "done") {
      return "green";
    }
    if (s === "in progress") {
      return "orange";
    }
    return "gray";
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
    const today = new Date().toLocaleDateString("en-CA");
    
    if (
      text.trim() === "" || resource.trim() === "" || startDate === "" || endDate === "") {
      alert("all inputs must be filled");
      return;
    }

    if (startDate !== "" && endDate !== "" && endDate < startDate) {
      alert("end date can't be before start date dummy");
      return;
    }

    if (startDate !== today) {
      alert("start date must be today");
      return;
    }


    const newTask = {
      text: text,
      resource: resource,
      startDate: startDate,
      endDate: endDate,
      status: status,
    };

    let newList;

    if (editIndex === null) {
      newList = [...task, newTask];
    } else {
      newList = task.map((item, index) => {
        if (index === editIndex) {
          return newTask;
        }
        return item;
      });
    }

    setTask(newList);
    localStorage.setItem("tasks", JSON.stringify(newList));

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
    const updatedtasks = task.filter((item, index) => {
      return index !== indexToDelete;
    });

    setTask(updatedtasks);
    localStorage.setItem("tasks", JSON.stringify(updatedtasks));
    resetForm();
  }

  function enRetard(item) {
    const today = new Date().toLocaleDateString("en-CA");
    if (item.status !== 'done'){
    return item.endDate < today;
    }
  }


  let lateCount = 0;
  let todoCount = 0;
  let progressCount = 0;
  let doneCount = 0;

  for (let i = 0; i < task.length; i++) {
    if (enRetard(task[i])) {
      lateCount = lateCount + 1;
    }
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

  const filtered = task
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => {
      const q = search.trim().toLowerCase();
      return (
        item.text.toLowerCase().includes(q) ||
        item.resource.toLowerCase().includes(q) ||
        item.status.toLowerCase().includes(q)
      );
    });
    
 // for pie chart
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

      <div className="kpis">
        <div className="kpi">
          <span className="kpiVal">{task.length}</span>
          <span className="kpiStat">Total tasks</span>
        </div>
        <div className="kpi">
          <span className="kpiVal">{todoCount}</span>
          <span className="kpiStat">Todo</span>
        </div>
        <div className="kpi">
          <span className="kpiVal">{progressCount}</span>
          <span className="kpiStat">In progress</span>
        </div>
        <div className="kpi">
          <span className="kpiVal">{doneCount}</span>
          <span className="kpiStat">Done</span>
        </div>
        <div className="kpi">
          <span className="kpiVal">{lateCount}</span>
          <span className="kpiStat">Late</span>
        </div>
      </div>

      <div className="row">
        <div className="tasks">
          <h3>Tasks ({filtered.length})</h3>
          <input
            type="text"
            className="search"
            placeholder="Search by task, resource or status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {task.length > 0 && filtered.length === 0 && (
            <p className="empty">No task matches "{search}".</p>
          )}
          {filtered.map(({ item, index }) => (
              <div
                className="item"
                key={index}
                style={{
                  backgroundColor: enRetard(item) ? "red" : getColor(item.status),
                  color: enRetard(item) ? "white" : "black",
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