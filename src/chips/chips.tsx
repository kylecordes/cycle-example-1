import xs, { Stream } from 'xstream';
import { VNode } from '@cycle/dom';
import isolate from '@cycle/isolate';

import { Chip } from './chip';

export function Chips(sources: {}) {

  // Create a couple of props objects for our component instances
  const red$ = xs.of({ label: 'red', r: 240, g: 20, b: 20 });
  const gray$ = xs.of({ label: 'gray', r: 150, g: 150, b: 150 });

  // We only care about the VDOM output of each component, so we don't even need
  // to retain any of the other output. Although this particular component
  // doesn't do anything that would require it be isolated, it is nonetheless
  // good practice to always isolate child components.
  const chips: Stream<VNode>[] = [
    isolate(Chip)({ ...sources, props: red$ }).DOM,
    isolate(Chip)({ ...sources, props: gray$ }).DOM,
    isolate(Chip)(sources).DOM
  ];

  return {
    DOM: view(chips)
  };
}

function view(doms: Stream<VNode>[]) {
  return xs.combine(...doms)
    .map(chips =>
      <div className='pure-g' >
        <div className='pure-u-2-3' >
          {chips[0]}
          {chips[1]}
          {chips[2]}
        </div>
        <div className='pure-u-1-3' >
          <p>This screen demonstrates several instances of the same component.
            This component accepts "props" as a React component would.
            Different props are passed to each component instance.
          </p>
        </div>
      </div>
    );
}
