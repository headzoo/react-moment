# Migration guide

This guide covers breaking changes when upgrading from **1.2.3** to **2.0.0**, which migrates the library to TypeScript and replaces the class-based `Moment` component with a functional component.

If your usage is limited to rendering `<Moment />` with documented props, global configuration (`Moment.globals.format`, etc.), and the pooled timer API (`Moment.startPooledTimer()` / `Moment.clearPooledTimer()`), you may not need to change anything. The sections below call out cases that **do** require updates.

## Summary

| Area | 1.2.3 | Next release |
| --- | --- | --- |
| Component implementation | React class component | React function component (hooks) |
| Source language | JavaScript (`.jsx` / `.js`) | TypeScript (`.tsx` / `.ts`) |
| Runtime prop validation | PropTypes | None (TypeScript types only) |
| `prop-types` peer dependency | Required | Removed |
| Published entry point | `dist/index.js` | `dist/index.js` (unchanged) |
| Type declarations | Hand-written class typings | Generated from TypeScript source |

---

## Remove `prop-types` as a peer dependency

**1.2.3** listed `prop-types` as a peer dependency and validated props at runtime via `PropTypes`.

The next release removes runtime validation entirely. Type information is provided only through TypeScript declarations.

### What to change

- Remove `prop-types` from your dependencies if you installed it solely to satisfy `react-moment`'s peer dependency warning.
- Do not expect development-time console warnings from `react-moment` when invalid props are passed; rely on your own TypeScript checks or tests instead.

### Peer dependencies (next release)

```json
{
  "peerDependencies": {
    "moment": "^2.29.0",
    "react": "^16.0 || ^17.0.0 || ^18.0.0"
  }
}
```

---

## `Moment` is no longer a class component

In **1.2.3**, `Moment` extended `React.Component`. It is now a function component with static properties attached for global configuration and utilities.

### Breaking if you relied on class-component internals

The following patterns **no longer work**:

```jsx
// instanceof checks
if (instance instanceof Moment) { /* ... */ }

// Instance methods on a mounted component
ref.current.update();
ref.current.setTimer();
ref.current.clearTimer();
ref.current.getTitle();
ref.current.componentWillUnmount();

// TestUtils helpers that expect a class instance
TestUtils.findRenderedComponentWithType(container, Moment);
```

### What still works

Documented static APIs are unchanged in behavior:

- Global configuration: `Moment.globals.moment`, `Moment.globals.locale`, `Moment.globals.local`, `Moment.globals.format`, `Moment.globals.parse`, `Moment.globals.filter`, `Moment.globals.element`, `Moment.globals.timezone`
- Pooled timer: `Moment.startPooledTimer(interval?)`, `Moment.clearPooledTimer()`
- Utilities: named exports `getDatetime(props)`, `getContent(props)`, and `getShortRelativeTime(datetime)` from `react-moment`

Normal JSX usage is unchanged:

```jsx
<Moment fromNow>{date}</Moment>
<Moment format="YYYY-MM-DD" date={date} />
```

### Default prop behavior

**1.2.3** declared defaults via `static defaultProps` on the class. The functional component applies the same effective defaults through runtime fallbacks (for example, `interval ?? 60000`, identity `filter` when none is provided, falsy boolean props treated as `false`). Typical usage does not need changes.

---

## Pooled timer registry type change

**1.2.3** stored mounted `Moment` **class instances** in `Moment.pooledElements` and validated entries with `instanceof Moment` inside `pushPooledElement`.

The next release stores lightweight **pool entries** instead:

```ts
interface PoolEntry {
  getProps: () => MomentProps;
  update: () => void;
}
```

### Breaking if you accessed the pool directly

```jsx
// 1.2.3 — no longer valid
Moment.pooledElements.forEach((instance) => {
  instance.update();
});

Moment.pushPooledElement(myMomentInstance);
```

### What to change

- Use `Moment.startPooledTimer()` and `Moment.clearPooledTimer()` as documented in the README; do not manually push to `pooledElements` unless you provide a `PoolEntry`-shaped object with `getProps` and `update` functions.
- If you inspected `pooledElements`, iterate entries and call `entry.update()` or read props via `entry.getProps()` instead of treating entries as component instances.

---

## TypeScript declaration changes

