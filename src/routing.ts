// Cycle cyclic-router RouterOutlet component This implements a relatively naive
// router outlet component, which pre-creates instances of all the destination
// route components, and supports only simple non-parameterized routing so far.

// Requires that incoming sources include a cyclic-router called router.
// Requires that application will consume a VDOM sink called DOM.

import xs, { Stream } from 'xstream';
import { VNode } from '@cycle/dom';
import isolate from '@cycle/isolate';
import { RouterSource, RouteMatcherReturn } from 'cyclic-router';

export interface RouteDef {
  urlPath: string;
  label: string;
  cssClass: string;
  componentFn: any;
}

interface Sources {
  router: RouterSource;
}

interface Sinks {
  DOM: Stream<VNode>;
}

export function RouterOutlet<S extends Sinks>(sources: Sources, defs: RouteDef[], sinkNames: string[]): S {

  const defsWithComps = defs.map(def => {
    const comp = isolate(def.componentFn)({
      ...sources,
      router: sources.router.path(def.urlPath) // scoped router
    });
    return { ...def, comp };
  });

  // Pass through all the non-DOM outputs

  const passThroughSinks = sinkNames
    .map(n => ({
      [n]: xs.merge(...defsWithComps
        .map(def => def.comp[n] || xs.never()))
    }))
    .reduce(Object.assign, {});

  // Switch between component DOM outputs:

  const definitions = defsWithComps.reduce((result, item) => ({
    ...result,
    [item.urlPath]: item.comp
  }), {});

  const match$ = sources.router.define(definitions);

  const dom$ = match$.map((m: RouteMatcherReturn) => m.value)
    .map((c: Sinks) => c.DOM).flatten();

  return {
    ...passThroughSinks,
    DOM: dom$
  };
}
