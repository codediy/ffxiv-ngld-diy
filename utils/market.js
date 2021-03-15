/**
 * 依赖库:axios
 * apiResList
 * {
    "creatorID": "5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9",
    "lastReviewTime": 1615716785,
    "listingID": "5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9",
    "pricePerUnit": 200,
    "quantity": 99,
    "retainerID": "b777deba4d325bf745f7a0423cabe54549557cec862d09a7c4e1718eb13282bd",
    "sellerID": "44c5f9cc2a9f24c66788590eab8b2758c8ef91874aa000fe3339ffc58eadcd37",
    "stainID": 0,
    "worldName": "HuanYingQunDao",
    "creatorName": "",
    "hq": false,
    "isCrafted": false,
    "materia": [],
    "onMannequin": false,
    "retainerCity": 1,
    "retainerName": "口干",
    "total": 19800
  }
  apiResHistory 
  {
    "hq": false,
    "pricePerUnit": 150,
    "quantity": 10,
    "timestamp": 1615653703,
    "worldName": "HongYuHai",
    "buyerName": "Nenero",
    "total": 1500
  }
  option:{
      callback:res => {},
      hq:false|true
  }
 */
const ffmarket = {
    config: {
        baseApi: "https://universalis.app",
        listApi: "/api/", // /api/:world/:item[?,item]
        dcs: {},//服务器列表
        currentDc: "", //当前服务器id与名称
        axiosInstance: null,
        isInited: false,

        isLoading: false,
        loadingCallback: () => {
            console.log("loading...");
        },
        perNum: 5,//每个物品显示的前几个
        result: [],
        //api请求缓存
        PRICE_CHECK:"price_check",
        HISTORY_CHECK:"history_check",
        //[{id:0,time:0,raw:{}}]
        apiResultCache: [],
        cacheTime: 60, //缓存1分钟内的数据
        isResult: false,
        now: function () {
            return Math.round(new Date() / 1000);
        }
    },
    init(dcIdOrName) {
        ffmarket.config.isInited = false;
        if (this.checkLib() && dcIdOrName.length > 0) {
            ffmarket.config.axiosInstance = axios.create({
                baseURL: ffmarket.baseApi,
            });
            ffmarket.config.currentDc = dcIdOrName;
            ffmarket.config.isInited = true;
        } else {
            console.log("axios erorr or dc error")
        }
    },
    checkLib() {
        if (typeof Vue === undefined
            || typeof axios === undefined) {
            console.log("vue,axios库缺失");
            return false;
        }
        return true;
    },
    setDcs(dcs) {
        ffmarket.currentDc.dcs = dcs;
    },
    setDc(dcIdOrName) {
        ffmarket.config.currentDc = dcIdOrName;
    },
    setResultCacheTime(cacheTime) {
        parseInt(cacheTime) > 0
            ? ffmarket.cacheTime = cacheTime
            : 1000 * 60;//默认60s 一分钟
    },
    setLoadingCallback(callback) {
        if (typeof callback === "function") {
            ffmarket.loadingCallback = callback;
        }
    },
    showLoading() {
        ffmarket.isLoading = true;
        let loadingId = setInterval(() => {
            if (ffmarket.isLoading) {
                if (typeof ffmarket.loadingCallback === "function") {
                    ffmarket.loadingCallback();
                }
            } else {
                clearInterval(loadingId);
            }
        }, 100)
    },
    hideLoading() {
        ffmarket.isLoading = false;
    },
    
    getOnePrice(itemId, option) {
        option.type = ffmarket.config.PRICE_CHECK;
        //单个id转换为多个id
        ffmarket.getManyInfo([1,itemId],option);
    },
    getOneHistory(itemId, option) {
        option.type = ffmarket.config.HISTORY_CHECK;
        //单个id转换为多个id
        ffmarket.getManyInfo([1,itemId],option);
    },
    getManyPrice(itemIds, option) {
        option.type = ffmarket.config.PRICE_CHECK;
        ffmarket.getManyInfo(itemIds,option);
    },
    getManyHistory(itemIds, option) {
        option.type = ffmarket.config.HISTORY_CHECK;
        ffmarket.getManyInfo(itemIds,option);
    },
    getManyInfo(itemIds,option){
        this.getPriceCallback(itemIds, datas => {
            //读取历史数据
            let tempManyResults = [];
            for (const tempItem of datas) {
                //单个数据的获取
                let tempResult = {
                    id: tempItem.itemID,
                    time: tempItem.lastUploadTime,
                    raw: datas,
                    list: [],
                };
                //处理列表与成交历史
                if(option.type == ffmarket.config.PRICE_CHECK && tempItem.listings.length > 0){
                    tempResult.list = ffmarket.handlePrice(tempItem.listings, option);
                }
                if(option.type == ffmarket.config.HISTORY_CHECK && tempItem.recentHistory.length > 0){
                    tempResult.list = ffmarket.handleHistory(tempItem.recentHistory, option);
                }
                tempManyResults.push(tempResult);
            }
            option.callback && typeof option.callback === 'function'
                ? option.callback(tempManyResults)
                : ffmarket.result = tempManyResults;
        },option);
    },
    getPriceCallback(itemIds,callback,option) {
        if (ffmarket.config.isInited) {
            //loading... 
            ffmarket.showLoading();
            //检查缓存
            let checkCacheResult = ffmarket.checkApiCache(itemIds,option);
            console.log("checkCacheResult",checkCacheResult);

            if(checkCacheResult.needApiIds.length > 0){
                //api request
                let url = ffmarket.config.baseApi + ffmarket.config.listApi;
                let checkIds = checkCacheResult.needApiIds;
                if(checkIds.length == 1){ //修正单个数据
                    checkIds.push(1);
                }
                ffmarket.config.axiosInstance
                    .get(url + ffmarket.config.currentDc + "/" + checkIds)
                    .then(res => {
                        ffmarket.hideLoading();
                        if (typeof callback === 'function') {
                            //缓存数据
                            let tempResult = ffmarket.setApiCache(res.data.items,checkCacheResult.data,option);
                            callback(tempResult);
                        }
                    })
                    .catch(function (error) {
                        ffmarket.hideLoading();
                        console.log("getPriceCallback", error);
                    });
            }else{
                ffmarket.hideLoading();
                if (typeof callback === 'function') {
                    callback(checkCacheResult.data);
                }
            }
        }
    },
    handlePrice(rawList, option) {
        let tempResultList = [];
        for (const tempItem of rawList) {
            if (tempResultList.length < ffmarket.config.perNum) {
                //检查是否需要hq
                if (option.hq && !tempItem.hq) {
                    continue;
                }
                tempResultList.push({
                    price: tempItem.pricePerUnit,
                    num: tempItem.quantity,
                    total: tempItem.total,
                    worldName: tempItem.worldName,
                    hq: tempItem.hq
                });
            }
        }
        return tempResultList;
    },
    handleHistory(rawList, option) {
        let tempResultList = [];
        for (const tempItem of rawList) {
            if (tempResultList.length < ffmarket.config.perNum) {
                //检查是否需要hq
                if (option.hq && !tempItem.hq) {
                    continue;
                }
                tempResultList.push({
                    price: tempItem.pricePerUnit,
                    num: tempItem.quantity,
                    total: tempItem.total,
                    worldName: tempItem.worldName,
                    hq: tempItem.hq,
                    time: tempItem.timestamp
                })
            }
        }
        return tempResultList;
    },
    setApiCache(itemsInfo,cacheData,option){

        let now = ffmarket.config.now();
        let tempHq = option.hq ? option.hq : false;

        for (const tempItem of itemsInfo) {
            let tempCacheInfo = {
                id:tempItem.itemID,
                hq:option.hq ? option.hq : false, //是否hq的
                time:now,
                raw:tempItem
            };
            //检查是否已缓存
            let tempIndex = ffmarket.config.apiResultCache.findIndex(d => {
                d.id == tempItem.itemID &&  d.hq == tempHq
            });

            if(tempIndex > 0){
                ffmarket.config.apiResultCache[tempIndex] = tempCacheInfo;
            }else{
                ffmarket.config.apiResultCache.push(tempCacheInfo)
            }
        }
        return cacheData.concat(itemsInfo);
    },
    checkApiCache(itemIds,option) {
        let result = {
            data:[],
            needApiIds:[]
        };
        //检查时间
        let now = ffmarket.config.now();
        let maxCha = ffmarket.config.cacheTime;
        let tempHq = option.hq ? option.hq : false;

        if(ffmarket.config.apiResultCache.length > 0){
            for (const tempItemId of itemIds) {
                let tempIndex = ffmarket.config.apiResultCache.findIndex(d => {
                    return d.id == tempItemId && d.hq == tempHq
                });
                if(tempIndex >= 0 
                    &&  now - ffmarket.config.apiResultCache[tempIndex]["time"] < maxCha //缓存有效
                ){
                    result.data.push(ffmarket.config.apiResultCache[tempIndex]["raw"])
                }else{
                    result.needApiIds.push(tempItemId);
                }
            }
        }else{
            result.needApiIds = itemIds;
        }
        return result;
    },
}
/**
 * test
 */
