import xs, { Stream } from 'xstream';
import { VNode, DOMSource } from '@cycle/dom';
import { TimeSource } from '@cycle/time';
import { HTTPSource, RequestOptions } from '@cycle/http';
import { StateSource } from 'cycle-onionify';
import { RouterSource } from 'cyclic-router';
import { h } from '@cycle/dom';

import { RouterOutlet } from './routing';
import { routesDefs } from './routes';
import { Nav } from './page/nav';

export interface AppNavState {
  active: boolean;
};

export type Reducer = (prevState: AppNavState) => AppNavState;

export interface Sources {
  DOM: DOMSource;
  HTTP: HTTPSource;
  onion: StateSource<AppNavState>;
  router: RouterSource;
  time: TimeSource;
};

interface Sinks {
  DOM: Stream<VNode>;
  HTTP: Stream<RequestOptions>;
  onion: Stream<Reducer>;
  router: any;
};

export function App(sources: Sources): Sinks {
  // subscribe to keep state alive while navigating routes.
  sources.onion.state$.addListener((x: any) => x);

  // Print each new state
  sources.onion.state$.debug('state').addListener((x: any) => x);

  const nav = Nav(sources);  // Not isolated.
  const outlet = RouterOutlet<Sinks>(sources, routesDefs, ['HTTP', 'onion', 'router', 'modal']);
  const initReducer$ = xs.of<Reducer>(() => ({ active: false }));

  const active$ = sources.onion.state$.map(s => s.active);

  return {
    ...outlet,
    router: xs.merge<string>(nav.router, outlet.router),
    onion: xs.merge<Reducer>(initReducer$, outlet.onion, nav.onion),
    DOM: view(nav.DOM, outlet.DOM, active$)
  };
}

function view(nav$: Stream<VNode[]>, contents$: Stream<VNode>,
  active$: Stream<boolean>): Stream<VNode> {
  return xs.combine(nav$, contents$, active$)
    .map(([nav, contents, active]) =>
      h('div#layout', { class: { active } }, [
        ...nav,
        h('div#main', { class: { active } }, [
          <div className='header'>
            <h1>Example CycleJS / TypeScript Application</h1>
            <h2>(Kyle Cordes)</h2>
          </div>,
          <div className='content'>
            {contents}
          </div>
        ])
      ])
    );
}
