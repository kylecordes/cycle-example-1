import xs, { Stream } from 'xstream';
import { VNode } from '@cycle/dom';
import { DOMSource } from '@cycle/dom';
import isolate from '@cycle/isolate';
import { StateSource } from 'cycle-onionify';
import { ModalAction } from 'cyclejs-modal';

import { Counter } from './counter';
import { ModalSummary } from './modal-summary';

interface Sources {
  DOM: DOMSource;
  onion: StateSource<any>;
};

export function Counters(sources: Sources) {
  const counter1 = isolate(Counter)(sources);
  const counter2 = isolate(Counter)(sources);

  const showModal = sources.DOM.select('.total-button')
    .events('click')
    .mapTo<ModalAction>({
      type: 'open',
      component: ModalSummary
    });

  return {
    DOM: view(counter1.DOM, counter2.DOM),
    onion: xs.merge(counter1.onion, counter2.onion),
    modal: showModal
  };
}

function view(counter1DOM: Stream<VNode>, counter2DOM: Stream<VNode>) {
  return xs.combine(counter1DOM, counter2DOM)
    .map(([c1, c2]) =>
      <div className='pure-g'>
        <div className='pure-u-1 pure-u-md-1-3'>
          <h2>Counter 1:</h2>
          {c1}
        </div>
        <div className='pure-u-1 pure-u-md-1-3'>
          <h2>Counter 2:</h2>
          {c2}
          <p>Try a modal / pop-up</p>
          <button type='button' className='total-button pure-button'>Pop now</button>
        </div>
        <div className='pure-u-1 pure-u-md-1-3'>
          <p>This screen demonstrates two stateful components (of the same kind)
            used side by side. Each has its own isolated state. Look in the source code to
            see the minimal amount of "glue" required to use components and then
            display them jointly in apparent component.</p>
        </div>
      </div>
    );
}
