interface Stringable {
  toString(): string;
}

export function formatArray(array?: Array<Stringable>): string {
  if (!array) return '';

  const content = array.map(element => element.toString?.() ?? '').join(', ');
  return `[${content}]`;
}
