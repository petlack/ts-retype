import 'vitest';
import type { Assertion, AsymmetricMatchersContaining } from 'vitest';

interface CustomMatchers<R = unknown> {
  toTreeEqual: () => R
}

declare module vitest {
  interface Assertion<T = unknown> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}

type OwnMatcher<Params extends unknown[]> = (
    this: jest.MatcherContext,
    actual: unknown,
    ...params: Params
) => jest.CustomMatcherResult

declare global {
    namespace jest {
        interface Matchers<R, T> {
            toTreeEqual<Tree>(tree: Tree): T
        }
        interface ExpectExtendMap {
            toTreeEqual: OwnMatcher<[tree: unknown]>
        }
    }
}
