/* Copyright (c) 2019 Tony Gonçalves. All rights reserved.
 * See LICENSE.txt for licensing details */

var denormalize = require('.');

var now = new Date();

var singleObj = {
  data: {
    id: '1',
    type: 'iceCream',
    attributes: {
      id: '1',
      name: 'Triple Trouble',
      creamy: true,
      createdAt: now
    },
    relationships: {
      cone: {
        data: { id: '2', type: 'container' }
      },
      flavors: {
        data: [
          { id: '3', type: 'filling' },
          { id: '4', type: 'filling' },
          { id: '5', type: 'filling' }
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
        name: 'Chocolate Ice Cream'
      },
      relationships: {
        brand: {
          data: {
            id: '6',
            type: 'company',
            attributes: {
              name: 'I Screaaaaaam!'
            }
          }
        }
      }
    },
    {
      id: '4',
      type: 'filling'
    }
  ]
};

var singleObjDenormalized = {
  data: {
    id: '1',
    type: 'iceCream',
    name: 'Triple Trouble',
    creamy: true,
    createdAt: now,
    cone: { id: '2', type: 'container', name: 'Big Cone' },
    flavors: [
      {
        id: '3',
        type: 'filling',
        name: 'Chocolate Ice Cream',
        brand: { id: '6', type: 'company', name: 'I Screaaaaaam!' }
      },
      { id: '4', type: 'filling' },
      { id: '5', type: 'filling' }
    ]
  }
};

var list = {
  data: [
    {
      id: '1',
      type: 'iceCream',
      attributes: {
        id: '1',
        name: 'Triple Trouble',
        creamy: true,
        createdAt: now
      },
      relationships: {
        cone: {
          data: { id: '2', type: 'container' }
        },
        flavors: {
          data: [
            { id: '3', type: 'filling' },
            { id: '4', type: 'filling' },
            { id: '5', type: 'filling' }
          ]
        }
      }
    },
    {
      id: '11',
      type: 'iceCream',
      attributes: {
        id: '11',
        name: 'Double Dank',
        creamy: true,
        createdAt: now
      },
      relationships: {
        cone: {
          data: { id: '12', type: 'container' }
        },
        flavors: {
          data: [{ id: '3', type: 'filling' }, { id: '5', type: 'filling' }]
        }
      }
    }
  ],
  included: [
    {
      id: '2',
      type: 'container',
      attributes: {
        name: 'Big Cone'
      }
    },
    {
      id: '12',
      type: 'container',
      attributes: {
        name: 'Medium Cone'
      }
    },
    {
      id: '3',
      type: 'filling',
      attributes: {
        name: 'Chocolate Ice Cream'
      },
      relationships: {
        brand: {
          data: {
            id: '6',
            type: 'company',
            attributes: {
              name: 'I Screaaaaaam!'
            }
          }
        }
      }
    },
    {
      id: '4',
      type: 'filling'
    }
  ]
};

var listDenormalized = {
  data: [
    {
      id: '1',
      type: 'iceCream',
      name: 'Triple Trouble',
      creamy: true,
      createdAt: now,
      cone: { id: '2', type: 'container', name: 'Big Cone' },
      flavors: [
        {
          id: '3',
          type: 'filling',
          name: 'Chocolate Ice Cream',
          brand: { id: '6', type: 'company', name: 'I Screaaaaaam!' }
        },
        { id: '4', type: 'filling' },
        { id: '5', type: 'filling' }
      ]
    },
    {
      id: '11',
      type: 'iceCream',
      name: 'Double Dank',
      creamy: true,
      createdAt: now,
      cone: { id: '12', type: 'container', name: 'Medium Cone' },
      flavors: [
        {
          id: '3',
          type: 'filling',
          name: 'Chocolate Ice Cream',
          brand: { id: '6', type: 'company', name: 'I Screaaaaaam!' }
        },
        { id: '5', type: 'filling' }
      ]
    }
  ]
};

describe('denormalize', function() {
  it('denormalizes responses with a singular top-level object', function() {
    expect(denormalize(singleObj)).toEqual(singleObjDenormalized);
  });

  it('denormalizes responses with multiple top-level objects', function() {
    expect(denormalize(list)).toEqual(listDenormalized);
  });

  it('deals correctly with empty lists', function() {
    expect(denormalize({ data: [] })).toEqual({ data: [] });
  });

  it('returns empty data when called with a null argument', function() {
    expect(denormalize(null)).toEqual(null);
  });

  it("returns the original object when the data key doesn't exist", function() {
    expect(denormalize({ yo: 'dude' })).toEqual({ yo: 'dude' });
  });
});
