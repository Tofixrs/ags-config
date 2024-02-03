export function range(length: number, start: number = 0): number[] {
	return Array.from({ length }).map((_, i) => i + start);
}
