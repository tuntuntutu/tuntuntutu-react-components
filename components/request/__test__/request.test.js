/* eslint-disable */
import request from '../index';
import juicer from '../lib/juicer';
const baseUrl = 'https://nei.netease.com/api/apimock/61f88d60b2575fcc52418d80c94c3774'; //MOCK 地址前缀

//采用第三方MOCK地址进行测试
describe('request online Mock', () => {
    /**
     * code 200
     * 用例通过的标准：
     * 1. 业务正常,返回纯业务数据
     * 2. code默认200
     */
    it('code=200:业务成功', async () => {
        expect.assertions(1);
        const data = await request({
            method: 'get',
            url: `${baseUrl}/api/200`,
            data: {},
        });
        expect(data).toEqual([]);
    });

    /**
     * code 200 返回完整数据
     * 用例通过的标准：
     * 1. 业务正常,返回纯业务数据
     * 2. code默认200
     */
    it('code=200:业务成功，返回完整数据', async () => {
        expect.assertions(2);
        const data = await request({
            method: 'get',
            url: `${baseUrl}/api/200`,
            data: {},
            intactData:true

        });
        expect(data.data).toEqual([]);
        expect(data.message).toBeDefined();
    });

    /**
     * code 300
     * 用例通过的标准：
     * 1. 业务正常,返回{data:**,response:**}，jest 判断，是否拥有data和response两个属性
     * 2. 入参需要传入指定的code
     */
    it('code=300:业务成功，在入参中设置code=300', async () => {
        expect.assertions(1);
        const data = await request({
            method: 'get',
            url: `${baseUrl}/api/300/success`,
            data: {},
            code:[0,300]
        });
        expect(data).toEqual([]);
    });

    /**
     * code 300
     * 用例通过的标准：
     * 1. 在catch中的错误信息进行校验 sucess: false
     * 2. 在catch中的错误信息进行校验 message: 有值
     */
    it('code=300:业务异常~', async () => {
        expect.assertions(3);
        try {
            await request({
                method: 'get',
                url: `${baseUrl}/api/300`,
                data: {},
            });
        } catch (e) {
            expect(e.success).toBeFalsy();
            expect(e.message).toBeDefined();
            expect(JSON.parse(e.message).code).toEqual(300);//在错误信息中，需要暴露code
        }
    });

    /**
     * code 555
     * 用例通过的标准：
     * 1. 页面用antd的message组件正常提示error
     * 2. 在catch中的错误信息进行校验 sucess: false
     * 3. 在catch中的错误信息进行校验 message: 有值
     */
    it('code=555', async () => {
        expect.assertions(2);
        try {
            await request({
                method: 'get',
                url: `${baseUrl}/api/555`,
                data: {},
            });
        } catch (e) {
            expect(e.success).toBeFalsy();
            expect(e.message).toBeDefined();
        }
    });
    /**
     * code 556
     * 用例通过的标准：
     * 1. 页面用antd的message组件正常提示error
     * 2. 在catch中的错误信息进行校验 sucess: false
     * 3. 在catch中的错误信息进行校验 message: 有值
     */
    it('code=556', async () => {
        expect.assertions(2);
        try {
            await request({
                method: 'get',
                url: `${baseUrl}/api/556`,
                data: {},
            });
        } catch (e) {
            expect(e.success).toBeFalsy();
            expect(e.message).toBeDefined();
        }
    });
});

describe('Request-juicer function', () => {
    it('juicer 数据处理', async () => {
        expect.assertions(20);
        expect(juicer(null)).toEqual(null);
        expect(juicer({ a: true, b: '    ',c:false })).toEqual({ a: true, b: '',c:false });
        expect(juicer({ a: 1, b: '    ' })).toEqual({ a: 1, b: '' });
        expect(juicer({ a: 1, b: '' })).toEqual({ a: 1, b: '' });
        expect(juicer({ a: 1, b: '  123   ' })).toEqual({ a: 1, b: '123' });
        expect(juicer([1, ''])).toEqual([1, '']);
        expect(juicer({ a: [1, undefined] })).toEqual({ a: [1] });
        expect(juicer({ a: [1, undefined, '', '  123   '] })).toEqual({ a: [1, '', '123'] });
        expect(juicer([{ a: 1, b: '' }])).toEqual([{ a: 1, b: '' }]);
        expect(juicer([{ a: 1, b: '', c: undefined, e: '  123   ' }, '', undefined])).toEqual([{ a: 1, b: '', e: '123' }, '']);
        expect(juicer([{ a: [{ b: '  123  ', c: 1, e: 2 }] }, '', undefined])).toEqual([{ a: [{ b: '123', c: 1, e: 2 }] }, '']);
        expect(juicer([1, undefined, undefined])).toEqual([1]);
        expect(juicer({ a: 1, b: undefined })).toEqual({ a: 1 });
        expect(juicer({ a: 1, b: undefined, c: '' })).toEqual({ a: 1, c: '' });
        expect(juicer([1, undefined, ''])).toEqual([1, '']);
        expect(juicer([1, '  123   '])).toEqual([1, '123']);
        expect(juicer({ a: [1, ''] })).toEqual({ a: [1, ''] });
        expect(juicer({ a: [1, undefined, ''] })).toEqual({ a: [1, ''] });
        expect(juicer([{ a: 1, b: undefined }])).toEqual([{ a: 1 }]);
        expect(juicer([{ a: 1, b: '', c: undefined }])).toEqual([{ a: 1, b: '' }]);
    });

});
