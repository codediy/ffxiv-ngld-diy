/**
 * 到exportData到全局，注册数据使用
 * @param {*} exportData 
 * @param {*} name 
 */
function exportToGlobal(exportData,name)
{
    if(typeof exports === 'object' && typeof module !== 'undefined' ){
        module.exports = exportData;
    }else if(typeof define === 'function' && define.amd){
        define(exportData);
    }else if(typeof window === 'object'){
        window[name] = exportData;
    }else if(typeof global === 'object'){
        global[name] = exportData;
    }
}

//注册全局函数
exportToGlobal(exportToGlobal,"exportToGlobal");