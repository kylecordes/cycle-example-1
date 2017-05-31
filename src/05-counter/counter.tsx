import xs, { Stream } from 'xstream';
import { DOMSource } from '@cycle/dom';
import { StateSource } from 'cycle-onionify';

export interface State {
  count: number;
};

interface Sources {
  DOM: DOMSource;
  onion: StateSource<State>;
};

type Reducer = (prev: State) => State;

export function Counter(sources: Sources) {
  return {
    DOM: view(sources.onion.state$),
    onion: intent(sources.DOM)
  };
}

function intent(DOM: DOMSource) {
  const defaultReducer$ = xs.of<Reducer>(prev => prev || { count: 0 });

  const add$ = DOM.select('.add').events('click')
    .mapTo<Reducer>(state => ({ ...state, count: state.count + 1 }));

  const subtract$ = DOM.select('.subtract').events('click')
    .mapTo<Reducer>(state => ({ ...state, count: Math.max(state.count - 1, 0) }));

  return xs.merge(defaultReducer$, add$, subtract$);
}

function view(state$: Stream<State>) {
  return state$
    .map(s => s.count)
    .map(count =>
      <div>
        <p>Counter: {count}</p>
        <div>
          <button type='button' className='add'>Increase</button>
          <button type='button' className='subtract'>Decrease</button>
        </div>
      </div>
    );
}
