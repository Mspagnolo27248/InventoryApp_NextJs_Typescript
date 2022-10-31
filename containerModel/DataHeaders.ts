//--------------Constant Variables ---------------
export const assetHeaders = [
  "ItemCode",
  "GL",
  "Desc",
  "GlAccount",
  "Part",
  "StandardCost",
];
export const receiptHeaders = [
  "GlAccount",
  "TGJRNL",
  "TGCRDR",
  "TGAMT",
  "TGDAT8",
  "ReceiptValue",
  "TGDesc",
  "QTYClean",
  "ReceiptQty",
];

export const beginInventoryHeaders = [
  "GlAccount",
  "BeginInvQty",
  "BeginInvDollars",
  "CPU",
  "Month",
];


export const endInventoryHeaders = ['GlAccount','EndInvQty','EndInvDollars']

export const expenseMappingHeaders = ['ProductKey',	'ExpenseGl']

export const billOfMaterialHeaders = ['ContainerCode'	,'IMSCode'	,'PartType',	'Unit',	'ProductKey'
]