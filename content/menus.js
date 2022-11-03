export const menuItems = [


{
    name:"Current Month",
    url:"/CurrentMonthAssetsPage",
    subMenu:[
        {
            name:'Expense',
            url:"CurrentMonthExpensePage"
        },
        {
            name:'Assets',
            url:"CurrentMonthAssetsPage"
        }
    ]
},
{
    name:"Closed Month",
    url:"#",
    subMenu:[
        {
            name:'Expense',
            url:"#"
        },
        {
            name:'Assets',
            url:"#"
        }
    ]
}
,
{
    name:"Historical Month",
    url:"#",
}
]