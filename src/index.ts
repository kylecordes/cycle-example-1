import xs from 'xstream';
import { run } from '@cycle/run';
import { makeDOMDriver } from '@cycle/dom';
import { makeHTTPDriver } from '@cycle/http';
import { timeDriver } from '@cycle/time';
import onionify from 'cycle-onionify';
import { makeRouterDriver } from 'cyclic-router';
import { createBrowserHistory } from 'history';
import switchPath from 'switch-path';

import { App, Sources } from './app';

const main = onionify(App, 'onion');

const drivers: any = {
  DOM: makeDOMDriver('#app'),
  HTTP: makeHTTPDriver(),
  // https://github.com/cyclejs-community/cyclic-router/issues/192 :
  router: makeRouterDriver(createBrowserHistory(), switchPath as any),
  time: timeDriver
};

export const driverNames: string[] = Object.keys(drivers);
const sinks: (s: Sources) => any = sources => ({
  ...driverNames.map(n => ({ [n]: xs.never() })).reduce(Object.assign, {}),
  ...main(sources)
});

run(sinks, drivers);
