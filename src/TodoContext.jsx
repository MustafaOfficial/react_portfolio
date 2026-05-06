import React from "react";
import { useState } from "react";
import { Children } from "react";
import { createContext } from "react";
import supabase from "./supabse-client";

export const todoContext = createContext();

const TodoContextProvider = ({ children }) => {
  const [todoList, setTodoList] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  // const [testState, setTestState] = useState("");

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
    <todoContext.Provider
      value={{
        todoList,
        setTodoList,
        newTodo,
        setNewTodo,
        fetchData,
        handleAddbtn,
        handleDelete,
        markComplete,
      }}
    >
      {children}
    </todoContext.Provider>
  );
};

export default TodoContextProvider;
