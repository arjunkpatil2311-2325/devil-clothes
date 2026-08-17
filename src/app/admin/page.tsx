"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  Package, 
  Users, 
  DollarSign, 
  Activity, 
  LayoutDashboard, 
  ShoppingBag, 
  ShoppingCart,
  Plus,
  Edit2,
  Trash2,
  X,
  AlertTriangle
} from "lucide-react";
import { mockProducts, Product } from "@/lib/mock-data";

// --- Types & Mock Data ---

type OrderStatus = 'New' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

interface Order {
  id: string;
  customer: string;
  productName: string;
  amount: number;
  status: OrderStatus;
  date: string;
}

const initialOrders: Order[] = [
  { id: "ORD-7392", customer: "Rahul Sharma", productName: "NOCTURNAL HEAVY HOODIE", amount: 7798, status: "Processing", date: "Today, 14:20" },
  { id: "ORD-7391", customer: "Priya Desai", productName: "ESSENTIAL CARGO PANTS", amount: 3499, status: "Shipped", date: "Today, 11:05" },
  { id: "ORD-7390", customer: "Karan Patel", productName: "OVERSIZED GRAPHIC TEE", amount: 12297, status: "Delivered", date: "Yesterday" },
  { id: "ORD-7389", customer: "Anjali Gupta", productName: "SIGNATURE CAP", amount: 1899, status: "New", date: "Yesterday" },
];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "products" | "orders">("dashboard");
  
  // Local state for demo purposes
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  
  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Stats calculations
  const totalRevenue = orders.reduce((acc, order) => acc + (order.status !== 'Cancelled' ? order.amount : 0), 0);
  const totalOrders = orders.length;
  // Let's pretend products with id > "2" have low stock for the demo
  const lowStockCount = 2; 

  const handleDeleteProduct = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleSaveProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newProduct: Product = {
      id: editingProduct ? editingProduct.id : `PROD-${Date.now()}`,
      name: formData.get("name") as string,
      category: formData.get("category") as "T-SHIRTS" | "HOODIES" | "PANTS" | "ACCESSORIES",
      price: Number(formData.get("price")),
      image: formData.get("image") as string || "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop",
      isNew: formData.get("isNew") === "on",
      description: editingProduct ? editingProduct.description : "New product description",
      sizes: editingProduct ? editingProduct.sizes : ["S", "M", "L", "XL"],
      stock: editingProduct ? editingProduct.stock : 100,
    };
    
    const salePriceRaw = formData.get("salePrice");
    if (salePriceRaw) newProduct.salePrice = Number(salePriceRaw);

    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? newProduct : p));
    } else {
      setProducts([newProduct, ...products]);
    }
    setIsProductModalOpen(false);
  };

  const updateOrderStatus = (id: string, newStatus: OrderStatus) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
  };

  return (
    <div className="flex w-full min-h-screen bg-[#050505]">
      
      {/* Sidebar */}
      <aside className="w-64 bg-black border-r border-white/10 hidden md:flex flex-col">
        <div className="p-6 border-b border-white/10">
          <div className="text-xl font-black tracking-widest uppercase">
            DEVIL <span className="text-gray-500">ADMIN</span>
          </div>
          <div className="mt-2 text-[10px] font-bold tracking-widest uppercase bg-white text-black px-2 py-0.5 inline-block">Demo Mode</div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold tracking-widest uppercase transition-colors ${activeTab === "dashboard" ? "bg-white text-black" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
          >
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab("products")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold tracking-widest uppercase transition-colors ${activeTab === "products" ? "bg-white text-black" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
          >
            <ShoppingBag className="w-4 h-4" /> Products
          </button>
          <button 
            onClick={() => setActiveTab("orders")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold tracking-widest uppercase transition-colors ${activeTab === "orders" ? "bg-white text-black" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
          >
            <ShoppingCart className="w-4 h-4" /> Orders
          </button>
        </nav>
      </aside>

      {/* Mobile Topbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-black border-b border-white/10 p-4 z-40 flex justify-between items-center">
        <div className="text-lg font-black tracking-widest uppercase">
          DEVIL <span className="text-gray-500">ADMIN</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setActiveTab("dashboard")} className={`p-2 ${activeTab === "dashboard" ? "text-white" : "text-gray-500"}`}><LayoutDashboard className="w-5 h-5" /></button>
          <button onClick={() => setActiveTab("products")} className={`p-2 ${activeTab === "products" ? "text-white" : "text-gray-500"}`}><ShoppingBag className="w-5 h-5" /></button>
          <button onClick={() => setActiveTab("orders")} className={`p-2 ${activeTab === "orders" ? "text-white" : "text-gray-500"}`}><ShoppingCart className="w-5 h-5" /></button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 pt-24 md:pt-10 overflow-y-auto">
        
        {/* DASHBOARD TAB */}
        {activeTab === "dashboard" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl font-black tracking-tighter uppercase mb-8">Dashboard Overview</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
              <div className="bg-[#111] border border-white/10 p-6 relative">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-xs font-bold tracking-widest uppercase text-gray-500">Total Revenue</div>
                  <DollarSign className="w-5 h-5 text-green-400" />
                </div>
                <div className="text-3xl font-black">₹{totalRevenue.toLocaleString('en-IN')}</div>
              </div>
              <div className="bg-[#111] border border-white/10 p-6 relative">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-xs font-bold tracking-widest uppercase text-gray-500">Orders</div>
                  <Package className="w-5 h-5 text-gray-400" />
                </div>
                <div className="text-3xl font-black">{totalOrders}</div>
              </div>
              <div className="bg-[#111] border border-white/10 p-6 relative">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-xs font-bold tracking-widest uppercase text-gray-500">Total Products</div>
                  <ShoppingBag className="w-5 h-5 text-gray-400" />
                </div>
                <div className="text-3xl font-black">{products.length}</div>
              </div>
              <div className="bg-[#111] border border-red-500/30 p-6 relative">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-xs font-bold tracking-widest uppercase text-red-400">Low Stock</div>
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <div className="text-3xl font-black text-red-400">{lowStockCount}</div>
              </div>
            </div>

            <div className="bg-[#111] border border-white/10 p-6">
              <h2 className="text-lg font-black tracking-widest uppercase mb-6 border-b border-white/10 pb-4">Recent Orders</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="text-xs font-bold tracking-widest uppercase text-gray-500 border-b border-white/5">
                      <th className="pb-4 pr-4">Order</th>
                      <th className="pb-4 px-4">Customer</th>
                      <th className="pb-4 px-4">Amount</th>
                      <th className="pb-4 pl-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="border-b border-white/5 last:border-0 text-sm">
                        <td className="py-4 pr-4 font-bold">{order.id}</td>
                        <td className="py-4 px-4 text-gray-300">{order.customer}</td>
                        <td className="py-4 px-4 text-gray-400">₹{order.amount.toLocaleString('en-IN')}</td>
                        <td className="py-4 pl-4 text-right">
                          <span className={`px-2 py-1 text-[10px] font-bold tracking-widest uppercase ${
                            order.status === 'Delivered' ? 'bg-green-500/20 text-green-400' : 
                            order.status === 'Processing' ? 'bg-yellow-500/20 text-yellow-400' : 
                            order.status === 'Cancelled' ? 'bg-red-500/20 text-red-400' : 
                            'bg-white/10 text-white'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === "products" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-end mb-8">
              <h1 className="text-3xl font-black tracking-tighter uppercase">Products</h1>
              <button 
                onClick={() => { setEditingProduct(null); setIsProductModalOpen(true); }}
                className="bg-white text-black px-4 py-2 font-black tracking-widest uppercase text-xs hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Add Product
              </button>
            </div>
            
            <div className="bg-[#111] border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="text-[10px] font-bold tracking-widest uppercase text-gray-500 border-b border-white/10 bg-black/50">
                      <th className="py-4 px-6">Product</th>
                      <th className="py-4 px-6">Category</th>
                      <th className="py-4 px-6">Price</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            <div className="relative w-12 h-16 bg-black border border-white/10 shrink-0">
                              <Image src={product.image} alt={product.name} fill className="object-cover" />
                            </div>
                            <span className="font-bold text-sm tracking-wide uppercase line-clamp-2">{product.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-400 uppercase tracking-widest">{product.category}</td>
                        <td className="py-4 px-6 text-sm font-medium">
                          {product.salePrice ? (
                            <div>
                              <div className="text-red-400">₹{product.salePrice.toLocaleString('en-IN')}</div>
                              <div className="text-xs text-gray-600 line-through">₹{product.price.toLocaleString('en-IN')}</div>
                            </div>
                          ) : (
                            <div>₹{product.price.toLocaleString('en-IN')}</div>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex gap-2">
                            <span className="px-2 py-1 text-[10px] font-bold tracking-widest uppercase bg-green-500/20 text-green-400">In Stock</span>
                            {product.isNew && <span className="px-2 py-1 text-[10px] font-bold tracking-widest uppercase bg-white text-black">New</span>}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex justify-end gap-3">
                            <button 
                              onClick={() => { setEditingProduct(product); setIsProductModalOpen(true); }}
                              className="text-gray-400 hover:text-white transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteProduct(product.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === "orders" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl font-black tracking-tighter uppercase mb-8">Orders</h1>
            
            <div className="bg-[#111] border border-white/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="text-[10px] font-bold tracking-widest uppercase text-gray-500 border-b border-white/10 bg-black/50">
                      <th className="py-4 px-6">Order ID</th>
                      <th className="py-4 px-6">Customer</th>
                      <th className="py-4 px-6">Product</th>
                      <th className="py-4 px-6">Total</th>
                      <th className="py-4 px-6 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                        <td className="py-4 px-6 font-bold">{order.id}</td>
                        <td className="py-4 px-6 text-sm text-gray-300">{order.customer}</td>
                        <td className="py-4 px-6 text-sm text-gray-400 uppercase text-[10px] tracking-wider">{order.productName}</td>
                        <td className="py-4 px-6 text-sm font-medium">₹{order.amount.toLocaleString('en-IN')}</td>
                        <td className="py-4 px-6 text-right">
                          <select 
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                            className={`bg-black border border-white/20 text-xs font-bold tracking-widest uppercase px-3 py-2 outline-none focus:border-white transition-colors cursor-pointer ${
                              order.status === 'Delivered' ? 'text-green-400' : 
                              order.status === 'Processing' ? 'text-yellow-400' : 
                              order.status === 'Cancelled' ? 'text-red-400' : 'text-white'
                            }`}
                          >
                            <option value="New">New</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Product Form Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111] border border-white/20 w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-[#111] z-10">
              <h2 className="text-xl font-black tracking-widest uppercase">
                {editingProduct ? "Edit Product" : "Add Product"}
              </h2>
              <button onClick={() => setIsProductModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSaveProduct} className="p-6 space-y-6">
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-gray-400 mb-2">Product Name</label>
                <input 
                  type="text" 
                  name="name" 
                  required 
                  defaultValue={editingProduct?.name}
                  className="w-full bg-black border border-white/20 px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors text-white" 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-gray-400 mb-2">Category</label>
                  <select 
                    name="category" 
                    required 
                    defaultValue={editingProduct?.category || "T-Shirts"}
                    className="w-full bg-black border border-white/20 px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors text-white uppercase tracking-widest"
                  >
                    <option value="T-Shirts">T-Shirts</option>
                    <option value="Hoodies">Hoodies</option>
                    <option value="Pants">Pants</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-gray-400 mb-2">Is New Drop?</label>
                  <div className="h-[46px] flex items-center px-4 border border-white/20 bg-black">
                    <input 
                      type="checkbox" 
                      name="isNew" 
                      defaultChecked={editingProduct?.isNew}
                      className="w-4 h-4 accent-white" 
                    />
                    <span className="ml-3 text-sm font-bold tracking-widest uppercase">Yes</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-gray-400 mb-2">Regular Price (₹)</label>
                  <input 
                    type="number" 
                    name="price" 
                    required 
                    defaultValue={editingProduct?.price}
                    className="w-full bg-black border border-white/20 px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors text-white" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-gray-400 mb-2">Sale Price (₹) <span className="text-gray-600 font-normal normal-case">- Optional</span></label>
                  <input 
                    type="number" 
                    name="salePrice" 
                    defaultValue={editingProduct?.salePrice}
                    className="w-full bg-black border border-white/20 px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors text-white" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-gray-400 mb-2">Image URL</label>
                <input 
                  type="url" 
                  name="image" 
                  required 
                  defaultValue={editingProduct?.image || "https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format&fit=crop"}
                  className="w-full bg-black border border-white/20 px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors text-white" 
                />
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setIsProductModalOpen(false)}
                  className="flex-1 bg-transparent border border-white/20 text-white py-4 font-black tracking-widest uppercase text-xs hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 bg-white text-black py-4 font-black tracking-widest uppercase text-xs hover:bg-gray-200 transition-colors"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
