LyFM PHP文件管理器
=================================================

LyFM 是一个基于PHP的个人网站文件管理器，采用完全Ajax操作，实现高效的在线文件管理。


## 使用说明

* 首次使用请配置config.php文件
* 修改默认密码
* 建议将程序放在file目录下，nginx和apache伪静态配置请参考范例，IIS请使用PATH_INFO访问。
* 默认访问形式为 http://127.0.0.1/file/index.php/ 请主动添加后缀
* 如果需要修改程序目录请相应修改伪静态规则
* 如果需要增加对其他文本格式的编辑支持，可手动修改js目录下的`LyApi.js`的第一个TextFileExtenName数组
* 如果访问首页跳转到404页面的，如果支持PATH_INFO请主动添加`/index.php/`来访问，否则节哀。

## LyFM主页

http://www.loveyu.net/LyFm

## 反馈地址

http://www.loveyu.org/2429.html