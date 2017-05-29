import xs, { Stream } from 'xstream';
import { VNode, DOMSource } from '@cycle/dom';
import { HTTPSource } from '@cycle/http';
import { TimeSource } from '@cycle/time';
import { div, label, input, hr, ul, li, a, h2, p } from '@cycle/dom';

interface Sources {
  DOM: DOMSource;
  HTTP: HTTPSource;
  time: TimeSource;
};

export function Search(sources: Sources) {
  const searchRequest$ = sources.DOM.select('.field').events('input')
    .map(ev => (ev.target as HTMLInputElement).value)
    .compose(sources.time.debounce(500))
    .filter(query => query.length > 0)
    .map(q => ({
      url: `https://api.github.com/search/repositories?q=${encodeURI(q)}`,
      category: 'github',
    }));

  const searchResults$ = sources.HTTP.select('github')
    .flatten()
    .map(res => res.body.items)
    .startWith([]);

  return {
    DOM: view(searchResults$),
    HTTP: searchRequest$
  };
}

function view(searchResults$: Stream<any[]>): xs<VNode> {
  return searchResults$.map(results =>
    div('.pure-g', [
      div('.pure-u-2-3', [
        h2('Github Search'),
        label('.label', 'Search: '),
        input('.field', { attrs: { type: 'text' } }),
        hr({ style: { width: '90%' } }),
        ul('.search-results', results.map(result =>
          li('.search-result', [
            a({ attrs: { href: result.html_url } }, result.name)
          ])
        ))
      ]),
      div('.pure-u-1-3', [
        p(` The screen demonstrates an incremental, debounced search implemented
        with Cycle. It is adapted from another published good hub search example.`)
      ])
    ])
  );;
}
