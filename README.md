react-moment
============
React component for the [moment](http://momentjs.com/) date library.

[![Build Status](https://travis-ci.org/headzoo/react-moment.svg?branch=master)](https://travis-ci.org/headzoo/react-moment)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://raw.githubusercontent.com/headzoo/react-moment/master/LICENSE)

* [Installing](#installing)
* [Quick Start](#quick-start)
* [Formatting](#formatting)
* [Parsing Dates](#parsing-dates)
* [From Now](#from-now)
* [From](#from)
* [To Now](#to-now)
* [To](#to)
* [Unix Timestamps](#unix-timestamps)
* [Timezone](#timezone)
* [Locale](#locale)
* [as](#as)
* [Other Props](#other-props)
* [License](#license)
* [Contributors](#contributors)


### Installing
Use npm to install react-moment, along with its peer dependencies, `moment`
and `moment-timezone`.

```sh
npm install --save moment moment-timezone react-moment
```


### Quick Start

```js
import React  from 'react';
import Moment from 'react-moment';

exports default class MyComponent extends React.Component {
    render() {
        let dateToFormat = '1976-04-19T12:59-0500';
        <Moment>{dateToFormat}</Moment>
    }
}
```

Outputs:

```html
<time>Mon Apr 19 1976 12:59:00 GMT-0500</time>
```

The above example could also be written this way if you prefer to pass
the date using an attribute rather than as a child to `<Moment>`.

```js
import React  from 'react';
import Moment from 'react-moment';

exports default class MyComponent extends React.Component {
    render() {
        let dateToFormat = '1976-04-19T12:59-0500';
        <Moment date={dateToFormat} />
    }
}
```

The date value may be a string, object, array, or `Date` instance.

```js
import React  from 'react';
import Moment from 'react-moment';

exports default class MyComponent extends React.Component {
    render() {
        let dateToFormat = new Date('1976-04-19T12:59-0500');
        <Moment date={dateToFormat} />
    }
}
```


### Formatting

```js
import React  from 'react';
import Moment from 'react-moment';

exports default class MyComponent extends React.Component {
    render() {
        <Moment format="YYYY/MM/DD">1976-04-19T12:59-0500</Moment>
    }
}
```

Outputs:

```html
<time>1976/04/19</time>
```


### Parsing Dates

Moment can parse most standard date formats. Use the `parse` attribute
to tell moment how to parse the given date when non-standard.

```js
import React  from 'react';
import Moment from 'react-moment';

exports default class MyComponent extends React.Component {
    render() {
        <Moment parse="YYYY-MM-DD HH:mm">1976-04-19 12:59</Moment>
    }
}
```


### From Now

```js
import React  from 'react';
import Moment from 'react-moment';

exports default class MyComponent extends React.Component {
    render() {
        <Moment fromNow>1976-04-19T12:59-0500</Moment>
    }
}
```

Outputs:

```html
<time>40 years</time>
```

```js
import React  from 'react';
import Moment from 'react-moment';

exports default class MyComponent extends React.Component {
    render() {
        <Moment fromNow ago>1976-04-19T12:59-0500</Moment>
    }
}
```

Outputs:

```html
<time>40 years</time>
```


### From

```js
import React  from 'react';
import Moment from 'react-moment';

exports default class MyComponent extends React.Component {
    render() {
        <Moment from="2015-04-19">1976-04-19T12:59-0500</Moment>
    }
}
```

Outputs:

```html
<time>39 years</time>
```

```js
import React  from 'react';
import Moment from 'react-moment';

exports default class MyComponent extends React.Component {
    render() {
        <Moment from="2015-04-19" ago>1976-04-19T12:59-0500</Moment>
    }
}
```

Outputs:

```html
<time>39 years</time>
```


### To Now

```js
import React  from 'react';
import Moment from 'react-moment';

exports default class MyComponent extends React.Component {
    render() {
        <Moment toNow>1976-04-19T12:59-0500</Moment>
    }
}
```

Outputs:

```html
<time>40 years</time>
```

```js
import React  from 'react';
import Moment from 'react-moment';

exports default class MyComponent extends React.Component {
    render() {
        <Moment toNow ago>1976-04-19T12:59-0500</Moment>
    }
}
```

Outputs:

```html
<time>in 40 years</time>
```


### To

```js
import React  from 'react';
import Moment from 'react-moment';

exports default class MyComponent extends React.Component {
    render() {
        <Moment to="2015-04-19">1976-04-19T12:59-0500</Moment>
    }
}
```

Outputs:

```html
<time>39 years</time>
```

```js
import React  from 'react';
import Moment from 'react-moment';

exports default class MyComponent extends React.Component {
    render() {
        <Moment to="2015-04-19" ago>1976-04-19T12:59-0500</Moment>
    }
}
```

Outputs:

```html
<time>in 39 years</time>
```


### Unix Timestamps

```js
import React  from 'react';
import Moment from 'react-moment';

exports default class MyComponent extends React.Component {
    render() {
        let unixTimestamp = 198784740;
        <Moment unix>{unixTimestamp}</Moment>
    }
}
```

Outputs:

```html
<time>Mon Apr 19 1976 12:59:00 GMT-0500</time>
```


### Timezone

To enable server side rendering (SSR), client and server has to provide same datetime, based on common Timezone.
`tz` attribute will enable set the common timezone.

```js
import React  from 'react';
import Moment from 'react-moment';

exports default class MyComponent extends React.Component {
    render() {
        let unixTimestamp = 198784740;
        <Moment unix tz="America/Los_Angeles">{unixTimestamp}</Moment>
    }
}
```

Outputs:

```html
<time>Mon Apr 19 1976 09:59:00 GMT-0800</time>
```


### Locale

```js
import React  from 'react';
import Moment from 'react-moment';

exports default class MyComponent extends React.Component {
    render() {
        let dateToFormat = '1976-04-19T12:59-0500';
        <Moment locale="de">{dateToFormat}</Moment>
    }
}
```

### as

An element type to render as (string or function).

```js
import React  from 'react';
import Moment from 'react-moment';

exports default class MyComponent extends React.Component {
    render() {
        <Moment as="span">1976-04-19T12:59-0500</Moment>
    }
}
```

Outputs:

```html
<i>Mon Apr 19 1976 12:59:00 GMT-0500</i>
```


### Other Props

Any other properties are passed to the `<time>` element.

```js
import React  from 'react';
import Moment from 'react-moment';

exports default class MyComponent extends React.Component {
    render() {
        <Moment className="datetime" aria-hidden={true}>1976-04-19T12:59-0500</Moment>
    }
}
```

Outputs:

```html
<time class="datetime" aria-hidden="true">Mon Apr 19 1976 12:59:00 GMT-0500</time>
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
