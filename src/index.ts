import { makeDOMDriver } from '@cycle/dom';
import { makeHTTPDriver } from '@cycle/http';
import { makeHashHistoryDriver } from '@cycle/history';
import { run } from '@cycle/run';
import { timeDriver } from '@cycle/time';
import { modalify } from 'cyclejs-modal';
import { routerify } from 'cyclic-router';
import onionify from 'cycle-onionify';
import switchPath from 'switch-path';
import xs from 'xstream';

import { App, Sources } from './app';

let main = onionify(App, 'onion');
main = modalify(main);
main = routerify(main, switchPath);

const drivers: any = {
  DOM: makeDOMDriver('#app'),
  HTTP: makeHTTPDriver(),
  history: makeHashHistoryDriver(),
  time: timeDriver
};

export const driverNames: string[] = Object.keys(drivers);
const sinks: (s: Sources) => any = sources => ({
  ...driverNames.map(n => ({ [n]: xs.never() })).reduce(Object.assign, {}),
  ...main(sources)
});

run(sinks, drivers);
