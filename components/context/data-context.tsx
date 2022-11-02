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
  }
  

const DataContext = createContext<IDataContext>({
    items:[],
    updateItems:(Items:Item[])=>{},
    expenses:[],
    updateExpenses:(expenses:ExpenseDetail[])=>{},
    itemMap:undefined,
    updateItemMap:(itemModel:Map<string,Item>)=>{}

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

    const context: IDataContext = {
      items: items!,
      updateItems: updateItemsHandler,  
      expenses: expenses!,
      updateExpenses:updateExpenseHandler,
      itemMap:itemModel,
      updateItemMap:updateItemModelHandler
    };
  
    return (
      <DataContext.Provider value={context}>
        {props.children}
      </DataContext.Provider>
    );
  }
  
  
  export default DataContext;
  