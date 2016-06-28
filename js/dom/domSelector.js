/**
 * @fileoverview dom选择器入口
 * @version 1.0.0 | 2016-06-27 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 * */

define(['dom/cssSelector'],function($cssSelector){
    var push = [].push;
    
    /**
     * 检测参数arr是否是array或者有效可遍历的节点列表
     */
    function checkDomArray(arr){
        if(arr == undefined){
            return 0;
        }else if(arr.constructor == Array){
            return 1;
        }else if(arr.constructor == DomSelector){
            return 2;
        }else if(typeof arr.item == 'function'){
            return 3;
        }else{
            return 0;
        }
    }
    
    /**
     * 节点选择
     * @param {String} *selector 选择器
     * @param {Element|Array|String|DomSelector对象} parent 父节点，从此节点下遍历符合selector的元素
     */
    function DomSelector(selector,parent){
        this.selector = selector;
        this.results = [];
        
        //参数检测
        if(typeof selector != 'string' || selector == ''){
            return this.results;
        }
        //parent是一个选择器字符串
        if(parent == undefined){
            parent = document;
        }else if(typeof parent == 'string'){
            parent = $cssSelector(parent);
        }
        //说明parent是个数组或节点元素集合，则进行遍历
        var ptype = checkDomArray(parent);
        if(ptype > 0){
            if(ptype == 2){
                parent = parent.results;
            }else if(ptype == 3){
                parent = Array.prototype.slice.call(parent);
            }
            //对parent进行排重，对于里面是父子关系的元素，删除子元素
            //正序排序并筛选。子，父
            parent.sort(function(item1,item2){
                 //说明item1包含item2
                 if($cssSelector.contains(item1,item2)){
                     item1._remove = false;
                     item2._remove = true;
                     return 1;
                 }else{
                     return -1;
                 }
            });
            //删除多余的元素
            var i = 0;
            while(i < parent.length){
                if(parent[i]._remove == true){
                    parent.splice(i,1);
                }else{
                    i++;
                }
            }
            for(var i = 0, len = parent.length; i < len; i++){
                var itemarr = $cssSelector(selector,parent[i]);
                push.apply(this.results, itemarr);
            }
        }else{
            this.results = $cssSelector(selector,parent);
        }
    }
    
    DomSelector.prototype.toString = function(){
        return this.results;
    };
    
    window.Z = function(selector,parent){
        return new DomSelector(selector,parent);
    };
    
    return DomSelector;
    
});