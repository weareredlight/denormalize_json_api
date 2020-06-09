# denormalize_json_api [![Build Status](https://travis-ci.org/weareredlight/denormalize_json_api.svg?branch=master)](https://travis-ci.org/weareredlight/denormalize_json_api)

## What is this?

When talking to a JSON:API compliant server, responses are normalized in a way that avoids data duplication, which is great. However the shape of the received objects is often inconvenient to work with.
What denormalize_json_api does is reassemble the data received from the server into something more easy to use.

## Example

Let's imagine a JSON:API server response that looks like this:

```js
{
  data: {
    id: '1',
    type: 'iceCream',
    attributes: {
      id: '1',
      name: 'Double Trouble',
      creamy: true,
      createdAt: '2019-09-29T12:42:37+01:00'
    },
    relationships: {
      cone: {
        data: { id: '2', type: 'container' }
      },
      flavors: {
        data: [
          { id: '3', type: 'filling' },
          { id: '4', type: 'filling' }
        ]
      }
    }
  },
  included: [
    {
      id: '2',
      type: 'container',
      attributes: {
        name: 'Big Cone'
      }
    },
    {
      id: '3',
      type: 'filling',
      attributes: {
        name: 'Chocolate'
      }
    },
    {
      id: '4',
      type: 'filling',
      attributes: {
        name: 'Banana'
      }
    }
  ]
}
```

After calling `denormalize` on that you would get:

```js
{
  id: '1',
  type: 'iceCream',
  name: 'Double Trouble',
  creamy: true,
  createdAt: '2019-09-29T12:42:37+01:00',
  cone: { id: '2', type: 'container', name: 'Big Cone' },
  flavors: [
    {
      id: '3',
      type: 'filling',
      name: 'Chocolate'
    },
    { 
      id: '4', 
      type: 'filling',
      name: 'Banana'
    },
  ]
}
```

## Quick Start

Install from the NPM repository using yarn or npm:

```shell
yarn add @weareredlight/denormalize_json_api
```

```shell
npm install @weareredlight/denormalize_json_api
```

Require it in your code and call it on a JSON:API response (you need to parse it into javascript first!):

```js
var denormalize = require('denormalize_json_api');

var denormalizedResponse = denormalize(response);
```

That's all there is to it!

## Dependencies

None.
