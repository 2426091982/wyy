/**
 * 标记匹配的搜索关键字
 * @param str 需要处理的字符串
 * @param targetStr 需要标记的目标字符串
 */
export const markStr = (str: string, targetStr: string) => {
    const reg = new RegExp(`${targetStr}`, 'g');
    return str.replace(reg, (old) => `<mark>${old}</mark>`);
};

/**
 * 
 * @param str 需要处理的字符串
 * @return <div></div> => divdiv
 */
export const handleSymbol = (str: string) => {
    const reg = /<|\/|>/g;
    return str.replace(reg, '');
};
