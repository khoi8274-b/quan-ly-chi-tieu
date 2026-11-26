import React, { Component } from 'react';

const CATEGORIES = ['Ăn uống', 'Đi lại', 'Học tập', 'Giải trí'];

class ExpenseForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      amount: '',
      category: 'Ăn uống',
      date: new Date().toISOString().split('T')[0],
      error: '',
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { title, amount, category, date } = this.state;

    if (!title.trim()) {
      this.setState({ error: 'Vui lòng nhập nội dung khoản chi.' });
      return;
    }
    if (!amount || Number(amount) <= 0) {
      this.setState({ error: 'Số tiền phải lớn hơn 0.' });
      return;
    }
    if (!date) {
      this.setState({ error: 'Vui lòng chọn ngày chi.' });
      return;
    }

    this.props.onAddExpense({
      id: Date.now().toString(),
      title: title.trim(),
      amount: Number(amount),
      category,
      date,
    });

    this.setState({
      title: '',
      amount: '',
      category: 'Ăn uống',
      date: new Date().toISOString().split('T')[0],
      error: '',
    });
  };

  render() {
    const { title, amount, category, date, error } = this.state;
    return (
      <form onSubmit={this.handleSubmit} style={{ marginBottom: 16 }}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <input
          type="text"
          placeholder="Nội dung chi..."
          value={title}
          onChange={(e) => this.setState({ title: e.target.value })}
        />
        <input
          type="number"
          placeholder="Số tiền (VNĐ)"
          value={amount}
          onChange={(e) => this.setState({ amount: e.target.value })}
        />
        <select
          value={category}
          onChange={(e) => this.setState({ category: e.target.value })}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => this.setState({ date: e.target.value })}
        />
        <button type="submit">Thêm khoản chi</button>
      </form>
    );
  }
}

export default ExpenseForm;