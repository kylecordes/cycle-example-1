import xs, { Stream } from 'xstream';
import { VNode, DOMSource } from '@cycle/dom';
import { StateSource, makeCollection } from 'cycle-onionify';
import { ul } from '@cycle/dom';

import { Timer, State as TimerState } from './timer';

export type State = Array<TimerState & { key: string }>;

interface Sources {
  DOM: DOMSource;
  onion: StateSource<State>;
};

type Reducer = (prevState: State) => State | undefined;

export function Timers(sources: Sources) {

  const List = makeCollection<TimerState, any, any>({
    item: Timer,
    itemKey: (childState, index) => childState.key,
    itemScope: index => index,
    collectSinks: instances => {
      return {
        onion: instances.pickMerge('onion'),
        DOM: instances.pickCombine('DOM')
          .map((vnodes: VNode[]) => ul(vnodes))
      };
    }
  });

  const init$ = xs.of<Reducer>(prev => []);
  const add$ = sources.DOM.select('.add').events('click')
    .mapTo<Reducer>(prev => [...prev, {
      running: false,
      x: 0,
      key: Date.now().toString()
    }]);

  const listSinks = List(sources);

  return {
    DOM: view(listSinks.DOM),
    onion: xs.merge(init$, listSinks.onion, add$)
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