function testGetOnePrice() {
    console.log("testGetOnePrice");

    let world = "LuXingNiao";
    ffmarket.init(world);
    let itemid = 5393;//紫檀原木

    ffmarket.getOnePrice(itemid, {
        callback: res => {
            console.log("获取的当前价格", res);
        }
    });
    ffmarket.getOnePrice(itemid, {
        callback: res => {
            console.log("获取的当前hq价格", res);
        }, hq: true
    });
}
// testGetOnePrice();
function testCache()
{
    console.log("testCache");

    let world = "LuXingNiao";
    ffmarket.init(world);
    let itemid = 5393;//紫檀原木

    ffmarket.getOnePrice(itemid, {
        callback: res => {
            console.log("获取的当前价格", res);
        }
    });
    ffmarket.getOnePrice(itemid, {
        callback: res => {
            console.log("获取的当前hq价格", res);
        }, hq: true
    });

    setTimeout(() => {
        ffmarket.getOnePrice(itemid, {
            callback: res => {
                console.log("获取的当前价格", res);
            }
        });
        ffmarket.getOnePrice(itemid, {
            callback: res => {
                console.log("获取的当前hq价格", res);
            }, hq: true
        });
    },5000)
    setTimeout(() => {
        ffmarket.getOnePrice(itemid, {
            callback: res => {
                console.log("获取的当前价格", res);
            }
        });
        ffmarket.getOnePrice(itemid, {
            callback: res => {
                console.log("获取的当前hq价格", res);
            }, hq: true
        });
    },10000)
}
// testCache();
function testGetOneHistory() {
    console.log("testGetOneHistory");
    let world = "LuXingNiao";
    ffmarket.init(world);
    let itemid = 5393;//紫檀原木
    ffmarket.getOneHistory(itemid, {
        callback: res => {
            console.log("获取历史成交", res);
        }
    });
    ffmarket.getOneHistory(itemid, {
        callback: res => {
            console.log("获取历史成交", res);
        }, hq: true
    });
}
// testGetOneHistory();
function testGetManyPrice() {
   
    console.log("testGetManyPrice");
    let world = "LuXingNiao";
    ffmarket.init(world);

    let itemid = [5393, 5386];//紫檀原木
    ffmarket.getManyPrice(itemid, {
        callback: res => {
            console.log("获取的当前价格", res);
        }
    });
    ffmarket.getManyPrice(itemid, {
        callback: res => {
            console.log("获取的当前价格", res);
        }, hq: true
    });
}
// testGetManyPrice();
function testGetManyHistory() {
    console.log("testGetManyHistory");
    let world = "LuXingNiao";
    ffmarket.init(world);

    let itemid = [5393, 5386];//紫檀原木
    ffmarket.getManyHistory(itemid, {
        callback: res => {
            console.log("获取历史成交", res);
        }
    });
    ffmarket.getManyHistory(itemid, {
        callback: res => {
            console.log("获取历史成交", res);
        }, hq: true
    });
}
// testGetManyHistory();