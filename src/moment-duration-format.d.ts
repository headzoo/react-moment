declare module 'moment-duration-format' {
  import type moment from 'moment';

  const setup: (momentRef: typeof moment) => void;
  export default setup;
}
