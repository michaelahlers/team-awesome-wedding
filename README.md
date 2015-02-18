# Team Awesome Wedding

Heather and Michael decided they needed a custom wedding web site…

## Naming

You might ask: what's with the name? Heather and [Michael](http://github.com/michaelahlers) have a running gag where we refer to ourselves collectively as “Team Awesome” (because, well, we are).

## Abstract

This site is built on the [Typesafe](http://typesafe.com/) stack ([Scala](http://scala-lang.org/), [Play Framework](http://playframework.com/)), [MongoDB](http://mongodb.org), [ReactiveMongo](http://reactivemongo.org/), [RequireJS](http://requirejs.org/), [AngularJS](http://angularjs.org/), Twitter [Bootstrap](http://getbootstrap.org), [LESS Hat](http://lesshat.madebysource.com/), and others. It's deployed to [Heroku](http://heroku.com/) with the [MongoLab](http://mongolab.com/welcome/) add-on. A few scripts are provided to ease this workflow.

It's a single-page web application where a rich [JavaScript](http://developer.mozilla.org/en-US/docs/Web/JavaScript) client is downloaded once, then all data exchnaged with the server as [JSON](http://json.org/) over [REST](http://en.wikipedia.org/wiki/Representational_state_transfer) web services.

There are few web services that deal with two main data types: groups (which represent a party of invitees), and invitees (which record who's to attend).

The client loads its modules asynchronously with RequireJS, and makes heavy use of HTML5 features.

## Browsers

We've only tested on modern browsers, and no versions of Internet Explorer (it's simply too time-consuming to maintain for a side project like this for Microsoft's troubled browser). _Caveat emptor._

## Contribute

Anyone is free to use this source for their own benefit! See the included [MIT license](http://github.com/michaelahlers/team-awesome-wedding/blob/master/LICENSE.md). Pull-requests to this project are probably not useful as the wedding will be done on April 5, 2014. However, you're encouraged to fork it!

If you enjoyed this project in any way, please consider making a donation to its author. Send bitcoins to [`1LTX3m3Tysf3XQTQm3rnn15hGnL8nmwRRK`](bitcoin:1LTX3m3Tysf3XQTQm3rnn15hGnL8nmwRRK).

## Acknowledgements

- [Pattern Consulting, Inc.](http://pattern.nu/)
