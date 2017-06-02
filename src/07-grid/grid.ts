import { Stream } from 'xstream';
import { VNode, DOMSource } from '@cycle/dom';
import { TimeSource } from '@cycle/time';
import { div, h2, table, tr, td, p, span } from '@cycle/dom';

interface State {
  values: number[];
}

interface Sources {
  DOM: DOMSource;
  time: TimeSource;
};

const CELLS = 2000;

export function Grid(sources: Sources) {
  const state$ = sources.time.periodic(5)
    .fold((acc, t) => {
      acc[t % acc.length]++;
      return acc;
    }, Array(CELLS).fill(0))
    .map(arr => ({ values: arr as number[] }))
    .remember();

  state$.addListener((ignored: any) => ignored); // so we keep state while routed away

  return {
    DOM: view(state$)
  };
}

function view(state$: Stream<State>): Stream<VNode> {
  const rowLength = 50;
  const cols = Array(rowLength).fill(0);
  const rows = Array(Math.ceil(CELLS / rowLength)).fill(0);

  return state$.map(state => {
    let i = 0;
    return div([
      h2('Data grid - DOM update performance demo'),
      p(`This table contains 2000 cells, of which one is updated ideally every
        5 ms. It is intended as a stress test of the virtual DOM mechanism,
        and a simple case in which to apply any optimizations to get performant
        results. In its current form, this series of updates results in
        substantial browser CPU usage.`),
      table(
        rows.map(row => tr(
          { key: i },
          cols.map(col => td(
            {
              key: i,
              class: { cell: true }
            },
            [
              span(' '),
              span(state.values[i++] || '-')
            ])
          )))
      )
    ]);
  });
}
