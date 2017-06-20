import xs, { Stream } from 'xstream';
import { div, p, span } from '@cycle/dom';

export interface Props {
  r: number;
  g: number;
  b: number;
  label: string;
};

interface Sources {
  props: Stream<Props>;
};

export function Chip(sources: Sources) {
  const defaultProps = xs.of({ label: 'black', r: 0, g: 0, b: 0 });
  return {
    DOM: view(sources.props || defaultProps)
  };
}

function view(props$: Stream<Props>) {
  return props$
    .map(props =>
      div([
        p([
          span('Color chip: '),
          span(props.label)
        ]),
        div({
          style: {
            width: '100px',
            height: '50px',
            border: '1px solid gray',
            'background-color': `rgb(${props.r},${props.g},${props.b})`
          }
        })
      ])
    );
}
