import Gtk30 from "gi://Gtk?version=3.0";
import { Label, Box, Entry } from "resource:///com/github/Aylur/ags/widget.js";
import PopupWindow from "../../globalWidgets/PopupWindow.js";
import { addTodo } from "../../lib/todos.js";

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
