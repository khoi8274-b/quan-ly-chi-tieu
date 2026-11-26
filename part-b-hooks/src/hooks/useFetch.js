import { useState, useEffect, useCallback } from 'react';

export function useFetch(url) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Lỗi tải dữ liệu (${res.status})`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err.message || 'Không thể kết nối đến server');
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const addItem = async (newItem) => {
    setError(null);
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      if (!res.ok) throw new Error('Thêm khoản chi thất bại');
      const created = await res.json();
      setData((prev) => [created, ...prev]);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const deleteItem = async (id) => {
    setError(null);
    try {
      const res = await fetch(`${url}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Xóa khoản chi thất bại');
      setData((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return { data, loading, error, addItem, deleteItem };
}