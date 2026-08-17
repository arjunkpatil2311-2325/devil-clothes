"use client";

import { useState, useEffect } from "react";
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
  AlertTriangle,
  Upload,
  MessageCircle
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";

// --- Types ---
type OrderStatus = 'awaiting_payment' | 'processing' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
type PaymentStatus = 'pending' | 'fully_paid';

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone?: string;
  total: number;
  order_status: OrderStatus;
  payment_status: PaymentStatus;
  created_at: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  original_price: number | null;
  category: string;
  collection: string | null;
  images: string[];
  stock: number;
  status: string;
  featured: boolean;
  bestseller: boolean;
  created_at: string;
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "products" | "orders">("dashboard");
  
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Image Upload State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [productsRes, ordersRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('orders').select('*').order('created_at', { ascending: false })
      ]);
      
      if (productsRes.data) setProducts(productsRes.data);
      if (ordersRes.data) setOrders(ordersRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Stats calculations
  const totalRevenue = orders.reduce((acc, order) => acc + (order.order_status !== 'cancelled' ? Number(order.total) : 0), 0);
  const totalOrders = orders.length;
  const lowStockCount = products.filter(p => p.stock < 5).length; 

  const handleDeleteProduct = async (id: string) => {
    if (confirm("Are you sure you want to archive this product?")) {
      const { error } = await supabase.from('products').update({ status: 'Archived' }).eq('id', id);
      if (!error) {
        fetchData();
      } else {
        alert("Failed to archive product: " + error.message);
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const formData = new FormData(e.currentTarget);
      const name = formData.get("name") as string;
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      let imageUrl = editingProduct?.images?.[0] || "";

      // Upload image if a new one is selected
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
        imageUrl = data.publicUrl;
      }

      const productData = {
        name,
        slug: editingProduct ? editingProduct.slug : slug,
        category: formData.get("category") as string,
        price: Number(formData.get("price")),
        original_price: formData.get("original_price") ? Number(formData.get("original_price")) : null,
        stock: Number(formData.get("stock")),
        status: formData.get("status") as string,
        featured: formData.get("featured") === "on",
        images: imageUrl ? [imageUrl] : [],
        description: editingProduct ? editingProduct.description : "New product description",
      };

      if (editingProduct) {
        const { error } = await supabase.from('products').update(productData).eq('id', editingProduct.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('products').insert([productData]);
        if (error) throw error;
      }

      setIsProductModalOpen(false);
      setImageFile(null);
      setImagePreview(null);
      fetchData();
    } catch (error: any) {
      alert("Error saving product: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const updateOrderStatus = async (id: string, newStatus: OrderStatus) => {
    const { error } = await supabase.from('orders').update({ order_status: newStatus }).eq('id', id);
    if (!error) {
      setOrders(orders.map(o => o.id === id ? { ...o, order_status: newStatus } : o));
    }
  };

  const confirmPayment = async (id: string) => {
    const { error } = await supabase.from('orders').update({ 
      payment_status: 'fully_paid',
      order_status: 'processing'
    }).eq('id', id);
    
    if (!error) {
      setOrders(orders.map(o => o.id === id ? { ...o, payment_status: 'fully_paid', order_status: 'processing' } : o));
      alert("Payment Confirmed and Order moved to Processing!");
    } else {
      alert("Failed to confirm payment: " + error.message);
    }
  };

  const generateAdminWhatsappUrl = (order: Order) => {
    const message = `Hi ${order.customer_name}! 👋\n\nYour ThreeKnots pre-order #${order.order_number} is ready for payment.\n\nAmount to pay: ₹${order.total}\n\nPlease complete the prepaid payment using the payment QR/details provided below.\n\nAfter completing the payment, please send your payment confirmation/screenshot here.\n\nYour order will be confirmed after we verify the payment.\n\nThank you for shopping with ThreeKnots ❤️`;
    // If we have a customer phone, we'd use it. For now, just generate the link to open standard wa.me
    // Normally it's wa.me/PHONENUMBER. We'll omit the phone if we don't have it parsed reliably.
    const phone = order.customer_phone ? order.customer_phone.replace(/[^0-9]/g, '') : '';
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  const openModal = (product: Product | null = null) => {
    setEditingProduct(product);
    setImageFile(null);
    setImagePreview(product?.images?.[0] || null);
    setIsProductModalOpen(true);
  };

  return (
    <div className="flex w-full min-h-screen bg-[#050505]">
      
      {/* Sidebar */}
      <aside className="w-64 bg-black border-r border-white/10 hidden md:flex flex-col">
        <div className="p-6 border-b border-white/10">
          <div className="text-xl font-black tracking-widest uppercase">
            DEVIL <span className="text-[#7A2635]">ADMIN</span>
          </div>
          <div className="mt-2 text-[10px] font-bold tracking-widest uppercase bg-[#7A2635] text-white px-2 py-0.5 inline-block">Production</div>
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
          DEVIL <span className="text-[#7A2635]">ADMIN</span>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setActiveTab("dashboard")} className={`p-2 ${activeTab === "dashboard" ? "text-white" : "text-gray-500"}`}><LayoutDashboard className="w-5 h-5" /></button>
          <button onClick={() => setActiveTab("products")} className={`p-2 ${activeTab === "products" ? "text-white" : "text-gray-500"}`}><ShoppingBag className="w-5 h-5" /></button>
          <button onClick={() => setActiveTab("orders")} className={`p-2 ${activeTab === "orders" ? "text-white" : "text-gray-500"}`}><ShoppingCart className="w-5 h-5" /></button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 pt-24 md:pt-10 overflow-y-auto">
        
        {isLoading ? (
           <div className="flex items-center justify-center h-full">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
           </div>
        ) : (
          <>
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
                            <td className="py-4 pr-4 font-bold">{order.order_number}</td>
                            <td className="py-4 px-4 text-gray-300">{order.customer_name}</td>
                            <td className="py-4 px-4 text-gray-400">₹{Number(order.total).toLocaleString('en-IN')}</td>
                            <td className="py-4 pl-4 text-right">
                              <span className={`px-2 py-1 text-[10px] font-bold tracking-widest uppercase ${
                                order.order_status === 'delivered' ? 'bg-green-500/20 text-green-400' : 
                                order.order_status === 'processing' || order.order_status === 'shipped' || order.order_status === 'packed' ? 'bg-blue-500/20 text-blue-400' : 
                                order.order_status === 'cancelled' ? 'bg-red-500/20 text-red-400' : 
                                'bg-yellow-500/20 text-yellow-400'
                              }`}>
                                {order.order_status.replace('_', ' ')}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {orders.length === 0 && (
                          <tr>
                            <td colSpan={4} className="py-8 text-center text-gray-500 text-sm font-medium">No orders yet.</td>
                          </tr>
                        )}
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
                    onClick={() => openModal()}
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
                          <th className="py-4 px-6">Status / Stock</th>
                          <th className="py-4 px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product) => (
                          <tr key={product.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-4">
                                <div className="relative w-12 h-16 bg-black border border-white/10 shrink-0">
                                  {product.images?.[0] ? (
                                    <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                                  ) : (
                                    <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                                      <Image className="w-4 h-4 text-gray-600" src="" alt="No Image" />
                                    </div>
                                  )}
                                </div>
                                <span className="font-bold text-sm tracking-wide uppercase line-clamp-2">{product.name}</span>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-sm text-gray-400 uppercase tracking-widest">{product.category}</td>
                            <td className="py-4 px-6 text-sm font-medium">
                              {product.original_price ? (
                                <div>
                                  <div className="text-red-400">₹{product.price.toLocaleString('en-IN')}</div>
                                  <div className="text-xs text-gray-600 line-through">₹{product.original_price.toLocaleString('en-IN')}</div>
                                </div>
                              ) : (
                                <div>₹{product.price.toLocaleString('en-IN')}</div>
                              )}
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex gap-2 flex-col items-start">
                                <span className={`px-2 py-1 text-[10px] font-bold tracking-widest uppercase ${
                                  product.status === 'Published' ? 'bg-green-500/20 text-green-400' :
                                  product.status === 'Archived' ? 'bg-red-500/20 text-red-400' :
                                  'bg-yellow-500/20 text-yellow-400'
                                }`}>
                                  {product.status}
                                </span>
                                <span className="text-xs text-gray-500">Stock: {product.stock}</span>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-right">
                              <div className="flex justify-end gap-3">
                                <button 
                                  onClick={() => openModal(product)}
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
                        {products.length === 0 && (
                          <tr>
                            <td colSpan={5} className="py-12 text-center text-gray-500 text-sm font-medium">No products found. Create your first product!</td>
                          </tr>
                        )}
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
                          <th className="py-4 px-6">Total</th>
                          <th className="py-4 px-6">Payment</th>
                          <th className="py-4 px-6">Fulfillment</th>
                          <th className="py-4 px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                            <td className="py-4 px-6 font-bold">
                              {order.order_number}
                              {order.order_status === 'awaiting_payment' && (
                                <div className="mt-1 text-[10px] text-yellow-500 font-bold tracking-widest uppercase flex items-center">
                                  <AlertTriangle className="w-3 h-3 mr-1" /> Awaiting Payment
                                </div>
                              )}
                            </td>
                            <td className="py-4 px-6 text-sm text-gray-300">
                              <div>{order.customer_name}</div>
                              <div className="text-xs text-gray-500">{order.customer_phone || "No phone"}</div>
                            </td>
                            <td className="py-4 px-6 text-sm font-medium">₹{Number(order.total).toLocaleString('en-IN')}</td>
                            
                            {/* Payment Status */}
                            <td className="py-4 px-6">
                               <span className={`px-2 py-1 text-[10px] font-bold tracking-widest uppercase ${
                                order.payment_status === 'fully_paid' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                              }`}>
                                {order.payment_status.replace('_', ' ')}
                              </span>
                            </td>

                            {/* Order Status Select */}
                            <td className="py-4 px-6">
                              <select 
                                value={order.order_status}
                                onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                                className={`bg-black border border-white/20 text-xs font-bold tracking-widest uppercase px-3 py-2 outline-none focus:border-white transition-colors cursor-pointer ${
                                  order.order_status === 'delivered' ? 'text-green-400' : 
                                  order.order_status === 'cancelled' ? 'text-red-400' : 'text-white'
                                }`}
                              >
                                <option value="awaiting_payment">Awaiting Payment</option>
                                <option value="processing">Processing</option>
                                <option value="packed">Packed</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>

                            {/* Actions */}
                            <td className="py-4 px-6 text-right">
                               <div className="flex justify-end gap-2">
                                  <a 
                                    href={generateAdminWhatsappUrl(order)} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    title="Message on WhatsApp"
                                    className="p-2 bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors rounded-sm"
                                  >
                                     <MessageCircle className="w-4 h-4" />
                                  </a>
                                  {order.payment_status === 'pending' && (
                                     <button 
                                        onClick={() => confirmPayment(order.id)}
                                        title="Confirm Payment"
                                        className="p-2 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 transition-colors rounded-sm text-[10px] font-bold uppercase tracking-widest flex items-center"
                                     >
                                        <DollarSign className="w-4 h-4 mr-1" /> Confirm
                                     </button>
                                  )}
                               </div>
                            </td>
                          </tr>
                        ))}
                        {orders.length === 0 && (
                          <tr>
                            <td colSpan={4} className="py-12 text-center text-gray-500 text-sm font-medium">No orders found.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </>
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
              
              {/* Image Upload Area */}
              <div>
                 <label className="block text-xs font-bold tracking-widest uppercase text-gray-400 mb-2">Product Image</label>
                 <div className="flex items-center gap-4">
                    <div className="relative w-24 h-32 bg-black border border-white/20 flex items-center justify-center overflow-hidden">
                      {imagePreview ? (
                        <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                      ) : (
                        <Upload className="w-6 h-6 text-gray-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <input 
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:bg-white file:text-black file:font-bold file:uppercase file:tracking-widest hover:file:bg-gray-200 cursor-pointer"
                      />
                      <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-wider">Required: High quality JPG/PNG</p>
                    </div>
                 </div>
              </div>

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
                  <label className="block text-xs font-bold tracking-widest uppercase text-gray-400 mb-2">Status</label>
                  <select 
                    name="status" 
                    required 
                    defaultValue={editingProduct?.status || "Published"}
                    className="w-full bg-black border border-white/20 px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors text-white uppercase tracking-widest"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-gray-400 mb-2">Selling Price (₹)</label>
                  <input 
                    type="number" 
                    name="price" 
                    required 
                    defaultValue={editingProduct?.price}
                    className="w-full bg-black border border-white/20 px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors text-white" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-gray-400 mb-2">Original Price (₹) <span className="text-gray-600 normal-case font-normal">- Optional</span></label>
                  <input 
                    type="number" 
                    name="original_price" 
                    defaultValue={editingProduct?.original_price || ""}
                    className="w-full bg-black border border-white/20 px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors text-white" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-gray-400 mb-2">Stock Quantity</label>
                  <input 
                    type="number" 
                    name="stock" 
                    required 
                    defaultValue={editingProduct?.stock || 0}
                    className="w-full bg-black border border-white/20 px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors text-white" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-gray-400 mb-2">Featured / New Drop?</label>
                  <div className="h-[46px] flex items-center px-4 border border-white/20 bg-black">
                    <input 
                      type="checkbox" 
                      name="featured" 
                      defaultChecked={editingProduct?.featured}
                      className="w-4 h-4 accent-white" 
                    />
                    <span className="ml-3 text-sm font-bold tracking-widest uppercase">Yes</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setIsProductModalOpen(false)}
                  disabled={isSaving}
                  className="flex-1 bg-transparent border border-white/20 text-white py-4 font-black tracking-widest uppercase text-xs hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="flex-1 bg-white text-black py-4 font-black tracking-widest uppercase text-xs hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
