import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import CollegeNav from './collegenav';

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminStatus();
    if (isAdmin) {
      fetchUsers();
      fetchItems();
    }
  }, [isAdmin]);

  async function checkAdminStatus() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single();
      
      setIsAdmin(profile?.is_admin || false);
    }
    setLoading(false);
  }

  async function fetchUsers() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) console.error('Error fetching users:', error);
    else setUsers(data);
  }

  async function fetchItems() {
    const { data, error } = await supabase
      .from('items')
      .select('*, profiles(name)')
      .order('created_at', { ascending: false });
    
    if (error) console.error('Error fetching items:', error);
    else setItems(data);
  }

  async function toggleAdmin(userId, currentStatus) {
    const { error } = await supabase
      .from('profiles')
      .update({ is_admin: !currentStatus })
      .eq('id', userId);

    if (error) console.error('Error updating admin status:', error);
    else fetchUsers();
  }

  async function deleteItem(itemId) {
    const { error } = await supabase
      .from('items')
      .delete()
      .eq('id', itemId);

    if (error) console.error('Error deleting item:', error);
    else fetchItems();
  }

  if (loading) return <div>Loading...</div>;
  if (!isAdmin) return <div>Unauthorized</div>;

  return (
    <div>
      <CollegeNav />
      <div className="container mt-4">
        <h2>Admin Panel</h2>
        
        <div className="row">
          <div className="col-md-6">
            <h3>Users</h3>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Admin</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.is_admin ? 'Yes' : 'No'}</td>
                      <td>
                        <button 
                          className={`btn btn-sm ${user.is_admin ? 'btn-danger' : 'btn-success'}`}
                          onClick={() => toggleAdmin(user.id, user.is_admin)}
                        >
                          {user.is_admin ? 'Remove Admin' : 'Make Admin'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="col-md-6">
            <h3>Items</h3>
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Owner</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>₹{item.price}</td>
                      <td>{item.profiles?.name}</td>
                      <td>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => deleteItem(item.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}