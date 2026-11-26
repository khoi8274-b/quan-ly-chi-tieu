import React, { Component } from 'react';
import Clock from './components/Clock';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';

const INITIAL_EXPENSES = [
  { id: '1', title: 'Cơm trưa', amount: 35000, category: 'Ăn uống', date: '2026-11-25' },
  { id: '2', title: 'Đổ xăng', amount: 50000, category: 'Đi lại', date: '2026-11-25' },
  { id: '3', title: 'Mua sách giáo trình', amount: 120000, category: 'Học tập', date: '2026-11-26' },
];

const FILTERS = ['Tất cả', 'Ăn uống', 'Đi lại', 'Học tập', 'Giải trí'];

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expenses: INITIAL_EXPENSES,
      filterCategory: 'Tất cả',
      showClock: true,
    };
  }

  componentDidMount() {
    this.updateTitle();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.expenses !== this.state.expenses) {
      this.updateTitle();
    }
  }

  updateTitle() {
    const totalAll = this.state.expenses.reduce((sum, item) => sum + Number(item.amount), 0);
    document.title = `Tổng chi: ${totalAll.toLocaleString('vi-VN')} đ`;
  }

  handleAddExpense = (newExpense) => {
    this.setState((prev) => ({
      expenses: [newExpense, ...prev.expenses],
    }));
  };

  handleDeleteExpense = (id) => {
    this.setState((prev) => ({
      expenses: prev.expenses.filter((item) => item.id !== id),
    }));
  };

  render() {
    const { expenses, filterCategory, showClock } = this.state;
    const filteredExpenses =
      filterCategory === 'Tất cả'
        ? expenses
        : expenses.filter((item) => item.category === filterCategory);

    return (
      <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>Quản lý chi tiêu (Class)</h1>
          <div>
            {showClock && <Clock />}
            <button
              style={{ marginLeft: 8 }}
              onClick={() => this.setState((prev) => ({ showClock: !prev.showClock }))}
            >
              {showClock ? 'Ẩn đồng hồ' : 'Hiện đồng hồ'}
            </button>
          </div>
        </header>

        <ExpenseForm onAddExpense={this.handleAddExpense} />

        <div style={{ marginBottom: 12 }}>
          {FILTERS.map((cat) => (
            <button
              key={cat}
              onClick={() => this.setState({ filterCategory: cat })}
              style={{
                marginRight: 6,
                fontWeight: filterCategory === cat ? 'bold' : 'normal',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <ExpenseList
          expenses={filteredExpenses}
          onDeleteExpense={this.handleDeleteExpense}
        />
      </div>
    );
  }
}

export default App;