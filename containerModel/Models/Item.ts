



export class Item{
   
    constructor( 
            public GlAccount:string,
            public ItemCode: string,
            public StandardCost:number=0,
            public BeginInvQty:number=0,
            public BeginInvValue:number=0,
            public EndInvQty:number=0,
            public EndInvValue:number=0,
            public ReceiptQty:number=0,
            public ReceiptValue:number=0,
            public UsageQty:number=0,
            public UsageValue:number=0,
            public ImsReceiptQty:number=0,
            public AccuralReversalQty:number=0,
            public AccuralReversalValue:number=0,
            public AccuralQty:number=0,
            public AccuralValue:number=0,
            public AdjReceiptQty:number=0,
            public AdjReceiptValue:number=0,
            public AllocatedExpense:number = 0,
            public UnallocatedExpense:number =0,
            public  Hurdle = 200
        ) {
      
    }

    calculateAccurals():void{
    
        let accuralQty = this.ImsReceiptQty-(this.ReceiptQty+this.AccuralReversalQty)

        let costPerUnit = 0;
        
        if(!this.ReceiptQty)
         costPerUnit = this.StandardCost;
        else{
            costPerUnit =  parseFloat((this.ReceiptValue/this.ReceiptQty).toFixed(4));
        }
        let accuralDollars = Math.round((accuralQty*costPerUnit)*100)/100;
        if(Math.abs(accuralDollars)>this.Hurdle){
            this.AccuralValue = accuralDollars;
        }
        this.AccuralQty = accuralQty;
      

    }
    calculateAjustedReceipts():void{
        this.AdjReceiptQty = this.AccuralQty + this.ReceiptQty + this.AccuralReversalQty;
        this.AdjReceiptValue  = this.AccuralValue + this.ReceiptValue + this.AccuralReversalValue;
    }


    calculateUsage():void{
    
        this.UsageQty = (this.AdjReceiptQty+this.BeginInvQty-this.EndInvQty);
       let beginCpu = this.BeginInvValue/this.BeginInvQty||0;
       let receiptCpu = this.AdjReceiptValue/this.AdjReceiptQty||0;
        if(this.BeginInvQty>=this.UsageQty){
            this.UsageValue = (this.UsageQty * beginCpu)||0
        }
        else{

            this.UsageValue = this.BeginInvValue +((this.UsageQty-this.BeginInvQty)*receiptCpu);

        }

    }

}