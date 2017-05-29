# Example CycleJS-TypeScript application

See it running:

<https://kylecordes.github.io/cycle-example-1>

## Intro / Goals

This is a small, simple example Cycle application. Its purpose is simply to
contain a variety of common application feature ideas, demonstrating how various
Cycle mechanisms work.

I'm trying to discover the minimum reasonable amount of "boilerplate" around a
cycle component. Boilerplate is an area where the numerous popular SPA
frameworks leave room for competitive advantage.

Many other example Cycle applications with TypeScript have what I find to be
unreasonably high demands on the developer to add explicit types. I think this
reflects the notion of TypeScript is a recent addition to the Cycle ecosystem.
More experienced TypeScript developers tend to prefer more type inference and
less explicit typing.

## Machinery

I first created this application using `create-cycle-app`:

```
create-cycle-app cycle3 --flavor cycle-scripts-one-fits-all
```

This makes it quite easy to run the application:

```
npm install
npm start
```

(For reasons unknown at this time, it does not work with yarn.)

## Status

This is currently quite a simple application, not showing very many advanced
ideas yet. Status and upcoming ideas are in the issue tracker:

https://github.com/kylecordes/cycle-example-1/issues

## Why?

Much of our mainstream customer work and training (I have trained many many
developers) involves Angular or React. These are both popular for numerous good
reasons. But there are things to be learned by picking up less popular tooling,
and Cycle seems to be a particularly interesting edge case: what if we mostly
just had observables and virtual DOM? Is that enough? It seems to mostly be
enough.

## Who?

Kyle Cordes <http://kylecordes.com>

Oasis Digital <https://oasisdigital.com>
