## 数据源的获取

0. 相关网站
- [中文wiki]
- [garlandtools数据网站]
- [ffxiv-teamcraft数据提取接口]
- [cafemaker中文数据读取](https://cafemaker.wakingsands.com)
- [素素资料](https://www.ffxiv.cn/)
- [配方相关](http://www.ffxiv.xin/)
- [v5+](http://5p.nbb.ffxiv.cn/#/cal)
- [宝の工具箱(预览版)](http://box.nbb.ffxiv.cn/#/home)

1. 物品信息获取流程
- 中文wiki搜索相关物品
- garlandtools获取英文信息
- ffxiv-teamcraft获取相关数据与xivapi接口
- 切换到cafemaker获取相关数据

2. 生产资料 
- 重建伊修加德收藏品
  1. 从collectables.json根据天穹振兴票获取收藏品物品id
  2. 根据收藏品物品id从recipes.json获取配方
- 天钢工具
- 主要套装 480hq 490hq 

3. 板子悬浮窗

触发机制
    initMakert() 鼠标滑过带有属性diy-market-id="xx"的标签

整体设计 
    简单页面  显示最近5个成交信息,
    详情页面  显示各个服务器的板子的价格信息
