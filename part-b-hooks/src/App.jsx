import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useFetch } from './hooks/useFetch';
import { useClock } from './hooks/useClock';
import { useDebounce } from './hooks/useDebounce';
import { ThemeProvider, useTheme } from './context/ThemeContext';

const API_URL = 'https://6b079b3458419b87a4386206.mockapi.io/expenses';
const CATEGORIES = ['Ăn uống', 'Đi lại', 'Học tập', 'Giải trí'];

function ExpenseTracker() {
  const { data: expenses, loading, error, addItem, deleteItem } = useFetch(API_URL);
  const currentTime = useClock();
  const { theme, toggleTheme } = useTheme();

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Ăn uống');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [formError, setFormError] = useState('');

  const [filterCategory, setFilterCategory] = useState('Tất cả');
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 400);

  const titleInputRef = useRef(null);

  useEffect(() => {
    const totalAll = expenses.reduce((sum, item) => sum + Number(item.amount), 0);
    document.title = `Tổng chi: ${totalAll.toLocaleString('vi-VN')} đ`;
  }, [expenses]);

  const categoryStats = useMemo(() => {
    return CATEGORIES.reduce((acc, cat) => {
      acc[cat] = expenses
        .filter((item) => item.category === cat)
        .reduce((sum, item) => sum + Number(item.amount), 0);
      return acc;
    }, {});
  }, [expenses]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((item) => {
      const matchCat = filterCategory === 'Tất cả' || item.category === filterCategory;
      const matchSearch = item.title.toLowerCase().includes(debouncedSearch.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [expenses, filterCategory, debouncedSearch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || Number(amount) <= 0 || !date) {
      setFormError('Vui lòng nhập đầy đủ nội dung, ngày chi và số tiền > 0.');
      return;
    }
    setFormError('');
    const ok = await addItem({
      title: title.trim(),
      amount: Number(amount),
      category,
      date,
    });
    if (ok) {
      setTitle('');
      setAmount('');
      titleInputRef.current?.focus();
    }
  };

  const containerStyle = {
    minHeight: '100vh',
    padding: 20,
    backgroundColor: theme === 'dark' ? '#1e1e2e' : '#ffffff',
    color: theme === 'dark' ? '#cdd6f4' : '#111111',
  };

  return (
    <div style={containerStyle}>
      <div style={{ maxWidth: 850, margin: '0 auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>Quản lý chi tiêu (Hooks)</h1>
          <div>
            <span>🕒 {currentTime}</span>
            <button onClick={toggleTheme} style={{ marginLeft: 12 }}>
              {theme === 'light' ? '🌙 Chế độ tối' : '☀️ Chế độ sáng'}
            </button>
          </div>
        </header>

        {/* Thống kê tổng tiền theo từng loại */}
        <div style={{ display: 'flex', gap: 12, margin: '16px 0' }}>
          {CATEGORIES.map((cat) => (
            <div key={cat} style={{ border: '1px solid #888', padding: 10, flex: 1 }}>
              <div>{cat}</div>
              <strong>{categoryStats[cat].toLocaleString('vi-VN')} đ</strong>
            </div>
          ))}
        </div>

        {/* Form thêm khoản chi */}
        <form onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
          {formError && <p style={{ color: 'red' }}>{formError}</p>}
          <input
            ref={titleInputRef}
            type="text"
            placeholder="Nội dung chi..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="number"
            placeholder="Số tiền"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <button type="submit">Thêm</button>
        </form>

        {/* Lọc theo loại & Tìm kiếm debounce */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            {['Tất cả', ...CATEGORIES].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                style={{ marginRight: 6, fontWeight: filterCategory === cat ? 'bold' : 'normal' }}
              >
                {cat}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Tìm theo nội dung..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading && <p>Đang tải dữ liệu từ MockAPI...</p>}
        {error && <p style={{ color: 'red' }}>Lỗi: {error}</p>}

        {!loading && (
          <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Nội dung</th>
                <th>Loại</th>
                <th>Ngày chi</th>
                <th>Số tiền</th>
                <th>Xóa</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.category}</td>
                  <td>{item.date}</td>
                  <td>{Number(item.amount).toLocaleString('vi-VN')} đ</td>
                  <td>
                    <button
                      onClick={() => {
                        if (window.confirm(`Xóa khoản "${item.title}"?`)) deleteItem(item.id);
                      }}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3"><strong>Tổng tiền</strong></td>
                <td colSpan="2">
                  <strong>
                    {filteredExpenses
                      .reduce((sum, item) => sum + Number(item.amount), 0)
                      .toLocaleString('vi-VN')}{' '}
                    đ
                  </strong>
                </td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ExpenseTracker />
    </ThemeProvider>
  );
}