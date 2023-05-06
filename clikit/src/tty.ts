import * as tty from 'node:tty';

const always =
  <T>(val: T) =>
  () =>
    val;

export const WriteStream = () =>
  ({
    isTTY: true,
    hasColors: always(false),
    on: always(true),
    off: always(true),
    write: always(true),
    cursorTo: always(true),
    moveCursor: always(true),
    clearLine: always(true),
    clearScreenDown: always(true),
    getWindowSize: always([40, 20]),
    addListener: always(true),
    emit: always(true),
    once: always(true),
    prependListener: always(true),
    prependOnceListener: always(true),
    getColorDepth: always(true),
    columns: 40,
    rows: 20,
  } as unknown as tty.WriteStream);
