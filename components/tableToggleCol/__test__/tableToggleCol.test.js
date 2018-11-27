/* eslint-disable */
import React from 'react';
import Enzyme,{  mount  } from 'enzyme';
import renderer from 'react-test-renderer';
import { Table } from 'antd';
import TableToggleCol from '../index';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

//延时函数
const timeout = (callback,fn) => {
    setTimeout(() => {
        fn();
        callback && callback();
    }, 1000); //一秒之后挂载节点
}

//计算固定列个数
const countFixedLength = (columns) => {
    let length = 0;
    columns.forEach(i => {
        i.fixed && length++
    });
    return length;
}
jest.useFakeTimers();

/**   测试内容:
 √ 入参为空时，列为空 (UI渲染正确)
 √ 下拉checkbox的个数和入参columns个数匹配，checkbox的个数是columns里面非fixed的列总数 (UI渲染正确)
 √ 小于7列之后，取消固定列行为 (取消固定列的准备行为)
 √ 点击下拉框的第一个checkbox，隐藏table的对应一列 (准确联动控制显隐，分别覆盖三种场景，一个固定列，两个固定列，没有固定列)
 √ 最后一个checkbox将无法隐藏最后一个非固定列 (无法隐藏最后个非固定列)
 √ Snapshot
 */



describe('tableToggleCol mount', () => {

    //列改动事件
    const columnsChange=(result) => { columns = result  };

    //渲染数据
    const list = [{0: 1, key: 1}];

    //列元素
    let columns = [
        { title: 'Column0', dataIndex: '0', key: '0', fixed: 'left' },
        { title: 'Column1', dataIndex: '1', key: '1' },
        { title: 'Column2', dataIndex: '2', key: '2' },
        { title: 'Column3', dataIndex: '3', key: '3' },
        { title: 'Column4', dataIndex: '4', key: '4' },
        { title: 'Column5', dataIndex: '5', key: '5' },
        { title: 'Column6', dataIndex: '6', key: '6', fixed: 'right' },
    ];

    //单独组件
    const togglecol = <TableToggleCol
        columns={columns}
        columnsChange={columnsChange}
    />;


    //业务渲染
    class BizRender extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                columns:props.columns
            }
        }
        render() {
            const {columns} = this.state;
            const {list,fixedColSize=5} = this.props;

            return(<div>
                <TableToggleCol
                    columns={columns}
                    fixedColSize={fixedColSize}
                    defaultChecked={false}
                    columnsChange={(result) => {
                        this.setState({columns:result});
                        //   this.setState({columns:result});
                    }}
                />
                <Table
                    columns={columns}
                    rowKey="key"
                    dataSource={list}
                    scroll={{ x: 1300 }}
                />
            </div>);
        }
    }

    it('入参为空时，列为空', () => {
        const wrapper = mount((<TableToggleCol
            columns={[]}
            columnsChange={columnsChange}
        />));
        expect(wrapper.find('.anticon-appstore-o').exists()).toBeTruthy();
        wrapper.find('Button').first().simulate('click');
        const callback = jest.fn();
        timeout(callback,() => {
            wrapper.update();//动态生成的节点无法使用find找到,需要update();
            const length = wrapper.find('.ant-dropdown-menu-item').length;
            expect(length).toBe(0);//0个
        });
        jest.runAllTimers();
    });

    it('下拉checkbox的个数和入参columns个数匹配，checkbox的个数是columns里面非fixed的列总数', () => {
        const wrapper = mount((<TableToggleCol
            columns={[
                { title: 'Column0', dataIndex: '0', key: '0' },
                { title: 'Column1', dataIndex: '1', key: '1' },
                { title: 'Column2', dataIndex: '2', key: '2' },
                { title: 'Column3', dataIndex: '3', key: '3' },
                { title: 'Column6', dataIndex: '6', key: '6', fixed: 'right' },
            ]}
            columnsChange={columnsChange}
        />));
        expect(wrapper.find('.anticon-appstore-o').exists()).toBeTruthy();
        wrapper.find('Button').first().simulate('click');
        const callback = jest.fn();
        timeout(callback,() => {
            wrapper.update();//动态生成的节点无法使用find找到,需要update();
            const length = wrapper.html().split('ant-dropdown-menu-item').length;
            expect(length).toBe(5);//第一列和最后一列拥有fixed属性，不允许控制显隐
        });
        jest.runAllTimers();
    });

    it('小于7列之后，取消固定列行为', () => {
        const wrapper = mount((<BizRender
            list={list}
            fixedColSize={7}
            columns={columns}
        />));
        expect(wrapper.find('.anticon-appstore-o').exists()).toBeTruthy();
        wrapper.find('Button').first().simulate('click');
        const callback = jest.fn();
        timeout(callback,() => {
            const callback = jest.fn();
            timeout(callback,() => {
                wrapper.update();//动态生成的节点无法使用find找到,需要update();

                //关于为什么使用change不用click的缘由：组件内部是在Checkbox组件上绑定change事件，而在Checkbox组件内部实际上是在checkbox中绑定了change事件，由于change事件不能冒泡，所以在父节点触发click将无法激活事件
                wrapper.find('.ant-checkbox-input').last().simulate('change');//simulate触发的事件，仅仅是事件而已，不会切换checkbox的状态，所以在组件初始化的时候，让所有checkbox默认不勾选
                //初始化fixed对象
                let fixed ={
                    left:'',
                    right:'',
                };
                //如果拥有fixed属性，则重置对应属性
                wrapper.state('columns').forEach(i => {
                    i.fixed && (fixed[i.fixed] = i.fixed)
                });

                //比较是否取消fixed属性
                expect(fixed).toEqual({
                    left:'',
                    right:'',
                });
            });
            jest.runAllTimers();
        });
        jest.runAllTimers();
    });


    it('快照对比', () => {
        const tableToggleCol = renderer.create(togglecol).toJSON();
        expect(tableToggleCol).toMatchSnapshot();
    });

});


