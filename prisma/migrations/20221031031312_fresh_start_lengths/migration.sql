BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[AssetMapping] (
    [ItemCode] VARCHAR(10) NOT NULL,
    [GL] VARCHAR(10),
    [GlDesc] VARCHAR(100),
    [GLAccount] VARCHAR(10),
    [Part] VARCHAR(10),
    [StandardCost] FLOAT(53),
    CONSTRAINT [AssetMapping_pkey] PRIMARY KEY CLUSTERED ([ItemCode])
);

-- CreateTable
CREATE TABLE [dbo].[BOM] (
    [ContainerCode] VARCHAR(10),
    [ImsCode] VARCHAR(10),
    [PartType] VARCHAR(10),
    [Unit] VARCHAR(10),
    [ProductKey] VARCHAR(15) NOT NULL,
    CONSTRAINT [BOM_pkey] PRIMARY KEY CLUSTERED ([ProductKey]),
    CONSTRAINT [BOM_ProductKey_PartType_Unit_key] UNIQUE NONCLUSTERED ([ProductKey],[PartType],[Unit])
);

-- CreateTable
CREATE TABLE [dbo].[EndingInv] (
    [GlAccount] VARCHAR(10) NOT NULL,
    [EndInvQty] INT,
    [EndInvDollats] FLOAT(53),
    CONSTRAINT [EndingInv_pkey] PRIMARY KEY CLUSTERED ([GlAccount])
);

-- CreateTable
CREATE TABLE [dbo].[ExpenseDetail] (
    [id] INT NOT NULL IDENTITY(1,1),
    [ProductKey] VARCHAR(15) NOT NULL,
    [ExpenseGl] VARCHAR(10),
    [ImsCode] VARCHAR(10) NOT NULL,
    [TotalPartFillsQty] INT,
    [SpecificPartUsageQty] INT,
    [AllocatedExpenseDollars] FLOAT(53),
    [TotalImsUsageDollars] FLOAT(53),
    CONSTRAINT [ExpenseDetail_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [ExpenseDetail_ProductKey_ImsCode_key] UNIQUE NONCLUSTERED ([ProductKey],[ImsCode])
);

-- CreateTable
CREATE TABLE [dbo].[ExpenseMapping] (
    [ProductKey] VARCHAR(15) NOT NULL,
    [ExpenseGl] VARCHAR(10),
    CONSTRAINT [ExpenseMapping_pkey] PRIMARY KEY CLUSTERED ([ProductKey])
);

-- CreateTable
CREATE TABLE [dbo].[ItemModel] (
    [id] INT NOT NULL IDENTITY(1,1),
    [GL] NVARCHAR(10) NOT NULL,
    [ItemCode] NVARCHAR(10) NOT NULL,
    [StandardCost] FLOAT(53) NOT NULL,
    [BeginInvQty] INT NOT NULL,
    [BeginInvValue] FLOAT(53) NOT NULL,
    [EndInvQty] INT NOT NULL,
    [EndInvValue] FLOAT(53) NOT NULL,
    [AdjustmentInvQty] INT NOT NULL,
    [AdjustmentInvValue] FLOAT(53) NOT NULL,
    [ReceiptQty] INT NOT NULL,
    [ReceiptValue] FLOAT(53) NOT NULL,
    [UsageQty] INT NOT NULL,
    [UsageValue] FLOAT(53) NOT NULL,
    [ImsReceiptQty] INT NOT NULL,
    [AccuralReversalQty] INT NOT NULL,
    [AccuralReversalValue] FLOAT(53) NOT NULL,
    [AccuralQty] INT NOT NULL,
    [AccuralValue] FLOAT(53) NOT NULL,
    [AdjReceiptQty] INT NOT NULL,
    [AdjReceiptValue] FLOAT(53) NOT NULL,
    [AllocatedExpense] FLOAT(53) NOT NULL,
    [UnallocatedExpense] FLOAT(53) NOT NULL,
    [Hurdle] FLOAT(53) NOT NULL,
    CONSTRAINT [ItemModel_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ItemModelHistory] (
    [ClosedMonth] INT NOT NULL,
    [ItemCode] VARCHAR(10) NOT NULL,
    [StandardCost] FLOAT(53),
    [BeginInvQty] INT,
    [BeginInvValue] FLOAT(53),
    [EndInvQty] INT,
    [EndInvValue] FLOAT(53),
    [AdjustmentInvQty] INT,
    [AdjustmentInvValue] FLOAT(53),
    [ReceiptQty] INT,
    [ReceiptValue] FLOAT(53),
    [UsageQty] INT,
    [UsageValue] FLOAT(53),
    [ImsReceiptQty] INT,
    [AccuralReversalQty] INT,
    [AccuralReversalValue] FLOAT(53),
    [AccuralQty] INT,
    [AccuralValue] FLOAT(53),
    [AdjReceiptQty] INT,
    [AdjReceiptValue] FLOAT(53),
    [AllocatedExpense] FLOAT(53),
    [UnallocatedExpense] FLOAT(53),
    [Hurdle] FLOAT(53),
    CONSTRAINT [ItemModelHistory_pkey] PRIMARY KEY CLUSTERED ([ItemCode]),
    CONSTRAINT [ItemModelHistory_ItemCode_ClosedMonth_key] UNIQUE NONCLUSTERED ([ItemCode],[ClosedMonth])
);

-- CreateTable
CREATE TABLE [dbo].[Receipts] (
    [GlAccount] VARCHAR(10) NOT NULL,
    [Journal] VARCHAR(10),
    [CD] VARCHAR(10),
    [Amount] FLOAT(53),
    [Date] INT,
    [ReceiptValue] FLOAT(53),
    [TGDesc] VARCHAR(100),
    [QtyClean] INT,
    [ReceiptQty] INT,
    CONSTRAINT [Receipts_pkey] PRIMARY KEY CLUSTERED ([GlAccount]),
    CONSTRAINT [Receipts_GlAccount_Journal_CD_key] UNIQUE NONCLUSTERED ([GlAccount],[Journal],[CD])
);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
