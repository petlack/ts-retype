async function executeFunction(fn: () => void | Promise<void>): Promise<void> {
  if (fn instanceof Function) {
    const result = fn();
    if (result instanceof Promise) {
      await result;
    }
  }
}

export function run(fn: () => Promise<void> | void) {
  executeFunction(fn)
    .then(() => {
      process.exit(0);
    })
    .catch((err: unknown) => {
      console.log(err);
      process.exit(1);
    });
}
