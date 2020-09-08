/*
 * @Author: Rhymedys/Rhymedys@gmail.com
 * @Date: 2019-08-11 22:40:37
 * @Last Modified by: Rhymedys
 * @Last Modified time: 2019-08-30 15:56:37
 */

export const none = ''
export const no = '0'
export const yes = '1'
export const noDigit = 0
export const yesDigit = 1

// const value = [
//   {
//     desc: '否',
//     color: 'red'
//   },
//   {
//     desc: '否',
//     color: 'red'
//   },
//   {
//     desc: '是',
//     color: 'green'
//   },
//   {
//     desc: '否',
//     color: 'red'
//   },
//   {
//     desc: '是',
//     lab: 'green'
//   }
// ]

export default {
  [none]: {
    desc: '否',
    color: 'red',
  },
  [no]: {
    desc: '否',
    color: 'red',
  },
  [yes]: {
    desc: '是',
    color: 'green',
  },
  [noDigit]: {
    desc: '否',
    color: 'red',
  },
  [yesDigit]: {
    desc: '是',
    color: 'green',
  },
}
