import { RouteDef } from './routing';

import { Home } from './home/home';
import { GrayPicker } from './gray/gray-picker';
import { Search } from './search/search';
import { Counters } from './counter/counters';
import { Timers } from './timer/timers';

export const routesDefs: RouteDef[] =
  [
    { urlPath: '/', label: 'Home', cssClass: 'home', componentFn: Home },
    { urlPath: '/gray', label: 'Gray', cssClass: 'gray', componentFn: GrayPicker },
    { urlPath: '/search', label: 'Search', cssClass: 'search', componentFn: Search },
    { urlPath: '/counters', label: 'Counters', cssClass: 'counters', componentFn: Counters },
    { urlPath: '/timers', label: 'Timers', cssClass: 'timers', componentFn: Timers }
  ];
