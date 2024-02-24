import { useState } from "react";

function Form(props) {
  const [name, setName] = useState("");
  const [isSubTask, setSubTask] = useState(false);
  const [selectedParentTask, setSelectedParentTask] = useState(null);

  function handleChange(event) {
    setName(event.target.value);
  }
  function handleCheckboxChange(event) {
    setSubTask(event.target.checked);
  }

  function handleDropdownChange(event) {
    setSelectedParentTask(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (name === "") {
      alert("Need to enter a value");
    } else {
      if (isSubTask && selectedParentTask !== null) {
        props.addTask(name, isSubTask, selectedParentTask);
      } else {
        props.addTask(name);
      }
      setName("");
      setSubTask(false);
      setSelectedParentTask("");
    }
  }
  return (
    <form onSubmit={handleSubmit}>
      <h2 className="label-wrapper">
        <label htmlFor="new-todo-input" className="label__lg">
          What needs to be done?
        </label>
      </h2>
      <input
        type="text"
        id="new-todo-input"
        className="input input__lg"
        name="text"
        autoComplete="off"
        value={name}
        onChange={handleChange}
      />
      <label htmlFor="new-subtask" className="label__sm">
        Is this a subtask?
      </label>
      <input
        type="checkbox"
        id="new-subtask"
        value={isSubTask}
        onChange={handleCheckboxChange}
      />
           {isSubTask && props.parentTasks.length > 0 && (

        <div>
          <label htmlFor="parent-task-dropdown" className="label__sm">
            Select Parent Task:
          </label>
          <select
            id="parent-task-dropdown"
            onChange={handleDropdownChange}
            value={selectedParentTask}
          >
            <option value={null}>Select a Parent Task</option>
            {props.parentTasks.map((parentTask) => (
              <option key={parentTask.id} value={parentTask.id}>
                {parentTask.name}
              </option>
            ))}
          </select>
        </div>
           )}
      <button type="submit" className="btn btn__primary btn__lg">
        Add
      </button>
    </form>
  );
}

export default Form;
