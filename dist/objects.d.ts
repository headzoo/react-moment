/**
 * Performs a key comparison between two objects, deleting from the first where
 * the keys exist in the second.
 *
 * Can be used to remove unwanted component prop values. For example:
 *
 * ```tsx
 * function Item(props) {
 *   const { children, className, ...rest } = props;
 *   return (
 *     <div
 *       {...objectKeyFilter(rest, Item.propKeys)}
 *       className={classNames('dp-item', className)}
 *     >
 *       {children}
 *     </div>
 *   );
 * }
 * ```
 */
export declare function objectKeyFilter<T extends Record<string, unknown>>(obj1: T, obj2: Record<string, unknown>): Partial<T>;
