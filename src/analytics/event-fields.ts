// The details of an event, as fields. The analytics backends receive them as the
// label, in JSON, which can be any length; GA4 receives them as event parameters
// instead (toGa4Params), as it drops a label over 100 characters.
export type EventFieldValue = string | number | boolean | readonly string[] | null | undefined;
export type EventFields = Readonly<Record<string, EventFieldValue>>;

// GA4 drops a parameter value over 100 characters; one cut short tells more than one lost.
const GA4_PARAM_VALUE_MAX_LENGTH = 100;

function toSnakeCase(name: string): string {
  return name.replace(/([a-z0-9])([A-Z])/g, '$1_$2').toLowerCase();
}

// Each field as a GA4 event parameter, named in snake_case as GA4's own are. Lists
// are left out: GA4 cannot hold one, and an event that has one also has its count.
export function toGa4Params(fields: EventFields): Record<string, string | number | boolean> {
  const params: Record<string, string | number | boolean> = {};
  for (const [name, value] of Object.entries(fields)) {
    if (value === null || value === undefined || Array.isArray(value)) continue;
    params[toSnakeCase(name)] = typeof value === 'string' ? value.slice(0, GA4_PARAM_VALUE_MAX_LENGTH) : (value as number | boolean);
  }
  return params;
}

// An error as text for an event: its name and message, never its stack, which can
// hold paths on the user's machine. Cut short, as a message can be long.
export function describeError(error: unknown): string {
  const text = error instanceof Error ? `${error.name}: ${error.message}` : String(error);
  return text.slice(0, 200);
}
