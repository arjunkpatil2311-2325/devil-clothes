"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Package,
  DollarSign,
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  Tags,
  Layers,
  Plus,
  Edit2,
  Trash2,
  X,
  AlertTriangle,
  Upload,
  MessageCircle,
  CheckCircle,
  ExternalLink,
} from "lucide-react";

// --- Types ---
type OrderStatus =
  | "awaiting_payment"
  | "processing"
  | "packed"
  | "shipped"
  | "delivered"
  | "cancelled";
type PaymentStatus = "pending" | "fully_paid";

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

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  active: boolean;
  created_at: string;
}

interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  active: boolean;
  created_at: string;
}

type TabType = "dashboard" | "products" | "categories" | "collections" | "orders";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Notification / Toast state
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Collection Modal State
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);

  const [isSaving, setIsSaving] = useState(false);

  // Image Upload State
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [productsRes, categoriesRes, collectionsRes, ordersRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/admin/categories"),
        fetch("/api/admin/collections"),
        fetch("/api/admin/orders"),
      ]);

      const [prodsData, catsData, colsData, ordersData] = await Promise.all([
        productsRes.json(),
        categoriesRes.json(),
        collectionsRes.json(),
        ordersRes.json(),
      ]);

      if (prodsData.success) setProducts(prodsData.data || []);
      if (catsData.success) setCategories(catsData.data || []);
      if (colsData.success) setCollections(colsData.data || []);
      if (ordersData.success) setOrders(ordersData.data || []);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      showNotification("error", "Failed to load database: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Stats calculations
  const totalRevenue = orders.reduce(
    (acc, order) => acc + (order.order_status !== "cancelled" ? Number(order.total) : 0),
    0
  );
  const lowStockCount = products.filter((p) => p.stock < 5).length;

  const handleDeleteProduct = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to permanently delete "${name}"?`)) {
      try {
        const res = await fetch(`/api/admin/products?id=${id}&hard=true`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to delete product");
        }
        showNotification("success", `Product "${name}" deleted successfully`);
        fetchData();
      } catch (error: any) {
        showNotification("error", error.message);
      }
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete category "${name}"?`)) {
      try {
        const res = await fetch(`/api/admin/categories?id=${id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to delete category");
        }
        showNotification("success", `Category "${name}" deleted successfully`);
        fetchData();
      } catch (error: any) {
        showNotification("error", error.message);
      }
    }
  };

  const handleDeleteCollection = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete collection "${name}"?`)) {
      try {
        const res = await fetch(`/api/admin/collections?id=${id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to delete collection");
        }
        showNotification("success", `Collection "${name}" deleted successfully`);
        fetchData();
      } catch (error: any) {
        showNotification("error", error.message);
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

  const uploadImage = async (): Promise<string> => {
    if (!imageFile) return "";
    const formData = new FormData();
    formData.append("file", imageFile);

    const res = await fetch("/api/admin/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Failed to upload image");
    }

    return data.url;
  };

  const handleSaveProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const formData = new FormData(e.currentTarget);
      const name = formData.get("name") as string;
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      let imageUrl = editingProduct?.images?.[0] || "";

      if (imageFile) {
        imageUrl = await uploadImage();
      }

      const productPayload = {
        name,
        slug: editingProduct ? editingProduct.slug : slug,
        category: formData.get("category") as string,
        collection: (formData.get("collection") as string) || null,
        price: Number(formData.get("price")),
        original_price: formData.get("original_price")
          ? Number(formData.get("original_price"))
          : null,
        stock: Number(formData.get("stock")),
        status: formData.get("status") as string,
        featured: formData.get("featured") === "on",
        bestseller: formData.get("bestseller") === "on",
        images: imageUrl ? [imageUrl] : [],
        description:
          (formData.get("description") as string) ||
          (editingProduct ? editingProduct.description : ""),
      };

      let res;
      if (editingProduct) {
        res = await fetch("/api/admin/products", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingProduct.id, ...productPayload }),
        });
      } else {
        res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productPayload),
        });
      }

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save product");
      }

      showNotification(
        "success",
        editingProduct
          ? `Product "${name}" updated successfully`
          : `Product "${name}" created successfully`
      );

      setIsProductModalOpen(false);
      setImageFile(null);
      setImagePreview(null);
      setEditingProduct(null);
      fetchData();
    } catch (error: any) {
      showNotification("error", error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const formData = new FormData(e.currentTarget);
      const name = formData.get("name") as string;
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

      const categoryPayload = {
        name,
        slug: editingCategory ? editingCategory.slug : slug,
        active: formData.get("active") === "on",
      };

      let res;
      if (editingCategory) {
        res = await fetch("/api/admin/categories", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingCategory.id, ...categoryPayload }),
        });
      } else {
        res = await fetch("/api/admin/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(categoryPayload),
        });
      }

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save category");
      }

      showNotification("success", `Category "${name}" saved successfully`);
      setIsCategoryModalOpen(false);
      setEditingCategory(null);
      fetchData();
    } catch (error: any) {
      showNotification("error", error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveCollection = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const formData = new FormData(e.currentTarget);
      const name = formData.get("name") as string;
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      let imageUrl = editingCollection?.image || "";

      if (imageFile) {
        imageUrl = await uploadImage();
      }

      const collectionPayload = {
        name,
        slug: editingCollection ? editingCollection.slug : slug,
        description: (formData.get("description") as string) || null,
        active: formData.get("active") === "on",
        image: imageUrl || null,
      };

      let res;
      if (editingCollection) {
        res = await fetch("/api/admin/collections", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingCollection.id, ...collectionPayload }),
        });
      } else {
        res = await fetch("/api/admin/collections", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(collectionPayload),
        });
      }

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to save collection");
      }

      showNotification("success", `Collection "${name}" saved successfully`);
      setIsCollectionModalOpen(false);
      setImageFile(null);
      setImagePreview(null);
      setEditingCollection(null);
      fetchData();
    } catch (error: any) {
      showNotification("error", error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const updateOrderStatus = async (id: string, newStatus: OrderStatus) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, order_status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update order status");
      }
      setOrders(orders.map((o) => (o.id === id ? { ...o, order_status: newStatus } : o)));
      showNotification("success", `Order updated to ${newStatus}`);
    } catch (error: any) {
      showNotification("error", error.message);
    }
  };

  const confirmPayment = async (id: string) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          payment_status: "fully_paid",
          order_status: "processing",
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to confirm payment");
      }
      setOrders(
        orders.map((o) =>
          o.id === id ? { ...o, payment_status: "fully_paid", order_status: "processing" } : o
        )
      );
      showNotification("success", "Payment confirmed & moved to Processing!");
    } catch (error: any) {
      showNotification("error", error.message);
    }
  };

  const generateAdminWhatsappUrl = (order: Order) => {
    const message = `Hi ${order.customer_name}! 👋\n\nYour DEVIL CLOTHES pre-order #${order.order_number} is received.\n\nAmount: ₹${order.total}\n\nThank you for choosing DEVIL CLOTHES!`;
    const phone = order.customer_phone ? order.customer_phone.replace(/[^0-9]/g, "") : "";
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  const openProductModal = (product: Product | null = null) => {
    setEditingProduct(product);
    setImageFile(null);
    setImagePreview(product?.images?.[0] || null);
    setIsProductModalOpen(true);
  };

  const openCategoryModal = (category: Category | null = null) => {
    setEditingCategory(category);
    setIsCategoryModalOpen(true);
  };

  const openCollectionModal = (collection: Collection | null = null) => {
    setEditingCollection(collection);
    setImageFile(null);
    setImagePreview(collection?.image || null);
    setIsCollectionModalOpen(true);
  };

  return (
    <div className="flex w-full min-h-screen bg-[#D8D5DB] text-[#2D3142]">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-3.5 rounded-full shadow-float border transition-all animate-bounce-short ${
            notification.type === "success"
              ? "bg-[#2D3142] text-[#D8D5DB] border-white/40"
              : "bg-red-900 text-white border-red-700"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-300 shrink-0" />
          )}
          <span className="text-xs font-bold uppercase tracking-wider">{notification.message}</span>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-64 bg-[#EBE9ED] border-r border-[#ADACB5]/40 hidden md:flex flex-col">
        <div className="p-6 border-b border-[#ADACB5]/40">
          <div className="text-lg font-black tracking-tight uppercase text-[#2D3142]">
            DEVIL <span className="text-[#2D3142]/60">ADMIN</span>
          </div>
          <div className="mt-2 text-[9px] font-black tracking-widest uppercase bg-[#2D3142] text-[#D8D5DB] px-2 py-0.5 rounded-full inline-block">
            Dashboard Live
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1.5">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-[12px] text-xs font-black tracking-widest uppercase transition-all ${
              activeTab === "dashboard"
                ? "bg-[#2D3142] text-[#D8D5DB] shadow-sm"
                : "text-[#2D3142]/70 hover:bg-[#D8D5DB]/60 hover:text-[#2D3142]"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-[12px] text-xs font-black tracking-widest uppercase transition-all ${
              activeTab === "products"
                ? "bg-[#2D3142] text-[#D8D5DB] shadow-sm"
                : "text-[#2D3142]/70 hover:bg-[#D8D5DB]/60 hover:text-[#2D3142]"
            }`}
          >
            <ShoppingBag className="w-4 h-4" /> Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-[12px] text-xs font-black tracking-widest uppercase transition-all ${
              activeTab === "categories"
                ? "bg-[#2D3142] text-[#D8D5DB] shadow-sm"
                : "text-[#2D3142]/70 hover:bg-[#D8D5DB]/60 hover:text-[#2D3142]"
            }`}
          >
            <Tags className="w-4 h-4" /> Categories ({categories.length})
          </button>
          <button
            onClick={() => setActiveTab("collections")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-[12px] text-xs font-black tracking-widest uppercase transition-all ${
              activeTab === "collections"
                ? "bg-[#2D3142] text-[#D8D5DB] shadow-sm"
                : "text-[#2D3142]/70 hover:bg-[#D8D5DB]/60 hover:text-[#2D3142]"
            }`}
          >
            <Layers className="w-4 h-4" /> Collections ({collections.length})
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-[12px] text-xs font-black tracking-widest uppercase transition-all ${
              activeTab === "orders"
                ? "bg-[#2D3142] text-[#D8D5DB] shadow-sm"
                : "text-[#2D3142]/70 hover:bg-[#D8D5DB]/60 hover:text-[#2D3142]"
            }`}
          >
            <ShoppingCart className="w-4 h-4" /> Orders ({orders.length})
          </button>
        </nav>
      </aside>

      {/* Mobile Topbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-[#EBE9ED] border-b border-[#ADACB5]/40 px-4 py-3 flex items-center justify-between">
        <span className="font-black text-sm uppercase tracking-tight">DEVIL ADMIN</span>
        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {(["dashboard", "products", "categories", "collections", "orders"] as TabType[]).map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  activeTab === tab
                    ? "bg-[#2D3142] text-[#D8D5DB]"
                    : "text-[#2D3142]/70 hover:bg-[#D8D5DB]"
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl pt-16 md:pt-8">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#2D3142] border-t-transparent"></div>
          </div>
        ) : (
          <>
            {/* TAB: DASHBOARD */}
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-black tracking-tight uppercase">
                    Admin Overview
                  </h1>
                  <p className="text-xs text-[#2D3142]/70 uppercase tracking-widest font-semibold mt-1">
                    Store metrics & quick actions
                  </p>
                </div>

                {/* Metric Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
                  <div className="bg-[#C7C5CF] rounded-[20px] p-4 md:p-6 border border-[#ADACB5] shadow-card">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-black tracking-widest uppercase text-[#2D3142]/70">
                        Total Revenue
                      </span>
                      <DollarSign className="w-4 h-4 text-[#2D3142]" />
                    </div>
                    <div className="text-xl md:text-2xl font-black">
                      ₹{totalRevenue.toLocaleString("en-IN")}
                    </div>
                  </div>

                  <div className="bg-[#C7C5CF] rounded-[20px] p-4 md:p-6 border border-[#ADACB5] shadow-card">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-black tracking-widest uppercase text-[#2D3142]/70">
                        Total Orders
                      </span>
                      <ShoppingCart className="w-4 h-4 text-[#2D3142]" />
                    </div>
                    <div className="text-xl md:text-2xl font-black">{orders.length}</div>
                  </div>

                  <div className="bg-[#C7C5CF] rounded-[20px] p-4 md:p-6 border border-[#ADACB5] shadow-card">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-black tracking-widest uppercase text-[#2D3142]/70">
                        Total Products
                      </span>
                      <Package className="w-4 h-4 text-[#2D3142]" />
                    </div>
                    <div className="text-xl md:text-2xl font-black">{products.length}</div>
                  </div>

                  <div className="bg-[#C7C5CF] rounded-[20px] p-4 md:p-6 border border-[#ADACB5] shadow-card">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-black tracking-widest uppercase text-[#2D3142]/70">
                        Low Stock Alert
                      </span>
                      <AlertTriangle className="w-4 h-4 text-amber-700" />
                    </div>
                    <div className="text-xl md:text-2xl font-black text-amber-900">
                      {lowStockCount} items
                    </div>
                  </div>
                </div>

                {/* Quick Shortcuts */}
                <div className="flex gap-3 flex-wrap pt-2">
                  <button
                    onClick={() => openProductModal()}
                    className="bg-[#2D3142] text-[#D8D5DB] px-6 py-3 rounded-full text-xs font-black tracking-[0.2em] uppercase flex items-center hover:bg-[#3D4258] transition-all shadow-sm"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Product
                  </button>
                  <button
                    onClick={() => openCategoryModal()}
                    className="bg-[#C7C5CF] text-[#2D3142] border border-[#ADACB5] px-6 py-3 rounded-full text-xs font-black tracking-[0.2em] uppercase flex items-center hover:bg-white transition-all shadow-card"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Category
                  </button>
                  <button
                    onClick={() => openCollectionModal()}
                    className="bg-[#C7C5CF] text-[#2D3142] border border-[#ADACB5] px-6 py-3 rounded-full text-xs font-black tracking-[0.2em] uppercase flex items-center hover:bg-white transition-all shadow-card"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Collection
                  </button>
                </div>
              </div>
            )}

            {/* TAB: PRODUCTS */}
            {activeTab === "products" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight uppercase">
                      Products Management
                    </h1>
                    <p className="text-xs text-[#2D3142]/70 uppercase tracking-widest font-semibold mt-1">
                      Manage inventory, pricing & status
                    </p>
                  </div>
                  <button
                    onClick={() => openProductModal()}
                    className="bg-[#2D3142] text-[#D8D5DB] px-6 py-3 rounded-full text-xs font-black tracking-[0.2em] uppercase flex items-center hover:bg-[#3D4258] transition-all shadow-sm"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add New Product
                  </button>
                </div>

                <div className="bg-[#C7C5CF] rounded-[24px] border border-[#ADACB5] overflow-hidden shadow-card">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs uppercase font-semibold">
                      <thead>
                        <tr className="border-b border-[#ADACB5] bg-[#BDBCC6] text-[#2D3142] tracking-wider text-[11px] font-black">
                          <th className="py-4 px-5">Image</th>
                          <th className="py-4 px-5">Name & Category</th>
                          <th className="py-4 px-5">Price</th>
                          <th className="py-4 px-5">Stock</th>
                          <th className="py-4 px-5">Status</th>
                          <th className="py-4 px-5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#ADACB5]/40">
                        {products.map((product) => (
                          <tr key={product.id} className="hover:bg-[#D8D5DB]/50 transition-colors">
                            <td className="py-3.5 px-5">
                              <div className="relative w-12 h-14 bg-[#D8D5DB] rounded-[10px] overflow-hidden border border-[#ADACB5]">
                                {product.images?.[0] ? (
                                  <Image
                                    src={product.images[0]}
                                    alt={product.name}
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[9px] text-[#2D3142]/50">
                                    No Img
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="py-3.5 px-5">
                              <div className="font-black text-[#2D3142]">{product.name}</div>
                              <div className="text-[10px] text-[#2D3142]/70 font-bold tracking-widest mt-0.5">
                                {product.category} {product.collection && `• ${product.collection}`}
                              </div>
                            </td>
                            <td className="py-3.5 px-5 font-black text-[#2D3142]">
                              ₹{product.price.toLocaleString("en-IN")}
                              {product.original_price && (
                                <span className="line-through text-[10px] text-[#2D3142]/50 ml-1.5 font-normal">
                                  ₹{product.original_price.toLocaleString("en-IN")}
                                </span>
                              )}
                            </td>
                            <td className="py-3.5 px-5 font-bold">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                                  product.stock > 5
                                    ? "bg-[#D8D5DB] text-[#2D3142]"
                                    : "bg-red-200 text-red-900"
                                }`}
                              >
                                {product.stock} in stock
                              </span>
                            </td>
                            <td className="py-3.5 px-5">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                                  product.status === "Published"
                                    ? "bg-[#2D3142] text-[#D8D5DB]"
                                    : "bg-[#D8D5DB] text-[#2D3142]/70 border border-[#ADACB5]"
                                }`}
                              >
                                {product.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-5 text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => openProductModal(product)}
                                  className="p-2 bg-[#D8D5DB] text-[#2D3142] hover:bg-white transition-colors rounded-lg shadow-sm"
                                  title="Edit Product"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(product.id, product.name)}
                                  className="p-2 bg-[#D8D5DB] text-[#2D3142] hover:bg-red-200 hover:text-red-900 transition-colors rounded-lg shadow-sm"
                                  title="Delete Product"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
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

            {/* TAB: CATEGORIES */}
            {activeTab === "categories" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight uppercase">
                      Categories
                    </h1>
                    <p className="text-xs text-[#2D3142]/70 uppercase tracking-widest font-semibold mt-1">
                      Product navigation taxonomy
                    </p>
                  </div>
                  <button
                    onClick={() => openCategoryModal()}
                    className="bg-[#2D3142] text-[#D8D5DB] px-6 py-3 rounded-full text-xs font-black tracking-[0.2em] uppercase flex items-center hover:bg-[#3D4258] transition-all shadow-sm"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Category
                  </button>
                </div>

                <div className="bg-[#C7C5CF] rounded-[24px] border border-[#ADACB5] overflow-hidden shadow-card">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs uppercase font-semibold">
                      <thead>
                        <tr className="border-b border-[#ADACB5] bg-[#BDBCC6] text-[#2D3142] tracking-wider text-[11px] font-black">
                          <th className="py-4 px-5">Name</th>
                          <th className="py-4 px-5">Slug</th>
                          <th className="py-4 px-5">Active Status</th>
                          <th className="py-4 px-5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#ADACB5]/40">
                        {categories.map((cat) => (
                          <tr key={cat.id} className="hover:bg-[#D8D5DB]/50 transition-colors">
                            <td className="py-3.5 px-5 font-black text-[#2D3142]">{cat.name}</td>
                            <td className="py-3.5 px-5 text-[#2D3142]/70 font-mono text-[11px]">
                              {cat.slug}
                            </td>
                            <td className="py-3.5 px-5">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                                  cat.active
                                    ? "bg-[#2D3142] text-[#D8D5DB]"
                                    : "bg-[#D8D5DB] text-[#2D3142]/60"
                                }`}
                              >
                                {cat.active ? "Active" : "Hidden"}
                              </span>
                            </td>
                            <td className="py-3.5 px-5 text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => openCategoryModal(cat)}
                                  className="p-2 bg-[#D8D5DB] text-[#2D3142] hover:bg-white transition-colors rounded-lg shadow-sm"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteCategory(cat.id, cat.name)}
                                  className="p-2 bg-[#D8D5DB] text-[#2D3142] hover:bg-red-200 hover:text-red-900 transition-colors rounded-lg shadow-sm"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
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

            {/* TAB: COLLECTIONS */}
            {activeTab === "collections" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight uppercase">
                      Collections
                    </h1>
                    <p className="text-xs text-[#2D3142]/70 uppercase tracking-widest font-semibold mt-1">
                      Curated seasonal drops
                    </p>
                  </div>
                  <button
                    onClick={() => openCollectionModal()}
                    className="bg-[#2D3142] text-[#D8D5DB] px-6 py-3 rounded-full text-xs font-black tracking-[0.2em] uppercase flex items-center hover:bg-[#3D4258] transition-all shadow-sm"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Add Collection
                  </button>
                </div>

                <div className="bg-[#C7C5CF] rounded-[24px] border border-[#ADACB5] overflow-hidden shadow-card">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs uppercase font-semibold">
                      <thead>
                        <tr className="border-b border-[#ADACB5] bg-[#BDBCC6] text-[#2D3142] tracking-wider text-[11px] font-black">
                          <th className="py-4 px-5">Image</th>
                          <th className="py-4 px-5">Name & Slug</th>
                          <th className="py-4 px-5">Status</th>
                          <th className="py-4 px-5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#ADACB5]/40">
                        {collections.map((col) => (
                          <tr key={col.id} className="hover:bg-[#D8D5DB]/50 transition-colors">
                            <td className="py-3.5 px-5">
                              <div className="relative w-12 h-14 bg-[#D8D5DB] rounded-[10px] overflow-hidden border border-[#ADACB5]">
                                {col.image ? (
                                  <Image src={col.image} alt={col.name} fill className="object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-[9px] text-[#2D3142]/50">
                                    No Img
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="py-3.5 px-5">
                              <div className="font-black text-[#2D3142]">{col.name}</div>
                              <div className="text-[10px] text-[#2D3142]/70 font-mono mt-0.5">
                                {col.slug}
                              </div>
                            </td>
                            <td className="py-3.5 px-5">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                                  col.active
                                    ? "bg-[#2D3142] text-[#D8D5DB]"
                                    : "bg-[#D8D5DB] text-[#2D3142]/60"
                                }`}
                              >
                                {col.active ? "Active" : "Hidden"}
                              </span>
                            </td>
                            <td className="py-3.5 px-5 text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => openCollectionModal(col)}
                                  className="p-2 bg-[#D8D5DB] text-[#2D3142] hover:bg-white transition-colors rounded-lg shadow-sm"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteCollection(col.id, col.name)}
                                  className="p-2 bg-[#D8D5DB] text-[#2D3142] hover:bg-red-200 hover:text-red-900 transition-colors rounded-lg shadow-sm"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
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

            {/* TAB: ORDERS */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl md:text-3xl font-black tracking-tight uppercase">
                    Customer Orders
                  </h1>
                  <p className="text-xs text-[#2D3142]/70 uppercase tracking-widest font-semibold mt-1">
                    Manage orders, status & WhatsApp follow-ups
                  </p>
                </div>

                <div className="bg-[#C7C5CF] rounded-[24px] border border-[#ADACB5] overflow-hidden shadow-card">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs uppercase font-semibold">
                      <thead>
                        <tr className="border-b border-[#ADACB5] bg-[#BDBCC6] text-[#2D3142] tracking-wider text-[11px] font-black">
                          <th className="py-4 px-5">Order #</th>
                          <th className="py-4 px-5">Customer</th>
                          <th className="py-4 px-5">Total</th>
                          <th className="py-4 px-5">Payment</th>
                          <th className="py-4 px-5">Order Status</th>
                          <th className="py-4 px-5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#ADACB5]/40">
                        {orders.map((order) => (
                          <tr key={order.id} className="hover:bg-[#D8D5DB]/50 transition-colors">
                            <td className="py-3.5 px-5 font-black text-[#2D3142]">
                              #{order.order_number}
                            </td>
                            <td className="py-3.5 px-5">
                              <div className="font-black text-[#2D3142]">{order.customer_name}</div>
                              <div className="text-[10px] text-[#2D3142]/70 font-mono mt-0.5">
                                {order.customer_phone}
                              </div>
                            </td>
                            <td className="py-3.5 px-5 font-black text-[#2D3142]">
                              ₹{Number(order.total).toLocaleString("en-IN")}
                            </td>
                            <td className="py-3.5 px-5">
                              <span
                                className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                                  order.payment_status === "fully_paid"
                                    ? "bg-[#2D3142] text-[#D8D5DB]"
                                    : "bg-amber-200 text-amber-900"
                                }`}
                              >
                                {order.payment_status}
                              </span>
                            </td>
                            <td className="py-3.5 px-5">
                              <select
                                value={order.order_status}
                                onChange={(e) =>
                                  updateOrderStatus(order.id, e.target.value as OrderStatus)
                                }
                                className="bg-[#D8D5DB] border border-[#ADACB5] text-[#2D3142] text-xs font-bold uppercase rounded-lg px-2.5 py-1.5 outline-none cursor-pointer"
                              >
                                <option value="awaiting_payment">Awaiting Payment</option>
                                <option value="processing">Processing</option>
                                <option value="packed">Packed</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td className="py-3.5 px-5 text-right">
                              <div className="flex justify-end gap-2">
                                <a
                                  href={generateAdminWhatsappUrl(order)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 bg-[#D8D5DB] text-[#2D3142] hover:bg-white transition-colors rounded-lg shadow-sm"
                                  title="Contact Customer on WhatsApp"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                </a>
                                {order.payment_status === "pending" && (
                                  <button
                                    onClick={() => confirmPayment(order.id)}
                                    className="px-2.5 py-1 bg-[#2D3142] text-[#D8D5DB] rounded-lg text-[9px] font-black uppercase tracking-wider hover:bg-[#3D4258]"
                                  >
                                    Confirm Paid
                                  </button>
                                )}
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
          </>
        )}
      </main>

      {/* Category Form Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-[#2D3142]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#EBE9ED] border border-[#ADACB5] rounded-[24px] w-full max-w-md p-6 shadow-float text-[#2D3142]">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-[#ADACB5]/40">
              <h2 className="text-lg font-black tracking-tight uppercase">
                {editingCategory ? "Edit Category" : "Add Category"}
              </h2>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-[#2D3142]/60 hover:text-[#2D3142]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black tracking-widest uppercase text-[#2D3142]/70 mb-1.5">
                  Category Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={editingCategory?.name}
                  placeholder="e.g. Jackets"
                  className="w-full bg-[#D8D5DB] border border-[#ADACB5] rounded-[12px] px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#2D3142] text-[#2D3142]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black tracking-widest uppercase text-[#2D3142]/70 mb-1.5">
                  Active
                </label>
                <div className="h-[42px] flex items-center px-3.5 border border-[#ADACB5] rounded-[12px] bg-[#D8D5DB]">
                  <input
                    type="checkbox"
                    name="active"
                    defaultChecked={editingCategory ? editingCategory.active : true}
                    className="w-4 h-4 accent-[#2D3142]"
                  />
                  <span className="ml-2.5 text-xs font-bold uppercase">Active in store</span>
                </div>
              </div>
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  disabled={isSaving}
                  className="flex-1 bg-[#D8D5DB] border border-[#ADACB5] text-[#2D3142] py-3 rounded-full font-black tracking-widest uppercase text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 bg-[#2D3142] text-[#D8D5DB] py-3 rounded-full font-black tracking-widest uppercase text-xs hover:bg-[#3D4258]"
                >
                  {isSaving ? "Saving..." : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Collection Form Modal */}
      {isCollectionModalOpen && (
        <div className="fixed inset-0 bg-[#2D3142]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#EBE9ED] border border-[#ADACB5] rounded-[24px] w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-float text-[#2D3142]">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-[#ADACB5]/40">
              <h2 className="text-lg font-black tracking-tight uppercase">
                {editingCollection ? "Edit Collection" : "Add Collection"}
              </h2>
              <button
                onClick={() => setIsCollectionModalOpen(false)}
                className="text-[#2D3142]/60 hover:text-[#2D3142]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveCollection} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black tracking-widest uppercase text-[#2D3142]/70 mb-1.5">
                  Cover Image (Optional)
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative w-20 h-20 bg-[#D8D5DB] rounded-[12px] border border-[#ADACB5] flex items-center justify-center overflow-hidden shrink-0">
                    {imagePreview ? (
                      <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                    ) : (
                      <Upload className="w-5 h-5 text-[#2D3142]/60" />
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="text-xs text-[#2D3142]/70"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black tracking-widest uppercase text-[#2D3142]/70 mb-1.5">
                  Collection Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={editingCollection?.name}
                  placeholder="e.g. Nocturnal Awakening"
                  className="w-full bg-[#D8D5DB] border border-[#ADACB5] rounded-[12px] px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#2D3142] text-[#2D3142]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black tracking-widest uppercase text-[#2D3142]/70 mb-1.5">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={2}
                  defaultValue={editingCollection?.description || ""}
                  placeholder="Collection bio & aesthetic..."
                  className="w-full bg-[#D8D5DB] border border-[#ADACB5] rounded-[12px] px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#2D3142] text-[#2D3142]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black tracking-widest uppercase text-[#2D3142]/70 mb-1.5">
                  Active
                </label>
                <div className="h-[42px] flex items-center px-3.5 border border-[#ADACB5] rounded-[12px] bg-[#D8D5DB]">
                  <input
                    type="checkbox"
                    name="active"
                    defaultChecked={editingCollection ? editingCollection.active : true}
                    className="w-4 h-4 accent-[#2D3142]"
                  />
                  <span className="ml-2.5 text-xs font-bold uppercase">Active in store</span>
                </div>
              </div>
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsCollectionModalOpen(false)}
                  disabled={isSaving}
                  className="flex-1 bg-[#D8D5DB] border border-[#ADACB5] text-[#2D3142] py-3 rounded-full font-black tracking-widest uppercase text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 bg-[#2D3142] text-[#D8D5DB] py-3 rounded-full font-black tracking-widest uppercase text-xs hover:bg-[#3D4258]"
                >
                  {isSaving ? "Saving..." : "Save Collection"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Form Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-[#2D3142]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#EBE9ED] border border-[#ADACB5] rounded-[24px] w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-float text-[#2D3142]">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-[#ADACB5]/40">
              <h2 className="text-lg font-black tracking-tight uppercase">
                {editingProduct ? "Edit Product" : "Add Product"}
              </h2>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-[#2D3142]/60 hover:text-[#2D3142]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black tracking-widest uppercase text-[#2D3142]/70 mb-1.5">
                  Product Image
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative w-20 h-24 bg-[#D8D5DB] rounded-[12px] border border-[#ADACB5] flex items-center justify-center overflow-hidden shrink-0">
                    {imagePreview ? (
                      <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                    ) : (
                      <Upload className="w-5 h-5 text-[#2D3142]/60" />
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="text-xs text-[#2D3142]/70"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black tracking-widest uppercase text-[#2D3142]/70 mb-1.5">
                  Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={editingProduct?.name}
                  placeholder="e.g. Heavyweight Boxy Tee"
                  className="w-full bg-[#D8D5DB] border border-[#ADACB5] rounded-[12px] px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#2D3142] text-[#2D3142]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black tracking-widest uppercase text-[#2D3142]/70 mb-1.5">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={2}
                  required
                  defaultValue={editingProduct?.description}
                  placeholder="Fabric specs, fit, detailing..."
                  className="w-full bg-[#D8D5DB] border border-[#ADACB5] rounded-[12px] px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#2D3142] text-[#2D3142]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black tracking-widest uppercase text-[#2D3142]/70 mb-1.5">
                    Category
                  </label>
                  <select
                    name="category"
                    required
                    defaultValue={editingProduct?.category || categories[0]?.slug || "T-SHIRTS"}
                    className="w-full bg-[#D8D5DB] border border-[#ADACB5] rounded-[12px] px-3 py-2.5 text-xs font-semibold focus:outline-none text-[#2D3142] uppercase"
                  >
                    {categories.length > 0 ? (
                      categories.map((cat) => (
                        <option key={cat.id} value={cat.slug || cat.name}>
                          {cat.name}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="T-SHIRTS">T-Shirts</option>
                        <option value="HOODIES">Hoodies</option>
                        <option value="PANTS">Pants</option>
                        <option value="ACCESSORIES">Accessories</option>
                        <option value="JACKETS">Jackets</option>
                      </>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black tracking-widest uppercase text-[#2D3142]/70 mb-1.5">
                    Collection (Optional)
                  </label>
                  <select
                    name="collection"
                    defaultValue={editingProduct?.collection || ""}
                    className="w-full bg-[#D8D5DB] border border-[#ADACB5] rounded-[12px] px-3 py-2.5 text-xs font-semibold focus:outline-none text-[#2D3142] uppercase"
                  >
                    <option value="">None</option>
                    {collections.map((col) => (
                      <option key={col.id} value={col.name}>
                        {col.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black tracking-widest uppercase text-[#2D3142]/70 mb-1.5">
                    Selling Price (₹)
                  </label>
                  <input
                    type="number"
                    name="price"
                    required
                    defaultValue={editingProduct?.price}
                    placeholder="1999"
                    className="w-full bg-[#D8D5DB] border border-[#ADACB5] rounded-[12px] px-3.5 py-2.5 text-xs font-semibold focus:outline-none text-[#2D3142]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black tracking-widest uppercase text-[#2D3142]/70 mb-1.5">
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    name="original_price"
                    defaultValue={editingProduct?.original_price || ""}
                    placeholder="2499"
                    className="w-full bg-[#D8D5DB] border border-[#ADACB5] rounded-[12px] px-3.5 py-2.5 text-xs font-semibold focus:outline-none text-[#2D3142]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black tracking-widest uppercase text-[#2D3142]/70 mb-1.5">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    name="stock"
                    required
                    defaultValue={editingProduct?.stock !== undefined ? editingProduct.stock : 25}
                    className="w-full bg-[#D8D5DB] border border-[#ADACB5] rounded-[12px] px-3.5 py-2.5 text-xs font-semibold focus:outline-none text-[#2D3142]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black tracking-widest uppercase text-[#2D3142]/70 mb-1.5">
                    Status
                  </label>
                  <select
                    name="status"
                    required
                    defaultValue={editingProduct?.status || "Published"}
                    className="w-full bg-[#D8D5DB] border border-[#ADACB5] rounded-[12px] px-3 py-2.5 text-xs font-semibold focus:outline-none text-[#2D3142] uppercase"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black tracking-widest uppercase text-[#2D3142]/70 mb-1.5">
                    Featured Item
                  </label>
                  <div className="h-[42px] flex items-center px-3.5 border border-[#ADACB5] rounded-[12px] bg-[#D8D5DB]">
                    <input
                      type="checkbox"
                      name="featured"
                      defaultChecked={editingProduct ? editingProduct.featured : true}
                      className="w-4 h-4 accent-[#2D3142]"
                    />
                    <span className="ml-2.5 text-xs font-bold uppercase">Homepage Drop</span>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black tracking-widest uppercase text-[#2D3142]/70 mb-1.5">
                    Bestseller
                  </label>
                  <div className="h-[42px] flex items-center px-3.5 border border-[#ADACB5] rounded-[12px] bg-[#D8D5DB]">
                    <input
                      type="checkbox"
                      name="bestseller"
                      defaultChecked={editingProduct ? editingProduct.bestseller : false}
                      className="w-4 h-4 accent-[#2D3142]"
                    />
                    <span className="ml-2.5 text-xs font-bold uppercase">Bestseller Badge</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsProductModalOpen(false);
                    setEditingProduct(null);
                  }}
                  disabled={isSaving}
                  className="flex-1 bg-[#D8D5DB] border border-[#ADACB5] text-[#2D3142] py-3 rounded-full font-black tracking-widest uppercase text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 bg-[#2D3142] text-[#D8D5DB] py-3 rounded-full font-black tracking-widest uppercase text-xs hover:bg-[#3D4258]"
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
