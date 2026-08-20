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
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";

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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [productsRes, categoriesRes, collectionsRes, ordersRes] = await Promise.all([
        supabase.from("products").select("*").order("created_at", { ascending: false }),
        supabase.from("categories").select("*").order("created_at", { ascending: false }),
        supabase.from("collections").select("*").order("created_at", { ascending: false }),
        supabase.from("orders").select("*").order("created_at", { ascending: false }),
      ]);

      if (productsRes.data) setProducts(productsRes.data);
      if (categoriesRes.data) setCategories(categoriesRes.data);
      if (collectionsRes.data) setCollections(collectionsRes.data);
      if (ordersRes.data) setOrders(ordersRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
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

  const handleDeleteProduct = async (id: string) => {
    if (confirm("Are you sure you want to archive this product?")) {
      const { error } = await supabase
        .from("products")
        .update({ status: "Archived" })
        .eq("id", id);
      if (!error) {
        fetchData();
      } else {
        alert("Failed to archive product: " + error.message);
      }
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (!error) {
        fetchData();
      } else {
        alert("Failed to delete category: " + error.message);
      }
    }
  };

  const handleDeleteCollection = async (id: string) => {
    if (confirm("Are you sure you want to delete this collection?")) {
      const { error } = await supabase.from("collections").delete().eq("id", id);
      if (!error) {
        fetchData();
      } else {
        alert("Failed to delete collection: " + error.message);
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
    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;
    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, imageFile);
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from("product-images").getPublicUrl(filePath);
    return data.publicUrl;
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

      const productData = {
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
        images: imageUrl ? [imageUrl] : [],
        description:
          (formData.get("description") as string) ||
          (editingProduct ? editingProduct.description : ""),
      };

      if (editingProduct) {
        const { error } = await supabase
          .from("products")
          .update(productData)
          .eq("id", editingProduct.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert([productData]);
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

  const handleSaveCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const formData = new FormData(e.currentTarget);
      const name = formData.get("name") as string;
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

      const categoryData = {
        name,
        slug: editingCategory ? editingCategory.slug : slug,
        active: formData.get("active") === "on",
      };

      if (editingCategory) {
        const { error } = await supabase
          .from("categories")
          .update(categoryData)
          .eq("id", editingCategory.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("categories").insert([categoryData]);
        if (error) throw error;
      }

      setIsCategoryModalOpen(false);
      fetchData();
    } catch (error: any) {
      alert("Error saving category: " + error.message);
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

      const collectionData = {
        name,
        slug: editingCollection ? editingCollection.slug : slug,
        description: formData.get("description") as string,
        active: formData.get("active") === "on",
        image: imageUrl || null,
      };

      if (editingCollection) {
        const { error } = await supabase
          .from("collections")
          .update(collectionData)
          .eq("id", editingCollection.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("collections").insert([collectionData]);
        if (error) throw error;
      }

      setIsCollectionModalOpen(false);
      setImageFile(null);
      setImagePreview(null);
      fetchData();
    } catch (error: any) {
      alert("Error saving collection: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const updateOrderStatus = async (id: string, newStatus: OrderStatus) => {
    const { error } = await supabase
      .from("orders")
      .update({ order_status: newStatus })
      .eq("id", id);
    if (!error) {
      setOrders(orders.map((o) => (o.id === id ? { ...o, order_status: newStatus } : o)));
    }
  };

  const confirmPayment = async (id: string) => {
    const { error } = await supabase
      .from("orders")
      .update({
        payment_status: "fully_paid",
        order_status: "processing",
      })
      .eq("id", id);

    if (!error) {
      setOrders(
        orders.map((o) =>
          o.id === id ? { ...o, payment_status: "fully_paid", order_status: "processing" } : o
        )
      );
      alert("Payment Confirmed and Order moved to Processing!");
    } else {
      alert("Failed to confirm payment: " + error.message);
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
      {/* Sidebar */}
      <aside className="w-64 bg-[#EBE9ED] border-r border-[#ADACB5]/40 hidden md:flex flex-col">
        <div className="p-6 border-b border-[#ADACB5]/40">
          <div className="text-lg font-black tracking-tight uppercase text-[#2D3142]">
            DEVIL <span className="text-[#2D3142]/60">ADMIN</span>
          </div>
          <div className="mt-2 text-[9px] font-black tracking-widest uppercase bg-[#2D3142] text-[#D8D5DB] px-2 py-0.5 rounded-full inline-block">
            Dashboard
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
            <ShoppingBag className="w-4 h-4" /> Products
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-[12px] text-xs font-black tracking-widest uppercase transition-all ${
              activeTab === "categories"
                ? "bg-[#2D3142] text-[#D8D5DB] shadow-sm"
                : "text-[#2D3142]/70 hover:bg-[#D8D5DB]/60 hover:text-[#2D3142]"
            }`}
          >
            <Tags className="w-4 h-4" /> Categories
          </button>
          <button
            onClick={() => setActiveTab("collections")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-[12px] text-xs font-black tracking-widest uppercase transition-all ${
              activeTab === "collections"
                ? "bg-[#2D3142] text-[#D8D5DB] shadow-sm"
                : "text-[#2D3142]/70 hover:bg-[#D8D5DB]/60 hover:text-[#2D3142]"
            }`}
          >
            <Layers className="w-4 h-4" /> Collections
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-[12px] text-xs font-black tracking-widest uppercase transition-all ${
              activeTab === "orders"
                ? "bg-[#2D3142] text-[#D8D5DB] shadow-sm"
                : "text-[#2D3142]/70 hover:bg-[#D8D5DB]/60 hover:text-[#2D3142]"
            }`}
          >
            <ShoppingCart className="w-4 h-4" /> Orders
          </button>
        </nav>
      </aside>

      {/* Mobile Topbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-[#EBE9ED] border-b border-[#ADACB5]/40 p-3.5 z-40 flex justify-between items-center overflow-x-auto whitespace-nowrap shadow-sm">
        <div className="text-base font-black tracking-tight uppercase mr-3 text-[#2D3142]">
          DEVIL <span className="text-[#2D3142]/60">ADMIN</span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`p-2 rounded-lg ${
              activeTab === "dashboard" ? "bg-[#2D3142] text-[#D8D5DB]" : "text-[#2D3142]/70"
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveTab("products")}
            className={`p-2 rounded-lg ${
              activeTab === "products" ? "bg-[#2D3142] text-[#D8D5DB]" : "text-[#2D3142]/70"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveTab("categories")}
            className={`p-2 rounded-lg ${
              activeTab === "categories" ? "bg-[#2D3142] text-[#D8D5DB]" : "text-[#2D3142]/70"
            }`}
          >
            <Tags className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveTab("collections")}
            className={`p-2 rounded-lg ${
              activeTab === "collections" ? "bg-[#2D3142] text-[#D8D5DB]" : "text-[#2D3142]/70"
            }`}
          >
            <Layers className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`p-2 rounded-lg ${
              activeTab === "orders" ? "bg-[#2D3142] text-[#D8D5DB]" : "text-[#2D3142]/70"
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#2D3142] border-t-transparent"></div>
          </div>
        ) : (
          <>
            {/* DASHBOARD TAB */}
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                <h1 className="text-2xl md:text-3xl font-black tracking-tight uppercase text-[#2D3142]">
                  Dashboard Overview
                </h1>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                  <div className="bg-[#EBE9ED] border border-[#ADACB5]/40 rounded-[18px] p-4 md:p-6 shadow-card">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-black tracking-widest uppercase text-[#2D3142]/60">
                        Total Revenue
                      </span>
                      <DollarSign className="w-4 h-4 text-[#2D3142]" />
                    </div>
                    <div className="text-xl md:text-2xl font-black text-[#2D3142]">
                      ₹{totalRevenue.toLocaleString("en-IN")}
                    </div>
                  </div>

                  <div className="bg-[#EBE9ED] border border-[#ADACB5]/40 rounded-[18px] p-4 md:p-6 shadow-card">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-black tracking-widest uppercase text-[#2D3142]/60">
                        Orders
                      </span>
                      <Package className="w-4 h-4 text-[#2D3142]" />
                    </div>
                    <div className="text-xl md:text-2xl font-black text-[#2D3142]">
                      {orders.length}
                    </div>
                  </div>

                  <div className="bg-[#EBE9ED] border border-[#ADACB5]/40 rounded-[18px] p-4 md:p-6 shadow-card">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-black tracking-widest uppercase text-[#2D3142]/60">
                        Products
                      </span>
                      <ShoppingBag className="w-4 h-4 text-[#2D3142]" />
                    </div>
                    <div className="text-xl md:text-2xl font-black text-[#2D3142]">
                      {products.length}
                    </div>
                  </div>

                  <div className="bg-[#EBE9ED] border border-[#ADACB5]/40 rounded-[18px] p-4 md:p-6 shadow-card">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-black tracking-widest uppercase text-[#2D3142]/60">
                        Low Stock
                      </span>
                      <AlertTriangle className="w-4 h-4 text-[#2D3142]" />
                    </div>
                    <div className="text-xl md:text-2xl font-black text-[#2D3142]">
                      {lowStockCount}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* CATEGORIES TAB */}
            {activeTab === "categories" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl md:text-3xl font-black tracking-tight uppercase text-[#2D3142]">
                    Categories
                  </h1>
                  <button
                    onClick={() => openCategoryModal()}
                    className="bg-[#2D3142] text-[#D8D5DB] px-4 py-2.5 rounded-full font-black tracking-widest uppercase text-xs hover:bg-[#3D4258] transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-4 h-4" /> Add Category
                  </button>
                </div>

                <div className="bg-[#EBE9ED] border border-[#ADACB5]/40 rounded-[20px] overflow-hidden shadow-card">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[500px]">
                      <thead>
                        <tr className="text-[10px] font-black tracking-widest uppercase text-[#2D3142]/60 border-b border-[#ADACB5]/30 bg-[#D8D5DB]/60">
                          <th className="py-3.5 px-5">Name</th>
                          <th className="py-3.5 px-5">Slug</th>
                          <th className="py-3.5 px-5">Status</th>
                          <th className="py-3.5 px-5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#ADACB5]/20">
                        {categories.map((category) => (
                          <tr key={category.id} className="hover:bg-[#D8D5DB]/40 transition-colors">
                            <td className="py-3.5 px-5 font-black uppercase text-xs text-[#2D3142]">
                              {category.name}
                            </td>
                            <td className="py-3.5 px-5 text-xs text-[#2D3142]/70">{category.slug}</td>
                            <td className="py-3.5 px-5">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-widest uppercase ${
                                  category.active
                                    ? "bg-[#2D3142] text-[#D8D5DB]"
                                    : "bg-[#ADACB5] text-[#2D3142]"
                                }`}
                              >
                                {category.active ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="py-3.5 px-5 text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => openCategoryModal(category)}
                                  className="p-1.5 text-[#2D3142]/60 hover:text-[#2D3142]"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteCategory(category.id)}
                                  className="p-1.5 text-[#2D3142]/60 hover:text-[#2D3142]"
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

            {/* COLLECTIONS TAB */}
            {activeTab === "collections" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl md:text-3xl font-black tracking-tight uppercase text-[#2D3142]">
                    Collections
                  </h1>
                  <button
                    onClick={() => openCollectionModal()}
                    className="bg-[#2D3142] text-[#D8D5DB] px-4 py-2.5 rounded-full font-black tracking-widest uppercase text-xs hover:bg-[#3D4258] transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-4 h-4" /> Add Collection
                  </button>
                </div>

                <div className="bg-[#EBE9ED] border border-[#ADACB5]/40 rounded-[20px] overflow-hidden shadow-card">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[500px]">
                      <thead>
                        <tr className="text-[10px] font-black tracking-widest uppercase text-[#2D3142]/60 border-b border-[#ADACB5]/30 bg-[#D8D5DB]/60">
                          <th className="py-3.5 px-5">Name</th>
                          <th className="py-3.5 px-5">Slug</th>
                          <th className="py-3.5 px-5">Status</th>
                          <th className="py-3.5 px-5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#ADACB5]/20">
                        {collections.map((col) => (
                          <tr key={col.id} className="hover:bg-[#D8D5DB]/40 transition-colors">
                            <td className="py-3.5 px-5">
                              <div className="flex items-center gap-3">
                                {col.image && (
                                  <div className="w-8 h-8 relative rounded-md overflow-hidden bg-[#D8D5DB] shrink-0">
                                    <Image src={col.image} alt={col.name} fill className="object-cover" />
                                  </div>
                                )}
                                <span className="font-black uppercase text-xs text-[#2D3142]">
                                  {col.name}
                                </span>
                              </div>
                            </td>
                            <td className="py-3.5 px-5 text-xs text-[#2D3142]/70">{col.slug}</td>
                            <td className="py-3.5 px-5">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-widest uppercase ${
                                  col.active
                                    ? "bg-[#2D3142] text-[#D8D5DB]"
                                    : "bg-[#ADACB5] text-[#2D3142]"
                                }`}
                              >
                                {col.active ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="py-3.5 px-5 text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => openCollectionModal(col)}
                                  className="p-1.5 text-[#2D3142]/60 hover:text-[#2D3142]"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteCollection(col.id)}
                                  className="p-1.5 text-[#2D3142]/60 hover:text-[#2D3142]"
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

            {/* PRODUCTS TAB */}
            {activeTab === "products" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl md:text-3xl font-black tracking-tight uppercase text-[#2D3142]">
                    Products
                  </h1>
                  <button
                    onClick={() => openProductModal()}
                    className="bg-[#2D3142] text-[#D8D5DB] px-4 py-2.5 rounded-full font-black tracking-widest uppercase text-xs hover:bg-[#3D4258] transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <Plus className="w-4 h-4" /> Add Product
                  </button>
                </div>

                <div className="bg-[#EBE9ED] border border-[#ADACB5]/40 rounded-[20px] overflow-hidden shadow-card">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                      <thead>
                        <tr className="text-[10px] font-black tracking-widest uppercase text-[#2D3142]/60 border-b border-[#ADACB5]/30 bg-[#D8D5DB]/60">
                          <th className="py-3.5 px-5">Product</th>
                          <th className="py-3.5 px-5">Category</th>
                          <th className="py-3.5 px-5">Price</th>
                          <th className="py-3.5 px-5">Status / Stock</th>
                          <th className="py-3.5 px-5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#ADACB5]/20">
                        {products.map((product) => (
                          <tr key={product.id} className="hover:bg-[#D8D5DB]/40 transition-colors">
                            <td className="py-3.5 px-5">
                              <div className="flex items-center gap-3">
                                <div className="relative w-10 h-13 bg-[#D8D5DB] rounded-md overflow-hidden shrink-0">
                                  {product.images?.[0] && (
                                    <Image
                                      src={product.images[0]}
                                      alt={product.name}
                                      fill
                                      className="object-cover"
                                    />
                                  )}
                                </div>
                                <span className="font-bold text-xs uppercase tracking-wide text-[#2D3142] line-clamp-1">
                                  {product.name}
                                </span>
                              </div>
                            </td>
                            <td className="py-3.5 px-5 text-xs text-[#2D3142]/70 uppercase font-semibold">
                              {product.category}
                            </td>
                            <td className="py-3.5 px-5 text-xs font-black text-[#2D3142]">
                              ₹{product.price.toLocaleString("en-IN")}
                            </td>
                            <td className="py-3.5 px-5">
                              <div className="flex flex-col items-start gap-1">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[9px] font-black tracking-widest uppercase ${
                                    product.status === "Published"
                                      ? "bg-[#2D3142] text-[#D8D5DB]"
                                      : "bg-[#ADACB5] text-[#2D3142]"
                                  }`}
                                >
                                  {product.status}
                                </span>
                                <span className="text-[10px] text-[#2D3142]/60 font-bold">
                                  Stock: {product.stock}
                                </span>
                              </div>
                            </td>
                            <td className="py-3.5 px-5 text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => openProductModal(product)}
                                  className="p-1.5 text-[#2D3142]/60 hover:text-[#2D3142]"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(product.id)}
                                  className="p-1.5 text-[#2D3142]/60 hover:text-[#2D3142]"
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

            {/* ORDERS TAB */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                <h1 className="text-2xl md:text-3xl font-black tracking-tight uppercase text-[#2D3142]">
                  Orders
                </h1>

                <div className="bg-[#EBE9ED] border border-[#ADACB5]/40 rounded-[20px] overflow-hidden shadow-card">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                      <thead>
                        <tr className="text-[10px] font-black tracking-widest uppercase text-[#2D3142]/60 border-b border-[#ADACB5]/30 bg-[#D8D5DB]/60">
                          <th className="py-3.5 px-5">Order ID</th>
                          <th className="py-3.5 px-5">Customer</th>
                          <th className="py-3.5 px-5">Total</th>
                          <th className="py-3.5 px-5">Payment</th>
                          <th className="py-3.5 px-5">Status</th>
                          <th className="py-3.5 px-5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#ADACB5]/20">
                        {orders.map((order) => (
                          <tr key={order.id} className="hover:bg-[#D8D5DB]/40 transition-colors">
                            <td className="py-3.5 px-5 font-black text-xs text-[#2D3142]">
                              {order.order_number}
                            </td>
                            <td className="py-3.5 px-5 text-xs text-[#2D3142]">
                              <div className="font-bold">{order.customer_name}</div>
                              <div className="text-[10px] text-[#2D3142]/60">{order.customer_phone}</div>
                            </td>
                            <td className="py-3.5 px-5 text-xs font-black text-[#2D3142]">
                              ₹{Number(order.total).toLocaleString("en-IN")}
                            </td>
                            <td className="py-3.5 px-5">
                              <span
                                className={`px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-widest uppercase ${
                                  order.payment_status === "fully_paid"
                                    ? "bg-[#2D3142] text-[#D8D5DB]"
                                    : "bg-[#ADACB5] text-[#2D3142]"
                                }`}
                              >
                                {order.payment_status.replace("_", " ")}
                              </span>
                            </td>
                            <td className="py-3.5 px-5">
                              <select
                                value={order.order_status}
                                onChange={(e) =>
                                  updateOrderStatus(order.id, e.target.value as OrderStatus)
                                }
                                className="bg-[#D8D5DB] border border-[#ADACB5]/40 text-[#2D3142] text-xs font-bold uppercase rounded-lg px-2.5 py-1.5 outline-none cursor-pointer"
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
                                  className="p-2 bg-[#D8D5DB] text-[#2D3142] hover:bg-[#2D3142] hover:text-[#D8D5DB] transition-colors rounded-lg shadow-sm"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                </a>
                                {order.payment_status === "pending" && (
                                  <button
                                    onClick={() => confirmPayment(order.id)}
                                    className="px-2.5 py-1 bg-[#2D3142] text-[#D8D5DB] rounded-lg text-[9px] font-black uppercase tracking-wider hover:bg-[#3D4258]"
                                  >
                                    Confirm
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
          <div className="bg-[#EBE9ED] border border-[#ADACB5]/40 rounded-[24px] w-full max-w-md p-6 shadow-float text-[#2D3142]">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-[#ADACB5]/30">
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
                  className="w-full bg-[#D8D5DB] border border-[#ADACB5]/40 rounded-[12px] px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#2D3142] text-[#2D3142]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black tracking-widest uppercase text-[#2D3142]/70 mb-1.5">
                  Active
                </label>
                <div className="h-[42px] flex items-center px-3.5 border border-[#ADACB5]/40 rounded-[12px] bg-[#D8D5DB]">
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
                  className="flex-1 bg-[#D8D5DB] border border-[#ADACB5]/40 text-[#2D3142] py-3 rounded-full font-black tracking-widest uppercase text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 bg-[#2D3142] text-[#D8D5DB] py-3 rounded-full font-black tracking-widest uppercase text-xs hover:bg-[#3D4258]"
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Collection Form Modal */}
      {isCollectionModalOpen && (
        <div className="fixed inset-0 bg-[#2D3142]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#EBE9ED] border border-[#ADACB5]/40 rounded-[24px] w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-float text-[#2D3142]">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-[#ADACB5]/30">
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
                  <div className="relative w-20 h-20 bg-[#D8D5DB] rounded-[12px] border border-[#ADACB5]/40 flex items-center justify-center overflow-hidden shrink-0">
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
                  className="w-full bg-[#D8D5DB] border border-[#ADACB5]/40 rounded-[12px] px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#2D3142] text-[#2D3142]"
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
                  className="w-full bg-[#D8D5DB] border border-[#ADACB5]/40 rounded-[12px] px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#2D3142] text-[#2D3142]"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black tracking-widest uppercase text-[#2D3142]/70 mb-1.5">
                  Active
                </label>
                <div className="h-[42px] flex items-center px-3.5 border border-[#ADACB5]/40 rounded-[12px] bg-[#D8D5DB]">
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
                  className="flex-1 bg-[#D8D5DB] border border-[#ADACB5]/40 text-[#2D3142] py-3 rounded-full font-black tracking-widest uppercase text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 bg-[#2D3142] text-[#D8D5DB] py-3 rounded-full font-black tracking-widest uppercase text-xs hover:bg-[#3D4258]"
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Form Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-[#2D3142]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#EBE9ED] border border-[#ADACB5]/40 rounded-[24px] w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 shadow-float text-[#2D3142]">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-[#ADACB5]/30">
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
                  <div className="relative w-20 h-24 bg-[#D8D5DB] rounded-[12px] border border-[#ADACB5]/40 flex items-center justify-center overflow-hidden shrink-0">
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
                  className="w-full bg-[#D8D5DB] border border-[#ADACB5]/40 rounded-[12px] px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#2D3142] text-[#2D3142]"
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
                  className="w-full bg-[#D8D5DB] border border-[#ADACB5]/40 rounded-[12px] px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#2D3142] text-[#2D3142]"
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
                    defaultValue={editingProduct?.category || categories[0]?.slug || ""}
                    className="w-full bg-[#D8D5DB] border border-[#ADACB5]/40 rounded-[12px] px-3 py-2.5 text-xs font-semibold focus:outline-none text-[#2D3142] uppercase"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black tracking-widest uppercase text-[#2D3142]/70 mb-1.5">
                    Collection (Optional)
                  </label>
                  <select
                    name="collection"
                    defaultValue={editingProduct?.collection || ""}
                    className="w-full bg-[#D8D5DB] border border-[#ADACB5]/40 rounded-[12px] px-3 py-2.5 text-xs font-semibold focus:outline-none text-[#2D3142] uppercase"
                  >
                    <option value="">None</option>
                    {collections.map((col) => (
                      <option key={col.id} value={col.slug}>
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
                    className="w-full bg-[#D8D5DB] border border-[#ADACB5]/40 rounded-[12px] px-3.5 py-2.5 text-xs font-semibold focus:outline-none text-[#2D3142]"
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
                    className="w-full bg-[#D8D5DB] border border-[#ADACB5]/40 rounded-[12px] px-3.5 py-2.5 text-xs font-semibold focus:outline-none text-[#2D3142]"
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
                    defaultValue={editingProduct?.stock || 0}
                    className="w-full bg-[#D8D5DB] border border-[#ADACB5]/40 rounded-[12px] px-3.5 py-2.5 text-xs font-semibold focus:outline-none text-[#2D3142]"
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
                    className="w-full bg-[#D8D5DB] border border-[#ADACB5]/40 rounded-[12px] px-3 py-2.5 text-xs font-semibold focus:outline-none text-[#2D3142] uppercase"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black tracking-widest uppercase text-[#2D3142]/70 mb-1.5">
                  Featured / New Drop?
                </label>
                <div className="h-[42px] flex items-center px-3.5 border border-[#ADACB5]/40 rounded-[12px] bg-[#D8D5DB]">
                  <input
                    type="checkbox"
                    name="featured"
                    defaultChecked={editingProduct?.featured}
                    className="w-4 h-4 accent-[#2D3142]"
                  />
                  <span className="ml-2.5 text-xs font-bold uppercase">Featured on Homepage</span>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  disabled={isSaving}
                  className="flex-1 bg-[#D8D5DB] border border-[#ADACB5]/40 text-[#2D3142] py-3 rounded-full font-black tracking-widest uppercase text-xs"
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
