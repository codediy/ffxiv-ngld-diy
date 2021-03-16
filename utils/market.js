/**
 * 依赖库:<script src="https://cdn.bootcdn.net/ajax/libs/axios/0.21.1/axios.min.js"></script>
 * example
 *       let world = "LuXingNiao";
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
      hq:false|true,
      eachWorld:false|true
  }
 */
const dcs = {
    "Aether": ["Adamantoise", "Cactuar", "Faerie", "Gilgamesh", "Jenova", "Midgardsormr", "Sargatanas", "Siren"],
    "Chaos": ["Cerberus", "Louisoix", "Moogle", "Omega", "Ragnarok", "Spriggan"],
    "Crystal": ["Balmung", "Brynhildr", "Coeurl", "Diabolos", "Goblin", "Malboro", "Mateus", "Zalera"],
    "Elemental": ["Aegis", "Atomos", "Carbuncle", "Garuda", "Gungnir", "Kujata", "Ramuh", "Tonberry", "Typhon", "Unicorn"],
    "Gaia": ["Alexander", "Bahamut", "Durandal", "Fenrir", "Ifrit", "Ridill", "Tiamat", "Ultima", "Valefor", "Yojimbo", "Zeromus"],
    "Light": ["Lich", "Odin", "Phoenix", "Shiva", "Zodiark", "Twintania"],
    "Mana": ["Anima", "Asura", "Belias", "Chocobo", "Hades", "Ixion", "Mandragora", "Masamune", "Pandaemonium", "Shinryu", "Titan"],
    "Primal": ["Behemoth", "Excalibur", "Exodus", "Famfrit", "Hyperion", "Lamia", "Leviathan", "Ultros"],
    "陆行鸟": ["HongYuHai", "ShenYiZhiDi", "LaNuoXiYa", "HuanYingQunDao", "MengYaChi", "YuZhouHeYin", "WoXianXiRan", "ChenXiWangZuo"],
    "莫古力": ["BaiYinXiang", "BaiJinHuanXiang", "ShenQuanHen", "ChaoFengTing", "LvRenZhanQiao", "FuXiaoZhiJian", "Longchaoshendian", "MengYuBaoJing"],
    "猫小胖": ["ZiShuiZhanQiao", "YanXia", "JingYuZhuangYuan", "MoDuNa", "HaiMaoChaWu", "RouFengHaiWan", "HuPoYuan"],
    "LuXingNiao": ["HongYuHai", "ShenYiZhiDi", "LaNuoXiYa", "HuanYingQunDao", "MengYaChi", "YuZhouHeYin", "WoXianXiRan", "ChenXiWangZuo"],
    "MoGuLi": ["BaiYinXiang", "BaiJinHuanXiang", "ShenQuanHen", "ChaoFengTing", "LvRenZhanQiao", "FuXiaoZhiJian", "Longchaoshendian", "MengYuBaoJing"],
    "MaoXiaoPang": ["ZiShuiZhanQiao", "YanXia", "JingYuZhuangYuan", "MoDuNa", "HaiMaoChaWu", "RouFengHaiWan", "HuPoYuan"]
};

