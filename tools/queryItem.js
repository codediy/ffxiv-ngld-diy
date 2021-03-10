/**
 * data = {
 *      node:采矿点
 *      maps:地图
 *      node_items:采矿点的矿物
 *      item_attributes:矿物信息
 * }
 */
const data = require("../data/Data.5.3");
/**
 * 获取maps中的地图区域
 * @param {*} mapsData 
 * @returns 
 */
function getRegion(mapsData)
{
    let regionIds = [];
    let regions = [];
    for (const key in mapsData) {
        if (Object.hasOwnProperty.call(mapsData, key)) {
            const mapItem = mapsData[key];
            if(regionIds.indexOf(mapItem.region_id) < 0){
                regionIds.push(mapItem.region_id);
                regions.push({region_id:mapItem.region_id,region_name:mapItem.region_name});
            }
        }
    }
    return regions;
}

/**
 * 获取特定区域下的地图
 * @param {*} regionId 
 * @param [] mapsData 
 * @returns 
 */
function getRegionMaps(regionId,mapsData)
{   
    let maps = [];
    for (const key in mapsData) {
        if (Object.hasOwnProperty.call(mapsData, key)) {
            const mapItem = mapsData[key];
            if(mapItem.region_id == regionId){
                maps.push({
                    id:mapItem.id,
                    name:mapItem.place_name
                });
            }
        }
    }
    return maps;
}

/**
 * 获取地图的资源信息
 * @param {*} mapId 
 * @param {*} items 
 */
function getMapItem(mapId,nodes,nodeItems,itemAttrs)
{   
    let items = {
        0:[],1:[],2:[],3:[],4:[],5:[],6:[],7:[],8:[],9:[],10:[],11:[],12:[],
        13:[],14:[],15:[],16:[],17:[],18:[],19:[],20:[],21:[],22:[],23:[],24:[]
    };
    //读取地图的采矿点
    for (const nodeK in nodes) {
        if (Object.hasOwnProperty.call(nodes, nodeK)) {
            const tempNode = nodes[nodeK];
            if(tempNode.map_id == mapId){
                // 采矿点时间段
                let tempDuration = tempNode.duration;
                //读取采矿点的矿物
                let tempNodeItem = [];
                const tempItems = nodeItems[tempNode.id];
                for (const hiddenItem of tempItems["hidden"]) {
                    tempNodeItem.push(itemAttrs[hiddenItem["item_id"]]);
                }
                for (const listItem of tempItems["list"]) {
                    tempNodeItem.push(itemAttrs[listItem["item_id"]]);
                }
                if(!Object.hasOwnProperty.call(items, tempDuration)){
                    Object.defineProperty(items,tempDuration,{
                        value:[]
                    })
                }
                items[tempDuration].push({
                    node:tempNode,
                    list:tempNodeItem,
                });
            }
        }
    }
    return items;
}

function testGetRegionMaps()
{
    console.log(getRegionMaps(23,data.maps));
}
function testGetMapItem()
{
    p(
        getMapItem(492,data.nodes,data.node_items,data.item_attributes),"json"
    )
}
function p(o) {
    console.log(JSON.stringify(o,"",2));
}

// testGetRegionMaps();
// testGetMapItem();