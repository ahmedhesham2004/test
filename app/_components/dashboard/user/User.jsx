"use client";
import { useEffect, useState } from "react";
import { Trash2, Users, Search, Filter, MoreVertical, UserCheck, Mail, Phone, Shield, RefreshCw, AlertCircle } from "lucide-react";

export default function User() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);
const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
const [newUser, setNewUser] = useState({
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  sex: "",
  password: "",
  roles: [""]
});
  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = JSON.parse(localStorage.getItem('User'))?.tokens;
      const res = await fetch("https://itch-clinc.runasp.net/api/Users/GetAll", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("فشل في تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete user
  const deleteUser = async (email) => {
    if (!confirm("هل أنت متأكد أنك تريد حذف هذا المستخدم؟")) return;
    
    setDeleting(email);
    try {
      const token = JSON.parse(localStorage.getItem('User'))?.tokens;
      
      const res = await fetch(`https://itch-clinc.runasp.net/api/Users/Delete/${email}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (res.ok) {
        setUsers((prev) => prev.filter((user) => user.email !== email));
      } else {
        const contentType = res.headers.get("content-type");
        let errorMessage = "حدث خطأ غير معروف";
        
        if (contentType && contentType.includes("application/json")) {
          const errorData = await res.json();
          errorMessage = errorData.message || JSON.stringify(errorData);
        } else {
          const text = await res.text();
          errorMessage = text;
        }
        
        console.error("فشل في حذف المستخدم:", errorMessage);
        alert(`فشل في حذف المستخدم: ${errorMessage}`);
      }
      
    } catch (err) {
      console.error("خطأ في الاتصال:", err);
      alert(`خطأ في الاتصال: ${err.message}`);
    } finally {
      setDeleting(null);
    }
  };
  const handleAddUser = async () => {
  try {
    const token = JSON.parse(localStorage.getItem('User'))?.tokens;
    const res = await fetch(" https://itch-clinc.runasp.net/api/Users/Add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(newUser),
    });

    if (res.ok) {
      fetchUsers(); // Refresh the user list
      setIsAddUserModalOpen(false);
      setNewUser({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        sex: "",
        password: "",
        roles: [""]
      });
    } else {
      const errorData = await res.json();
      alert(`فشل في إضافة المستخدم: ${errorData.message || "حدث خطأ غير معروف"}`);
    }
  } catch (err) {
    console.error("Error adding user:", err);
    alert("حدث خطأ أثناء محاولة إضافة المستخدم");
  }
};

  // Filter users based on search and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.roles?.some(role => role === filterRole);
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role) => {
    switch (role) {
      case "Admin": return "bg-purple-100 text-purple-800 border-purple-200";    
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const uniqueRoles = [...new Set(users.flatMap(user => user.roles || []))];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4 space-x-reverse">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">خطأ في تحميل البيانات</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchUsers}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mr-auto py-8 px-4 min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">إدارة المستخدمين</h1>
              <p className="text-gray-600">إدارة وتتبع جميع المستخدمين في النظام</p>
            </div>
          </div>
          {/* <button
            onClick={fetchUsers}
            className="p-2 bg-white rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="w-5 h-5 text-gray-600" />
          </button> */}
          <div className="flex items-center gap-4">
  <button
    onClick={() => setIsAddUserModalOpen(true)}
    className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
  >
    إضافة مستخدم
  </button>
  <button
    onClick={fetchUsers}
    className="p-2 bg-white rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
  >
    <RefreshCw className="w-5 h-5 text-gray-600" />
  </button>
</div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">إجمالي المستخدمين</p>
              <p className="text-2xl font-bold text-gray-900">{users.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-xl">
              <UserCheck className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">المديرين</p>
              <p className="text-2xl font-bold text-gray-900">
                {users.filter(u => u.roles?.some(role => role === "مدير" || role === "Admin")).length}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-xl">
              <Shield className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">المستخدمين النشطين</p>
              <p className="text-2xl font-bold text-gray-900">{filteredUsers.length}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-xl">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="البحث في المستخدمين..."
              className="w-full text-black pl-4 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
            <select
              className="pl-4 text-black pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="all">جميع الأدوار</option>
              {uniqueRoles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">لا يوجد مستخدمين</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Desktop Table */}
            <table className="min-w-full divide-y divide-gray-200 hidden md:table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المستخدم
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإيميل
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    رقم الهاتف
                  </th>
                  {/* <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                     الجنس
                  </th> */}
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الأدوار
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id || user.email} className="hover:bg-gray-50 transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {getInitials(user.firstName, user.lastName)}
                        </div>
                        <div className="mr-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.id}</div>
                    </td> */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.phoneNumber || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.id || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {user.roles?.map((role, index) => (
                          <span key={index} className={`px-2 py-1 text-xs font-medium rounded-full border ${getRoleColor(role)}`}>
                            {role}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => deleteUser(user.email)}
                          disabled={deleting === user.email}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {deleting === user.email ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                          )}
                        </button>
                        <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <div key={user.id || user.email} className="p-4 hover:bg-gray-50 transition-colors duration-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3 space-x-reverse">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {getInitials(user.firstName, user.lastName)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-sm">
                          {user.firstName} {user.lastName}
                        </h3>
                        <div className="flex items-center gap-1 text-gray-600 mt-1">
                          <Mail className="w-3 h-3" />
                          <span className="text-xs">{user.email}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => deleteUser(user.email)}
                        disabled={deleting === user.email}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deleting === user.email ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                      <button className="p-1.5 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {user.phoneNumber && (
                    <div className="flex items-center gap-1 text-gray-600 mb-2">
                      <Phone className="w-3 h-3" />
                      <span className="text-xs">{user.phoneNumber}</span>
                    </div>
                  )}
                  {/* <div className="flex items-center gap-1 text-gray-600 mb-2">
                      <Phone className="w-3 h-3" />
                      <span className="text-xs">{user.gender}</span>
                    </div> */}
                  
                  <div className="flex flex-wrap gap-1">
                    {user.roles?.map((role, index) => (
                      <span key={index} className={`px-2 py-1 text-xs font-medium rounded-full border ${getRoleColor(role)}`}>
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Add User Modal */}
{isAddUserModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white rounded-2xl p-6 w-full max-w-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-900">إضافة مستخدم جديد</h3>
        <button 
          onClick={() => setIsAddUserModalOpen(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الأول</label>
          <input
            type="text"
            className="w-full text-black p-2 border border-gray-300 rounded-lg"
            value={newUser.firstName}
            onChange={(e) => setNewUser({...newUser, firstName: e.target.value})}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الأخير</label>
          <input
            type="text"
            className="w-full text-black p-2 border border-gray-300 rounded-lg"
            value={newUser.lastName}
            onChange={(e) => setNewUser({...newUser, lastName: e.target.value})}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
          <input
            type="email"
            className="w-full text-black p-2 border border-gray-300 rounded-lg"
            value={newUser.email}
            onChange={(e) => setNewUser({...newUser, email: e.target.value})}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
          <input
            type="tel"
            className="w-full text-black p-2 border border-gray-300 rounded-lg"
            value={newUser.phoneNumber}
            onChange={(e) => setNewUser({...newUser, phoneNumber: e.target.value})}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
          <input
            type="text"
            className="w-full text-black p-2 border border-gray-300 rounded-lg"
            value={newUser.password}
            onChange={(e) => setNewUser({...newUser, password: e.target.value})}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">النوع</label>
          <select
            className="w-full text-black p-2 border border-gray-300 rounded-lg"
            value={newUser.sex}
            onChange={(e) => setNewUser({...newUser, sex: e.target.value})}
          >
            <option value="">اختر النوع</option>
            <option value="Male">ذكر</option>
            <option value="Female">أنثى</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">الدور</label>
          <select
            className="w-full p-2 border border-gray-300 rounded-lg"
            value={newUser.roles[0]}
            onChange={(e) => setNewUser({...newUser, roles: [e.target.value]})}
          >
            <option value="">اختر الدور</option>
            {uniqueRoles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={() => setIsAddUserModalOpen(false)}
          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          إلغاء
        </button>
        <button
          onClick={handleAddUser}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          حفظ
        </button>
      </div>
    </div>
  </div>
)}
      </div>
    </div>
  );
}