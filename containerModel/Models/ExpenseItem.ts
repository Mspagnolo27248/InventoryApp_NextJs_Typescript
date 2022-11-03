interface IExpenseDetail {
     ProductKey: string,
     ExpenseGl: string,
     ImsCode: string,
     TotalPartFillsQty: number,
     SpecificPartUsageQty: number,
     AllocatedExpenseDollars: number,
     TotalImsUsageDollars: number
}

interface IProductFills{
    ProductKey:string,
    FilledQty:number
}

interface IPartFills{
    ImsCode:string,
    FilledQty:number
}

export class ExpenseGlAccounts {
  constructor(
    public ExpenseGl: string,
     public ExpenseDollars: number) {}
}

export class ExpenseDetail {
  constructor(

    public ProductKey: string,
    public ExpenseGl: string,
    public ImsCode: string,
    public TotalPartFillsQty: number,
    public SpecificPartUsageQty: number,
    public AllocatedExpenseDollars: number,
    public TotalImsUsageDollars: number
  ) {}
}
