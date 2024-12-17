import { exec, execAsync } from "astal";
import { bash } from "./utils";

export class HistEntry {
	id: number;
	text?: string;

	constructor({ id, text }: { id: number; text: string }) {
		this.id = id;
		this.text = text;
	}

	removeEntry() {
		bash(`echo ${this.id} | cliphist delete`);
	}

	copy() {
		bash(`cliphist decode ${this.id} | wl-copy`);
	}
	isImage() {
		return /^\[\[.binary.data.(\S{1,}.){2}(png|jpeg|jpg|gif).(\S{1,}.)\]\]$/.test(
			this.text ?? "",
		);
	}
	getImageType() {
		return this.text?.split(" ")[5];
	}
}

export function getHistory(): HistEntry[] {
	const str = exec("cliphist list");
	if (str.trim() == "") {
		return [];
	}
	return str
		.split("\n")
		.map((entry) => entry.split("\t"))
		.map(([id, text]) => {
			return new HistEntry({ id: Number(id), text });
		});
}

export function wipe() {
	execAsync("cliphist wipe");
}
