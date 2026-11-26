import React, { Component } from 'react';

class ExpenseList extends Component {
  handleDelete = (id, title) => {
    if (window.confirm(`Bạn có chắc muốn xóa khoản "${title}"?`)) {
      this.props.onDeleteExpense(id);
    }
  };

  render() {
    const { expenses } = this.props;
    const total = expenses.reduce((sum, item) => sum + Number(item.amount), 0);

    return (
      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Nội dung</th>
            <th>Loại</th>
            <th>Ngày chi</th>
            <th>Số tiền</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {expenses.length === 0 ? (
            <tr><td colSpan="5" align="center">Không có khoản chi nào</td></tr>
          ) : (
            expenses.map((item) => (
              <tr key={item.id}>
                <td>{item.title}</td>
                <td>{item.category}</td>
                <td>{item.date}</td>
                <td>{Number(item.amount).toLocaleString('vi-VN')} đ</td>
                <td>
                  <button onClick={() => this.handleDelete(item.id, item.title)}>Xóa</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan="3"><strong>Tổng tiền hiển thị</strong></td>
            <td colSpan="2"><strong>{total.toLocaleString('vi-VN')} đ</strong></td>
          </tr>
        </tfoot>
      </table>
    );
  }
}

export default ExpenseList;