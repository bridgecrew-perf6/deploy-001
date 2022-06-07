let tableMap = new Map([
    [100, '0'],
    [101, '1'],
    [102, '2'],
    [103, '3'],
    [104, '4'],
    [105, '5'],
    [106, '6'],
    [107, '7'],
    [108, '8'],
    [109, '9'],
    [110, 'a'],
    [111, 'b'],
    [112, 'c'],
    [113, 'd'],
    [114, 'e'],
    [115, 'f'],
    [116, 'g'],
    [117, 'h'],
    [118, 'i'],
    [119, 'j'],
    [120, 'k'],
    [121, 'l'],
    [122, 'm'],
    [123, 'n'],
    [124, 'o'],
    [125, 'p'],
    [126, 'q'],
    [127, 'r'],
    [128, 's'],
    [129, 't'],
    [130, 'u'],
    [131, 'v'],
    [132, 'w'],
    [133, 'x'],
    [134, 'y'],
    [135, 'z'],
]);


export function NumberToAlp(num: number) {
    return tableMap.get(num)
}

//md5 firstchar
export function AlpToNumber(alp: any) {
    let res:number;
    tableMap.forEach(function (v, k) {
        if (v == alp) {
            res = k
        }
    })
    return res
}