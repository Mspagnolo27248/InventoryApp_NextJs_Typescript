
//------------------Interfaces------------------------
export interface IassetMapping {
    ItemCode: string;
    GL: string;
    Desc: string;
    GlAccount: string;
    Part: string;
    StandardCost: string;
  }
  
  // export interface Ireceipts {
  //   GlAccount: string;
  //   TGJR: string;
  //   TGCRDR: string;
  //   TGAMT: string;
  //   TGDAT8: string;
  //   ReceiptValue: string;
  //   TGDesc: string;
  //   QTYClean: string;
  //   ReceiptQty: string;
  // }
  
  // export interface IEndInventory{
  //   GlAccount:string,
  //   EndInvQty:string,
  //   EndInvDollars:string,
  
  // }
  
  // export interface IbeginInventory{
  //   GlAccount:string,
  //   BeginInvQty:string,
  //   BeginInvDollars:string,
  //   CPU:string,
  //   Month:string,
  // }
  
  // export interface IAccural{
  //   ImsCode:string,
  //   GlAccount:string,
  //   Qty:string,
  //   value:string
  // }
  
//  export  interface IImsActivity{
//   IMS_Code:string,
//   BEGBALANCE:string,
//   TOTALRECEIPTS	:string,
//   TOTALISSUES:string,
//   TOTALRETURNS:string,
//   TOTALADJUSTMENTS:string,
//   TOTALPHYSICAL:string,
//   TOTALTRANSFERTO:string
  
//   }
  
  export interface IBom{
    ContainerCode:string	,
    IMSCode:string,
    PartType:string,	
    Unit:string,
    ProductKey:string,
  }
  