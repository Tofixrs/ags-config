import { utils } from "./index";

export class HistEntry {
	id: number;
	text: string;

	constructor({ id, text }: { id: number; text: string }) {
		this.id = id;
		this.text = text;
	}

	removeEntry() {
		utils.bash(`echo ${this.id} | cliphist delete`);
	}

	copy() {
		utils.bash(`cliphist decode ${this.id} | wl-copy`);
	}
	isImage() {
		return /^\[\[.binary.data.(\S{1,}.){2}(png|jpeg|jpg|gif).(\S{1,}.)\]\]$/.test(
			this.text,
		);
	}
	getImageType() {
		return this.text.split(" ")[5];
	}
}

export function getHistory(): HistEntry[] {
	return Utils.exec("cliphist list")
		.split("\n")
		.map((entry) => entry.split("\t"))
		.map(([id, text]) => {
			return new HistEntry({ id: Number(id), text });
		});
}

export function wipe() {
	Utils.execAsync("cliphist wipe");
}
