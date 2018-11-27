import React, { Component } from 'react';

import { SelectMax } from '../../components/index';

export default class ExportDemo extends Component {
  render() {
    return (
      <div>
        <SelectMax
          style={{ width: 200 }}
          url={{
            url: 'https://api.github.com/events',
            method: 'get',
          }}
          optionMap={{ value: 'type', key: 'id' }}
        />
        <SelectMax
          style={{ width: 200 }}
          options={[{ value: '111', key: 1 }, { value: '222', key: 2 }, { value: '333', key: 3 }]}
        />
      </div>
    );
  }
}
