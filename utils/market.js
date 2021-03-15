/**
 * 依赖库:axios,vue
 * apiReslist 
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
    config:{
        baseApi:"https://universalis.app",
        listApi:"/api/", // /api/:world/:item[?,item]
        worlds:{},//服务器列表
        hoverAttr:"ff-market-id",//触发属性
        axiosInstance:null,

        isLoading:false,
        loadingCallback:() => {
            console.log("loading...");
        },

        perNum:5,//每个物品显示的前几个
        result:[],
        isResult:false,
    },
    init(){
        if(this.checkLib()){
            ffmarket.config.axiosInstance = axios.create({
                baseURL: ffmarket.baseApi,
            });
        }
    },
    checkLib(){
        if(typeof Vue === undefined
        || typeof axios === undefined){
            console.log("vue,axios库缺失");
            return false;
        }
        return true;
    },
    setDc(){

    },
    setLoadingCallback(callback){
        if(typeof callback === "function"){
            ffmarket.loadingCallback = callback;
        }
    },
    showLoading()
    {
        ffmarket.isLoading = true;
        let loadingId = setInterval(()=>{
            if(ffmarket.isLoading){
                if(typeof ffmarket.loadingCallback === "function"){
                    ffmarket.loadingCallback();
                }
            }else{
                clearInterval(loadingId);
            }
        },100)
    },
    hideLoading()
    {
        ffmarket.isLoading = false;
    },
    getPriceCallback(url,world,item,callback)
    {
        if(this.checkLib() ){
            //loading... 
            ffmarket.showLoading();
            //api request
            ffmarket.config.axiosInstance
            .get(url+world+"/"+item)
            .then(res => {
                ffmarket.hideLoading();
                // console.log("res",res);
                if(typeof callback === 'function'){
                    callback(res.data);
                }
            })
            .catch(function (error) {
                ffmarket.hideLoading();
                console.log("getPriceCallback",error);
            });
        }
    },
    getOnePrice(world,itemId,option)
    {   
        let url = ffmarket.config.baseApi + ffmarket.config.listApi;
        this.getPriceCallback(url,world,itemId,res => {
            //读取单个价格的前n个数据
            let tempResult = {
                id:res.itemID,
                time:res.lastUploadTime,
                list:ffmarket.handlePrice(res.listings,option),
                raw:res,
            };
            option.callback && typeof option.callback === 'function'
            ? option.callback(tempResult)
            : ffmarket.result = tempResult;
        });
    },
    getManyPrice(world,itemIds,option)
    {
        let url = ffmarket.config.baseApi + ffmarket.config.listApi;
        this.getPriceCallback(url,world,itemIds.join(","),res => {
            //读取历史数据
            let tempManyResults = [];
            for (const tempItem of res.items) {
                 //单个数据的获取
                 let tempResult = {
                    id:tempItem.itemID,
                    time:tempItem.lastUploadTime,
                    list:ffmarket.handlePrice(tempItem.listings,option),
                    raw:res,
                };
                tempManyResults.push(tempResult);
            }
            option.callback && typeof option.callback === 'function'
            ? option.callback(tempManyResults)
            : ffmarket.result = tempManyResults;
        });
    },
    getOneHistory(world,itemId,option)
    {   
        let url = ffmarket.config.baseApi + ffmarket.config.listApi;
        this.getPriceCallback(url,world,itemId,res => {
            //读取单个数据
            //读取单个价格的前n个数据
            let tempResult = {
                id:res.itemID,
                time:res.lastUploadTime,
                list:ffmarket.handleHistory(res.recentHistory,option),
                raw:res,
            };
            option.callback && typeof option.callback === 'function'
            ? option.callback(tempResult)
            : ffmarket.result = tempResult;
        });
    },
    getManyHistory(world,itemIds,option)
    {
        let url = ffmarket.config.baseApi + ffmarket.config.listApi;
        this.getPriceCallback(url,world,itemIds,res => {
            //读取多个历史数据
            let tempManyResults = [];
            for (const tempItem of res.items) {
                 //单个数据的获取
                 let tempResult = {
                    id:tempItem.itemID,
                    time:tempItem.lastUploadTime,
                    list:ffmarket.handleHistory(tempItem.recentHistory,option),
                    raw:res,
                };
                tempManyResults.push(tempResult);
            }
            option.callback && typeof option.callback === 'function'
            ? option.callback(tempManyResults)
            : ffmarket.result = tempManyResults;
        });
    },
    handlePrice(rawList,option)
    {   
        let tempResultList = [];
        for (const tempItem of rawList) {
            if(tempResultList.length < ffmarket.config.perNum){
                //检查是否需要hq
                if(option.hq && !tempItem.hq){
                    continue;
                }
                tempResultList.push({
                    price:tempItem.pricePerUnit,
                    num:tempItem.quantity,
                    total:tempItem.total,
                    worldName:tempItem.worldName,
                    hq:tempItem.hq
                })
            }
        }
        return tempResultList;
    },
    handleHistory(rawList,option)
    {
        let tempResultList = [];
        for (const tempItem of rawList) {
            if(tempResultList.length < ffmarket.config.perNum){
                //检查是否需要hq
                if(option.hq && !tempItem.hq){
                    continue;
                }
                tempResultList.push({
                    price:tempItem.pricePerUnit,
                    num:tempItem.quantity,
                    total:tempItem.total,
                    worldName:tempItem.worldName,
                    hq:tempItem.hq,
                    time:tempItem.timestamp
                })
            }
        }
        return tempResultList;
    }
}

/**
 * test
 */

function testGetOnePrice()
{   
    ffmarket.init();
    console.log("testGetOnePrice");
    let world = "LuXingNiao";
    let itemid = 5393;//紫檀原木
    ffmarket.getOnePrice(world,itemid,{callback:res => {
        console.log("获取的当前价格",res);
    }});
    ffmarket.getOnePrice(world,itemid,{callback:res => {
        console.log("获取的当前价格",res);
    },hq:true});
}

// testGetOnePrice();
function testGetOneHistory()
{   
    ffmarket.init();
    console.log("testGetOneHistory");
    let world = "LuXingNiao";
    let itemid = 5393;//紫檀原木
    ffmarket.getOneHistory(world,itemid,{callback:res => {
        console.log("获取历史成交",res);
    }});
    ffmarket.getOneHistory(world,itemid,{callback:res => {
        console.log("获取历史成交",res);
    },hq:true});
}
// testGetOneHistory();
function testGetManyPrice()
{
    ffmarket.init();
    console.log("testGetManyPrice");
    let world = "LuXingNiao";
    let itemid = [5393,5386];//紫檀原木
    ffmarket.getManyPrice(world,itemid,{callback:res => {
        console.log("获取的当前价格",res);
    }});
    ffmarket.getManyPrice(world,itemid,{callback:res => {
        console.log("获取的当前价格",res);
    },hq:true});
}
// testGetManyPrice();
function testGetManyHistory()
{   
    ffmarket.init();
    console.log("testGetManyHistory");
    let world = "LuXingNiao";
    let itemid = [5393,5386];//紫檀原木
    ffmarket.getManyHistory(world,itemid,{callback:res => {
        console.log("获取历史成交",res);
    }});
    ffmarket.getManyHistory(world,itemid,{callback:res => {
        console.log("获取历史成交",res);
    },hq:true});
}
// testGetManyHistory();