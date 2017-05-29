import xs, { Stream } from 'xstream';
import { DOMSource } from '@cycle/dom';
import { TimeSource } from '@cycle/time';
import { StateSource } from 'cycle-onionify';
import sampleCombine from 'xstream/extra/sampleCombine';
import { div, span, button } from '@cycle/dom';

export interface State {
  running: boolean;
  x: number;
  key: number;
};

interface Sources {
  DOM: DOMSource;
  onion: StateSource<State>;
  time: TimeSource;
};

type Reducer = (prev: State) => State;

export function Timer(sources: Sources) {
  // Initialze if used alone - use parent provided state is present
  const defaultReducer$ = xs.of<Reducer>(prev => prev || { running: false });

  const i$ = sources.time.periodic(100)
    .map(x => x + 1)
    .startWith(0)
    .remember();

  const start$ = sources.DOM.select('.start').events('click')
    .compose(sampleCombine(i$))
    .map<Reducer>(eventI => state => ({ ...state, running: true, x: eventI[1] - state.x }));

  const stop$ = sources.DOM.select('.stop').events('click')
    .compose(sampleCombine(i$))
    .map<Reducer>(eventI => state => ({ ...state, running: false, x: eventI[1] - state.x }));

  const reset$ = sources.DOM.select('.reset').events('click')
    .mapTo<Reducer>(state => ({ ...state, running: false, x: 0 }));

  return {
    DOM: view(sources.onion.state$, i$),
    onion: xs.merge(defaultReducer$, start$, stop$, reset$)
  };
}

function view(state$: Stream<State>, i$: Stream<number>) {
  return xs.combine(state$, i$)
    .map(([s, i]) =>
      div('.timer', [
        span('Timer '),
        div({ style: {width: '50px', display: 'inline-block'}}, `${(s.running ? i - s.x : s.x) / 10}`),
        ' ',
        s.running ? undefined : button({ key: 1, attrs: { type: 'button', class: 'pure-button start' } }, 'Start'),
        ' ',
        s.running ? button({ attrs: { key: 2, type: 'button', class: 'pure-button stop' } }, 'Stop') : undefined,
        ' ',
        s.running ? undefined : button({ key: 3, attrs: { type: 'button', class: 'pure-button reset' } }, 'Reset'),
      ])
    );
}
