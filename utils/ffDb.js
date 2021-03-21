/**
 * 依赖库 :
 * <script src="https://unpkg.com/dexie@latest/dist/dexie.js"></script>
 * <script src="https://cdn.bootcdn.net/ajax/libs/axios/0.21.1/axios.min.js"></script>
 * 管理静态数据与操作缓存
 * 1. 静态数据   本地解析数据
 * 2. 操作缓存   历史操作记录
 * @type {{}}
 */
const ffDb = {
    config: {
        jsonBasePath: "../data/teamcraft/raw/",
        isInited: false,
        dbName: "ffxiv_db",
        dexieDb: null, //数据库实例
        dbVersion: 1,
        fileExt: ".json",
        isShowLoading:false,
        //异步执行队列
        promiseQueue: [],
        exportFiles: [
            {
                "table": "ItemsName",
                "tableIndex":["++item_id"],
                "tablePrkKeyValue":(key) => {
                    return {"item_id":parseInt(key)};
                },
                "files": ["items", "/zh/zh-items", "/ko/ko-items"]
            },
            {
                "table": "MapsName",
                "tableIndex":["++map_id"],
                "tablePrkKeyValue":(key) => {
                    return {"map_id":parseInt(key)};
                },
                "files": ["maps", "/zh/zh-maps", "/ko/ko-maps"]
            },
            {
                "table": "PlacesName",
                "tableIndex":["++place_id"],
                "tablePrkKeyValue":(key) => {
                   return {"place_id":parseInt(key)};
                },
                "files": ["places", "/zh/zh-places", "/ko/ko-places"]
            }
        ],
    },
    init() {
        this.config.isInited = false;
        if (this.checkLib()) {
            this.config.isInited = true;
        } else {
            console.log("axios erorr or dc error")
        }
    },
    checkLib() {
        if (typeof Dexie === undefined
            || typeof axios === undefined) {
            console.log("dexie,axios库缺失");
            return false;
        } else{
            this.config.dexieDb = new Dexie(this.config.dbName);
            this.config.promiseQueue = Promise.resolve();
        }
        return true;
    },
    exportData() {
        if (!this.config.isInited) {
            console.log("init 失败");
            return;
        }
        Dexie.exists(this.config.dbName).then(isExists => {
            if(isExists){
                console.log("isExists");
                this.config.dexieDb.open()
                .then(db => {
                    //获取当前版本
                    this.config.dbVersion = db.verno;
                    this._exportData();
                }).catch(e => {
                    console.log("openError",e);
                });
            }else{
                console.log("noExists");
                this._exportData();
            }
        })
    },
    _exportData(){
        //倒入所有文件
        this.config.exportFiles.forEach(tableConfig => {
            this.config.promiseQueue = this.config.promiseQueue.then(()=>{
                //生成数据表
                this.showLoading();
                let tempfileData = [];
                return this.getDataFromJson(tableConfig)
                .then((fileData) => {
                    console.log("checkTable",tableConfig.table);
                    tempfileData = fileData;
                    //检查数据表
                    return this.checkTable(tableConfig,tempfileData);
                }).then((isNeed) => {
                    console.log("batchInsertData",tableConfig.table,isNeed);
                    if(isNeed){
                        return this.batchInsertData(tableConfig,tempfileData);
                    }else{
                        return new Promise((res,rej) => {
                            res("no need");
                        })
                    }
                });
            });
        })
        //依次执行
        this.config.promiseQueue.then((table, num) => {
            this.hideLoading();
            console.log("ddd", table, num)
        })
    },
    /**
     * 文件读取数据
     * @param {*} tableConfig 
     * @returns 
     */
    getDataFromJson(tableConfig) {
        return new Promise((res,rej) => {
            let jsonRequest = [];
            if (Array.isArray(tableConfig.files)) {
                tableConfig.files.forEach(file => {
                    jsonRequest.push(
                        axios.get(this.config.jsonBasePath + file + this.config.fileExt)
                    )
                });
                //清空待读取数据
                this.config.tempFileData = [];
                axios.all(jsonRequest).then(axios.spread((...data) => {
                    //临时存储
                    let tempData = data.map(d => {
                        return d.data;
                    });
                    res(tempData);
                    // callback();
                })).catch(e => {
                    console.log("getData error", e);
                    rej();
                })
            }
        })
    },
    /**
     * 
     * @param {*} tableConfig 
     * @param {*} fileData 
     * @returns 
     */
    checkTable(tableConfig,fileData){
        return new Promise((res,rej) => {
            let tableName = tableConfig.table;
            if(this.config.dexieDb.isOpen()){
                console.log("tables",this.config.dexieDb.tables);

                //检查是否已导入过数据
                let tableIndex =  this.config.dexieDb.tables.findIndex(d => {
                    return d.name == tableName;
                });  
                if( tableIndex > -1){
                    let tempTable =  this.config.dexieDb.tables[tableIndex];
                    console.log("数据表已存在",tempTable);
                    tempTable.count(nums => {
                        //检查数据是否已导入全
                        console.log("nums",nums,Object.keys(fileData[0]).length);
                        if(nums < Object.keys(fileData[0]).length){
                            if(nums > 0){
                                tempTable.clear().then(() => {
                                    console.log("clearNums");
                                    res(true);
                                });
                            }else{
                                console.log("zeroNum");
                                res(true);
                            }
                        }else{
                            console.log("数据已添加")
                            res(false);
                        }
                    })
                }else{
                    console.log("ttt",tableConfig.tableIndex)
                    // 关闭数据库
                    this.config.dexieDb.close();
                    // 数据库版本自增
                    this.config.dbVersion = this.config.dbVersion + 1;
                    console.log("dbVersion",this.config.dbVersion); 
                    // 创建数据表 并升级数据库版本
                    this.config.dexieDb.version(this.config.dbVersion).stores({
                        [tableName]: tableConfig.tableIndex.join(",")
                    });
                    this.config.dexieDb.open().then(() => {
                        //检查是否已导入过数据
                        tableIndex =  this.config.dexieDb.tables.findIndex(d => {
                            return d.name == tableName;
                        });  
                        console.log("数据表新添加",tableIndex);
                        res(true);
                    });
                }
            }else{
                console.log("ttt",tableConfig.tableIndex)
                // 创建数据表 并升级数据库版本
                this.config.dexieDb.version(this.config.dbVersion).stores({
                    [tableName]: tableConfig.tableIndex.join(",")
                });
                this.config.dexieDb.open().then(() => {
                    //检查是否已导入过数据
                    tableIndex =  this.config.dexieDb.tables.findIndex(d => {
                        return d.name == tableName;
                    });  
                    console.log("数据库添加后添加数据表",tableIndex);
                    res(true);
                });
            }
        })
    },
    /**
     * 插入数据 需要生成的字段
     * @param priKeyF
     */
    batchInsertData(tableConfig,fileData) {
        let data = fileData;
        // 待添加数据
        let tempAddData = [];
        for (const tempKey in data[0]) {
            let tempData = typeof tableConfig.tablePrkKeyValue === "function"
                ? tableConfig.tablePrkKeyValue(tempKey)
                : {};
            for (let i = 0; i < data.length; i++) {
                tempData = {...tempData, ...data[i][tempKey]};
            }
            tempAddData.push(tempData);
        }
        console.log("tableData", tempAddData);
        let tableIndex =  this.config.dexieDb.tables.findIndex(d => {
            return d.name == tableConfig.table;
        });  
        let tempTable =  this.config.dexieDb.tables[tableIndex];
        return  tempTable.bulkAdd(tempAddData);
    },
    
    showLoading()
    {
        this.config.isShowLoading = true;
        let loadingId = setInterval(() => {
            if(this.config.isShowLoading){
                console.log("loading...");
            }else{
                clearInterval(loadingId);
            }
        },10);
    },
    hideLoading(){
        this.config.isShowLoading = false;
    },

    cacheVersion(){

    },
    getVersion(){

    }
}

exportToGlobal(ffDb, "ffDb");