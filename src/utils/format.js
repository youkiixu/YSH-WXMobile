// 格式化分类代码
export function formatCatelog(data) {
    let navList = [];
    data.map(item => {
        navList.push({
            Id: item.Id,
            Name: item.Name
        })

    })


    return navList;
}