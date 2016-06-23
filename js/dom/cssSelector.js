/**
 * @fileoverview css选择器单体
 * @version 1.0.0 | 2016-06-23 版本信息
 * @author Zhang Mingrui | 592044573@qq.com
 * */
define(function(){
    var CssSelector = {};
    
    /**
     * css选择器正则map 
     */
    CssSelector.regMap = {
        /****************正则字符串****************/
        //状态选择
        booleans: "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
        // http://www.w3.org/TR/css3-selectors/#whitespace 空白匹配
        whitespace: "[\\x20\\t\\r\\n\\f]",
        // http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier 值标识符匹配
        identifier: "(?:\\\\.|[\\w-]|[^\0-\\xa0])+",
        // Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors 属性选择器匹配
        attributes: "\\[" + this.whitespace + "*(" + this.identifier + ")(?:" + this.whitespace +
            // Operator (capture 2)
            "*([*^$|!~]?=)" + this.whitespace +
            // "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
            "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + this.identifier + "))|)" + this.whitespace +
            "*\\]",
        /***************匹配类型正则*****************/
       //id选择器
        "ID": new RegExp( "^#(" + this.identifier + ")" ),
        //类选择器
        "CLASS": new RegExp( "^\\.(" + this.identifier + ")" ),
        //tag选择器
        "TAG": new RegExp( "^(" + this.identifier + "|[*])" ),
        //属性选择器
        "ATTR": new RegExp( "^" + this.attributes ),
        //子元素选择器
        "CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + this.whitespace +
            "*(even|odd|(([+-]|)(\\d*)n|)" + this.whitespace + "*(?:([+-]|)" + this.whitespace +
            "*(\\d+)|))" + this.whitespace + "*\\)|)", "i" ),
        //是否是某个状态的布尔选择器
        "bool": new RegExp( "^(?:" + this.booleans + ")$", "i" ),
        rinputs: /^(?:input|select|textarea|button)$/i,
        rheader: /^h\d$/i,
    
        rnative: /^[^{]+\{\s*\[native \w/,
    
        // Easily-parseable/retrievable ID or TAG or CLASS selectors
        rquickExpr: /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
    
        rsibling: /[+~]/,
    
        // CSS escapes
        // http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
        runescape: new RegExp( "\\\\([\\da-f]{1,6}" + this.whitespace + "?|(" + this.whitespace + ")|.)", "ig" ),
    };
    /**
     * css选择器匹配过滤检测方法 
     */
    CssSelector.filterMap = {
        
    };
    return CssSelector; 
});

