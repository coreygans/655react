import "./App.css";

import Form from "./components/Form";
import FilterButton from "./components/FilterButton";
import Todo from "./components/Todo";
import { useState } from "react";
import { nanoid } from "nanoid";

//Filters aren't working for subtasks
const FILTER_MAP = {
  All: () => true,
  Active: (task) => !task.completed,
  Completed: (task) => task.completed,
};

const FILTER_NAMES = Object.keys(FILTER_MAP);

function App(props) {
  const [tasks, setTasks] = useState(props.tasks);
  const [parentTasks, setParentTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const filterList = FILTER_NAMES.map((name) => (
    <FilterButton
      key={name}
      name={name}
      isPressed={name === filter}
      setFilter={setFilter}
    />
  ));
  const taskList = tasks
    .filter(FILTER_MAP[filter])
    .map((task) => (
      <Todo
        id={task.id}
        name={task.name}
        completed={task.completed}
        subtasks={task.subtasks}
        key={task.id}
        isSubTask={task.isSubTask}
        setSelectedParentTask={task.setSelectedParentTask}
        toggleTaskCompleted={toggleTaskCompleted}
        deleteTask={deleteTask}
        editTask={editTask}
        editSubtask={editSubtask}
        deleteSubtask={deleteSubtask}
      />
    ));
  console.log(taskList);
  function addTask(name, isSubTask, parentTaskId) {
    if (isSubTask && parentTaskId) {
      // If it's a subtask, link to parent task
      const parentTask = tasks.find((task) => task.id === parentTaskId);

      if (parentTask) {
        const subtaskId = `subtask-${nanoid()}`;
        const updatedTasks = tasks.map((task) =>
          task.id === parentTaskId
            ? {
                ...task,
                subtasks: [
                  ...(task.subtasks || []),
                  { id: subtaskId, name, key: subtaskId, completed: false },
                ],
              }
            : task
        );
        setTasks(updatedTasks);
      }
    } else {
      const newTask = { id: `todo-${nanoid()}`, name, completed: false };
      setTasks([...tasks, newTask]);

      if (!isSubTask) {
        // Add regular task to the parentTasks list
        setParentTasks([...parentTasks, newTask]);
      }
    }
  }

  function toggleTaskCompleted(id) {
    const updatedTasks = tasks.map((task) => {
      if (id === task.id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks);
  }

  function deleteTask(id) {
    const remainingTasks = tasks.filter((task) => id !== task.id);
    setTasks(remainingTasks);
  }

  function deleteSubtask(taskId, subtaskId) {
    const updatedTasks = tasks.map((task) => {
      if (taskId === task.id) {
        const updatedSubtasks = task.subtasks.filter((subtask) => subtask.id !== subtaskId);
  
        return { ...task, subtasks: updatedSubtasks };
      }
  
      return task;
    });
  
    setTasks(updatedTasks);
  }

  function editTask(id, newName) {
    const editedTaskList = tasks.map((task) => {
      if (id === task.id) {
        return { ...task, name: newName };
      }
      return task;
    });
    setTasks(editedTaskList);
  }

  function editSubtask(taskId, subtaskId, newName) {
    const updatedTasks = tasks.map((task) => {
      if (taskId === task.id) {
        const updatedSubtasks = task.subtasks.map((subtask) => {
          if (subtaskId === subtask.id) {
            return { ...subtask, name: newName };
          }
          return subtask;
        });
  
        return { ...task, subtasks: updatedSubtasks };
      }
  
      return task;
    });
  
    setTasks(updatedTasks);
  }

 
  const tasksNoun = taskList.length !== 1 ? "tasks" : "task";
  const headingText = `${taskList.length} ${tasksNoun} remaining`;
  return (
    <div className="todoapp stack-large">
      <h1>Todo List</h1>
      <Form addTask={addTask} parentTasks={parentTasks} />
      <div className="filters btn-group stack-exception">{filterList}</div>
      <h2 id="list-heading">{headingText}</h2>
      <ul
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading">
        {taskList}
      </ul>
    </div>
  );
}

export default App;
