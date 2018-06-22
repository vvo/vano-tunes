# 🎺 vano-tunes

> Nothing to see here for now, pushed for save

[![Version][version-svg]][package-url] [![Build Status][travis-svg]][travis-url] [![License][license-image]][license-url] [![Downloads][downloads-image]][downloads-url]

<!-- START doctoc generated TOC please keep comment here to allow auto update -->

<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

**Table of Contents** _generated with [DocToc](https://github.com/thlorenz/doctoc)_

* [Installation](#installation)
* [Usage](#usage)
* [Contributing](#contributing)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Dev environement

```sh
docker-compose up -d
yarn
yarn db-migrate up
yarn dev
```

## Db tasks

```sh
yarn db-migrate reset
```

## Getting a spotify refresh token

Use https://github.com/vvo/tokenify.

[travis-svg]: https://img.shields.io/travis/vvo/vano-tunes/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/vvo/vano-tunes
[license-image]: https://img.shields.io/badge/license-MIT-green.svg?style=flat-square
[license-url]: LICENSE
[downloads-image]: https://img.shields.io/npm/dm/vano-tunes.svg?style=flat-square
[downloads-url]: http://npm-stat.com/charts.html?package=vano-tunes
[version-svg]: https://img.shields.io/npm/v/vano-tunes.svg?style=flat-square
[package-url]: https://yarnpkg.com/en/package/vano-tunes
