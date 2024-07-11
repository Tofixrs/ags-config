import {
	Box,
	Button,
	Label,
	Scrollable,
} from "resource:///com/github/Aylur/ags/widget.js";
import Variable from "resource:///com/github/Aylur/ags/variable.js";
import { S } from "../index.js";
import Config, { Todo } from "../../../services/config.js";
import Gtk from "gi://Gtk?version=3.0";
import BoxT from "types/widgets/box.js";
import { requestAddTodo } from "../TodoAddForm.js";

const SelectedDate = Variable(new Date());
const day = 24 * 60 * 60 * 1000;

export function getCurrentDayTodos() {
	const selectedDay = Config.persistentData.todos.find((d) => {
		const day = d.day == SelectedDate.value.getDate();
		const month = d.month == SelectedDate.value.getMonth() + 1;
		const year = d.year == SelectedDate.value.getFullYear();

		return day && month && year;
	});
	return selectedDay ? selectedDay.tasks : [];
}
export function getCurrentDayIndex() {
	return Config.persistentData.todos.findIndex((d) => {
		const day = d.day == SelectedDate.value.getDate();
		const month = d.month == SelectedDate.value.getMonth() + 1;
		const year = d.year == SelectedDate.value.getFullYear();

		return day && month && year;
	});
}

function checked(todo: Todo) {
	const todos = getCurrentDayTodos();

	function map(td: Todo): Todo {
		if (td.id == todo.id) td.finished = !td.finished;

		//recurse to complete branch tasks
		const neededTasks = td.neededTasks.map(map);

		//check if subtasks completed to complete self
		const neededFinished = neededTasks.map((t) => Number(t.finished));
		const needLen = neededFinished.length;
		if (needLen > 0 && neededFinished.reduce((a, b) => a + b) == needLen)
			td.finished = true;

		return td;
	}

	const dayI = getCurrentDayIndex();

	//copy cuz gotta fire set event
	const copy = Config.persistentData;
	copy.todos[dayI].tasks = todos.map(map);
	Config.persistentData = copy;
}

function removeTodo(id: string) {
	const todos = getCurrentDayTodos();
	const copy = Config.persistentData;
	const dayI = getCurrentDayIndex();

	function map(todo: Todo) {
		if (id == todo.id) return undefined;

		//@ts-expect-error
		todo.neededTasks = todo.neededTasks.map(map).filter((v) => v != undefined);
		return todo;
	}

	//@ts-expect-error
	copy.todos[dayI].tasks = todos.map(map).filter((v) => v != undefined);
	Config.persistentData = copy;
}

const TodoView = () => {
	function updateTodoView(self: BoxT<Gtk.Widget, unknown>) {
		const todos = getCurrentDayTodos();
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
		height_request: 500,
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
