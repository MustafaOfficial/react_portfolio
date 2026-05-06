import { useContext, useEffect, useState } from "react";
import "./App.css";
import "./custom.css";
import { todoContext } from "./TodoContext";

function App() {
  console.log("App Rendered");

  const {
    todoList,
    setTodoList,
    newTodo,
    setNewTodo,
    fetchData,
    handleAddbtn,
    handleDelete,
    markComplete,
  } = useContext(todoContext);

  useEffect(() => {
    console.log("useEffect() called");
    fetchData();
  }, []);

  return (
    <>
      <h1>My Todo List</h1>
      <input
        type="text"
        placeholder="New Todo"
        onKeyDown={(e) => {
          e.key === "Enter" ? handleAddbtn() : "";
        }}
        onChange={(e) => {
          setNewTodo(e.target.value);
        }}
        value={newTodo}
      />
      <button onClick={handleAddbtn}>Add Todo</button>

      <p>{newTodo}</p>
      <ol>
        {todoList.map((task) => {
          return (
            <div key={task.id}>
              <li>{task.name}</li>
              <button
                onClick={() => {
                  markComplete(task.id, task.isCompleted);
                }}
                className={!task.isCompleted ? "taskIncomplete" : "taskdone"}
              >
                {!task.isCompleted ? "Mark Complete" : "Undo"}
              </button>
              <button
                className="deleteButton"
                onClick={() => handleDelete(task.id)}
              >
                Delete
              </button>
            </div>
          );
        })}
      </ol>
      <br />
      <h1>Footer</h1>
      <h3>Contact Us</h3>
      <h3>About</h3>
      <h3>Careers</h3>
    </>
  );
}

export default App;
