import xs, { Stream } from 'xstream';
import { VNode, DOMSource } from '@cycle/dom';
import { HTTPSource } from '@cycle/http';
import { TimeSource } from '@cycle/time';
import { div, label, input, hr, ul, li, a, h2, p, form } from '@cycle/dom';

interface Sources {
  DOM: DOMSource;
  HTTP: HTTPSource;
  time: TimeSource;
};

export function Search(sources: Sources) {

  function val$(selector: string) {
    return sources.DOM.select(selector).events('input')
      .map(ev => (ev.target as HTMLInputElement).value)
      .startWith('');
  }

  const searchRequest$ = xs.combine(val$('#search'), val$('#language'), val$('#stars'))
    .filter(query => query[0].length > 0)
    .map(([search, language, stars]) => {
      const terms = [search];
      if (isNumeric(stars)) {
        terms.push(`stars:">=${stars}"`);
      }
      if (language !== '') {
        terms.push(`language:"${language}"`);
      }
      return {
        q: terms.join(' ')
      };
    })
    .compose(sources.time.debounce(500))
    .debug('criteria')
    .map(query => ({
      url: 'https://api.github.com/search/repositories',
      query,
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

function isNumeric(n: any) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function labelField(id: string, labelText: string) {
  return div('.pure-u-1.pure-u-md-1-3', [
    label('.label', { attrs: { for: id } }, labelText),
    input('.field.pure-u-23-24', { attrs: { id, type: 'text' } })
  ]);
}

function view(searchResults$: Stream<any[]>): Stream<VNode> {
  return searchResults$.map(results =>
    div('.pure-g', [
      div('.pure-u-2-3', [
        h2('Github Search'),

        form('.pure-form.pure-form-stacked', [
          div('.pure-g', [
            labelField('search', 'Description'),
            labelField('language', 'Language'),
            labelField('stars', 'Min Stars'),
          ])
        ]),

        hr({ style: { width: '90%' } }),

        ul('.search-results', results.map(result =>
          li('.search-result', [
            a({ attrs: { href: result.html_url } }, result.name)
          ])
        ))
      ]),
      div('.pure-u-1-3', [
        p(`This screen demonstrates an incremental, debounced search implemented
        with Cycle. It is adapted from another published Github search example.`)
      ])
    ])
  );
}
