import {
	Box,
	Button,
	Label,
	Scrollable,
} from "resource:///com/github/Aylur/ags/widget.js";
import { S } from "../index.js";
import Config from "../../../services/config.js";
import Gtk from "gi://Gtk?version=3.0";
import BoxT from "types/widgets/box.js";
import {
	getCurrentDayIndex,
	removeTodo,
	requestAddTodo,
	SelectedDate,
	updateTodos,
	Todo,
} from "../../../lib/todos.js";

const day = 24 * 60 * 60 * 1000;

function checked(todo: Todo) {
	function updateTasks(td: Todo): Todo {
		if (td.id == todo.id) td.finished = !td.finished;

		//recurse to complete branch tasks
		const neededTasks = td.neededTasks.map(updateTasks);

		//check if subtasks completed to complete self
		const neededFinished = neededTasks.map((t) => Number(t.finished));
		const needLen = neededFinished.length;
		if (needLen > 0 && neededFinished.reduce((a, b) => a + b) == needLen)
			td.finished = true;

		return td;
	}
	updateTodos(updateTasks);
}

const TodoView = () => {
	function updateTodoView(self: BoxT<Gtk.Widget, unknown>) {
		const dayI = getCurrentDayIndex();
		const todos = Config.persistentData.todos[dayI].tasks;

		self.children = [
			Box({
				children: [...todos.map((v) => TodoCards(v, checked))],
				vertical: true,
			}),
			Button({
				label: "+",
				hexpand: true,
				class_names: ["add_root"],
				on_clicked: () => requestAddTodo(""),
			}),
		];
	}

	const content = Box({ vertical: true })
		.hook(Config, updateTodoView)
		.hook(SelectedDate, updateTodoView);
	return Scrollable({
		vscroll: "always",
		hscroll: "never",
		height_request: 250,
		max_content_width: 250,
		child: content,
	});
};

const TodoCards = (
	todo: Todo,
	onChecked: (todo: Todo) => void,
	sub: boolean = false,
) => {
	const checkbutton = Gtk.CheckButton.new_with_label(todo.text);
	checkbutton.set_active(todo.finished);
	checkbutton.connect("toggled", () => onChecked(todo));

	const class_names = sub ? ["todo-content", "todo-sub"] : ["todo-content"];
	return Box({
		class_names,
		vertical: true,
		children: [
			Box({
				children: [
					checkbutton,
					S(),
					Button({
						label: "-",
						class_names: ["modify_btn"],
						on_clicked: () => {
							removeTodo(todo.id);
						},
					}),
					Button({
						label: "+",
						class_names: ["modify_btn"],
						on_clicked: () => {
							requestAddTodo(todo.id);
						},
					}),
				],
			}),
			...todo.neededTasks.map((todo) => TodoCards(todo, onChecked, true)),
		],
	});
};

const DateRow = () =>
	Box({
		children: [
			Button({
				label: "-",
				on_clicked: () =>
					SelectedDate.setValue(new Date(SelectedDate.value.getTime() - day)),
			}),
			S(),
			Label({ label: SelectedDate.bind().transform((v) => v.toDateString()) }),
			S(),
			Button({
				label: "+",
				on_clicked: () =>
					SelectedDate.setValue(new Date(SelectedDate.value.getTime() + day)),
			}),
		],
	});

export default () =>
	Box({
		class_names: ["bg", "todo"],
		vertical: true,
		children: [
			Label({ class_names: ["title"], label: "Todo list" }),
			DateRow(),
			TodoView(),
		],
	});
