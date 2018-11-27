/* eslint-disable */
import React from 'react';
import Enzyme, { mount } from 'enzyme';
import { Input, Select, DatePicker, Radio } from 'antd';
import PageTemplate from '../index';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

describe('PageTemplate render', () => {
  const columns = [{
    title: '城市名称',
    dataIndex: 'cityName',
  }];

  const config = {
    searchOnLoad: true,
    pageSize: 2,
    url: 'https://rap.caocaokeji.cn/mockjsdata/106/car-insurance/useSeal/queryAuditPageInfo',
    type: 'get',
    beforeRequest: val => val,
    afterRequest: val => val,
  }

  const connect = () => { };
  const rowKey = "id";
  const toolbar = null;
  const filter = [
    {
      component: 'Input', key: 'input1', label: '测试输入1', onChange: () => { }
    },
    {
      component: 'Input', key: 'input2', label: '测试输入2', onChange: () => { }
    }
  ];
  const needExport = false;


  //空判断
  it('connect props is empty', () => {
    const wrapper = mount((<PageTemplate
      connect={null}
      columns={columns}
      rowKey={rowKey}
      toolbar={toolbar}
      config={config}
      filter={filter}
      needExport={needExport}
    />));
    expect(wrapper.find('.page-template').exists()).toBeTruthy();
  });

  it('rowKey props is empty', () => {
    const wrapper = mount((<PageTemplate
      connect={connect}
      columns={columns}
      toolbar={toolbar}
      config={config}
      filter={filter}
      needExport={needExport}
    />));
    expect(wrapper.find('.page-template').exists()).toBeTruthy();
  });
  it('toolbar props is empty', () => {
    const wrapper = mount((<PageTemplate
      connect={connect}
      columns={columns}
      rowKey={rowKey}
      toolbar={null}
      config={config}
      filter={filter}
      needExport={needExport}
    />));
    expect(wrapper.find('.page-template').exists()).toBeTruthy();
  });
  // it('config props is empty', () => {
  //     const wrapper = mount((<PageTemplate
  //         connect={connect}
  //         columns={columns}
  //         rowKey={rowKey}
  //         toolbar={toolbar}
  //         config={null}
  //         filter={filter}
  //         needExport={needExport}
  //     />));
  //     expect(wrapper.find('.page-template').exists()).toBeTruthy();
  // });
  it('filter props is empty', () => {
    const wrapper = mount((<PageTemplate
      connect={connect}
      columns={columns}
      rowKey={rowKey}
      toolbar={toolbar}
      config={config}
      filter={null}
      needExport={needExport}
    />));
    expect(wrapper.find('.page-template').exists()).toBeTruthy();
  });


  // test func
  it('connect props is called', () => {
    const fn = jest.fn();
    const connectfunc = (obj) => {
      fn();
      expect(obj).toHaveProperty('onSearch');
      expect(obj).toHaveProperty('form');
      expect(Object.prototype.toString.call(obj.onSearch)).toEqual('[object Function]');
      expect(Object.prototype.toString.call(obj.form)).toEqual('[object Object]');
    }

    const wrapper = mount((<PageTemplate
      connect={connectfunc}
      columns={columns}
      rowKey={rowKey}
      toolbar={toolbar}
      config={config}
      filter={filter}
      needExport={needExport}
    />));
    expect(fn.mock.calls.length).toBe(1);
  });

  it('beforeRequest props is called', () => {
    const fn = jest.fn();
    const beforeRequestfunc = (obj) => {
      fn();
      expect(Object.prototype.toString.call(obj)).toEqual('[object Object]');
    }

    const wrapper = mount((<PageTemplate
      connect={connect}
      columns={columns}
      rowKey={rowKey}
      toolbar={toolbar}
      config={{ ...config, beforeRequest: beforeRequestfunc }}
      filter={filter}
      needExport={needExport}
    />));
    wrapper.find('.page-template__filter .ant-btn').first().simulate('click');
    //由于页面加载好就设置了加载数据，因此当点击一次查询的时候，总共应该被调用两次
    expect(fn.mock.calls.length).toBe(2);
  });

  //afterRequest 依赖于request返回结果，因此如果遥测，需要开启对应的模拟服务
  it('afterRequest props is called', (done) => {
    const fn = jest.fn(function () {
      done();
    });
    const afterRequestfunc = (obj) => {
      fn();
      expect(Object.prototype.toString.call(obj)).toEqual('[object Object]');
      expect(fn.mock.calls.length).toBe(2);
      return obj;
    }

    const wrapper = mount((<PageTemplate
      connect={connect}
      columns={columns}
      rowKey={rowKey}
      toolbar={toolbar}
      config={{ ...config, afterRequest: afterRequestfunc }}
      filter={filter}
      needExport={needExport}
    />));
    wrapper.find('.page-template__filter .ant-btn').first().simulate('click');

  });

  // filter test

  it('filter props test', () => {
    const RadioGroup = Radio.Group;
    const filterArray = [
      { component: 'RangePicker', key: 'RangePicker1', label: '测试时间选择框1', onChange: () => { } },
      { component: 'Select', key: 'Select1', label: '测试下拉框1', onChange: () => { }, options: [] },
      { component: 'Input', key: 'input1', label: '测试输入框1', onChange: () => { } },
      { component: <DatePicker />, key: 'DatePicker1', label: '测试单个时间选择1', onChange: () => { } },
      {
        component: (<RadioGroup>
          <Radio value="a">item 1</Radio>
          <Radio value="b">item 2</Radio>
          <Radio value="c">item 3</Radio>
        </RadioGroup>), key: 'Radio1', label: '测试radio1', onChange: () => { }
      }
    ]
    const wrapper = mount((<PageTemplate
      connect={connect}
      columns={columns}
      rowKey={rowKey}
      toolbar={toolbar}
      config={config}
      filter={filterArray}
      needExport={needExport}
    />));

    expect(wrapper.find('.page-template__filter .ant-calendar-picker').length).toBe(2);
    expect(wrapper.find('.page-template__filter .ant-select').length).toBe(1);
    expect(wrapper.find('.page-template__filter Input').length).toBe(1);
    expect(wrapper.find('.page-template__filter .ant-radio-group').length).toBe(1);
  });
});
