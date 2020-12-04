/*
 * @Author: louzhedong
 * @Date: 2020-12-03 15:10:43
 * @LastEditors: louzhedong
 * @LastEditTime: 2020-12-03 15:23:56
 * @Description: 描述
 */

class SetScriptTimestampPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap(
      'SetScriptTimestampPlugin',
      (compilation, callback) => {
        compilation.plugin(
          'html-webpack-plugin-before-html-processing',
          function (htmlPluginData, callback) {
            // 读取并修改 script 上 src 列表
            let jsScr = htmlPluginData.assets.js[0];
            htmlPluginData.assets.js = [];
            let result = `
                <script>
                    let scriptDOM = document.createElement("script");
                    let jsScr = "./${jsScr}";
                    scriptDOM.src = jsScr + "?" + new Date().getTime();
                    document.body.appendChild(scriptDOM)
                </script>
            `;
            let resultHTML = htmlPluginData.html.replace(
              '<!--SetScriptTimestampPlugin inset script-->',
              result
            );
            // 返回修改后的结果
            htmlPluginData.html = resultHTML;
          }
        );
      }
    );
  }
}

module.exports = SetScriptTimestampPlugin;
