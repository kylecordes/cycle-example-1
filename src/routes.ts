import { RouteDef } from './routing';

import { Home } from './home/home';
import { Counters } from './counter/counters';
import { Search } from './search/search';
import { Timers } from './timer/timers';

export const routesDefs: RouteDef[] =
  [
    { urlPath: '/', label: 'Home', cssClass: 'home', componentFn: Home },
    { urlPath: '/counters', label: 'Counters', cssClass: 'counters', componentFn: Counters },
    { urlPath: '/search', label: 'Search', cssClass: 'search', componentFn: Search },
    { urlPath: '/timers', label: 'Timers', cssClass: 'timers', componentFn: Timers }
  ];
