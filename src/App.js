import { React, useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import "./App.css";

const buttons = [
  {
    type: "all",
    label: "All",
  },
  {
    type: "active",
    label: "Active",
  },
  {
    type: "done",
    label: "Done",
  },
];

function App() {
  const [itemToAdd, setItemToAdd] = useState("");

  const [items, setItems] = useState(() => JSON.parse(localStorage.getItem('key')) || []);

  const [filterType, setFilterType] = useState("");

  const [searchedItem, setSearchedItem] = useState("");

  const handleChangeItem = (event) => {setItemToAdd(event.target.value)};

  const getFilteredItemWithoutSelected = (array, itemKey) => array.filter(item => item.key !== itemKey);

  const handleItemRemove = ({key}) => {
    const itemsWithoutSelectedItem = getFilteredItemWithoutSelected(items, key);
    setItems([...itemsWithoutSelectedItem ]);
  };

  const handleItemImportant = ({key}) => {
    setItems((prevItems) => prevItems.map((item) => {
      if (item.key === key) {
        return { ...item, important: !item.important };
      }
      else return item;
    }
  ));
  };

  const handleItemSearch = (event) => {
    setSearchedItem(event.target.value);
  };

  const handleAddItem = () => {
    setItems((prevItems) => [...prevItems, {key: uuidv4(), label: itemToAdd}]);
    setItemToAdd("");
  };

  const handleItemDone = ({key}) => {
    setItems((prevItems) => prevItems.map((item) => {
        if (item.key === key) {
          return { ...item, done: !item.done };
        }
        else return item;
      }
    ));
  };

  const handleFilterItems = (type) => {
    setFilterType(type);
  };

  const amountDone = items.filter((item) => item.done).length;

  const amountLeft = items.length - amountDone;

  const localStorageADD = () => {
    localStorage.clear();
    localStorage.setItem('key', JSON.stringify(items));
  }

  useEffect(()=>{
    localStorageADD();
  }, [items]);

  const filteredItems =
    !filterType || filterType === "all"
      ? items
      : filterType === "active"
      ? items.filter((item) => !item.done)
      : items.filter((item) => item.done);
  
  const searchArray = filteredItems.filter(item =>
    item.label.substring(0, searchedItem.length).toLowerCase() === searchedItem.toLowerCase())

  const arraySF = !searchedItem ? filteredItems : searchArray;

  return (
    <div className="todo-app">
      {/* App-header */}
      <div className="app-header d-flex">
        <h1>Todo List</h1>
        <h2>
          {amountLeft} more to do, {amountDone} done
        </h2>
      </div>
      <div className="top-panel d-flex">
        {/* Search-panel */}
        <input
          value={searchedItem}
          type="text"
          className="form-control search-input"
          placeholder="type to search"
          onChange={handleItemSearch}
        />
        {/* Item-status-filter */}
        <div className="btn-group">
          {buttons.map((item) => (
            <button
              onClick={() => handleFilterItems(item.type)}
              key={item.type}
              type="button"
              className={`btn btn-${
                filterType !== item.type ? "outline-" : ""
              }info`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      {/* List-group */}
      <ul className="list-group todo-list">
        {arraySF.length > 0 &&
          arraySF.map((item) => (
            <li key={item.key} className="list-group-item">
              <span className={`todo-list-item${item.done ? " done" : ""} ${item.important ? " important" : ""}` }>
                <span
                  className="todo-list-item-label"
                  onClick={() => handleItemDone(item)}
                >
                  {item.label}
                </span>
                <button
                  onClick={() => handleItemImportant(item)}
                  type="button"
                  className="btn btn-outline-success btn-sm float-right"
                >
                  <i className="fa fa-exclamation" />
                </button>
                <button
                  onClick={() => handleItemRemove(item)}
                  type="button"
                  className="btn btn-outline-danger btn-sm float-right"
                >
                  <i className="fa fa-trash-o" />
                </button>
              </span>
            </li>
          ))}
      </ul>
      {/* Add form */}
      <div className="item-add-form d-flex">
        <input
          value={itemToAdd}
          type="text"
          className="form-control"
          placeholder="What needs to be done"
          onChange={handleChangeItem}
        />
        <button className="btn btn-outline-secondary" onClick={handleAddItem}>
          Add item
        </button>
      </div>
    </div>
  );
}
export default App;