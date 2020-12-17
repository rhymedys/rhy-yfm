/*
 * @Author: Rhymedys/Rhymedys@gmail.com
 * @Date: 2019-10-18 15:22:41
 * @Last Modified by: Rhymedys
 * @Last Modified time: 2020-12-17 14:13:48
 */

export function mapImg(strDom) {
  return strDom
    .replace(/src="\{.*?\}"/g, (match) => {
      return match.replace(/\{.*?\}/g, (idTemplate) => {
        const id = idTemplate.substr(1, idTemplate.length - 2)
        return `//zentao.mhealth100.com/zentaopms/www/file-read-${id}`
      })
    })
    .replace(/<img/g, (match) => {
      return `${match} style="max-width:100%;"`
    })
    .replace(/<img.*?>/g, (match) => {
      let src = match.match(/src=".*?"/)[0]
      src = src.replace(/src="/, '').replace('"$', '')
      return `<a href="${src}" target="_Blank">${match}</a>`
    })
}
