export class HistEntry {
	id: number;
	text: string;

	constructor({ id, text }: { id: number; text: string }) {
		this.id = id;
		this.text = text;
	}

	removeEntry() {
		Utils.execAsync(`echo ${this.id} | cliphist delete ${this.text}`);
	}

	copy() {
		Utils.execAsync(`cliphist decode ${this.id} | wl-copy`);
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
