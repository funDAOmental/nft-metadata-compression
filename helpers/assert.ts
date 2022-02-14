export default function assert(
  condition: boolean,
  message?: string
): asserts condition {
  if (condition === false) {
    const suffix = message === undefined ? "" : `: ${message}`;
    throw new Error(`Assertion failure${suffix}`);
  }
}
