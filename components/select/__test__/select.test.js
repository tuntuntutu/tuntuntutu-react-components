/* eslint-disable */
import React from 'react';
import SelectMax from '../index';
import renderer from 'react-test-renderer';
import {shallow, mount} from 'enzyme';


describe("加强版select组件", () => {

  it('异步获取数据的select', async () => {
    const tree = mount(<SelectMax
      url={{
        url: 'https://rap.caocaokeji.cn/mockjsdata/139/common/queryOperateLogs',
        method: 'get',
      }}
      optionMap={{value: 'operateContent', key: 'operateDate'}}
    />);
    await new Promise(resolve => setTimeout(resolve, 2000));

    expect(tree.state().asyncOptions.length).toBeGreaterThan(1);
  });
  it('传options的select', () => {
    const tree = shallow(<SelectMax
      style={{ width: 200 }}
      options={[{ value: '111', key: 1 }, { value: '222', key: 2 }, { value: '333', key: 3 }]}
    />);
    expect(tree.find('Select').exists()).toBeTruthy();
  });
})

