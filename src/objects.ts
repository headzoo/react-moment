/**
 * Performs a key comparison between two objects, deleting from the first where
 * the keys exist in the second.
 *
 * Can be used to remove unwanted component prop values before passing the rest
 * to a DOM element. For example, `<Moment>` strips its own props and forwards
 * the remainder:
 *
 * ```tsx
 * const passProps = objectKeyFilter(
 *   remaining as Record<string, unknown>,
 *   knownMomentPropKeys
 * );
 * return React.createElement(tag, passProps, content);
 * ```
 */
export function objectKeyFilter<T extends Record<string, unknown>>(
  obj1: T,
  obj2: Record<string, unknown>
): Partial<T> {
  const obj2Keys = Object.keys(obj2);
  const newProps: Partial<T> = { ...obj1 };
  Object.keys(newProps)
    .filter(key => obj2Keys.indexOf(key) !== -1)
    .forEach((key) => {
      delete (newProps as Record<string, unknown>)[key];
    });

  return newProps;
}
