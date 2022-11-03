import { createContext,useState } from "react";
import { Item } from "../../containerModel/Models/Item";
import { ExpenseDetail } from "../../containerModel/Models/ExpenseItem";

interface IDataContext {
    items: Item[];
    updateItems: (items: Item[]) => void;

    expenses: ExpenseDetail[]
    updateExpenses: (expenses: ExpenseDetail[]) => void;

    itemMap:Map<string,Item>|undefined;
    updateItemMap:(itemModel:Map<string,Item>)=>void;

    expenseMap:Map<string,ExpenseDetail>|undefined;
    updateExpenseMap:(itemModel:Map<string,ExpenseDetail>)=>void;


  }
  

const DataContext = createContext<IDataContext>({
    items:[],
    updateItems:(Items:Item[])=>{},
    expenses:[],
    updateExpenses:(expenses:ExpenseDetail[])=>{},
    itemMap:undefined,
    updateItemMap:(itemModel:Map<string,Item>)=>{},
    expenseMap:undefined,
    updateExpenseMap:(itemModel:Map<string,ExpenseDetail>)=>{}

    })

    
export function DataContextProvider(props: any) {
    const [items, setItems] = useState<Item[]>();  
    function updateItemsHandler(items: Item[]) {
      setItems(prevData=>[...items]);
    }
  
  const [expenses, setExpenses] = useState<ExpenseDetail[]>();
  function updateExpenseHandler(expenses:ExpenseDetail[]){
    setExpenses(expenses)
  }

  const [itemModel,setItemModel] = useState<Map<string,Item>|undefined>(undefined);
  function updateItemModelHandler(itemModel:Map<string,Item>){
    setItemModel(itemModel)
  }

  const [expenseModel,setExpenseModel] = useState<Map<string,ExpenseDetail>|undefined>(undefined);
  function updateExpenseModelHandler(expenseModel:Map<string,ExpenseDetail>){
    setExpenseModel(expenseModel)
  }
    const context: IDataContext = {
      items: items!,
      updateItems: updateItemsHandler,  
      expenses: expenses!,
      updateExpenses:updateExpenseHandler,
      itemMap:itemModel,
      updateItemMap:updateItemModelHandler,
      expenseMap:expenseModel,
      updateExpenseMap:updateExpenseModelHandler
    };
  
    return (
      <DataContext.Provider value={context}>
        {props.children}
      </DataContext.Provider>
    );
  }
  
  
  export default DataContext;
  