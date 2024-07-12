import GLib from "gi://GLib?version=2.0";
import Config from "../services/config.js";

export const SelectedDate = Variable(new Date());
let parentToAddTo = "";

export interface Todo {
	text: string;
	finished: boolean;
	neededTasks: Todo[];
	id: string;
	parentID?: string;
}

export function requestAddTodo(pID: string) {
	parentToAddTo = pID;
	App.openWindow("todoAddForm");
}

export function addTodo(text: string) {
	const todo: Todo = {
		text,
		id: GLib.uuid_string_random()!,
		parentID: parentToAddTo != "" ? parentToAddTo : undefined,
		neededTasks: [],
		finished: false,
	};

	if (parentToAddTo == "") {
		const copy = Config.persistentData;
		const dayI = getCurrentDayIndex();
		copy.todos[dayI].tasks.push(todo);

		Config.persistentData = copy;
		return;
	}

	function map(td: Todo) {
		if (parentToAddTo == td.id) {
			td.neededTasks.push(todo);
			return td;
		}

		const neededTasks = td.neededTasks.map(map);
		td.neededTasks = neededTasks;

		return td;
	}

	updateTodos(map);

	parentToAddTo = "";
}
export function removeTodo(id: string) {
	const map = (todo: Todo) => {
		if (id == todo.id) return undefined;

		//@ts-expect-error
		todo.neededTasks = todo.neededTasks.map(map).filter((v) => v != undefined);
		return todo;
	};
	updateTodos(map, (td) => td != undefined);
}

export function updateTodos(
	mapFunc: (td: Todo) => Todo | undefined,
	filterFunc?: (td: Todo) => boolean,
) {
	const dayI = getCurrentDayIndex();
	const copy = Config.persistentData;
	const todos = copy.todos[dayI].tasks;

	if (copy.todos[dayI] == undefined) {
		copy.todos.push({
			day: SelectedDate.value.getDate(),
			month: SelectedDate.value.getMonth() + 1,
			year: SelectedDate.value.getFullYear(),
			tasks: [],
		});
	}

	//@ts-expect-error
	copy.todos[dayI].tasks = todos.map(mapFunc);
	if (filterFunc != undefined) {
		copy.todos[dayI].tasks = copy.todos[dayI].tasks.filter(filterFunc);
	}

	Config.persistentData = copy;
}

export function getCurrentDayIndex() {
	const result = Config.persistentData.todos.findIndex((d) => {
		const day = d.day == SelectedDate.value.getDate();
		const month = d.month == SelectedDate.value.getMonth() + 1;
		const year = d.year == SelectedDate.value.getFullYear();

		return day && month && year;
	});
	if (result == -1) {
		const copy = Config.persistentData;
		copy.todos.push({
			day: SelectedDate.value.getDate(),
			month: SelectedDate.value.getMonth() + 1,
			year: SelectedDate.value.getFullYear(),
			tasks: [],
		});
		Config.persistentData = copy;

		return copy.todos.length - 1;
	}
	return result;
}
