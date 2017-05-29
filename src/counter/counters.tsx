import xs, { Stream } from 'xstream';
import { VNode } from '@cycle/dom';
import isolate from '@cycle/isolate';

import { Counter } from './counter';

export function Counters(sources: {}) {
  const counter1 = isolate(Counter)(sources);
  const counter2 = isolate(Counter)(sources);

  return {
    DOM: view(counter1.DOM, counter2.DOM),
    onion: xs.merge(counter1.onion, counter2.onion)
  };
}

function view(counter1DOM: Stream<VNode>, counter2DOM: Stream<VNode>) {
  return xs.combine(counter1DOM, counter2DOM)
    .map(([c1, c2]) =>
      <div className='pure-g'>
        <div className='pure-u-1-3'>
          <h2>Counter 1:</h2>
          {c1}
        </div>
        <div className='pure-u-1-3'>
          <h2>Counter 2:</h2>
          {c2}
        </div>
        <div className='pure-u-1-3'>
          <p>This screen demonstrates two components (of the same kind) use side
          by side. Each has its own isolated state. Look in the source code to
          see the minimal amount of "glue" required to use components and then
          display them jointly in apparent component.</p>
        </div>
      </div>
    );
}
