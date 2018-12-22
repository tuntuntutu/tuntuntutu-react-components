/* eslint-disable */
import React from 'react';
import Gallery from '../index';
import sinon from 'sinon'
import Enzyme, { mount, shallow } from 'enzyme';
import renderer from 'react-test-renderer';
import EnzymeToJson from 'enzyme-to-json';

const imgList = [
  'http://pic1.win4000.com/pic/a/9e/1d031613571.jpg',
  'https://www.linuxprobe.com/wp-content/uploads/2017/06/GO-1YEAR-01-1024x538.jpg',
  'https://cdn.arstechnica.net/wp-content/uploads/2018/06/7-2-1.jpg',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJbs5lK2RZjCr642ul6iOIdNHO2F29M8FvTnC3EKIGyxDI3wlK',
];

const props = {
  imgList: imgList,
  visible: true,
  index: 0,
  onClose: jest.fn((e) => {
  })
}

describe('PicturesGallery组件', () => {
  const fn = jest.fn();
  const mountGallery = () => mount(<Gallery
    {...props}
  />);

  it('render Gallery correctly', () => {
    const Pic = <Gallery {...props} />;
    expect(EnzymeToJson(mountGallery())).toMatchSnapshot();
  });

  // 判断传值正确性
  it('render Gallery data correctly', () => {
    const mountPic = mountGallery();
    expect(mountPic.find('Gallery').length).toBe(1);

    expect(mountPic.prop('visible')).toBeTruthy;
    expect(mountPic.prop('imgList').length).toEqual(4);
    expect(mountPic.prop('index')).toEqual(0);
  });

  // 判断函数是否正确触发
  it('Gallery func triggery correctly', () => {
    const mountPic = mountGallery();
    expect(mountPic.find('.ril-next-button').length).toEqual(1);
    mountPic.find('.ril-next-button').simulate('click');
    expect(mountPic.state().photoIndex).toEqual(1);

    expect(mountPic.find('.ril-close').length).toEqual(1);
    mountPic.find('.ril-close').simulate('click');
    expect(mountPic.prop('visible')).toBeFalsy;
  });

});