Type declarations are now generated from the TypeScript source (`tsc --emitDeclarationOnly`) rather than hand-maintained class typings.

### Component type

**1.2.3:**

```ts
declare class Moment extends Component<MomentProps, any> { /* ... */ }
export default Moment;
```

**Next release:**

```ts
declare const Moment: React.FC<MomentProps> & MomentStatics;
export default Moment;
```

Update code that types refs or variables as `Moment` (the class) or `Component<MomentProps>`.

### `MomentProps` changes

Notable differences:

| Prop / area | 1.2.3 | Next release |
| --- | --- | --- |
| `add` / `subtract` | `subtractOrAddTypes` (loose object) | `moment.DurationInputObject` |
| `date`, `from`, `to`, etc. | `dateTypes` (`string \| number \| array \| object`) | `moment.MomentInput` |
| `parse` | `string \| Array<any>` | `moment.MomentFormatSpecification` |
| `calendar` | `boolean \| object` | `boolean \| moment.CalendarSpec` |
| `unit` | `string` | `moment.unitOfTime.Diff` |
| `filter` | `(date: string) => string` | `Filter` — `(content: MomentContent) => MomentContent` |
| `onChange` | `(content: any) => any` | `(content: MomentContent) => void` |
| `element` | `string \| FunctionComponent \| ComponentClass` | `ElementType \| null` |
| Passthrough DOM props | Explicit optional props (`className`, `style`, …) | Index signature `[key: string]: unknown` |

Stricter types may surface existing type errors in TypeScript projects. Adjust call sites or narrow types at boundaries as needed.

### New exported declaration files

The published package includes additional `.d.ts` files alongside `dist/index.d.ts`:

- `dist/types.d.ts` — `MomentProps`, `MomentStatics`, `PoolEntry`, and related types
- `dist/objects.d.ts` — `objectKeyFilter` utility
- `dist/utils.d.ts` — helper implementations (`getDatetime`, `getContent`, etc.); also re-exported from `dist/index.d.ts`

These are primarily for advanced use and type re-exports; the default import path remains `react-moment`.

### New static members in typings

The next release's `MomentStatics` interface documents members that were present at runtime in **1.2.3** but omitted or incomplete in the old hand-written declarations, including:

- `Moment.pooledElements`
- `Moment.pooledTimer`
- `Moment.pushPooledElement(entry)`
- `Moment.removePooledElement(entry)`

Helper functions are named exports from the package entry point:

```ts
import Moment, { getDatetime, getContent, getShortRelativeTime } from 'react-moment';
```

---

## Source layout (monorepo / deep imports)

If you imported from source paths inside the package (unusual for npm consumers), file extensions and locations changed:

| 1.2.3 | Next release |
| --- | --- |
| `src/index.jsx` | `src/index.tsx` |
| `src/types.js` | `src/types.ts` |
| `src/objects.js` | `src/objects.ts` |
| — | `src/utils.ts` (new; date/content helpers) |

The supported public API remains the built artifact: `dist/index.js` with types at `dist/index.d.ts`. Deep imports from `src/` are not part of the supported API.

---

## Non-breaking for typical consumers

The following continue to work without changes:

- All documented JSX props (`fromNow`, `format`, `unix`, `tz`, `fromNowShort`, etc.)
- Global configuration object (`Moment.globals.format = '...'`, etc.)
- Pooled timer bootstrap (`Moment.startPooledTimer()` in your app entry file)
- UMD / CommonJS / AMD consumption via `require('react-moment')` or `import Moment from 'react-moment'`
- SSR via the published `dist/index.js` bundle
- Default render output (still a `<time>` element unless overridden with `element` or `Moment.globals.element`)

---

## Upgrade checklist

1. Upgrade `react-moment` to the new version.
2. Remove `prop-types` if it is only present for this package's peer dependency.
3. Search your codebase for `instanceof Moment`, refs to `Moment` instance methods, or direct use of `Moment.pooledElements` / `Moment.pushPooledElement`.
4. If you use TypeScript, fix type errors from the updated `MomentProps` and function-component typing.
5. Run your test suite; replace any tests that call `componentWillUnmount()` on a rendered `Moment` instance with a normal React unmount (`ReactDOM.unmountComponentAtNode(container)` or `@testing-library/react`'s `unmount()`).
