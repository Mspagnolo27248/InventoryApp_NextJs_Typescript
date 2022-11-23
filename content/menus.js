export const menuItems = [
  {
    name: "Entites",
    url: "/",
    subMenu: [
      {
        name: "Asset Mapping",
        url: "AssetMappingPage",
      },

      {
        name: "Expense Mapping",
        url: "ExpenseMappingPage",
      },
    ],
  },

  {
    name: "Current Month",
    url: "/CurrentMonthAssetsPage",
    subMenu: [
      {
        name: "Assets",
        url: "CurrentMonthAssetsPage",
      },
      {
        name: "Expense",
        url: "CurrentMonthExpensePage",
      },
      {
        name: "Receipts",
        url: "ReceiptsPage",
      },
      {
        name: "Fills",
        url: "FillsPage",
      },
      {
        name: "Expense Mapping",
        url: "ExpenseMappingPage",
      },
    ],
  },
  {
    name: "Closed Month",
    url: "#",
    subMenu: [
      {
        name: "Assets",
        url: "#",
      },
      {
        name: "Expense",
        url: "#",
      },
    ],
  },
  {
    name: "Historical Month",
    url: "#",
  },
];
