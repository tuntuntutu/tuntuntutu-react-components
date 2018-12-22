/* eslint-disable */
import React from 'react';
import Double from '../index';
import sinon from 'sinon'
import Enzyme, {mount, shallow} from 'enzyme';
import renderer from 'react-test-renderer';

const prefix = 'http://devcenter.caocaokeji.cn'
const provinces = [
  {
    "regionCode": "110000",
    "telCode": "010",
    "fullName": "北京市",
    "name": "北京市"
  },
  {
    "regionCode": "120000",
    "telCode": "022",
    "fullName": "天津市",
    "name": "天津市"
  }, {
    "regionCode": "130000",
    "telCode": null,
    "fullName": "河北省",
    "name": "河北省"
  },];

const cities = [
  {
    "regionCode": "140100",
    "telCode": "0351",
    "fullName": "山西省太原市",
    "name": "太原市"
  },
  {
    "regionCode": "140200",
    "telCode": "0352",
    "fullName": "山西省大同市",
    "name": "大同市"
  }, {
    "regionCode": "140300",
    "telCode": "0353",
    "fullName": "山西省阳泉市",
    "name": "阳泉市"
  },];
const config = {
  width: 200,
  className: '',
  firstConfig: {
    url: {
      method: 'get',
      url: `${prefix}/car-insurance/regionCode/queryAllProvinces`,
    },
    optionMap: {key: 'regionCode', value: 'name'},
  },
  secondConfig: {
    url: {
      method: 'get',
      url: `${prefix}/car-insurance/regionCode/queryCities`,
    },
    queryKey: 'provinceCode',
    optionMap: {key: 'telCode', value: 'name'},
  },
  defaultValue: {},
  onChange: () => {
  },
  value: {},
  format: {
    first: 'provinceCode',
    second: 'cityCode',
  },
  connect: () => {
  },
}

describe('SelectDouble组件', () => {
  const mountDouble = () => mount(<Double
    {...config}
  />);

  it('render SelectDouble correctly', () => {
    const double = <Double
      {...config}
    />;

    expect(renderer.create(double).toJSON()).toMatchSnapshot();

    const wrapper = mountDouble();

    expect(wrapper.find('Trigger').length).toBe(2);
    expect(wrapper.find('SelectTrigger').length).toBe(2);
    sinon.spy(wrapper.instance(), 'getSecondList');
    expect(wrapper.instance().getSecondList.calledOnce).toBeTruthy;

    const wrapperLink = shallow((double));

    expect(wrapperLink.find('div').children().length).toBe(2);
  });

  it('func is triggered correctly', () => {
    const wrapper = mountDouble();
    sinon.spy(wrapper.instance(), 'getFirstList');
    expect(wrapper.instance().getFirstList.calledOnce).toBeTruthy;
  })
});