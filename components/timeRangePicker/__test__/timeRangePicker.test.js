/* eslint-disable */
import React from 'react';
import TimeRangePicker from '../index';
import {shallow, mount} from 'enzyme';


describe("时间区间", () => {

  it('defaultValue时间区间', async () => {
    const tree = mount(<TimeRangePicker defaultValue={['12:12:12']} />);

    expect(tree.state().startTime).toBe('12:12:12');
  });
})

