import { ipcRenderer } from "electron";
import { DomHelper } from "../helpers/dom-helper";
import { Task } from "../interfaces/task.interface";
import { TodoListContainer } from "./TODO_LIST_CONTAINER";

let allTasks: Task[] = [];
let lastSelectedTaskActions: Element = null;

ipcRenderer.on(
  "loadTasksByListId",
  (event: Electron.IpcRendererEvent, lists: Task[]) => {
    allTasks = lists;
    console.table(allTasks);
    updateTasks();
  }
);

function updateTasks(): void {
  removeTasksFromDom();
  loadTasks();
}

function removeTasksFromDom(): void {
  DomHelper.searchAllElement(".task")?.forEach((el) => {
    el.remove();
  });
}

function loadTasks(): void {
  if (allTasks.length) {
    allTasks.forEach((task) => {
      const container = DomHelper.searchElement(".task-container");
      const taskNode = DomHelper.createElement("div");
      taskNode.setAttribute("id", task.id.toString());

      const actionsNode = DomHelper.createElement("div");
      const editButton = DomHelper.createElement("button");
      const deleteButton = DomHelper.createElement("button");
      const editText = DomHelper.createTextNode("edit");
      const deleteText = DomHelper.createTextNode("delete");
      editButton.appendChild(editText);
      deleteButton.appendChild(deleteText);
      actionsNode.appendChild(editButton);
      actionsNode.appendChild(deleteButton);
      actionsNode.classList.add(...["actions-container", "hide"]);
      editButton.classList.add("secondary-button");
      deleteButton.classList.add("secondary-button");

      const textNode = DomHelper.createElement("p");
      const text = DomHelper.createTextNode(task.title);
      textNode.appendChild(text);

      taskNode.classList.add("task");
      taskNode.appendChild(textNode);
      taskNode.appendChild(actionsNode);
      container?.appendChild(taskNode);
      taskNode.addEventListener("click", onTaskClicked);
      taskNode.addEventListener("dblclick", onTaskDblClicked);
    });
  }
}

function onTaskClicked(event: PointerEvent): void {
  const taskNode = event.currentTarget as HTMLDivElement;
  const actionsNode = taskNode.querySelector(".actions-container");
  actionsNode.classList.remove("hide");
  const lastSelectedTask = lastSelectedTaskActions?.parentElement;
  if (lastSelectedTaskActions && lastSelectedTask?.id !== taskNode.id) {
    lastSelectedTaskActions.classList.add("hide");
  }
  lastSelectedTaskActions = actionsNode;
}

function onTaskDblClicked(event: PointerEvent): void {
  const taskNode = event.currentTarget as HTMLDivElement;
  if (taskNode.classList.contains("completed")) {
    taskNode.classList.remove("completed");
  } else taskNode.classList.add("completed");
}

DomHelper.searchElement(".add-task-button")?.addEventListener(
  "click",
  addNewList
);
loadTasks();

function addNewList(): void {
  ipcRenderer.send("addTask", TodoListContainer.prototype.selectedListId);
}
