import Gtk30 from "gi://Gtk?version=3.0";
import { Label, Box, Entry } from "resource:///com/github/Aylur/ags/widget.js";
import PopupWindow from "../../globalWidgets/PopupWindow.js";
import Config, { Todo } from "../../services/config.js";
import GLib20 from "gi://GLib?version=2.0";
import {
	SelectedDate,
	getCurrentDayIndex,
	getCurrentDayTodos,
} from "./modules/todo.js";

let parentID = "";

export default () =>
	PopupWindow({
		name: "todoAddForm",
		transition: "none",
		child: Box({
			vertical: true,
			class_names: ["todo-add-form-wrapper"],
			child: Box({
				vertical: true,
				class_names: ["todo-add-form"],
				children: [
					Label({ label: "Add Todo", class_names: ["title"] }),
					Entry({
						placeholder_text: "Todo title",
						input_purpose: Gtk30.InputPurpose.FREE_FORM,
						visibility: true,
						caps_lock_warning: true,
						on_accept: (self) => {
							App.closeWindow("todoAddForm");
							addTodo(self.text ? self.text : "");

							self.text = "";
						},
					}),
				],
			}),
		}),
	});

export function requestAddTodo(pID: string) {
	parentID = pID;
	App.openWindow("todoAddForm");
}

function addTodo(text: string) {
	const todo: Todo = {
		text,
		id: GLib20.uuid_string_random()!,
		parentID: parentID != "" ? parentID : undefined,
		neededTasks: [],
		finished: false,
	};
	const todos = getCurrentDayTodos();
	const copy = Config.persistentData;
	const dayI = getCurrentDayIndex();
	if (copy.todos[dayI] == undefined) {
		copy.todos.push({
			day: SelectedDate.value.getDate(),
			month: SelectedDate.value.getMonth() + 1,
			year: SelectedDate.value.getFullYear(),
			tasks: [],
		});
	}

	if (parentID == "") {
		copy.todos[dayI].tasks.push(todo);

		Config.persistentData = copy;
		return;
	}

	function map(td: Todo) {
		if (parentID == td.id) {
			td.neededTasks.push(todo);
			return td;
		}

		const neededTasks = td.neededTasks.map(map);
		td.neededTasks = neededTasks;

		return td;
	}
	copy.todos[dayI].tasks = todos.map(map);
	Config.persistentData = copy;

	parentID = "";
}
