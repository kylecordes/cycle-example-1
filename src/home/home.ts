import xs from 'xstream';
import { VNode } from '@cycle/dom';
import { div } from '@cycle/dom';
import { Converter } from 'showdown';

import messageMd from './message';

export function Home() {
  return {
    DOM: view()
  };
}

// TODO: https://github.com/showdownjs/showdown/issues/376

function view(): xs<VNode> {
  const converter = new Converter();
  const html = converter.makeHtml(messageMd);
  return xs.of(
    div({ props: { innerHTML: html } })
  );
}
