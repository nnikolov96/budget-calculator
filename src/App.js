import React, { useState, useEffect } from 'react';
import './App.css';
import ExpenseList from './components/ExpenseList';
import ExpenseForm from './components/ExpenseForm';
import Alert from './components/Alert'
import uuid from 'uuid/v4';

/* const initialExpenses = [
  { id: uuid(), charge: 'rent', amount: 1600 },
  { id: uuid(), charge: 'food', amount: 200 },
  { id: uuid(), charge: 'drinks', amount: 2000 }
];
 */

const initialExpenses = localStorage.getItem('expenses') ? JSON.parse(localStorage.getItem('expenses')) : []

function App() {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [ charge, setCharge ] = useState('');
  const [ amount , setAmount ] = useState('');
  const [alert, setAlert] = useState({show: false});
  const [edit, setEdit] = useState(false);
  const [id, setId] = useState(0);
  useEffect( () => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]); 

  const handleCharge = e => {
    setCharge(e.target.value);
  };
  const handleAmount = e => {
    setAmount(e.target.value);
  };

  const handleAlert = ({type, text})=> {
    setAlert({show: true, type, text});
    setTimeout(() => { 
      setAlert({show: false})
    }, 2000);
  };

  const handleSubmit = e => { 
    e.preventDefault();
    if(charge !== '' && amount > 0) { 

      if(edit){
        let tempExpenses = expenses.map(item => { 
          return item.id === id ? {...item, charge, amount} : item 
        });
        setExpenses(tempExpenses);
        handleAlert({ type: 'success', text: 'Item Edited'})
        setEdit(false);
      }
      else { 
        const singleExpense = { id: uuid(), charge, amount };
        setExpenses([...expenses, singleExpense]);
        handleAlert({ type: 'success', text: 'Item Added'})
      }
      setCharge('');
      setAmount('');
    }
    else { 
      handleAlert({ type: 'danger', text: 'Item was not added. Please fill the form correctly'})
    }
  };

  const clearItems = () => { 
    setExpenses([]);
    handleAlert({type: 'danger', text: 'all items deleted'})
  }

  const handleDelete = (id) => {
    let tempExpenses = expenses.filter(item => { 
      return item.id !== id
    });
    setExpenses(tempExpenses);
    handleAlert({type: 'danger', text: 'item deleted'})
  }

  const handleEdit = (id) => {
    let expense = expenses.find((item) => {
      return item.id === id;
    });
    let {charge, amount} = expense;
    setCharge(charge);
    setAmount(amount);
    setEdit(true);
    setId(id);

  }

  return (
    <>
      {alert.show && <Alert type={alert.type} text={alert.text}/>}
      <h1>Budget Calculator</h1>
      <main className='App'>
        <ExpenseForm charge = {charge} 
          amount = {amount} 
          handleAmount = {handleAmount}
          edit = {edit}
          handleCharge = {handleCharge} 
          handleSubmit = {handleSubmit}/>

        <ExpenseList expenses = { expenses } handleDelete = {handleDelete} handleEdit = {handleEdit} clearItems = {clearItems} />
      </main>
      <h1>
        total spending : <span className='total'>$ {expenses.reduce((acc, curr) => {
          return (acc += parseInt(curr.amount));
        }, 0)}</span>
      </h1>
    </>
  );
}

export default App;
