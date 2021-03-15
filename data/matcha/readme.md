## 重要文件
- [项目地址](https://github.com/thewakingsands/matcha)
- 网络操作码(\matcha-master\Cafe.Matcha\Constant\MatchaOpcode)
- 触发事件参数(\matcha-master\Cafe.Matcha\Network\NetworkMonitor)

## 网络操作码
```c#
internal enum MatchaOpcode
    {
        ActorControlSelf,
        CEDirector,
        CompanyAirshipStatus,
        CompanySubmersibleStatus,
        ContentFinderNotifyPop,
        DirectorStart,
        EventPlay,
        Examine,
        InitZone,
        InventoryTransaction,
        ItemInfo,
        MarketBoardItemListing,
        MarketBoardItemListingCount,
        MarketBoardItemListingHistory,
        PlayerSetup,
        PlayerSpawn,
    }
```
- 相关操作码
- ActorControlSelf, 玩家控制
- CEDirector,
- CompanyAirshipStatus,
- CompanySubmersibleStatus,
- ContentFinderNotifyPop,
- DirectorStart,
- EventPlay,
- Examine,
- InitZone,
- InventoryTransaction,
- ItemInfo,
- MarketBoardItemListing,          板子相关
- MarketBoardItemListingCount,     板子相关
- MarketBoardItemListingHistory,   板子相关
- PlayerSetup,
- PlayerSpawn,


```c#
public static Dictionary<ushort, MatchaOpcode> Global = new Dictionary<ushort, MatchaOpcode>
{
    { 0x03d5, MatchaOpcode.ActorControlSelf },
    { 0x01f5, MatchaOpcode.CEDirector },
    { 0x0206, MatchaOpcode.CompanyAirshipStatus },
    { 0x013b, MatchaOpcode.CompanySubmersibleStatus },
    { 0x026e, MatchaOpcode.ContentFinderNotifyPop },
    { 0x01d8, MatchaOpcode.DirectorStart },
    { 0x0276, MatchaOpcode.EventPlay },
    { 0x0261, MatchaOpcode.Examine },
    { 0x0233, MatchaOpcode.InitZone },
    { 0x02ee, MatchaOpcode.InventoryTransaction },
    { 0x0175, MatchaOpcode.ItemInfo },
    { 0x016b, MatchaOpcode.MarketBoardItemListing },
    { 0x00c0, MatchaOpcode.MarketBoardItemListingCount },
    { 0x01c3, MatchaOpcode.MarketBoardItemListingHistory },
    { 0x01e9, MatchaOpcode.PlayerSetup },
    { 0x01ab, MatchaOpcode.PlayerSpawn },
};
public static Dictionary<ushort, MatchaOpcode> China = new Dictionary<ushort, MatchaOpcode>
{
    { 0x007c, MatchaOpcode.ActorControlSelf },
    { 0x0144, MatchaOpcode.CEDirector },
    { 0x0271, MatchaOpcode.CompanyAirshipStatus },
    { 0x0345, MatchaOpcode.CompanySubmersibleStatus },
    { 0x02d0, MatchaOpcode.ContentFinderNotifyPop },
    { 0x02f2, MatchaOpcode.DirectorStart },
    { 0x01b9, MatchaOpcode.EventPlay },
    { 0x0316, MatchaOpcode.Examine },
    { 0x02d2, MatchaOpcode.InitZone },
    { 0x00a8, MatchaOpcode.InventoryTransaction },
    { 0x031a, MatchaOpcode.ItemInfo },
    { 0x0158, MatchaOpcode.MarketBoardItemListing },
    { 0x0280, MatchaOpcode.MarketBoardItemListingCount },
    { 0x01f3, MatchaOpcode.MarketBoardItemListingHistory },
    { 0x01f9, MatchaOpcode.PlayerSetup },
    { 0x00d1, MatchaOpcode.PlayerSpawn },
};
```
- Global国际服,China国服

## 事件参数
```c#
if (opcode == MatchaOpcode.MarketBoardItemListingCount)
{
    if (message.Length != 48)
    {
        return;
    }

    var itemId = BitConverter.ToUInt32(data, 0);
    var count = data[0x0B];

    FireEvent(new MarketBoardItemListingCountDTO()
    {
        Item = (int)itemId,
        Count = count,
        World = State.Instance.WorldId
    });
    ThreadPool.QueueUserWorkItem(o => Universalis.Client.QueryItem(State.Instance.WorldId, itemId, FireEvent));
}
```
- MarketBoardItemListingCount 板子的数据查询
- `ThreadPool.QueueUserWorkItem`查找价格信息后调用`FireEvent`传入相关的数据
