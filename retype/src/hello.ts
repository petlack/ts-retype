import { capture, interact } from '@ts-retype/clikit';
import { ProgressBar, Header } from '@ts-retype/clikit/components';
import { Interactive } from '@ts-retype/clikit/app';
import type { IObservable } from '@ts-retype/clikit/src/app/Interactive.js';

type Todo = { id: number; text: string };

async function run() {
  let output = '';
  output = await capture(ProgressBar, { duration: 10, progress: 0.4, speed: 13, width: 30 });
  console.log(output);

  output = await capture(Header, { label: 'abcdefghijklmnopqrstuvwxyz0123456789' });
  console.log(output);

  let todos: Todo[] = [];
  let listeners: (() => void)[] = [];

  const todosStore: IObservable<Todo[]> = {
    subscribe(listener: () => void) {
      listeners = [...listeners, listener];
      return () => {
        listeners = listeners.filter((l) => l !== listener);
      };
    },
    getSnapshot() {
      return todos;
    },
  };

  function emitChange() {
    for (const listener of listeners) {
      listener();
    }
  }

  const app = interact(Interactive, { observable: todosStore });

  app.start();

  for (const i of [...Array(10).keys()]) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    todos = [...todos, { id: i, text: 'Todo #' + i }];
    emitChange();
  }
}

run();
