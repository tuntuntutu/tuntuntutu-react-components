/* eslint-disable */
import React from 'react';
import renderer from 'react-test-renderer';
import { shallow, mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import Export from '../index';

describe('<Export /> 导出组件', () => {
    describe('静态检查', () => {
        // 预设置
        beforeAll(() => {
            window.sessionStorage.setItem('permissions', 'center-driver/driver,b/c/c/,c');
        });

        afterAll(() => {
            window.sessionStorage.removeItem('permissions');
        });

        it('有权限', () => {
            const component = renderer.create(
                <Export
                    url="http://example.com/center-driver/driver"
                />,
            );
            let tree = component.toJSON();

            expect(tree).toMatchSnapshot();
        });

        it('无权限', () => {
            const component = renderer.create(
                <Export
                    url="http://example.com/a/b/c"
                />,
            );
            let tree = component.toJSON();

            expect(tree).toMatchSnapshot();
        });

        it('检查默认配置下的文案是否正确', () => {
            // 4个参数配置

            const wrapper = shallow(
                <Export
                    url="http://example.com/center-driver/driver"
                />,
            );
            wrapper.setState({ visible: true });

            expect(wrapper.find('Modal').prop('okText')).toBe('跳转到下载页');
            expect(wrapper.find('Modal').find('p').text()).toBe('导出任务提交成功!');
        });

        it('自定义 btnText btnType modalContent okText', () => {
            const wrapper = shallow(
                <Export
                    url="http://example.com/center-driver/driver"
                    btnText="打印"
                    btnType="primary"
                    modalContent="前往电子简历下载页"
                    okText="确定"
                />,
            );

            wrapper.setState({ visible: true });
            expect(wrapper.find('Modal').prop('okText')).toBe('确定');
            expect(wrapper.find('Modal').find('p').text()).toBe('前往电子简历下载页');
        });
    });
    describe('功能', () => {
        // 检查模态框在导出请求后的表现是否正常
        it('Check <Modal> display after request', () => {
            const wrapper = shallow(
                <Export
                    url="https://rap.caocaokeji.cn/mockjs/139/socialSecurity/export"
                    params={{}}
                />,
            );
            wrapper.setState({ visible: true, downloadUrl: 'www.baidu.com' });

            expect(wrapper.find('Modal').exists()).toBeTruthy();
        });
        // 检查模态框是否正常关闭
        it('<Modal> disappear when users press the ok button and cancel button', () => {
            const wrapper = mount(
                <Export
                    url="https://rap.caocaokeji.cn/mockjs/139/socialSecurity/export"
                    params={{}}
                />,
            );
            const instance = wrapper.instance();
            // 打开模态框
            wrapper.setState({ visible: true, downloadUrl: 'www.baidu.com' });
            // 点击模态框中的 确定 取消 按钮
            expect(toJson(wrapper)).toMatchSnapshot();
            expect(wrapper.find('Modal').exists()).toBeTruthy();

            instance.closeModal();
            expect(wrapper.state().visible).toBeFalsy();
        });

        it('Check params and getForm config', () => {
            const getForm = function() {
              return {
                  age: 29,
              }
            }
            const wrapper1 = shallow(
                <Export
                    url="https://rap.caocaokeji.cn/mockjs/139/socialSecurity/export"
                    params={{ name: 'xxx' }}
                />,
            );
            const wrapper2 = shallow(
                <Export
                    url="https://rap.caocaokeji.cn/mockjs/139/socialSecurity/export"
                    getForm={getForm}
                />,
            );
            const wrapper3 = shallow(
                <Export
                    url="https://rap.caocaokeji.cn/mockjs/139/socialSecurity/export"
                    params={{ name: 'xxx' }}
                    getForm={getForm}
                />,
            );

            const wrapper1Props = wrapper1.instance().props;
            const wrapper2Props = wrapper2.instance().props;
            const wrapper3Props = wrapper3.instance().props;

            expect(wrapper1Props.getForm() || wrapper1Props.params).toMatchObject({ name: 'xxx' });
            expect(wrapper2Props.getForm() || wrapper2Props.params).toMatchObject({ age: 29 });
            expect(wrapper3Props.getForm() || wrapper3Props.params).toMatchObject({ age: 29 });
        });
        /**
         * getForm 返回false来阻止导出请求
         * */
        it('getForm 返回false来阻止导出请求', () => {
          const wrapper = mount(
            <Export
              url="https://rap.caocaokeji.cn/mockjs/139/socialSecurity/export"
              getForm={() => false}
            />,
          );
          const instance = wrapper.instance();

          expect(instance.requestExport()).toBeFalsy();
        });
    });
});
