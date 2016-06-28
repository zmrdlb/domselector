/**
 * @fileoverview css选择器单体
 * @version 1.0.0 | 2016-06-23 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 * */
define(function(){
    var docElem = document.documentElement,
    push = [].push;
    
    var baseRegMap = {
        // http://www.w3.org/TR/css3-selectors/#whitespace 空白匹配
        whitespace: "[\\x20\\t\\r\\n\\f]",
        // http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier 值标识符匹配
        identifier: "(?:\\\\.|[\\w-]|[^\0-\\xa0])+"
    };
    /**
     * css选择器正则map 
     */
    var regMap = {
        /****************正则字符串****************/
        //状态选择
        booleans: "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
        
        // Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors 属性选择器匹配
        attributes: "\\[" + baseRegMap.whitespace + "*(" + baseRegMap.identifier + ")(?:" + baseRegMap.whitespace +
            // Operator (capture 2)
            "*([*^$|!~]?=)" + baseRegMap.whitespace +
            // "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
            "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + baseRegMap.identifier + "))|)" + baseRegMap.whitespace +
            "*\\]",
        rinputs: /^(?:input|select|textarea|button)$/i,
        rheader: /^h\d$/i,
    
        rnative: /^[^{]+\{\s*\[native \w/,
        
        //初步简单检测是以下哪种选择器：id|tag|class
        // Easily-parseable/retrievable ID or TAG or CLASS selectors
        rquickExpr: /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
    
        rsibling: /[+~]/,
    
        // CSS escapes
        // http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
        runescape: new RegExp( "\\\\([\\da-f]{1,6}" + baseRegMap.whitespace + "?|(" + baseRegMap.whitespace + ")|.)", "ig" ),
        //去除前后空格
        rtrim: new RegExp( "^" + baseRegMap.whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + baseRegMap.whitespace + "+$", "g" )
    };
    /***************匹配类型正则*****************/
   //id选择器
    regMap.ID = new RegExp( "^#(" + baseRegMap.identifier + ")" );
    //类选择器
    regMap.CLASS = new RegExp( "^\\.(" + baseRegMap.identifier + ")" );
    //tag选择器
    regMap.TAG = new RegExp( "^(" + baseRegMap.identifier + "|[*])" );
    //属性选择器
    regMap.ATTR = new RegExp( "^" + regMap.attributes );
    //子元素选择器
    regMap.CHILD = new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + baseRegMap.whitespace +
        "*(even|odd|(([+-]|)(\\d*)n|)" + baseRegMap.whitespace + "*(?:([+-]|)" + baseRegMap.whitespace +
        "*(\\d+)|))" + baseRegMap.whitespace + "*\\)|)", "i" );
    //是否是某个状态的布尔选择器
    regMap.bool = new RegExp( "^(?:" + regMap.booleans + ")$", "i" );
    
    /**
     * 节点选择
     * @param {String} *selector 选择器
     * @param {Node} parent 父节点，从此节点下遍历符合selector的元素
     */
    function CssSelector(selector,parent){
        //参数检测
        if(typeof selector != 'string' || selector == ''){
            return [];
        }
        parent = parent || document;
        //节点选择
        if(CssSelector.supportQuery){ //采用原生方法
            return Array.prototype.slice.call(parent.querySelectorAll(selector)); //转化为普通数组
        }else{ //不支持原生选择，则自行选择
            //筛选结果
            var results = [];
            // nodeType defaults to 9
            var nodeType = parent ? context.nodeType : 9;
            // 判断nodeType是否有效
            if (nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {
                return results;
            }
            
            //初步是否属于简单的id|tag|class选择器
            var match = regMap.rquickExpr.exec(selector);
            var m, //筛选出的选择器关键词
            dom; //当前dom存储
            if(match){
                //id选择器
                if((m = match[1])){
                    dom = document.getElementById(m);
                    if(dom && dom.id == m && CssSelector.contains(parent,dom)){
                        results.push(dom);
                    }
                    return results;
                }
                //tag选择器
                else if((m = match[2])){
                    push.apply(results, parent.getElementsByTagName(m.toLowerCase()));
                    return results;
                }
                //class选择器
                else if((m = match[3])){
                    //检测是否有原生的通过class来获取元素的方法
                    if(regMap.rnative.test(document.getElementsByClassName)){
                        push.apply( results, parent.getElementsByClassName(m));
                        return results;
                    }
                }
            }else{
                return results;
            }
            
            //说明属于其他选择器
            //return CssSelector.select(selector.replace(regMap.rtrim, "$1"), parent, results);
        }
        
    };
    /**
     * 是否支持原生的querySelectorAll方法 
     */
    CssSelector.supportQuery = document.querySelectorAll? true: false;
   
   
    
    /**
     * css选择器匹配过滤检测方法 
     */
    CssSelector.filterMap = {
        
    };

    /**
     * 检测node是否包含otherNode
     * @param {Element} node
     * @param {Element} otherNode
     * document包含document.documentElement;
     */
    CssSelector.contains = function(node,otherNode){
        if(node === otherNode){
            return false;
        }
        if(regMap.rnative.test(docElem.compareDocumentPosition)){ //说明存在元素的位置比较方法
            return !!(node.compareDocumentPosition(otherNode) & 16);
        }
        if(regMap.rnative.test(docElem.contains)){ //说明存在contains方法
            return node.contains(otherNode);
        }
    };
    
    /**
     * A low-level selection function that works with CssSelector's compiled
     *  selector functions
     * @param {String} selector A selector or a pre-compiled
     *  selector function built with CssSelector.compile
     * @param {Element} context
     * @param {Array} [results]
     */
    // CssSelector.select = function( selector, context, results ) {
        // var i, tokens, token, type, find,
            // compiled = typeof selector === "function" && selector,
            // match = tokenize( (selector = compiled.selector || selector) );
//     
        // results = results || [];
//     
        // // Try to minimize operations if there is only one selector in the list and no seed
        // // (the latter of which guarantees us context)
        // if ( match.length === 1 ) {
//     
            // // Reduce context if the leading compound selector is an ID
            // tokens = match[0] = match[0].slice( 0 );
            // if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
                    // support.getById && context.nodeType === 9 && documentIsHTML &&
                    // Expr.relative[ tokens[1].type ] ) {
//     
                // context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
                // if ( !context ) {
                    // return results;
//     
                // // Precompiled matchers will still verify ancestry, so step up a level
                // } else if ( compiled ) {
                    // context = context.parentNode;
                // }
//     
                // selector = selector.slice( tokens.shift().value.length );
            // }
//     
            // // Fetch a seed set for right-to-left matching
            // i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
            // while ( i-- ) {
                // token = tokens[i];
//     
                // // Abort if we hit a combinator
                // if ( Expr.relative[ (type = token.type) ] ) {
                    // break;
                // }
                // if ( (find = Expr.find[ type ]) ) {
                    // // Search, expanding context for leading sibling combinators
                    // if ( (seed = find(
                        // token.matches[0].replace( runescape, funescape ),
                        // rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
                    // )) ) {
//     
                        // // If seed is empty or no tokens remain, we can return early
                        // tokens.splice( i, 1 );
                        // selector = seed.length && toSelector( tokens );
                        // if ( !selector ) {
                            // push.apply( results, seed );
                            // return results;
                        // }
//     
                        // break;
                    // }
                // }
            // }
        // }
//     
        // // Compile and execute a filtering function if one is not provided
        // // Provide `match` to avoid retokenization if we modified the selector above
        // ( compiled || compile( selector, match ) )(
            // seed,
            // context,
            // !documentIsHTML,
            // results,
            // !context || rsibling.test( selector ) && testContext( context.parentNode ) || context
        // );
        // return results;
    // };
// 
    // /**
     // * 节点查询 
     // * @param {String} *selector 选择器
     // * @param {Node} parent 父节点，从此节点下遍历符合selector的元素
     // */
    // CssSelector.find = function(selector,parent){
        // parent = parent || document;
//         
//         
    // };
//     
    return CssSelector; 
});

