import { RouteDef } from './routing';

import { Home } from './01-home/home';
import { Chips } from './02-chips/chips';
import { GrayPicker } from './03-gray/gray-picker';
import { Search } from './04-search/search';
import { Counters } from './05-counter/counters';
import { Timers } from './06-timer/timers';
import { Grid } from './07-grid/grid';

export const routesDefs: RouteDef[] =
  [
    { urlPath: '/', label: 'Home', cssClass: 'home', componentFn: Home },
    { urlPath: '/chips', label: 'Chips', cssClass: 'chips', componentFn: Chips },
    { urlPath: '/gray', label: 'Gray', cssClass: 'gray', componentFn: GrayPicker },
    { urlPath: '/search', label: 'Search', cssClass: 'search', componentFn: Search },
    { urlPath: '/counters', label: 'Counters', cssClass: 'counters', componentFn: Counters },
    { urlPath: '/timers', label: 'Timers', cssClass: 'timers', componentFn: Timers },
    { urlPath: '/grid', label: 'Grid', cssClass: 'grid', componentFn: Grid }
  ];
