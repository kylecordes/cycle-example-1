import xs, { Stream } from 'xstream';
import { DOMSource } from '@cycle/dom';
import { h, span } from '@cycle/dom';
import { StateSource } from 'cycle-onionify';
import sampleCombine from 'xstream/extra/sampleCombine';

import { routesDefs } from '../routes';
import { AppNavState, Reducer } from '../app';

interface Sources {
  DOM: DOMSource;
  onion: StateSource<AppNavState>;
};

export function Nav(sources: Sources) {
  const routeActions$ = xs.merge(
    ...routesDefs.map(def =>
      sources.DOM.select('.' + def.cssClass)
        .events('click')
        .mapTo(def.urlPath)
    ));

  const active$ = sources.onion.state$.map(s => s.active);

  const menuLink$ = sources.DOM.select('#menuLink')
    .events('click', { preventDefault: true })
    .mapTo<Reducer>(state => ({ ...state, active: !state.active }));

  const contentReducers$ = sources.DOM.select('#main').events('click')
    .compose(sampleCombine(active$))
    .filter(eventActive => eventActive[1])
    .mapTo<Reducer>(state => ({ ...state, active: false }));

  return {
    DOM: view(active$),
    router: routeActions$,
    onion: xs.merge(menuLink$, contentReducers$)
  };
}

function view(active$: Stream<boolean>) {
  const links = routesDefs.map(def =>
    h('li.pure-menu-item', [
      h('a', {
        attrs: { href: '#' },
        class: {
          'pure-menu-link': true,
          [def.cssClass]: true
        }
      }, def.label)]));

  return active$.map(a => [
    h('a#menuLink.menu-link', { class: { active: a } }, [span()]),
    h('div#menu', [
      h('div.pure-menu', [
        h('a.pure-menu-heading.home', { attrs: { href: '#' } }, 'Example'),
        h('ul.pure-menu-list', links)
      ])
    ])
  ]);
}
