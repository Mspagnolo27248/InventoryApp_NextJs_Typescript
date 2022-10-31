import { createContext,useState } from "react";
import { Item } from "../../containerModel/Models/Item";
import { ExpenseDetail } from "../../containerModel/Models/ExpenseItem";

interface IDataContext {
    items: Item[];
    updateItems: (items: Item[]) => void;
    expenses: ExpenseDetail[]
    updateExpenses: (expenses: ExpenseDetail[]) => void;
  }
  

const DataContext = createContext<IDataContext>({
    items:[],
    updateItems:(Items:Item[])=>{},
    expenses:[],
    updateExpenses:(expenses:ExpenseDetail[])=>{}
    })

    
export function DataContextProvider(props: any) {
    const [items, setItems] = useState<Item[]>();
  
    function updateItemsHandler(items: Item[]) {
      setItems(items);
    }
  
    const [expenses, setExpenses] = useState<ExpenseDetail[]>();
  function updateExpenseHandler(expenses:ExpenseDetail[]){
    setExpenses(expenses)
  }
    const context: IDataContext = {
      items: items!,
      updateItems: updateItemsHandler,  
      expenses: expenses!,
      updateExpenses:updateExpenseHandler
  
    };
  
    return (
      <DataContext.Provider value={context}>
        {props.children}
      </DataContext.Provider>
    );
  }
  
  
  export default DataContext;
  