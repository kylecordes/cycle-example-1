import xs, { Stream } from 'xstream';
import { DOMSource } from '@cycle/dom';
import { ModalAction } from 'cyclejs-modal';
import { VNode, div, button } from '@cycle/dom';

interface Sources {
  DOM: DOMSource;
};

export function ModalSummary(sources: Sources) {
  return {
    DOM: view(),
    modal: sources.DOM.select('.close-button').events('click')
      .mapTo<ModalAction>({ type: 'close' })
  };
}

function view(): Stream<VNode> {
  return xs.of(
    div([
      div(['This is a modal. Hello!']),
      button('.close-button.pure-button', ['close'])
    ]));
}