const ffChsName = {
    "23": {"region": "global", "en": "Asura"},
    "24": {"region": "global", "en": "Belias"},
    "28": {"region": "global", "en": "Pandaemonium"},
    "29": {"region": "global", "en": "Shinryu"},
    "30": {"region": "global", "en": "Unicorn"},
    "31": {"region": "global", "en": "Yojimbo"},
    "32": {"region": "global", "en": "Zeromus"},
    "33": {"region": "global", "en": "Twintania"},
    "34": {"region": "global", "en": "Brynhildr"},
    "35": {"region": "global", "en": "Famfrit"},
    "36": {"region": "global", "en": "Lich"},
    "37": {"region": "global", "en": "Mateus"},
    "39": {"region": "global", "en": "Omega"},
    "40": {"region": "global", "en": "Jenova"},
    "41": {"region": "global", "en": "Zalera"},
    "42": {"region": "global", "en": "Zodiark"},
    "43": {"region": "global", "en": "Alexander"},
    "44": {"region": "global", "en": "Anima"},
    "45": {"region": "global", "en": "Carbuncle"},
    "46": {"region": "global", "en": "Fenrir"},
    "47": {"region": "global", "en": "Hades"},
    "48": {"region": "global", "en": "Ixion"},
    "49": {"region": "global", "en": "Kujata"},
    "50": {"region": "global", "en": "Typhon"},
    "51": {"region": "global", "en": "Ultima"},
    "52": {"region": "global", "en": "Valefor"},
    "53": {"region": "global", "en": "Exodus"},
    "54": {"region": "global", "en": "Faerie"},
    "55": {"region": "global", "en": "Lamia"},
    "56": {"region": "global", "en": "Phoenix"},
    "57": {"region": "global", "en": "Siren"},
    "58": {"region": "global", "en": "Garuda"},
    "59": {"region": "global", "en": "Ifrit"},
    "60": {"region": "global", "en": "Ramuh"},
    "61": {"region": "global", "en": "Titan"},
    "62": {"region": "global", "en": "Diabolos"},
    "63": {"region": "global", "en": "Gilgamesh"},
    "64": {"region": "global", "en": "Leviathan"},
    "65": {"region": "global", "en": "Midgardsormr"},
    "66": {"region": "global", "en": "Odin"},
    "67": {"region": "global", "en": "Shiva"},
    "68": {"region": "global", "en": "Atomos"},
    "69": {"region": "global", "en": "Bahamut"},
    "70": {"region": "global", "en": "Chocobo"},
    "71": {"region": "global", "en": "Moogle"},
    "72": {"region": "global", "en": "Tonberry"},
    "73": {"region": "global", "en": "Adamantoise"},
    "74": {"region": "global", "en": "Coeurl"},
    "75": {"region": "global", "en": "Malboro"},
    "76": {"region": "global", "en": "Tiamat"},
    "77": {"region": "global", "en": "Ultros"},
    "78": {"region": "global", "en": "Behemoth"},
    "79": {"region": "global", "en": "Cactuar"},
    "80": {"region": "global", "en": "Cerberus"},
    "81": {"region": "global", "en": "Goblin"},
    "82": {"region": "global", "en": "Mandragora"},
    "83": {"region": "global", "en": "Louisoix"},
    "85": {"region": "global", "en": "Spriggan"},
    "90": {"region": "global", "en": "Aegis"},
    "91": {"region": "global", "en": "Balmung"},
    "92": {"region": "global", "en": "Durandal"},
    "93": {"region": "global", "en": "Excalibur"},
    "94": {"region": "global", "en": "Gungnir"},
    "95": {"region": "global", "en": "Hyperion"},
    "96": {"region": "global", "en": "Masamune"},
    "97": {"region": "global", "en": "Ragnarok"},
    "98": {"region": "global", "en": "Ridill"},
    "99": {"region": "global", "en": "Sargatanas"},
    "161": {"region": "global", "en": "Chocobo"},
    "166": {"region": "global", "en": "Moogle"},
    "1042": {"region": "cn", "name": "拉诺西亚", "en": "LaNuoXiYa"},
    "1043": {"region": "cn", "name": "紫水栈桥", "en": "ZiShuiZhanQiao"},
    "1044": {"region": "cn", "name": "幻影群岛", "en": "HuanYingQunDao"},
    "1045": {"region": "cn", "name": "摩杜纳", "en": "MoDuNa"},
    "1060": {"region": "cn", "name": "萌芽池", "en": "MengYaChi"},
    "1076": {"region": "cn", "name": "白金幻象", "en": "BaiJinHuanXiang"},
    "1081": {"region": "cn", "name": "神意之地", "en": "ShenYiZhiDi"},
    "1106": {"region": "cn", "name": "静语庄园", "en": "JingYuZhuangYuan"},
    "1113": {"region": "cn", "name": "旅人栈桥", "en": "LvRenZhanQiao"},
    "1121": {"region": "cn", "name": "拂晓之间", "en": "FuXiaoZhiJian"},
    "1166": {"region": "cn", "name": "龙巢神殿", "en": "Longchaoshendian"},
    "1167": {"region": "cn", "name": "红玉海", "en": "HongYuHai"},
    "1168": {"region": "cn", "name": "黄金港", "en": "HuangJinGang"},
    "1169": {"region": "cn", "name": "延夏", "en": "YanXia"},
    "1170": {"region": "cn", "name": "潮风亭", "en": "ChaoFengTing"},
    "1171": {"region": "cn", "name": "神拳痕", "en": "ShenQuanHen"},
    "1172": {"region": "cn", "name": "白银乡", "en": "BaiYinXiang"},
    "1173": {"region": "cn", "name": "宇宙和音", "en": "YuZhouHeYin"},
    "1174": {"region": "cn", "name": "沃仙曦染", "en": "WoXianXiRan"},
    "1175": {"region": "cn", "name": "晨曦王座", "en": "ChenXiWangZuo"},
    "1176": {"region": "cn", "name": "梦羽宝境", "en": "MengYuBaoJing"},
    "1177": {"region": "cn", "name": "海猫茶屋", "en": "HaiMaoChaWu"},
    "1178": {"region": "cn", "name": "柔风海湾", "en": "RouFengHaiWan"},
    "1179": {"region": "cn", "name": "琥珀原", "en": "HuPoYuan"}
};


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
        perNum: 8,//每个物品显示的前几个
        result: [],
        //api请求缓存
        /**
         * option {
         *     dc:"LuXingNiao",//重置dc区
         *     hq:true|false,
         *     callback:(res) => {}
         * }
         */
        isHq: false,//是否只查询HQ
        resCallback: (res) => {
            console.log("res", res)
        }, //查询回调函数
        checkType: "price_check",//list/history
        PRICE_CHECK: "price_check",
        HISTORY_CHECK: "history_check",
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
        if (this.checkLib()) {
            ffmarket.config.axiosInstance = axios.create({
                baseURL: ffmarket.baseApi,
            });
            if (dcIdOrName) {
                ffmarket.config.currentDc = dcIdOrName;
            }
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
        ffmarket.handleOption(option);
        ffmarket.config.checkType = ffmarket.config.PRICE_CHECK;
        //单个id转换为多个id
        ffmarket.getManyInfo([1, itemId]);
    },
    getOneHistory(itemId, option) {
        ffmarket.handleOption(option);
        ffmarket.config.checkType = ffmarket.config.HISTORY_CHECK;
        //单个id转换为多个id
        ffmarket.getManyInfo([1, itemId]);
    },
    getManyPrice(itemIds, option) {
        ffmarket.handleOption(option);
        ffmarket.config.checkType = ffmarket.config.PRICE_CHECK;
        ffmarket.getManyInfo(itemIds);
    },
    getManyHistory(itemIds, option) {
        ffmarket.handleOption(option);
        ffmarket.config.checkType = ffmarket.config.HISTORY_CHECK;
        ffmarket.getManyInfo(itemIds);
    },
    /**
     * 参数处理
     * @param option
     */
    handleOption(option) {
        if (option.dc) {
            if (dcs.hasOwnProperty(option.dc)
                && Array.isArray(dcs[option.dc])) {
                ffmarket.config.currentDc = option.dc;
            } else {
                ffmarket.err("dc error", dc)
            }
        }
        if (option.hq) {
            ffmarket.config.isHq = true;
        } else {
            ffmarket.config.isHq = false;
        }
        if (option.callback) {
            if (typeof option.callback) {
                ffmarket.config.resCallback = option.callback
            } else {
                ffmarket.err("callback error");
            }
        }
    },
    getManyInfo(itemIds) {
        this.getPriceCallback(itemIds, datas => {
            //读取历史数据
            let tempManyResults = {
                raw: datas, //原始列表数据
                result: [],
            };
            for (const tempItem of datas) {
                //单个数据的获取
                let tempResult = {
                    id: tempItem.itemID,
                    time: tempItem.lastUploadTime,
                    list: [],
                };
                //处理列表与成交历史
                if (ffmarket.config.checkType == ffmarket.config.PRICE_CHECK
                    && tempItem.listings.length > 0) {
                    tempResult.list = ffmarket.handlePrice(tempItem.listings);
                }
                if (ffmarket.config.checkType == ffmarket.config.HISTORY_CHECK
                    && tempItem.recentHistory.length > 0) {
                    tempResult.list = ffmarket.handleHistory(tempItem.recentHistory);
                }
                tempManyResults.result.push(tempResult);
            }
            ffmarket.config.result = tempManyResults;
            //回调处理
            ffmarket.config.resCallback(tempManyResults);
        });
    },
    getPriceCallback(itemIds, callback) {
        if (ffmarket.config.isInited) {
            //loading... 
            ffmarket.showLoading();
            //检查缓存
            let checkCacheResult = ffmarket.checkApiCache(itemIds);
            console.log("checkCacheResult", checkCacheResult);
            if (checkCacheResult.needApiIds.length > 0) {
                //api request
                let url = ffmarket.config.baseApi + ffmarket.config.listApi + ffmarket.config.currentDc + "/";
                console.log("api", url);
                let checkIds = checkCacheResult.needApiIds;
                if (checkIds.length == 1) { //修正单个数据
                    checkIds.push(1);
                }
                ffmarket.config.axiosInstance
                    .get(url + checkIds)
                    .then(res => {
                        ffmarket.hideLoading();
                        if (typeof callback === 'function') {
                            //缓存数据
                            let tempResult = ffmarket.setApiCache(res.data.items, checkCacheResult.data);
                            callback(tempResult);
                        }
                    })
                    .catch(function (error) {
                        ffmarket.hideLoading();
                        console.log("getPriceCallback", error);
                    });
            } else {
                ffmarket.hideLoading();
                if (typeof callback === 'function') {
                    callback(checkCacheResult.data);
                }
            }
        }
    },
    /**
     *
     * @param rawList
     * @param option
     * @returns {[]}
     */
    handlePrice(rawList) {
        let tempResultList = {"dc": [], "world": []};
        for (const tempItem of rawList) {
            if (tempResultList.dc.length < ffmarket.config.perNum) {
                //检查是否需要hq
                if (ffmarket.config.isHq && !tempItem.hq) {
                    continue;
                }
                let tempWorld = tempItem.worldName ? tempItem.worldName : ffmarket.config.currentDc;
                tempResultList.dc.push({
                    price: tempItem.pricePerUnit,
                    num: tempItem.quantity,
                    total: tempItem.total,
                    worldName: ffmarket.handleWorldName(tempWorld),
                    hq: tempItem.hq
                });
            }
        }
        //取出每个区的
        tempResultList.world = ffmarket.handleWorldData(rawList);
        return tempResultList;
    },

    handleHistory(rawList) {
        let tempResultList = {"dc": [], "world": []};
        for (const tempItem of rawList) {
            if (tempResultList.dc.length < ffmarket.config.perNum) {
                //检查是否需要hq
                if (ffmarket.config.isHq && !tempItem.hq) {
                    continue;
                }
                let tempWorld = tempItem.worldName ? tempItem.worldName : ffmarket.config.currentDc;
                tempResultList.dc.push({
                    price: tempItem.pricePerUnit,
                    num: tempItem.quantity,
                    total: tempItem.total,
                    worldName: ffmarket.handleWorldName(tempWorld),
                    hq: tempItem.hq,
                    time: tempItem.timestamp
                })
            }
        }
        //取出每个区的
        tempResultList.world = ffmarket.handleWorldData(rawList);
        return tempResultList;
    },
    handleWorldName(worldName) {
        let tempWorld = worldName ? worldName : ffmarket.config.currentDc;
        let tempChsName = tempWorld;
        let chsNameIndex = Object.values(ffChsName).findIndex(d => d.en == worldName);
        if (chsNameIndex >= 0) {
            tempChsName = Object.values(ffChsName)[chsNameIndex]["name"];
        }
        return tempChsName;
    },
    handleWorldData(rawList) {
        let result = [];//[{world:[],data:[]}]
        let worlds = dcs[ffmarket.config.currentDc];
        for (const tempWorld of worlds) {
            let tempWorldResult = {
                world: ffmarket.handleWorldName(tempWorld),
                data: []
            };
            tempWorldResult.data.push(rawList
                .filter(d => {
                    return d.worldName === tempWorld && d.hq === ffmarket.config.isHq;
                })
                .map(tempItem => {
                    if(ffmarket.config.checkType == ffmarket.config.PRICE_CHECK){
                        return {
                            price: tempItem.pricePerUnit,
                            num: tempItem.quantity,
                            total: tempItem.total,
                            worldName: ffmarket.handleWorldName(tempWorld),
                            hq: tempItem.hq
                        }
                    }
                    if(ffmarket.config.checkType == ffmarket.config.HISTORY_CHECK){
                        return {
                            price: tempItem.pricePerUnit,
                            num: tempItem.quantity,
                            total: tempItem.total,
                            worldName: ffmarket.handleWorldName(tempWorld),
                            hq: tempItem.hq,
                            time: tempItem.timestamp
                        }
                    }
                })
            );
            result.push(tempWorldResult);
        }
        return result;
    },
    setApiCache(itemsInfo, cacheData) {

        let now = ffmarket.config.now();
        for (const tempItem of itemsInfo) {
            let tempCacheInfo = {
                id: tempItem.itemID,
                hq: ffmarket.config.isHq, //是否hq的
                time: now,
                raw: tempItem
            };
            //检查是否已缓存
            let tempIndex = ffmarket.config.apiResultCache.findIndex(d => {
                return d.id === tempItem.itemID && d.hq === ffmarket.config.isHq
            });

            if (tempIndex > 0) {
                ffmarket.config.apiResultCache[tempIndex] = tempCacheInfo;
            } else {
                ffmarket.config.apiResultCache.push(tempCacheInfo)
            }
        }
        return cacheData.concat(itemsInfo);
    },
    checkApiCache(itemIds) {
        let result = {
            data: [],
            needApiIds: []
        };
        //检查时间
        let now = ffmarket.config.now();
        let maxCha = ffmarket.config.cacheTime;

        if (ffmarket.config.apiResultCache.length > 0) {
            for (const tempItemId of itemIds) {
                let tempIndex = ffmarket.config.apiResultCache.findIndex(d => {
                    return d.id === tempItemId && d.hq === ffmarket.config.isHq
                });
                if (tempIndex >= 0
                    && now - ffmarket.config.apiResultCache[tempIndex]["time"] < maxCha //缓存有效
                ) {
                    result.data.push(ffmarket.config.apiResultCache[tempIndex]["raw"])
                } else {
                    result.needApiIds.push(tempItemId);
                }
            }
        } else {
            result.needApiIds = itemIds;
        }
        return result;
    },

    err(...msg) {
        console.log(msg);
    },
}

exportToGlobal(ffmarket, "ffmarket")

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
function testCache() {
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
    }, 5000)
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
    }, 10000)
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

