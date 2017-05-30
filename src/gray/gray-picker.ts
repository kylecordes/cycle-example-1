import xs, { Stream } from 'xstream';
import { VNode, DOMSource } from '@cycle/dom';
import { div, button, h2, p, span } from '@cycle/dom';

interface Sources {
  DOM: DOMSource;
};

export function GrayPicker(sources: Sources) {

  const initial$ = xs.of(128);
  const plus$ = sources.DOM.select('.plus').events('click').mapTo(10);
  const minus$ = sources.DOM.select('.minus').events('click').mapTo(-10);
  const val$ = xs.merge(initial$, plus$, minus$)
    .fold((acc, x) => Math.max(Math.min(acc + x, 255), 0), 0);

  return {
    DOM: view(val$)
  };
}

function view(val$: Stream<number>): xs<VNode> {
  return val$.map(v =>
    div('.pure-g', [
      div('.pure-u-2-3', [
        h2('Gray Color Picker'),
        button({ attrs: { type: 'button', class: 'pure-button plus' } }, 'Lighter'),
        span(' '),
        button({ attrs: { type: 'button', class: 'pure-button minus' } }, 'Darker'),
        p('value = ' + v),
        div({ style: { width: '50px', height: '50px', border: '1px solid black', 'background-color': `rgb(${v},${v},${v})` } })
      ]),
      div('.pure-u-1-3', [
        p(`The screen demonstrates local state, kept in an observable here in the
          component without any connection to the broader application.`)
      ])
    ])
  );;
}
