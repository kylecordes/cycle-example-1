import xs, { Stream } from 'xstream';
import { VNode, div } from '@cycle/dom';
import { Converter } from 'showdown';

import messageMd from './message';

export function Home(sources: {}) {
  return {
    DOM: view()
  };
}

// TODO: https://github.com/showdownjs/showdown/issues/376

function view(): Stream<VNode> {
  const converter = new Converter();
  const html = converter.makeHtml(messageMd);
  return xs.of(
    div({ props: { innerHTML: html } })
  );
}
