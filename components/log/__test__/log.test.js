/* eslint-disable */
import React from 'react';
import Log from '../index';
import sinon from 'sinon'
import Enzyme, { mount } from 'enzyme';

//延时函数
const timeout = (callback,fn) => {
    setTimeout(() => {
        fn();
        callback && callback();
    }, 1000); //一秒之后挂载节点
}

const LogColumns = [{
  title: '操作内容',
  dataIndex: 'content',
  key: 'content',
}, {
  title: '操作入口',
  dataIndex: 'name',
  key: 'name',
}, {
  title: '操作人',
  dataIndex: 'username',
  key: 'username',
}, {
  title: '操作时间',
  dataIndex: 'time',
  key: 'time',
}];

describe('Log组件', () => {

  const mountLog = () => mount(<Log
    url="https://rap.caocaokeji.cn/mockjsdata/188/test/list"
    query={{ pageSize: 10, pageNum: 1, query: { bizzObjId: 1, bizzType: 5 } }}
    columns={LogColumns}
  />);

  // 点击显示
  it('display none after click', () => {
    let wrapper = mountLog();

    // 点击a标签显示Modal组件
    wrapper.find('.log').first().simulate('click');
    const callback = jest.fn();
    timeout(callback,() => {
      wrapper.update();//动态生成的节点无法使用find找到,需要update();
      expect(wrapper.state().visible).to.equal(true);
    });
    jest.runAllTimers();



    // 三个函数应该在初始化时都被调用了
    sinon.spy(wrapper.instance(), 'triggerQueryLog')
    expect(wrapper.instance().triggerQueryLog.calledOnce).toBeTruthy

    sinon.spy(wrapper.instance(), 'openModal')
    expect(wrapper.instance().openModal.calledOnce).toBeTruthy

    sinon.spy(wrapper.instance(), 'queryData')
    expect(wrapper.instance().queryData.calledOnce).toBeTruthy

    // 显示之后 组件的state visible为true
    wrapper.instance().openModal();
    expect(wrapper.state('visible')).toBeTruthy();
  })
})