/**
 * @fileoverview dom遍历单体
 * @version 1.0.0 | 2016-06-22 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 * @example
 *         requirejs(['dom/domWalk'],function($domWalk){
 *              //获取test1下所有子节点
                console.log($domWalk.downAll(document.getElementById('test1')));
                //获取test1下所有li节点
                console.log($domWalk.downAll(document.getElementById('test1'),function(node){
                    return node.tagName.toLowerCase() == 'li';
                }));
           });
 * */
define(function(){
    var DomWalk = {};
    /**
     * dom子孙节点遍历方法
     * @param {Node} parent 父节点，从此节点下遍历所有子元素。如果不传，则是document
     * @param {Function} filter 条件过滤函数。返回true,则将当前遍历的节点加入结果中。默认返回true
     *      function(node){
     *          //检测当前遍历的node
     *          return true;
     *      }
     * @param {Array} results 当前遍历的存放node的结果数组
     * @return {Array} results 遍历后的节点数组
     */
    DomWalk.downAll = function(parent,filter,results){
        //参数验证
        parent = parent || document;
        if(parent.nodeType != 1 && parent.nodeType != 9){
            return [];
        }
        //说明当前传入的顺序是：parent results
        if(Object.prototype.toString.call(filter) == '[object Array]'){
            results = filter;
        }
        if(typeof filter != 'function'){
            filter = function(){return true;};
        }
        results = results || [];
        
        //遍历节点
        var childArr = parent.children; //先使用children属性，返回的是HTMLCollection集合，只包括nodeType为1的节点
        for (var i = 0; i < childArr.length; i++){
            var curnode = childArr[i];
            if(filter(curnode) == true){
                results.push(curnode);
            }
            if(curnode.children.length > 0){
                DomWalk.downAll(curnode,filter,results);
            }
        }
        return results;
    };
    
    return DomWalk;
});
