import xs, { Stream } from 'xstream';
import { VNode, DOMSource } from '@cycle/dom';
import { StateSource } from 'cycle-onionify';
import { ul } from '@cycle/dom';

import { Timer, State as TimerState } from './timer';

export type State = Array<TimerState & { key: string }>;

interface Sources {
  DOM: DOMSource;
  onion: StateSource<State>;
};

type Reducer = (prevState: State) => State | undefined;

export function Timers(sources: Sources) {
  const instances = sources.onion.toCollection(Timer)
    .uniqueBy(t => t.key)
    .isolateEach(key => key)
    .build(sources);

  const listDOM$ = instances
    .pickCombine('DOM')
    .map((vnodes: VNode[]) => ul(vnodes));

  const inner$ = instances
    .pickMerge('onion');

  const init$ = xs.of<Reducer>(prev => []);
  const add$ = sources.DOM.select('.add').events('click')
    .mapTo<Reducer>(prev => [...prev, {
      running: false,
      x: 0,
      key: Date.now().toString()
    }]);

  return {
    DOM: view(listDOM$),
    onion: xs.merge(init$, inner$, add$)
  };
}

function view(list$: Stream<VNode>) {
  return list$.map(list =>
    <div>
      <h2>Timer List</h2>
      <p>This screen demonstrates a dynamically managed list of subcomponents.
        Each has its own separate state.</p>
      <button type='button' className='pure-button pure-button-primary add'>Add</button>
      <div>
        {list}
      </div>
    </div>
  );
}
