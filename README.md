react-moment
============
React component for the [moment](http://momentjs.com/) date library.

[![NPM Downloads](https://img.shields.io/npm/dm/react-moment.svg?style=flat-square)](https://www.npmjs.com/package/react-moment)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://raw.githubusercontent.com/headzoo/react-moment/master/LICENSE)

- [Installing](#installing)
    - [CDN](#cdn)
- [2.0.x](#20x)
- [Timezone Support](#timezone-support)
- [Quick Start](#quick-start)
- [Hooks](#hooks)
    - [useMomentContent](#usemomentcontent)
    - [useMomentContext](#usemomentcontext)
- [Props](#props)
    - [MomentProvider](#momentprovider)
    - [Pooled Timer](#pooled-timer)
    - [Interval](#interval)
    - [Output mode precedence](#output-mode-precedence)
    - [Formatting](#formatting)
    - [Parsing Dates](#parsing-dates)
    - [Add and Subtract](#add-and-subtract)
    - [From Now](#from-now)
    - [From Now Short](#from-now-short)
    - [From Now During](#from-now-during)
    - [From](#from)
    - [To Now](#to-now)
    - [To](#to)
    - [Filters](#filters)
    - [Custom Renderers](#custom-renderers)
    - [With Title](#with-title)
    - [Title Format](#title-format)
    - [Difference](#difference)
    - [Duration](#duration)
    - [Duration From Now](#duration-from-now)
    - [Unix Timestamps](#unix-timestamps)
    - [Local](#local)
    - [Timezone](#timezone)
    - [Calendar](#calendar)
    - [Locale](#locale)
    - [Element](#element)
    - [OnChange](#onchange)
    - [Other Props](#other-props)
- [Usage with React Native](#usage-with-react-native)
- [License](#license)
- [Contributors](#contributors)


### Installing
Requires [React](https://react.dev/) 18 or later, plus the peer dependency `moment`. Install with npm:

```sh
npm install --save moment react-moment
```

#### CDN
A pre-built UMD bundle is published alongside the npm package and can be loaded directly from [unpkg](https://unpkg.com/) (or any other npm CDN). Load `react`, `react-dom`, and `moment` first, then `react-moment`. The component is exposed on the global `window['react-moment']`.

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>react-moment via CDN</title>
</head>
<body>
    <div id="root"></div>

    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/moment@2/min/moment.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-moment@2.0.1/dist/index.umd.js"></script>

    <script>
        const Moment = window['react-moment'].default;
        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(
            React.createElement(Moment, null, '1976-04-19T12:59-0500')
        );
    </script>
</body>
</html>
```

Outputs:

```html
<time>Mon Apr 19 1976 12:59:00 GMT-0500</time>
```

### 2.0.x

The new 2.0.x is still in beta. It migrates the library to TypeScript and replaces the class-based `Moment` component with a functional component. It is not recommended to use this version in production.

Changes in 2.0.x:

- `prop-types` is no longer a peer dependency (runtime prop validation was removed; types are provided via TypeScript declarations)
- `Moment` is a function component — code that relied on class-component internals (for example `instanceof Moment`, instance methods on refs, or `TestUtils.findRenderedComponentWithType`) must be updated

See [MIGRATION.md](https://github.com/headzoo/react-moment/blob/master/MIGRATION.md) for the full upgrade guide and breaking-change details.


### Duration Formatting
The `moment-duration-format` package is required for the `duration` and `durationFromNow` props.

```sh
npm install --save moment-duration-format
```

It is an optional peer dependency — install it only when you use duration formatting.


### Timezone Support
The `moment-timezone` package is required to use the timezone related functions.

```sh
npm install --save moment-timezone
```

Then import the package into your project.

```jsx
import React from 'react';
import Moment from 'react-moment';
import 'moment-timezone';

export default function App() {
    ...
}
```


### Quick Start

```jsx
import React from 'react';
import Moment from 'react-moment';

export default function MyComponent() {
    const dateToFormat = '1976-04-19T12:59-0500';
    return (
        <Moment>{dateToFormat}</Moment>
    );
}
```

Outputs:

```html
<time>Mon Apr 19 1976 12:59:00 GMT-0500</time>
```

The above example could also be written this way if you prefer to pass the date using an attribute rather than as a child to `<Moment>`.

```jsx
import React from 'react';
import Moment from 'react-moment';

export default function MyComponent() {
    const dateToFormat = '1976-04-19T12:59-0500';
    return (
        <Moment date={dateToFormat} />
    );
}
```

The date value may be a string, object, array, or `Date` instance.

```jsx
import React from 'react';
import Moment from 'react-moment';

export default function MyComponent() {
    const dateToFormat = new Date('1976-04-19T12:59-0500');
    return (
        <Moment date={dateToFormat} />
    );
}
```


### Hooks

Use hooks when you need formatted output without rendering a `<time>` element, or when building custom UI around the same logic as `<Moment>`.

#### useMomentContent

`useMomentContent` accepts the same props as `<Moment>` except [`element`](#element). It uses the same formatting pipeline as the component, including [`<MomentProvider>`](#momentprovider) defaults, `add` / `subtract`, timezone, and locale handling.

**Return value**

| Property | Type | Description |
| --- | --- | --- |
| `content` | `string \| number` | Formatted output (same value `<Moment>` would render as text). |
| `datetime` | `moment.Moment` | The **adjusted** moment used to produce `content`, not the raw input. Includes `add`, `subtract`, `utc`, `local`, `tz`, and provider defaults. |
| `title` | `string` (optional) | Present when `withTitle` is set; uses the same format resolution as the `title` attribute ([`titleFormat`](#title-format) → [`format`](#formatting) → provider [`format`](#formatting) → ISO default). |

**Updates and callbacks**

- Pass [`interval`](#interval) to re-render when relative times change (default `60000` ms). Use `interval={0}` to disable periodic updates.
- Pass [`onChange`](#onchange) to receive the current `content` on mount and after each update — same semantics as `<Moment>`.
- Hooks inside a [`<MomentProvider pool>`](#pooled-timer) subtree register with the shared timer the same way `<Moment>` does.

TypeScript types `UseMomentContentProps` and `UseMomentContentResult` are exported from the package entry point.

```jsx
import React from 'react';
import { useMomentContent } from 'react-moment';

export default function RelativeLabel({ date }) {
    const { content, datetime } = useMomentContent({
        fromNow: true,
        children: date,
        interval: 60000
    });

    return (
        <span title={datetime.format()}>{content}</span>
    );
}
```

With `withTitle`, the hook returns a pre-formatted `title` string:

```jsx
const { content, title } = useMomentContent({
    format: 'D MMM YYYY',
    withTitle: true,
    titleFormat: 'YYYY-MM-DD',
    children: date
});
// content → "19 Apr 1976", title → "1976-04-19"
```

#### useMomentContext

`useMomentContext()` returns the nearest [`MomentContext`](#momentprovider) value:

| Property | Type | Description |
| --- | --- | --- |
| `settings` | `MomentSettings` | Merged defaults from the nearest `<MomentProvider>` chain (or built-in defaults when no provider is mounted). Same keys as [MomentProvider props](#momentprovider). |
| `pool` | `PoolController \| null` | Present when the nearest provider has `pool` enabled; used internally by `<Moment>` and `useMomentContent` to share a single timer. |

Use this hook when custom components need the same locale, format, timezone, or other defaults as sibling `<Moment>` instances without duplicating props.

TypeScript type `MomentContextValue` is exported from the package entry point.

```jsx
import React from 'react';
import { useMomentContext, useMomentContent } from 'react-moment';

export default function FormattedDate({ date }) {
    const { settings } = useMomentContext();
    const { content } = useMomentContent({
        children: date,
        format: settings.format ?? 'LL'
    });

    return <span>{content}</span>;
}
```


### Props
The `<Moment>` component supports the following props. Defaults for many of these can be set once on a wrapping [`<MomentProvider>`](#momentprovider) instead of repeating them on every instance. See the [Moment docs](https://momentjs.com/docs/) for more information.


#### MomentProvider
Wrap `<Moment>` instances in `<MomentProvider>` to share defaults across a subtree. Providers compose: nested providers inherit and override parent defaults.

* moment
* locale
* format
* parse
* filters
* renderers
* element
* timezone
* local
* pool (enables pooled timing for descendants; see [Pooled Timer](#pooled-timer))
* interval (pooled timer interval in milliseconds)

```jsx
import React from 'react';
import moment from 'moment/min/moment-with-locales';
import Moment, { MomentProvider } from 'react-moment';

export default function App() {
    return (
        <MomentProvider
            moment={moment}
            locale="fr"
            format="D MMM YYYY"
            timezone="America/Los_Angeles"
            local
            element="span"
            filters={[
                (content) => (typeof content === 'string' ? content.trim() : content),
                (content) => (typeof content === 'string' ? content.toUpperCase() : content)
            ]}
            renderers={[({ datetime }) => `Y${datetime.year()}`]}
        >
            <Moment>1976-04-19T12:59-0500</Moment>
        </MomentProvider>
    );
}
```

You can override provider values on a per-instance basis using regular `<Moment>` props.

```jsx
import React from 'react';
import Moment, { MomentProvider } from 'react-moment';

export default function App() {
    return (
        <MomentProvider locale="fr">
            <div>
                {/*
                    Renders using the 'fr' locale from the provider.
                */}
                <Moment>1976-04-19T12:59-0500</Moment>

                {/*
                    Overrides the provider locale and uses 'en' instead.
                */}
                <Moment locale="en">1976-04-19T12:59-0500</Moment>
            </div>
        </MomentProvider>
    );
}
```


#### Pooled Timer
By default a timer is created for each mounted `<Moment />` instance to update the date value, which is fine when you only have a few instances on the page. However, performance can take a hit when you have many mounted instances. The problem is solved by using a pooled timer.

When pooled timing is enabled, react-moment will only use a single timer to update all `<Moment />` instances within that provider. Wrap the instances in `<MomentProvider pool>` to enable pooling for that subtree only. Different providers maintain independent pools.

```jsx
import React from 'react';
import Moment, { MomentProvider } from 'react-moment';

export default function App() {
    return (
        <MomentProvider pool>
            <Moment fromNow>1976-04-19T12:59-0500</Moment>
            <Moment fromNow>2020-01-01T12:00:00</Moment>
        </MomentProvider>
    );
}
```

Or set the update interval. This will update the mounted instances every 30 seconds.

```jsx
<MomentProvider pool interval={30000}>
    ...
</MomentProvider>
```

Note: When using pooled timing, the provider `interval` controls how often the pool checks for updates. Descendants without an `interval` prop update on every provider tick. Per-instance `interval` values are honored so mixed update cadences can share one timer. Use `interval={0}` on a `<Moment />` instance to disable updating for that instance only.


#### Interval
_interval={number}_

By default the time updates every 60 seconds (60000 milliseconds). Use the `interval` prop to change or disable updating.

Updates the time every 30 seconds (30000 milliseconds).
```jsx
import React from 'react';
import Moment from 'react-moment';

export default function MyComponent() {
    return (
        <Moment interval={30000}>
            1976-04-19T12:59-0500
        </Moment>
    );
}
```

Disables updating.
```jsx
import React from 'react';
import Moment from 'react-moment';

export default function MyComponent() {
    return (
        <Moment interval={0}>
            1976-04-19T12:59-0500
        </Moment>
    );
}
```


#### Output mode precedence

Built-in output props (`format`, `from`, `fromNow`, `calendar`, and so on) are resolved by an ordered chain of renderers: the first renderer that applies wins. Custom `renderers` run before this chain (see [Custom Renderers](#custom-renderers)).

When multiple built-in modes are set at once, only the highest-priority one takes effect. For example, if both `format` and `fromNow` are set, the formatted output is shown and `fromNow` is ignored. The exception is [`fromNowDuring`](#from-now-during): while the date falls within that window (in milliseconds), relative output is shown as with `fromNow`; after that window, `format` is used instead.

Built-in order (highest to lowest priority):

1. `format`
2. `from`
3. `fromNowShort`
4. `fromNow`
5. `to`
6. `toNow`
7. `calendar`
8. `diff`
9. `duration`
10. `durationFromNow`
11. default (`datetime.toString()`)


#### Formatting
_format={string}_

Formats the date according to the given format string. See the [Moment docs on formatting](https://momentjs.com/docs/#/parsing/string-format/) for more information.

```jsx
import React from 'react';
import Moment from 'react-moment';

export default function MyComponent() {
    return (
        <Moment format="YYYY/MM/DD">
            1976-04-19T12:59-0500
        </Moment>
    );
}
```

Outputs:

```html
<time>1976/04/19</time>
```

For Duration and DurationFromNow formatting, the formatting is done using a separate library. See the [Moment-Duration-Format docs on formatting](https://github.com/jsmreese/moment-duration-format#template) for more information.

```jsx
import React from 'react';
import Moment from 'react-moment';
import moment from 'moment';

export default function MyComponent() {
    const start = moment().add(-4, 'm');
    return (
        <Moment date={start} format="hh:mm:ss" durationFromNow />
    );
}
```

Outputs:

```html
<time>00:04:00</time>
```

#### Trim
_trim={string|bool}_

When formatting duration time, the largest-magnitude tokens are automatically trimmed when they have no value. See the [Moment-Duration-Format docs on trim](https://github.com/jsmreese/moment-duration-format#trim) for more information.

```jsx
import React from 'react';
import Moment from 'react-moment';
import moment from 'moment';

export default function MyComponent() {
    const start = moment().add(-4, 'm');
    return (
        <Moment date={start} format="hh:mm:ss" trim durationFromNow />
    );
}
```

Outputs:

```html
<time>04:00</time>
```

#### Parsing Dates
_parse={string}_

Moment can parse most standard date formats. Use the `parse` attribute to tell moment how to parse the given date when non-standard. See the [Moment docs on parsing](https://momentjs.com/docs/#/parsing/string-format/) for more information.

```jsx
import React from 'react';
import Moment from 'react-moment';

export default function MyComponent() {
    return (
        <Moment parse="YYYY-MM-DD HH:mm">
            1976-04-19 12:59
        </Moment>
    );
}
```

#### Add and Subtract
_add={object}_

_subtract={object}_

Used to add and subtract periods of time from the given date, with the time periods expressed as object literals. See the [Moment docs on add and subtract](https://momentjs.com/docs/#/manipulating/add/) for more information.

```jsx
import React from 'react';
import Moment from 'react-moment';

export default function MyComponent() {
    const date = new Date();

    return (
        <div>
            <Moment add={{ hours: 12 }}>{date}</Moment>
            <Moment add={{ days: 1, hours: 12 }}>{date}</Moment>
            <Moment subtract={{ hours: 12 }}>{date}</Moment>
            <Moment subtract={{ days: 1, hours: 12 }}>{date}</Moment>
        </div>
    );
}
```

#### From Now
_fromNow={bool}_

Sometimes called timeago or relative time, displays the date as the time _from now_, e.g. "5 minutes ago".

```jsx
import React from 'react';
import Moment from 'react-moment';

export default function MyComponent() {
    return (
        <Moment fromNow>1976-04-19T12:59-0500</Moment>
    );
}
```

Outputs:

```html
<time>40 years ago</time>
```

Including `ago` with `fromNow` will omit the suffix from the relative time.

```jsx
import React from 'react';
import Moment from 'react-moment';

export default function MyComponent() {
    return (
        <Moment fromNow ago>1976-04-19T12:59-0500</Moment>
    );
}
```

Outputs:

```html
<time>40 years</time>
```

#### From Now Short
_fromNowShort={bool}_

Displays the relative time in a short format using abbreviated units (e.g., "1h", "2d", "3mo", "1y" instead of "1 hour ago", "2 days ago", etc.).

```jsx
import React from 'react';
import Moment from 'react-moment';

export default function MyComponent() {
    const date = new Date();
    return (
        <div>
            <Moment fromNowShort>{date}</Moment>
            {/* Output examples: "1h", "2d", "3mo", "1y" */}
        </div>
    );
}
```

Examples of short format output:
- "1s" - 1 second ago
- "30s" - 30 seconds ago
- "1m" - 1 minute ago
- "45m" - 45 minutes ago
- "1h" - 1 hour ago
- "5h" - 5 hours ago
- "1d" - 1 day ago
- "7d" - 7 days ago
- "1mo" - 1 month ago
- "3mo" - 3 months ago
- "1y" - 1 year ago
- "2y" - 2 years ago

Short format never includes an "ago" or "in" suffix, so the [`ago`](#from-now) prop does not apply to `fromNowShort`.

#### From Now During

_fromNowDuring={number}_

Setting _fromNowDuring_ will display the relative time as with _fromNow_ but just during its value in milliseconds, after that _format_ will be used instead.

#### From
_from={string}_

```jsx
import React from 'react';
import Moment from 'react-moment';

export default function MyComponent() {
    return (
        <Moment from="2015-04-19">1976-04-19T12:59-0500</Moment>
    );
}
```

Outputs:

```html
<time>39 years</time>
```


#### To Now
_toNow={bool}_

Similar to `fromNow`, but gives the opposite interval.

```jsx
import React from 'react';
import Moment from 'react-moment';

export default function MyComponent() {
    return (
        <Moment toNow>1976-04-19T12:59-0500</Moment>
    );
}
```

Outputs:

```html
<time>40 years ago</time>
```


#### To
_to={string}_

```jsx
import React from 'react';
import Moment from 'react-moment';

export default function MyComponent() {
    return (
        <Moment to="2015-04-19">1976-04-19T12:59-0500</Moment>
    );
}
```

Outputs:

```html
<time>39 years</time>
```

#### Filters
_filters={Filter[]}_

An array of filter functions applied **in order** to the rendered content before display. Each filter receives and returns `MomentContent` (`string | number` — formatted text or numeric diff/duration values). The `Filter` type is `(content: MomentContent) => MomentContent`.

When both a `<MomentProvider>` and a `<Moment>` set `filters`, the arrays are concatenated: provider filters run first, then per-instance filters.

If a filter throws, react-moment logs the error with `console.error`, skips that filter, and continues with the remaining filters using the last successful result.

```jsx
import React from 'react';
import Moment, { MomentProvider } from 'react-moment';

const trimFilter = (content) => (
    typeof content === 'string' ? content.trim() : content
);

const upperCaseFilter = (content) => (
    typeof content === 'string' ? content.toUpperCase() : content
);

export default function MyComponent() {
    return (
        <MomentProvider filters={[trimFilter]}>
            {/*
                trimFilter runs first (provider), then upperCaseFilter (instance).
            */}
            <Moment filters={[upperCaseFilter]}>
                1976-04-19T12:59-0500
            </Moment>
        </MomentProvider>
    );
}
```

On a single `<Moment>` without a provider, pass all filters on the instance:

```jsx
import React from 'react';
import Moment from 'react-moment';

const trimFilter = (content) => (
    typeof content === 'string' ? content.trim() : content
);

const upperCaseFilter = (content) => (
    typeof content === 'string' ? content.toUpperCase() : content
);

export default function MyComponent() {
    return (
        <Moment filters={[trimFilter, upperCaseFilter]}>
            1976-04-19T12:59-0500
        </Moment>
    );
}
```

Filters can also be registered on a `<MomentProvider>` (see [MomentProvider](#momentprovider)).


#### Custom Renderers
_renderers={ContentRenderer[]}_

An array of custom content renderer functions invoked **before** the built-in renderers. The first renderer (custom or built-in) to return a non-`undefined` value wins. Return `undefined` from a custom renderer to fall through to the next renderer in the chain.

When both a `<MomentProvider>` and a `<Moment>` set `renderers`, the arrays are concatenated: provider renderers are tried first, then per-instance renderers, then the built-in renderers.

If a renderer throws, react-moment logs the error with `console.error` and tries the next renderer in the chain (same as returning `undefined`).

Each renderer receives a `ContentContext` object:

```ts
type MomentContent = string | number;

interface ContentContext {
  props: MomentProps;
  datetime: moment.Moment;
  format: string | undefined;
  fromNowPeriod: boolean;
  settings: MomentSettings;
}

type ContentRenderer = (ctx: ContentContext) => MomentContent | undefined;
```

Because custom renderers run first, they can override any built-in output mode (including `format`, `fromNow`, `calendar`, etc.).

```jsx
import React from 'react';
import Moment from 'react-moment';

const fiscalYearRenderer = ({ props, datetime }) => {
  if (props.fiscalYear) {
    const year = datetime.month() >= 3 ? datetime.year() + 1 : datetime.year();
    return `FY${year}`;
  }
  return undefined;
};

export default function MyComponent() {
  return (
    <Moment fiscalYear renderers={[fiscalYearRenderer]}>
      1976-04-19T12:59-0500
    </Moment>
  );
}
```

Outputs:

```html
<time>FY1976</time>
```

Custom renderers can also be registered on a `<MomentProvider>` (see [MomentProvider](#momentprovider)).


#### With Title
_withTitle={bool}_

Adds a `title` attribute to the element. Title format resolution: [`titleFormat`](#title-format) → [`format`](#formatting) (instance or [`<MomentProvider>`](#momentprovider) default) → moment's default ISO-style output (`datetime.format('')`, e.g. `1976-04-19T12:59:00-05:00`).

When `titleFormat` is set, it formats only the title; visible text still follows `format` and the usual output props.

```jsx
import React from 'react';
import Moment from 'react-moment';

export default function MyComponent() {
    return (
        <Moment withTitle>
            1976-04-19T12:59-0500
        </Moment>
    );
}
```

Outputs:

```html
<time title="1976-04-19T12:59:00-05:00">Mon Apr 19 1976 12:59:00 GMT-0500</time>
```

When `format` is set and `titleFormat` is omitted, the title uses the same format string as the visible text:

```jsx
<Moment format="D MMM YYYY" withTitle>
    1976-04-19T12:59-0500
</Moment>
```

Outputs:

```html
<time title="19 Apr 1976">19 Apr 1976</time>
```


#### Title Format
_titleFormat={string}_

Formats the `title` attribute when using `withTitle`. Does not affect the visible text unless `format` is also set (or inherited from a provider).

```jsx
import React from 'react';
import Moment from 'react-moment';

export default function MyComponent() {
    return (
        <Moment titleFormat="D MMM YYYY" withTitle>
            1976-04-19T12:59-0500
        </Moment>
    );
}
```

Outputs:

```html
<time title="19 Apr 1976">Mon Apr 19 1976 12:59:00 GMT-0500</time>
```


#### Difference
_diff={string}_

_decimal={bool}_

_unit={string}_

```jsx
import React from 'react';
import Moment from 'react-moment';

export default function MyComponent() {
    return (
        <div>
          <Moment diff="2015-04-19">1976-04-19T12:59-0500</Moment>
          <Moment diff="2015-04-19" unit="days">1976-04-19T12:59-0500</Moment>
          <Moment diff="2015-04-19" unit="years" decimal>1976-04-19T12:59-0500</Moment>
        </div>
    );
}
```

#### Duration
_duration={string}_

_date={string}_

Shows the duration (elapsed time) between two dates. `duration` property should be behind `date` property time-wise.

```jsx
import React from 'react';
import Moment from 'react-moment';

export default function MyComponent() {
    return (
        <Moment duration="2018-11-1T10:59-0500"
                date="2018-11-1T12:59-0500"
        />
    );
}
```

#### Duration From Now

_durationFromNow={bool}_

Shows the duration (elapsed time) between now and the provided datetime.

```jsx
import React from 'react';
import Moment from 'react-moment';

export default function MyComponent() {
    return (
        <Moment date="2018-11-1T12:59-0500"
                durationFromNow
        />
    );
}
```

#### Unix Timestamps
_unix={bool}_

Tells Moment to parse the given date value as a unix timestamp.

```jsx
import React from 'react';
import Moment from 'react-moment';

export default function MyComponent() {
    const unixTimestamp = 198784740;
    return (
        <Moment unix>{unixTimestamp}</Moment>
    );
}
```

Outputs:

```html
<time>Mon Apr 19 1976 12:59:00 GMT-0500</time>
```

#### Local
_local={bool}_

Outputs the result in local time.

```jsx
import React from 'react';
import Moment from 'react-moment';

export default function MyComponent() {
    return (
        <Moment local>
            2018-11-01T12:59-0500
        </Moment>
    );
}
```

Outputs:

```html
<time>Thu Nov 01 2018 18:59:00 GMT+0100</time>
```


#### Timezone
_tz={string}_

Sets the timezone. To enable server side rendering (SSR), client and server has to provide same datetime, based on common Timezone. The `tz` attribute will enable set the common timezone.

```jsx
import React from 'react';
import Moment from 'react-moment';
import 'moment-timezone';

export default function MyComponent() {
    const unixTimestamp = 198784740;
    return (
        <Moment unix tz="America/Los_Angeles">
            {unixTimestamp}
        </Moment>
    );
}
```

Outputs:

```html
<time>Mon Apr 19 1976 09:59:00 GMT-0800</time>
```

#### Calendar
_calendar={object|bool}_

Customize the strings used for the calendar function.

```jsx
import React from 'react';
import Moment from 'react-moment';

export default function MyComponent() {
    const calendarStrings = {
        lastDay : '[Yesterday at] LT',
        sameDay : '[Today at] LT',
        nextDay : '[Tomorrow at] LT',
        lastWeek : '[last] dddd [at] LT',
        nextWeek : 'dddd [at] LT',
        sameElse : 'L'
    };

    return (
        <Moment calendar={calendarStrings}>
            1976-04-19T12:59-0500
        </Moment>
    );
}
```


#### Locale
_locale={string}_

Sets the locale used to display the date.

```jsx
import React from 'react';
import Moment from 'react-moment';

export default function MyComponent() {
    const dateToFormat = '1976-04-19T12:59-0500';
    return (
        <Moment locale="de">{dateToFormat}</Moment>
    );
}
```

**Note**
In some cases the language file is not automatically loaded by moment, and it must be manually loaded. For example, to use the French locale, add the following to your bootstrap (e.g. index.js) script.

```js
import 'moment/locale/fr';
```

#### Element
_element={string|React.Component}_

The element type to render as (string or function).

```jsx
import React from 'react';
import Moment from 'react-moment';

export default function MyComponent() {
    return (
        <Moment element="span">1976-04-19T12:59-0500</Moment>
    );
}
```

Outputs:

```html
<span>Mon Apr 19 1976 12:59:00 GMT-0500</span>
```


#### OnChange
_onChange={func}_

The `onChange` prop is called with the current displayed content when the component mounts, and again after each automatic update. By default, updates run every 60 seconds (`interval`, default `60000`). Set `interval={0}` to disable periodic updates while still receiving the initial callback on mount.

The callback receives the rendered content string (or number for modes such as `diff`), not a `Date` or moment instance.

```jsx
import React from 'react';
import Moment from 'react-moment';

export default function MyComponent() {
    return (
        <Moment onChange={(val) => { console.log(val); }}>
            1976-04-19T12:59-0500
        </Moment>
    );
}
```


#### Other Props
Any other properties are passed to the `<time>` element.

```jsx
import React from 'react';
import Moment from 'react-moment';

export default function MyComponent() {
    return (
        <Moment className="datetime" aria-hidden={true}>
            1976-04-19T12:59-0500
        </Moment>
    );
}
```

Outputs:

```html
<time class="datetime" aria-hidden="true">Mon Apr 19 1976 12:59:00 GMT-0500</time>
```


### Usage with React Native
If you are using React Native then you'll have to pass in `Text`.

```javascript
import Moment from 'react-moment';
import { Text } from 'react-native';
```

Then:

```html
<Moment element={Text} >1976-04-19T12:59-0500</Moment>
```


### License
This software is released under the MIT license. See LICENSE for more details.


### Contributors

* [markacola](https://github.com/markacola)
* [nclavaud](https://github.com/nclavaud)
* [Idan Gozlan](https://github.com/idangozlan)
* [Oliver Vartiainen](https://github.com/firoxer)
* [a-x-](https://github.com/a-x-)
* [khell](https://github.com/khell)
* [ali-master](https://github.com/ali-master)
* [tujoworker](https://github.com/tujoworker)
* [GaelGRIFFON](https://github.com/GaelGRIFFON)
* [jamesjryan](https://github.com/jamesjryan)
* [brasskazoo](https://github.com/brasskazoo)
* [henvo](https://github.com/henvo)
* [tadeo](https://github.com/tadeo)
* [centrual](https://github.com/centrual)
* [beniaminrychter](https://github.com/beniaminrychter)
* [joefatora](https://github.com/joefatora)
* [etairi](https://github.com/etairi)
* [tulak](https://github.com/tulak)
* [pesimeao](https://github.com/pesimeao)
* [DoctorHowser](https://github.com/DoctorHowser)
* [trevorr](https://github.com/trevorr)
* [arome](https://github.com/arome)
