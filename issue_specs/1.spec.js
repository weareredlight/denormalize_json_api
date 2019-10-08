/* Copyright (c) 2019 Tony Gonçalves. All rights reserved.
 * See LICENSE.txt for licensing details */

/**
 * Regression spec for https://github.com/tonyfg/denormalize_json_api/issues/1
 */

var denormalize = require('..');

var json = {
  data: [
    {
      id: '22',
      type: 'conversation',
      attributes: {
        created_at: '2019-09-23T09:17:51.188Z',
        patient_read_at: '2019-09-24T10:01:06.427Z',
        dentist_read_at: '2019-09-08T09:17:50.000Z',
        subject: 'like every single day guess what? every single one'
      },
      relationships: {
        dentist: {
          data: {
            id: '22',
            type: 'dentist'
          }
        },
        last_message: {
          data: {
            id: '3932',
            type: 'last_message'
          }
        }
      }
    }
  ],
  included: [
    {
      id: '3932',
      type: 'last_message',
      attributes: {
        created_at: '2019-09-23T16:09:06.155Z',
        updated_at: '2019-09-23T16:09:06.155Z',
        text: 'novo doc'
      },
      relationships: {
        conversation: {
          data: {
            id: '22',
            type: 'conversation'
          }
        },
        dentist: {
          data: null
        }
      }
    }
  ]
};

var denormalizedJson = {
  data: [
    {
      id: '22',
      type: 'conversation',
      created_at: '2019-09-23T09:17:51.188Z',
      patient_read_at: '2019-09-24T10:01:06.427Z',
      dentist_read_at: '2019-09-08T09:17:50.000Z',
      subject: 'like every single day guess what? every single one',
      dentist: { id: '22', type: 'dentist' },
      last_message: {
        id: '3932',
        type: 'last_message',
        created_at: '2019-09-23T16:09:06.155Z',
        updated_at: '2019-09-23T16:09:06.155Z',
        text: 'novo doc',
        dentist: null,
        conversation: { id: '22', type: 'conversation' }
      }
    }
  ]
};

describe('denormalize', function() {
  it('works correctly when some relationships are null', function() {
    expect(denormalize(json)).toEqual(denormalizedJson);
  });
});
