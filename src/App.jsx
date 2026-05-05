import { useEffect, useState } from "react";
import "./App.css";
import "./custom.css";
import supabase from "./supabse-client";

function App() {
  console.log("App Rendered");
  const [todoList, setTodoList] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  // const [testState, setTestState] = useState("");

  useEffect(() => {
    console.log("useEffect() called");
    fetchData();
  }, []);

  async function fetchData() {
    console.log("Fetch() called");
    const { data, error } = await supabase.from("todo_list").select("*");
    console.log("Data Fetched:", data);

    if (error) {
      console.log("Error while feching data: ", error);
    } else {
      setTodoList(data);
    }
  }

  const markComplete = async (id, isCompleted) => {
    console.log("id: " + id + " ,and isCompleted: " + isCompleted);

    const { data, error } = await supabase
      .from("todo_list")
      .update({ isCompleted: !isCompleted })
      .eq("id", id);

    if (error) {
      console.log("Error handling complete: ", error);
    } else {
      const newTodoList = todoList.map((task) => {
        if (task.id === id) {
          return { ...task, isCompleted: !isCompleted };
        } else {
          return task;
        }
      });
      setTodoList(newTodoList);
    }
  };

  async function handleDelete(id) {
    const { data, error } = await supabase
      .from("todo_list")
      .delete()
      .eq("id", id);
    if (error != null || error != undefined) {
      console.log("Error deleting task: ", error);
    } else {
      const newTodoList = todoList.filter((task) => {
        return task.id != id;
      });

      setTodoList(newTodoList);
    }
  }

  async function handleAddbtn() {
    const { data, error } = await supabase
      .from("todo_list")
      .insert([{ name: newTodo, isCompleted: false }])
      .select()
      .single();
    if (error) {
      console.log("Error inserting data :", error);
    } else {
      // setTestState(Math.random() * 10);
      setNewTodo("");
      // fetchData();
      setTodoList((prv) => {
        return [...prv, data];
      });
    }
  }
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
