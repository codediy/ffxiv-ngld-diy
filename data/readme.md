## 数据源
1. Data.5.3.js          采集数据    参考[素素采集](https://caiji.ffxiv.cn/#/) 
2. collectables.json    收藏品奖励  参考[teamcraft](https://github.com/ffxiv-teamcraft/ffxiv-teamcraft) 

## 目录内容
- [teamcraft](https://github.com/ffxiv-teamcraft/ffxiv-teamcraft) 游戏数据包的解析读取
- [matcha](https://github.com/thewakingsands/matcha) 网络数据包的读取与解析     

## 网络数据包
- [ff14网络抓包分析]
- [服务器模拟器]
- [matcha数据包事件]
- [ngld悬浮窗事件]

## 悬浮窗插件的层次
- cactbot悬浮窗/matchaoverlay   基于底层事件触发器的悬浮窗，cactbot基于ngld,matcha是配套的
- ngld悬浮窗/matcha             内存与网络事件获取与触发，ngld悬浮窗与matcha独立的        
- FFXIV_ACT_PLUGIN              数据包解析插插件 
- ACT                           最底层

## 两个事件触发器插件
- ngld悬浮窗,可以使用web网页编写插件
- matcha事件触发器,可以在ngld的debug工具中获取到(待测试