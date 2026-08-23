"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { useToast } from "@/components/ui/ToastProvider";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import {
  Package,
  DollarSign,
  Search,
  MoreVertical,
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
  Store,
  ImageIcon,
  Sparkles,
  TrendingUp,
  LogOut,
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

interface SiteBanners {
  hero_image: string;
  hero_title: string;
  hero_subtitle: string;
  promo_image: string;
  promo_tag: string;
  promo_title: string;
  promo_subtitle: string;
  promo_button_text: string;
  promo_button_link: string;
  story_image: string;
  story_title: string;
  story_text: string;
  shop_hero_image: string;
  collections_hero_image: string;
  about_hero_image: string;
  about_story_1: string;
  about_story_2: string;
  about_story_3: string;
  contact_hero_image: string;
}

type TabType = "dashboard" | "products" | "orders" | "categories" | "collections" | "banners";

export default function AdminDashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const { showToast } = useToast();
  const { confirm } = useConfirm();
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderFilter, setOrderFilter] = useState<"ALL" | "NEW" | "PAYMENT" | "PROCESSING" | "SHIPPED" | "DELIVERED">("ALL");
  const [orderSearch, setOrderSearch] = useState("");
  const [isUpdatingOrder, setIsUpdatingOrder] = useState<string | null>(null);

  const [banners, setBanners] = useState<SiteBanners | null>(null);
  const [bannerCategory, setBannerCategory] = useState<
    "ALL" | "HOMEPAGE" | "SHOP" | "COLLECTIONS" | "ABOUT" | "CONTACT"
  >("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadingBanner, setIsUploadingBanner] = useState<string | null>(null);

  // Promo Banner Text Customizer State
  const [isSavingPromoTexts, setIsSavingPromoTexts] = useState(false);
  const [promoTag, setPromoTag] = useState("Limited Time Offer");
  const [promoTitle, setPromoTitle] = useState("GET 20% OFF");
  const [promoSubtitle, setPromoSubtitle] = useState("On selected streetwear essentials & seasonal drops");
  const [promoBtnText, setPromoBtnText] = useState("Shop The Sale");
  const [promoBtnLink, setPromoBtnLink] = useState("/shop");

  // Modal States
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);

  const showNotification = (type: "success" | "error", message: string) => {
    showToast({ type, title: type === "success" ? "SUCCESS" : "ERROR", message });
  };

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
      const [productsRes, categoriesRes, collectionsRes, ordersRes, bannersRes] =
        await Promise.all([
          fetch("/api/admin/products"),
          fetch("/api/admin/categories"),
          fetch("/api/admin/collections"),
          fetch("/api/admin/orders"),
          fetch("/api/admin/banners"),
        ]);

      const [prodsData, catsData, colsData, ordersData, bannersData] = await Promise.all([
        productsRes.json(),
        categoriesRes.json(),
        collectionsRes.json(),
        ordersRes.json(),
        bannersRes.json(),
      ]);

      if (prodsData.success) setProducts(prodsData.data || []);
      if (catsData.success) setCategories(catsData.data || []);
      if (colsData.success) setCollections(colsData.data || []);
      if (ordersData.success) setOrders(ordersData.data || []);
      if (bannersData.success && bannersData.data) {
        setBanners(bannersData.data);
        if (bannersData.data.promo_tag) setPromoTag(bannersData.data.promo_tag);
        if (bannersData.data.promo_title) setPromoTitle(bannersData.data.promo_title);
        if (bannersData.data.promo_subtitle) setPromoSubtitle(bannersData.data.promo_subtitle);
        if (bannersData.data.promo_button_text) setPromoBtnText(bannersData.data.promo_button_text);
        if (bannersData.data.promo_button_link) setPromoBtnLink(bannersData.data.promo_button_link);
      }
    } catch (error: any) {
      console.error("Error fetching admin data:", error);
      showNotification("error", "Failed to load database: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Strictly calculate total revenue from confirmed/paid orders
  const totalRevenue = orders.reduce((acc, order) => {
    if (order.payment_status === "fully_paid" && order.order_status !== "cancelled") {
      return acc + Number(order.total || 0);
    }
    return acc;
  }, 0);

  const handleDeleteProduct = async (id: string, name: string) => {
    const isConfirmed = await confirm({
      title: "DELETE PRODUCT?",
      message: `Are you sure you want to delete "${name}"? This action cannot be undone.`,
      confirmText: "DELETE",
      cancelText: "CANCEL",
      destructive: true
    });
    if (isConfirmed) {
      try {
        const res = await fetch(`/api/admin/products?id=${id}&hard=true`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to delete product");
        }
        showToast({ type: "success", title: "PRODUCT DELETED", message: `Product "${name}" deleted` });
        fetchData();
      } catch (error: any) {
        showToast({ type: "error", title: "DELETE FAILED", message: error.message });
      }
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    const isConfirmed = await confirm({
      title: "DELETE CATEGORY?",
      message: `Are you sure you want to delete category "${name}"? This action cannot be undone.`,
      confirmText: "DELETE",
      cancelText: "CANCEL",
      destructive: true
    });
    if (isConfirmed) {
      try {
        const res = await fetch(`/api/admin/categories?id=${id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to delete category");
        }
        showToast({ type: "success", title: "CATEGORY DELETED", message: `Category "${name}" deleted` });
        fetchData();
      } catch (error: any) {
        showToast({ type: "error", title: "DELETE FAILED", message: error.message });
      }
    }
  };

  const handleDeleteCollection = async (id: string, name: string) => {
    const isConfirmed = await confirm({
      title: "DELETE COLLECTION?",
      message: `Are you sure you want to delete collection "${name}"? This action cannot be undone.`,
      confirmText: "DELETE",
      cancelText: "CANCEL",
      destructive: true
    });
    if (isConfirmed) {
      try {
        const res = await fetch(`/api/admin/collections?id=${id}`, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to delete collection");
        }
        showToast({ type: "success", title: "COLLECTION DELETED", message: `Collection "${name}" deleted` });
        fetchData();
      } catch (error: any) {
        showToast({ type: "error", title: "DELETE FAILED", message: error.message });
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

  const handleBannerUpload = async (key: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingBanner(key);
    try {
      const formData = new FormData();
      formData.append("key", key);
      formData.append("file", file);

      const res = await fetch("/api/admin/banners", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update banner");
      }

      showNotification("success", "Banner updated successfully!");
      if (banners) {
        setBanners({ ...banners, [key]: data.url });
      }
    } catch (error: any) {
      showNotification("error", error.message);
    } finally {
      setIsUploadingBanner(null);
    }
  };

  const handleSavePromoTexts = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingPromoTexts(true);
    try {
      const res = await fetch("/api/admin/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          texts: {
            promo_tag: promoTag,
            promo_title: promoTitle,
            promo_subtitle: promoSubtitle,
            promo_button_text: promoBtnText,
            promo_button_link: promoBtnLink,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update promotional texts");
      }

      showNotification("success", "Promotional discount & banner texts updated!");
      if (banners) {
        setBanners({
          ...banners,
          promo_tag: promoTag,
          promo_title: promoTitle,
          promo_subtitle: promoSubtitle,
          promo_button_text: promoBtnText,
          promo_button_link: promoBtnLink,
        });
      }
    } catch (error: any) {
      showNotification("error", error.message);
    } finally {
      setIsSavingPromoTexts(false);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const formData = new FormData(e.currentTarget);
      const name = formData.get("name") as string;
      const customSlug = formData.get("slug") as string;
      const slug =
        customSlug ||
        name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");

      let imageUrl = editingProduct?.images?.[0] || "";

      if (imageFile) {
        imageUrl = await uploadImage();
      }

      const productPayload = {
        name,
        slug,
        category: (formData.get("category") as string) || "T-SHIRTS",
        collection: (formData.get("collection") as string) || null,
        price: Number(formData.get("price")),
        original_price: formData.get("original_price")
          ? Number(formData.get("original_price"))
          : null,
        stock: Number(formData.get("stock")),
        status: (formData.get("status") as string) || "Published",
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
      const customSlug = formData.get("slug") as string;
      const slug =
        customSlug ||
        name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");

      const categoryPayload = {
        name,
        slug,
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
      const customSlug = formData.get("slug") as string;
      const slug =
        customSlug ||
        name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, "");
      let imageUrl = editingCollection?.image || "";

      if (imageFile) {
        imageUrl = await uploadImage();
      }

      const collectionPayload = {
        name,
        slug,
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

  const advanceOrderPipeline = async (order: Order) => {
    if (isUpdatingOrder) return;
    setIsUpdatingOrder(order.id);

    try {
      let payload: Partial<Order> = {};
      let successMsg = "";

      if (order.payment_status === "pending" || order.order_status === "awaiting_payment") {
        payload = { payment_status: "fully_paid", order_status: "processing" };
        successMsg = "PAYMENT CONFIRMED. Order moved to processing.";
      } else if (order.order_status === "processing" || order.order_status === "packed") {
        payload = { order_status: "shipped" };
        successMsg = "ORDER SHIPPED. Marked as shipped.";
      } else if (order.order_status === "shipped") {
        payload = { order_status: "delivered" };
        successMsg = "ORDER DELIVERED. Order is now complete.";
      } else {
        return;
      }

      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: order.id, ...payload }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to update order");

      setOrders(orders.map((o) => (o.id === order.id ? { ...o, ...payload } : o)));
      showToast({ type: "success", title: "SUCCESS", message: successMsg });
    } catch (error: any) {
      showToast({ type: "error", title: "UPDATE FAILED", message: error.message });
    } finally {
      setIsUpdatingOrder(null);
    }
  };

  const cancelOrder = async (order: Order) => {
    const isConfirmed = await confirm({
      title: "CANCEL ORDER?",
      message: `Are you sure you want to cancel ${order.order_number}? This action cannot be undone.`,
      confirmText: "CANCEL ORDER",
      cancelText: "KEEP ORDER",
      destructive: true,
    });
    
    if (!isConfirmed) return;

    setIsUpdatingOrder(order.id);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: order.id, order_status: "cancelled" }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to cancel order");

      setOrders(orders.map((o) => (o.id === order.id ? { ...o, order_status: "cancelled" } : o)));
      showToast({ type: "success", title: "ORDER CANCELLED", message: `${order.order_number} has been cancelled.` });
    } catch (error: any) {
      showToast({ type: "error", title: "CANCEL FAILED", message: error.message });
    } finally {
      setIsUpdatingOrder(null);
    }
  };

  const deleteOrder = async (id: string) => {
    const isConfirmed = await confirm({
      title: "DELETE ORDER?",
      message: "Are you sure you want to permanently delete this order? This action cannot be undone.",
      confirmText: "DELETE ORDER",
      cancelText: "KEEP ORDER",
      destructive: true
    });
    if (!isConfirmed) return;
    
    try {
      const res = await fetch(`/api/admin/orders?id=${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      setOrders(orders.filter((o) => o.id !== id));
      showToast({ type: "success", title: "ORDER DELETED", message: "Order deleted successfully" });
    } catch (error: any) {
      showToast({ type: "error", title: "DELETE FAILED", message: error.message });
    }
  };


  const generateAdminWhatsappUrl = (order: Order) => {
    const message = `Hi ${order.customer_name}! 👋\n\nYour DEVIL CLOTHES pre-order #${order.order_number} is received.\n\nTotal: ₹${order.total}\nStatus: ${order.order_status}\n\nThank you for choosing DEVIL CLOTHES!`;
    const phone = order.customer_phone ? order.customer_phone.replace(/[^0-9]/g, "") : "";
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
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

  const navItems = [
    { label: "Dashboard", shortLabel: "Home", id: "dashboard" as TabType, icon: LayoutDashboard },
    { label: "Products", shortLabel: "Items", id: "products" as TabType, icon: ShoppingBag, count: products.length },
    { label: "Orders", shortLabel: "Orders", id: "orders" as TabType, icon: ShoppingCart, count: orders.length },
    { label: "Banners", shortLabel: "Media", id: "banners" as TabType, icon: ImageIcon },
    { label: "Categories", shortLabel: "Cats", id: "categories" as TabType, icon: Tags, count: categories.length },
    { label: "Collections", shortLabel: "Drops", id: "collections" as TabType, icon: Layers, count: collections.length },
  ];

  return (
    <div className="flex w-full min-h-screen bg-[#D8D5DB] text-[#2D3142] pb-28 md:pb-8">

      {/* Desktop Sidebar */}
      <aside className="w-64 bg-[#ECEAEF] border-r border-[#ADACB5]/60 hidden md:flex flex-col shrink-0">
        <div className="p-6 border-b border-[#ADACB5]/40">
          <div className="text-lg font-black tracking-tight uppercase text-[#2D3142]">
            DEVIL <span className="text-[#2D3142]/60">CLOTHES</span>
          </div>
          <div className="text-[10px] font-black tracking-widest uppercase text-[#2D3142]/70 mt-0.5">
            Admin Studio
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[9px] font-black tracking-widest uppercase bg-[#2D3142] text-[#D8D5DB] px-2.5 py-0.5 rounded-full inline-block shadow-sm">
              Live Production
            </span>
            <Link
              href="/"
              target="_blank"
              className="text-[10px] font-bold uppercase tracking-wider text-[#2D3142]/70 hover:text-[#2D3142] flex items-center gap-1"
            >
              Store <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-[16px] text-xs font-black tracking-widest uppercase transition-all ${
                activeTab === item.id
                  ? "bg-[#2D3142] text-[#D8D5DB] shadow-sm"
                  : "text-[#2D3142]/70 hover:bg-[#D8D5DB]/70 hover:text-[#2D3142]"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </div>
              {item.count !== undefined && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                    activeTab === item.id
                      ? "bg-[#D8D5DB] text-[#2D3142]"
                      : "bg-[#D8D5DB] text-[#2D3142]/70"
                  }`}
                >
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-[#ADACB5]/40">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-[16px] text-xs font-black tracking-widest uppercase transition-all text-[#2D3142]/70 hover:bg-rose-100 hover:text-rose-600"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-[#D8D5DB]/90 backdrop-blur-2xl border-b border-[#ADACB5]/60 px-4 py-3 flex items-center justify-between">
        <div>
          <div className="text-sm font-black tracking-tight uppercase text-[#2D3142] leading-none">
            DEVIL CLOTHES
          </div>
          <div className="text-[9px] font-bold tracking-widest uppercase text-[#2D3142]/70 mt-0.5">
            Admin Studio
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="bg-[#2D3142] text-[#D8D5DB] px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
          >
            <Store className="w-3.5 h-3.5" />
            <span>Store</span>
          </Link>
          <button
            onClick={handleLogout}
            className="bg-rose-100 text-rose-600 px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-3.5 sm:p-5 md:p-8 overflow-y-auto max-w-7xl pt-16 md:pt-8 w-full">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#2D3142] border-t-transparent"></div>
          </div>
        ) : (
          <>
            {/* TAB: DASHBOARD */}
            {activeTab === "dashboard" && (
              <div className="space-y-5 md:space-y-6">
                <div className="hidden md:block">
                  <h1 className="text-2xl md:text-3xl font-black tracking-tight uppercase">
                    Admin Overview
                  </h1>
                  <p className="text-xs text-[#2D3142]/70 uppercase tracking-widest font-semibold mt-1">
                    Real-time metrics & inventory management
                  </p>
                </div>

                {/* 2-Column Mobile Metric Grid / 4-Column Desktop */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 md:gap-5">
                  <div
                    onClick={() => setActiveTab("products")}
                    className="bg-[#ECEAEF] rounded-[22px] p-4 md:p-6 border border-[#ADACB5]/60 shadow-[0_4px_20px_rgba(45,49,66,0.06)] cursor-pointer active:scale-98 transition-all hover:border-[#2D3142]/40"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] md:text-[11px] font-black tracking-widest uppercase text-[#2D3142]/70">
                        Products
                      </span>
                      <div className="w-7 h-7 rounded-full bg-[#D8D5DB] flex items-center justify-center text-[#2D3142]">
                        <Package className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <div className="text-2xl md:text-3xl font-black text-[#2D3142]">
                      {products.length}
                    </div>
                  </div>

                  <div
                    onClick={() => setActiveTab("orders")}
                    className="bg-[#ECEAEF] rounded-[22px] p-4 md:p-6 border border-[#ADACB5]/60 shadow-[0_4px_20px_rgba(45,49,66,0.06)] cursor-pointer active:scale-98 transition-all hover:border-[#2D3142]/40"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] md:text-[11px] font-black tracking-widest uppercase text-[#2D3142]/70">
                        Orders
                      </span>
                      <div className="w-7 h-7 rounded-full bg-[#D8D5DB] flex items-center justify-center text-[#2D3142]">
                        <ShoppingCart className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <div className="text-2xl md:text-3xl font-black text-[#2D3142]">
                      {orders.length}
                    </div>
                  </div>

                  <div className="bg-[#ECEAEF] rounded-[22px] p-4 md:p-6 border border-[#ADACB5]/60 shadow-[0_4px_20px_rgba(45,49,66,0.06)]">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] md:text-[11px] font-black tracking-widest uppercase text-[#2D3142]/70">
                        Revenue
                      </span>
                      <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800">
                        <DollarSign className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <div className="text-2xl md:text-3xl font-black text-[#2D3142]">
                      ₹{totalRevenue.toLocaleString("en-IN")}
                    </div>
                  </div>

                  <div
                    onClick={() => setActiveTab("banners")}
                    className="bg-[#ECEAEF] rounded-[22px] p-4 md:p-6 border border-[#ADACB5]/60 shadow-[0_4px_20px_rgba(45,49,66,0.06)] cursor-pointer active:scale-98 transition-all hover:border-[#2D3142]/40"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] md:text-[11px] font-black tracking-widest uppercase text-[#2D3142]/70">
                        Site Media
                      </span>
                      <div className="w-7 h-7 rounded-full bg-[#D8D5DB] flex items-center justify-center text-[#2D3142]">
                        <ImageIcon className="w-3.5 h-3.5" />
                      </div>
                    </div>
                    <div className="text-2xl md:text-3xl font-black text-[#2D3142]">
                      6 Custom
                    </div>
                  </div>
                </div>

                {/* Onboarding Empty State Banner if 0 products */}
                {products.length === 0 ? (
                  <div className="bg-[#ECEAEF] rounded-[24px] p-6 md:p-10 border border-[#ADACB5]/60 shadow-card text-center flex flex-col items-center justify-center space-y-3.5 my-4">
                    <div className="w-14 h-14 rounded-full bg-[#D8D5DB] border border-[#ADACB5] flex items-center justify-center text-[#2D3142]">
                      <Package className="w-7 h-7 stroke-[1.8px]" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-[#2D3142]">
                      Your store is ready.
                    </h2>
                    <p className="text-xs md:text-sm text-[#2D3142]/70 font-semibold uppercase tracking-wider max-w-sm">
                      No products yet. Add your first product to start selling.
                    </p>
                    <button
                      onClick={() => openProductModal()}
                      className="bg-[#2D3142] text-[#D8D5DB] px-8 py-3.5 min-h-[48px] rounded-full font-black tracking-[0.2em] uppercase text-xs hover:bg-[#3D4258] active:scale-95 transition-all shadow-sm"
                    >
                      + Add Product
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2.5 flex-wrap pt-1">
                    <button
                      onClick={() => openProductModal()}
                      className="bg-[#2D3142] text-[#D8D5DB] px-6 py-3 min-h-[46px] rounded-full text-xs font-black tracking-[0.2em] uppercase flex items-center hover:bg-[#3D4258] active:scale-95 transition-all shadow-sm"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Add Product
                    </button>
                    <button
                      onClick={() => openCategoryModal()}
                      className="bg-[#ECEAEF] text-[#2D3142] border border-[#ADACB5]/70 px-6 py-3 min-h-[46px] rounded-full text-xs font-black tracking-[0.2em] uppercase flex items-center hover:bg-white active:scale-95 transition-all shadow-card"
                    >
                      <Plus className="w-4 h-4 mr-2" /> Add Category
                    </button>
                    <button
                      onClick={() => setActiveTab("banners")}
                      className="bg-[#ECEAEF] text-[#2D3142] border border-[#ADACB5]/70 px-6 py-3 min-h-[46px] rounded-full text-xs font-black tracking-[0.2em] uppercase flex items-center hover:bg-white active:scale-95 transition-all shadow-card"
                    >
                      <ImageIcon className="w-4 h-4 mr-2" /> Customize Images
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB: BANNERS / MEDIA CUSTOMIZER */}
            {activeTab === "banners" && (
              <div className="space-y-5 md:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h1 className="text-xl md:text-3xl font-black tracking-tight uppercase">
                      Site Banners & Media Studio
                    </h1>
                    <p className="text-[10px] md:text-xs text-[#2D3142]/70 uppercase tracking-widest font-semibold">
                      Customize cover photos, promotional graphics & lookbook collages across all pages
                    </p>
                  </div>
                </div>

                {/* Page Filter Pill Buttons */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 bg-[#ECEAEF] p-2 rounded-[20px] border border-[#ADACB5]/60">
                  {[
                    { id: "ALL", label: "All Pages" },
                    { id: "HOMEPAGE", label: "Homepage" },
                    { id: "SHOP", label: "Shop Page" },
                    { id: "COLLECTIONS", label: "Collections" },
                    { id: "ABOUT", label: "About Us" },
                    { id: "CONTACT", label: "Contact Us" },
                  ].map((pageTab) => (
                    <button
                      key={pageTab.id}
                      onClick={() => setBannerCategory(pageTab.id as any)}
                      className={`text-[11px] font-black tracking-wider uppercase px-4 py-2 rounded-full transition-all shrink-0 active:scale-95 ${
                        bannerCategory === pageTab.id
                          ? "bg-[#2D3142] text-[#D8D5DB] shadow-sm"
                          : "text-[#2D3142]/70 hover:bg-[#D8D5DB]/80 hover:text-[#2D3142]"
                      }`}
                    >
                      {pageTab.label}
                    </button>
                  ))}
                </div>

                {/* Homepage Promo Offer Text & Discount Customizer */}
                {(bannerCategory === "ALL" || bannerCategory === "HOMEPAGE") && (
                  <div className="bg-[#ECEAEF] rounded-[24px] p-5 md:p-6 border border-[#ADACB5]/60 shadow-card">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-[#ADACB5]/40">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-black uppercase bg-[#2D3142] text-[#D8D5DB] px-2.5 py-0.5 rounded-full">
                            Homepage Promo Section
                          </span>
                          <span className="text-xs font-black uppercase text-[#2D3142]">
                            Live Offer & Discount Settings
                          </span>
                        </div>
                        <p className="text-[10px] text-[#2D3142]/70 font-semibold uppercase mt-1">
                          Edit the discount headline, badge tag, description, and button link shown on the homepage
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleSavePromoTexts} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                        {/* Offer Title / Headline */}
                        <div>
                          <label className="block text-[10px] font-black tracking-widest uppercase text-[#2D3142]/70 mb-1">
                            Discount Headline / Title *
                          </label>
                          <input
                            type="text"
                            value={promoTitle}
                            onChange={(e) => setPromoTitle(e.target.value)}
                            placeholder="e.g. GET 20% OFF or FLAT ₹300 OFF"
                            className="w-full bg-[#D8D5DB] border border-[#ADACB5] rounded-[14px] px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:border-[#2D3142] text-[#2D3142] uppercase"
                            required
                          />
                        </div>

                        {/* Promo Badge Tag */}
                        <div>
                          <label className="block text-[10px] font-black tracking-widest uppercase text-[#2D3142]/70 mb-1">
                            Badge Tag *
                          </label>
                          <input
                            type="text"
                            value={promoTag}
                            onChange={(e) => setPromoTag(e.target.value)}
                            placeholder="e.g. Limited Time Offer"
                            className="w-full bg-[#D8D5DB] border border-[#ADACB5] rounded-[14px] px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:border-[#2D3142] text-[#2D3142] uppercase"
                            required
                          />
                        </div>

                        {/* Button Text */}
                        <div>
                          <label className="block text-[10px] font-black tracking-widest uppercase text-[#2D3142]/70 mb-1">
                            Button Label *
                          </label>
                          <input
                            type="text"
                            value={promoBtnText}
                            onChange={(e) => setPromoBtnText(e.target.value)}
                            placeholder="e.g. Shop The Sale"
                            className="w-full bg-[#D8D5DB] border border-[#ADACB5] rounded-[14px] px-3.5 py-2.5 text-xs font-bold focus:outline-none focus:border-[#2D3142] text-[#2D3142] uppercase"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                        {/* Offer Description */}
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] font-black tracking-widest uppercase text-[#2D3142]/70 mb-1">
                            Offer Subtitle / Description *
                          </label>
                          <input
                            type="text"
                            value={promoSubtitle}
                            onChange={(e) => setPromoSubtitle(e.target.value)}
                            placeholder="e.g. On selected streetwear essentials & seasonal drops. Available while stocks last."
                            className="w-full bg-[#D8D5DB] border border-[#ADACB5] rounded-[14px] px-3.5 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#2D3142] text-[#2D3142]"
                            required
                          />
                        </div>

                        {/* Button Link */}
                        <div>
                          <label className="block text-[10px] font-black tracking-widest uppercase text-[#2D3142]/70 mb-1">
                            Button Link
                          </label>
                          <input
                            type="text"
                            value={promoBtnLink}
                            onChange={(e) => setPromoBtnLink(e.target.value)}
                            placeholder="e.g. /shop or /collections"
                            className="w-full bg-[#D8D5DB] border border-[#ADACB5] rounded-[14px] px-3.5 py-2.5 text-xs font-mono focus:outline-none focus:border-[#2D3142] text-[#2D3142]"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          type="submit"
                          disabled={isSavingPromoTexts}
                          className="bg-[#2D3142] text-[#D8D5DB] px-7 py-3 min-h-[46px] rounded-full text-xs font-black tracking-[0.2em] uppercase flex items-center gap-2 hover:bg-[#3D4258] active:scale-95 transition-all shadow-sm disabled:opacity-50"
                        >
                          {isSavingPromoTexts ? (
                            <span>Saving Offer...</span>
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 text-emerald-400" />
                              <span>Save Promo Discount & Texts</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    {
                      key: "hero_image",
                      page: "HOMEPAGE",
                      badge: "Homepage",
                      title: "1. Main Hero Banner",
                      desc: "The big top editorial cover on the Homepage.",
                      preview: banners?.hero_image || "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200",
                      aspect: "aspect-[16/9]",
                    },
                    {
                      key: "promo_image",
                      page: "HOMEPAGE",
                      badge: "Homepage",
                      title: "2. Promo Section Cover Image",
                      desc: `Cover photo for '${promoTitle || "Promo"}' section.`,
                      preview: banners?.promo_image || "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=1200",
                      aspect: "aspect-[16/9]",
                    },
                    {
                      key: "story_image",
                      page: "HOMEPAGE",
                      badge: "Homepage",
                      title: "3. Brand Story Image",
                      desc: "Featured in the 'BUILT FOR YOUR STYLE' section.",
                      preview: banners?.story_image || "https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=1200",
                      aspect: "aspect-[4/3]",
                    },
                    {
                      key: "shop_hero_image",
                      page: "SHOP",
                      badge: "Shop Page",
                      title: "4. Shop Header Banner",
                      desc: "Top cover graphic on the /shop catalog page.",
                      preview: banners?.shop_hero_image || "https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1200",
                      aspect: "aspect-[16/6]",
                    },
                    {
                      key: "collections_hero_image",
                      page: "COLLECTIONS",
                      badge: "Collections",
                      title: "5. Collections Header Banner",
                      desc: "Top cover graphic on the /collections page.",
                      preview: banners?.collections_hero_image || "https://images.unsplash.com/photo-1523398002811-999aa8d9512e?q=80&w=1200",
                      aspect: "aspect-[16/6]",
                    },
                    {
                      key: "about_hero_image",
                      page: "ABOUT",
                      badge: "About Us",
                      title: "6. About Hero Banner",
                      desc: "Top cover graphic on the /about page.",
                      preview: banners?.about_hero_image || "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200",
                      aspect: "aspect-[16/6]",
                    },
                    {
                      key: "about_story_1",
                      page: "ABOUT",
                      badge: "About Us",
                      title: "7. Story Collage 1 (Left Model)",
                      desc: "Left vertical pill in the Our Story 3-image collage.",
                      preview: banners?.about_story_1 || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800",
                      aspect: "aspect-[3/4]",
                    },
                    {
                      key: "about_story_2",
                      page: "ABOUT",
                      badge: "About Us",
                      title: "8. Story Collage 2 (Center Highlight)",
                      desc: "Center centerpiece pill in the Our Story collage.",
                      preview: banners?.about_story_2 || "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800",
                      aspect: "aspect-[3/4]",
                    },
                    {
                      key: "about_story_3",
                      page: "ABOUT",
                      badge: "About Us",
                      title: "9. Story Collage 3 (Right Craft)",
                      desc: "Right vertical pill in the Our Story 3-image collage.",
                      preview: banners?.about_story_3 || "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800",
                      aspect: "aspect-[3/4]",
                    },
                    {
                      key: "contact_hero_image",
                      page: "CONTACT",
                      badge: "Contact Us",
                      title: "10. Contact Header Banner",
                      desc: "Top cover graphic on the /contact page.",
                      preview: banners?.contact_hero_image || "https://images.unsplash.com/photo-1492288991661-058aa541ff43?q=80&w=1200",
                      aspect: "aspect-[16/6]",
                    },
                  ]
                    .filter((item) => bannerCategory === "ALL" || item.page === bannerCategory)
                    .map((item) => (
                      <div
                        key={item.key}
                        className="bg-[#ECEAEF] rounded-[22px] p-4 border border-[#ADACB5]/60 shadow-[0_4px_16px_rgba(45,49,66,0.06)] flex flex-col justify-between space-y-3.5 hover:shadow-card transition-shadow"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-[9px] font-black uppercase bg-[#D8D5DB] text-[#2D3142] px-2.5 py-0.5 rounded-full border border-[#ADACB5]/50">
                              {item.badge}
                            </span>
                            <span className="text-[9px] font-mono text-[#2D3142]/60">
                              {item.key}
                            </span>
                          </div>
                          <h3 className="font-black text-xs md:text-sm uppercase text-[#2D3142]">
                            {item.title}
                          </h3>
                          <p className="text-[10px] text-[#2D3142]/70 font-semibold uppercase mt-0.5">
                            {item.desc}
                          </p>
                        </div>

                        {/* Live Image Preview */}
                        <div className={`relative w-full ${item.aspect} bg-[#2D3142] rounded-[16px] overflow-hidden border border-[#ADACB5]`}>
                          <Image
                            src={item.preview}
                            alt={item.title}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                          <div className="absolute top-2 right-2 bg-[#2D3142]/85 backdrop-blur-md text-[#D8D5DB] text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-sm">
                            Live Active
                          </div>
                        </div>

                        {/* Upload Button */}
                        <div>
                          <label className="w-full bg-[#2D3142] text-[#D8D5DB] py-3 min-h-[46px] rounded-full text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#3D4258] active:scale-95 transition-all shadow-sm cursor-pointer">
                            <Upload className="w-4 h-4" />
                            <span>
                              {isUploadingBanner === item.key ? "Uploading..." : "Change Image"}
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleBannerUpload(item.key, e)}
                              className="hidden"
                              disabled={isUploadingBanner === item.key}
                            />
                          </label>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* TAB: PRODUCTS */}
            {activeTab === "products" && (
              <div className="space-y-4 md:space-y-6">
                <div className="flex justify-between items-center gap-3">
                  <div>
                    <h1 className="text-xl md:text-3xl font-black tracking-tight uppercase">
                      Products ({products.length})
                    </h1>
                    <p className="text-[10px] md:text-xs text-[#2D3142]/70 uppercase tracking-widest font-semibold">
                      Inventory & pricing
                    </p>
                  </div>
                  <button
                    onClick={() => openProductModal()}
                    className="bg-[#2D3142] text-[#D8D5DB] px-5 md:px-7 py-2.5 md:py-3.5 min-h-[44px] rounded-full text-xs font-black tracking-[0.2em] uppercase flex items-center hover:bg-[#3D4258] active:scale-95 transition-all shadow-sm"
                  >
                    <Plus className="w-4 h-4 mr-1.5" />
                    <span>Add Product</span>
                  </button>
                </div>

                {products.length === 0 ? (
                  <div className="bg-[#ECEAEF] rounded-[24px] p-8 md:p-12 border border-[#ADACB5]/60 text-center flex flex-col items-center justify-center shadow-card space-y-3.5">
                    <div className="w-14 h-14 rounded-full bg-[#D8D5DB] border border-[#ADACB5] flex items-center justify-center text-[#2D3142]">
                      <ShoppingBag className="w-7 h-7 stroke-[1.8px]" />
                    </div>
                    <h2 className="text-lg font-black uppercase text-[#2D3142]">No products yet</h2>
                    <p className="text-xs text-[#2D3142]/70 font-semibold uppercase tracking-wider max-w-xs">
                      Add your first streetwear piece to display it on the store.
                    </p>
                    <button
                      onClick={() => openProductModal()}
                      className="bg-[#2D3142] text-[#D8D5DB] px-7 py-3 rounded-full text-xs font-black tracking-[0.2em] uppercase shadow-sm"
                    >
                      + Add Product
                    </button>
                  </div>
                ) : (
                  /* Mobile Product Cards (Stacked vertically, 100% one-hand friendly) */
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="bg-[#ECEAEF] rounded-[22px] p-3.5 md:p-4 border border-[#ADACB5]/60 shadow-[0_4px_16px_rgba(45,49,66,0.06)] flex flex-col justify-between space-y-3"
                      >
                        <div className="flex gap-3.5 items-start">
                          {/* Image */}
                          <div className="relative w-20 h-24 md:w-22 md:h-26 bg-[#D8D5DB] rounded-[16px] overflow-hidden shrink-0 border border-[#ADACB5]/60">
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

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span
                                className={`text-[9px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full ${
                                  product.status === "Published"
                                    ? "bg-[#2D3142] text-[#D8D5DB]"
                                    : "bg-[#D8D5DB] text-[#2D3142]/70"
                                }`}
                              >
                                {product.status}
                              </span>
                              <span className="text-[9px] text-[#2D3142]/60 font-black uppercase truncate">
                                {product.category}
                              </span>
                            </div>

                            <h3 className="font-black text-xs md:text-sm text-[#2D3142] uppercase line-clamp-1">
                              {product.name}
                            </h3>

                            <div className="text-xs md:text-sm font-black text-[#2D3142] mt-1 flex items-center gap-1.5">
                              <span>₹{product.price.toLocaleString("en-IN")}</span>
                              {product.original_price && (
                                <span className="line-through text-[10px] text-[#2D3142]/50 font-semibold">
                                  ₹{product.original_price.toLocaleString("en-IN")}
                                </span>
                              )}
                            </div>

                            <div className="text-[10px] font-bold uppercase text-[#2D3142]/70 mt-1">
                              Stock: <span className="font-black">{product.stock}</span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-1 border-t border-[#ADACB5]/30">
                          <button
                            onClick={() => openProductModal(product)}
                            className="flex-1 bg-[#D8D5DB] text-[#2D3142] py-2.5 min-h-[40px] rounded-full text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-white active:scale-95 transition-all shadow-sm"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.id, product.name)}
                            className="bg-[#D8D5DB] text-red-800 px-4 py-2.5 min-h-[40px] rounded-full text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-red-200 active:scale-95 transition-all shadow-sm"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

                          {/* TAB: ORDERS */}
              {activeTab === "orders" && (() => {
                // Filter and search logic
                const filteredOrders = orders
                  .filter((o) => {
                    if (orderFilter === "ALL") return true;
                    if (orderFilter === "NEW") return o.order_status === "awaiting_payment" && o.payment_status === "pending";
                    if (orderFilter === "PAYMENT") return o.order_status === "awaiting_payment" || o.payment_status === "pending";
                    if (orderFilter === "PROCESSING") return o.order_status === "processing" || o.order_status === "packed";
                    if (orderFilter === "SHIPPED") return o.order_status === "shipped";
                    if (orderFilter === "DELIVERED") return o.order_status === "delivered";
                    return true;
                  })
                  .filter((o) => {
                    if (!orderSearch.trim()) return true;
                    const query = orderSearch.toLowerCase();
                    return (
                      o.order_number.toLowerCase().includes(query) ||
                      o.customer_name.toLowerCase().includes(query) ||
                      (o.customer_phone || "").toLowerCase().includes(query)
                    );
                  });

                return (
                  <div className="space-y-4 md:space-y-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                      <div>
                        <h1 className="text-xl md:text-3xl font-black tracking-tight uppercase">
                          Customer Orders ({orders.length})
                        </h1>
                        <p className="text-[10px] md:text-xs text-[#2D3142]/70 uppercase tracking-widest font-semibold">
                          Order Pipeline Management
                        </p>
                      </div>
                      
                      <div className="relative w-full md:w-64">
                        <input
                          type="text"
                          placeholder="Search orders..."
                          value={orderSearch}
                          onChange={(e) => setOrderSearch(e.target.value)}
                          className="w-full bg-[#ECEAEF] border border-[#ADACB5] rounded-full pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#2D3142] transition-colors"
                        />
                        <Search className="w-4 h-4 text-[#ADACB5] absolute left-4 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                      {["ALL", "NEW", "PAYMENT", "PROCESSING", "SHIPPED", "DELIVERED"].map((f) => (
                        <button
                          key={f}
                          onClick={() => setOrderFilter(f as any)}
                          className={`px-4 py-2 rounded-full text-[10px] font-black tracking-widest uppercase whitespace-nowrap transition-colors ${
                            orderFilter === f
                              ? "bg-[#2D3142] text-[#D8D5DB]"
                              : "bg-[#D8D5DB] border border-[#ADACB5] text-[#2D3142] hover:bg-white"
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>

                    {filteredOrders.length === 0 ? (
                      <div className="bg-[#ECEAEF] rounded-[24px] p-8 md:p-12 border border-[#ADACB5]/60 text-center flex flex-col items-center justify-center shadow-card space-y-3.5 mt-4">
                        <div className="w-14 h-14 rounded-full bg-[#D8D5DB] border border-[#ADACB5] flex items-center justify-center text-[#2D3142]">
                          <Search className="w-7 h-7 stroke-[1.8px]" />
                        </div>
                        <h2 className="text-lg font-black uppercase text-[#2D3142]">No orders found</h2>
                        <p className="text-xs text-[#2D3142]/70 font-semibold uppercase tracking-wider max-w-xs">
                          Try adjusting your filters or search query.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {filteredOrders.map((order) => {
                          const isAwaitingPayment = order.order_status === "awaiting_payment" || order.payment_status === "pending";
                          const isProcessing = order.order_status === "processing" || order.order_status === "packed";
                          const isShipped = order.order_status === "shipped";
                          const isDelivered = order.order_status === "delivered";
                          const isCancelled = order.order_status === "cancelled";

                          let actionText = "";
                          if (isAwaitingPayment) actionText = "CONFIRM PAYMENT & PROCESS";
                          else if (isProcessing) actionText = "MARK AS SHIPPED →";
                          else if (isShipped) actionText = "MARK AS DELIVERED →";

                          return (
                            <div
                              key={order.id}
                              className="bg-[#ECEAEF] rounded-[24px] p-5 border border-[#ADACB5]/60 shadow-sm flex flex-col"
                            >
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <span className="text-[10px] font-black tracking-widest uppercase text-[#2D3142]/70 block">
                                    NEW ORDER
                                  </span>
                                  <div className="font-black text-base text-[#2D3142] uppercase mt-0.5">
                                    {order.order_number}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <span className="text-base font-black text-[#2D3142] block">
                                    ₹{Number(order.total).toLocaleString("en-IN")}
                                  </span>
                                  <span className="text-[10px] font-bold text-[#2D3142]/70">
                                    {order.customer_name}
                                  </span>
                                </div>
                              </div>

                              {/* Pipeline Timeline */}
                              <div className="flex items-center justify-between mb-6 px-1">
                                <PipelineDot active={true} label="ORDER" />
                                <PipelineLine active={!isAwaitingPayment && !isCancelled} />
                                <PipelineDot active={!isAwaitingPayment && !isCancelled} label="PAYMENT" />
                                <PipelineLine active={(isShipped || isDelivered) && !isCancelled} />
                                <PipelineDot active={(isShipped || isDelivered) && !isCancelled} label="SHIPPED" />
                                <PipelineLine active={isDelivered && !isCancelled} />
                                <PipelineDot active={isDelivered && !isCancelled} label="DELIVERED" />
                              </div>

                              <div className="mt-auto space-y-3">
                                {isCancelled ? (
                                  <div className="bg-red-100 text-red-600 rounded-xl p-3 text-center text-xs font-black uppercase tracking-wider">
                                    ORDER CANCELLED
                                  </div>
                                ) : isDelivered ? (
                                  <div className="bg-[#2D3142]/10 text-[#2D3142] rounded-xl p-3 text-center text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2">
                                    <CheckCircle className="w-4 h-4" /> ORDER COMPLETE
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => advanceOrderPipeline(order)}
                                    disabled={isUpdatingOrder === order.id}
                                    className="w-full py-3.5 bg-[#2D3142] text-[#D8D5DB] rounded-xl text-[10px] font-black uppercase tracking-[0.1em] hover:bg-[#3D4258] disabled:opacity-50 transition-colors"
                                  >
                                    {isUpdatingOrder === order.id ? "UPDATING..." : actionText}
                                  </button>
                                )}

                                <div className="flex gap-2">
                                  <a
                                    href={generateAdminWhatsappUrl(order)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 py-3 bg-[#D8D5DB] border border-[#ADACB5]/60 text-[#2D3142] hover:bg-white rounded-xl text-[10px] font-black tracking-widest uppercase flex items-center justify-center gap-1.5 transition-colors"
                                  >
                                    <MessageCircle className="w-3.5 h-3.5" /> WHATSAPP
                                  </a>
                                  
                                  <div className="relative group flex-1">
                                    <button className="w-full py-3 bg-[#D8D5DB] border border-[#ADACB5]/60 text-[#2D3142] hover:bg-white rounded-xl text-[10px] font-black tracking-widest uppercase flex items-center justify-center gap-1.5 transition-colors">
                                      MORE <MoreVertical className="w-3 h-3" />
                                    </button>
                                    {/* Dropdown for More */}
                                    <div className="absolute bottom-full right-0 mb-2 w-36 bg-[#EBE9ED] border border-[#ADACB5]/60 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all overflow-hidden z-20">
                                      {!isCancelled && (
                                        <button 
                                          onClick={() => cancelOrder(order)}
                                          disabled={isUpdatingOrder === order.id}
                                          className="w-full px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-red-600 hover:bg-red-50 disabled:opacity-50 transition-colors"
                                        >
                                          Cancel Order
                                        </button>
                                      )}
                                      <button 
                                        onClick={() => deleteOrder(order.id)}
                                        className="w-full px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-red-600 border-t border-[#ADACB5]/20 hover:bg-red-50 transition-colors"
                                      >
                                        Delete Order
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })()}


            {/* TAB: CATEGORIES */}
            {activeTab === "categories" && (
              <div className="space-y-4 md:space-y-6">
                <div className="flex justify-between items-center gap-3">
                  <div>
                    <h1 className="text-xl md:text-3xl font-black tracking-tight uppercase">
                      Categories ({categories.length})
                    </h1>
                    <p className="text-[10px] md:text-xs text-[#2D3142]/70 uppercase tracking-widest font-semibold">
                      Product navigation taxonomy
                    </p>
                  </div>
                  <button
                    onClick={() => openCategoryModal()}
                    className="bg-[#2D3142] text-[#D8D5DB] px-5 md:px-7 py-2.5 md:py-3.5 min-h-[44px] rounded-full text-xs font-black tracking-[0.2em] uppercase flex items-center hover:bg-[#3D4258] active:scale-95 transition-all shadow-sm"
                  >
                    <Plus className="w-4 h-4 mr-1.5" />
                    <span>Add Category</span>
                  </button>
                </div>

                {categories.length === 0 ? (
                  <div className="bg-[#ECEAEF] rounded-[24px] p-8 md:p-12 border border-[#ADACB5]/60 text-center flex flex-col items-center justify-center shadow-card space-y-3.5">
                    <div className="w-14 h-14 rounded-full bg-[#D8D5DB] border border-[#ADACB5] flex items-center justify-center text-[#2D3142]">
                      <Tags className="w-7 h-7 stroke-[1.8px]" />
                    </div>
                    <h2 className="text-lg font-black uppercase text-[#2D3142]">No categories yet</h2>
                    <p className="text-xs text-[#2D3142]/70 font-semibold uppercase tracking-wider max-w-xs">
                      Create categories to organize your clothing pieces into collections.
                    </p>
                    <button
                      onClick={() => openCategoryModal()}
                      className="bg-[#2D3142] text-[#D8D5DB] px-7 py-3 rounded-full text-xs font-black tracking-[0.2em] uppercase shadow-sm"
                    >
                      + Add Category
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                    {categories.map((cat) => (
                      <div
                        key={cat.id}
                        className="bg-[#ECEAEF] rounded-[20px] p-4 border border-[#ADACB5]/60 shadow-card flex justify-between items-center"
                      >
                        <div>
                          <div className="font-black text-sm uppercase text-[#2D3142]">
                            {cat.name}
                          </div>
                          <div className="text-[10px] text-[#2D3142]/70 font-mono mt-0.5">
                            {cat.slug}
                          </div>
                          <span
                            className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full inline-block mt-1.5 ${
                              cat.active
                                ? "bg-[#2D3142] text-[#D8D5DB]"
                                : "bg-[#D8D5DB] text-[#2D3142]/60"
                            }`}
                          >
                            {cat.active ? "Active" : "Hidden"}
                          </span>
                        </div>

                        <div className="flex gap-1.5">
                          <button
                            onClick={() => openCategoryModal(cat)}
                            className="p-2.5 bg-[#D8D5DB] text-[#2D3142] hover:bg-white rounded-full shadow-sm"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(cat.id, cat.name)}
                            className="p-2.5 bg-[#D8D5DB] text-red-800 hover:bg-red-200 rounded-full shadow-sm"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: COLLECTIONS */}
            {activeTab === "collections" && (
              <div className="space-y-4 md:space-y-6">
                <div className="flex justify-between items-center gap-3">
                  <div>
                    <h1 className="text-xl md:text-3xl font-black tracking-tight uppercase">
                      Collections ({collections.length})
                    </h1>
                    <p className="text-[10px] md:text-xs text-[#2D3142]/70 uppercase tracking-widest font-semibold">
                      Curated seasonal drops
                    </p>
                  </div>
                  <button
                    onClick={() => openCollectionModal()}
                    className="bg-[#2D3142] text-[#D8D5DB] px-5 md:px-7 py-2.5 md:py-3.5 min-h-[44px] rounded-full text-xs font-black tracking-[0.2em] uppercase flex items-center hover:bg-[#3D4258] active:scale-95 transition-all shadow-sm"
                  >
                    <Plus className="w-4 h-4 mr-1.5" />
                    <span>Add Collection</span>
                  </button>
                </div>

                {collections.length === 0 ? (
                  <div className="bg-[#ECEAEF] rounded-[24px] p-8 md:p-12 border border-[#ADACB5]/60 text-center flex flex-col items-center justify-center shadow-card space-y-3.5">
                    <div className="w-14 h-14 rounded-full bg-[#D8D5DB] border border-[#ADACB5] flex items-center justify-center text-[#2D3142]">
                      <Layers className="w-7 h-7 stroke-[1.8px]" />
                    </div>
                    <h2 className="text-lg font-black uppercase text-[#2D3142]">
                      No collections yet
                    </h2>
                    <p className="text-xs text-[#2D3142]/70 font-semibold uppercase tracking-wider max-w-xs">
                      Create seasonal capsules and special drop releases.
                    </p>
                    <button
                      onClick={() => openCollectionModal()}
                      className="bg-[#2D3142] text-[#D8D5DB] px-7 py-3 rounded-full text-xs font-black tracking-[0.2em] uppercase shadow-sm"
                    >
                      + Add Collection
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                    {collections.map((col) => (
                      <div
                        key={col.id}
                        className="bg-[#ECEAEF] rounded-[20px] p-4 border border-[#ADACB5]/60 shadow-card flex gap-3 items-center justify-between"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative w-14 h-16 bg-[#D8D5DB] rounded-[12px] overflow-hidden shrink-0 border border-[#ADACB5]">
                            {col.image ? (
                              <Image src={col.image} alt={col.name} fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[9px] text-[#2D3142]/50">
                                No Img
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-black text-sm uppercase text-[#2D3142] truncate">
                              {col.name}
                            </div>
                            <div className="text-[10px] text-[#2D3142]/70 font-mono mt-0.5 truncate">
                              {col.slug}
                            </div>
                            <span
                              className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full inline-block mt-1 ${
                                col.active
                                  ? "bg-[#2D3142] text-[#D8D5DB]"
                                  : "bg-[#D8D5DB] text-[#2D3142]/60"
                              }`}
                            >
                              {col.active ? "Active" : "Hidden"}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-1.5 shrink-0">
                          <button
                            onClick={() => openCollectionModal(col)}
                            className="p-2.5 bg-[#D8D5DB] text-[#2D3142] hover:bg-white rounded-full shadow-sm"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCollection(col.id, col.name)}
                            className="p-2.5 bg-[#D8D5DB] text-red-800 hover:bg-red-200 rounded-full shadow-sm"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Floating Bottom Navigation for Admin on Mobile */}
      <div className="md:hidden fixed bottom-3 left-2.5 right-2.5 z-40 max-w-lg mx-auto pointer-events-none">
        <nav className="pointer-events-auto h-[64px] bg-[#ECEAEF]/95 backdrop-blur-2xl rounded-[26px] shadow-[0_14px_40px_rgba(45,49,66,0.22)] border border-[#ADACB5]/60 px-1 flex items-center justify-between">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex-1 h-[54px] flex flex-col items-center justify-center rounded-[20px] transition-all duration-200 active:scale-95 ${
                  isActive
                    ? "bg-[#2D3142] text-[#D8D5DB] shadow-md"
                    : "text-[#2D3142]/70 hover:text-[#2D3142]"
                }`}
              >
                <div className="relative flex items-center justify-center">
                  <item.icon
                    className={`w-[17px] h-[17px] ${
                      isActive ? "stroke-[2.5px] text-[#D8D5DB]" : "stroke-[1.8px] text-[#2D3142]/80"
                    }`}
                  />
                  {item.count !== undefined && item.count > 0 && (
                    <span
                      className={`absolute -top-1 -right-2 min-w-[13px] h-[13px] px-0.5 rounded-full flex items-center justify-center text-[7px] font-black leading-none ${
                        isActive
                          ? "bg-[#D8D5DB] text-[#2D3142]"
                          : "bg-[#2D3142] text-[#D8D5DB]"
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[8.5px] font-black tracking-tight mt-1 uppercase text-center leading-none truncate max-w-full px-0.5 ${
                    isActive ? "text-[#D8D5DB]" : "text-[#2D3142]/70"
                  }`}
                >
                  {item.shortLabel || item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Product Form Sheet / Modal (Full-screen mobile sheet) */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-[#2D3142]/75 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-[#ECEAEF] border-t sm:border border-[#ADACB5]/60 rounded-t-[28px] sm:rounded-[28px] w-full max-w-xl h-[92vh] sm:h-auto sm:max-h-[90vh] flex flex-col shadow-float text-[#2D3142]">
            {/* Handle on mobile */}
            <div className="w-10 h-1 bg-[#ADACB5] rounded-full mx-auto my-2 sm:hidden" />

            {/* Modal Header */}
            <div className="flex justify-between items-center px-5 py-3.5 border-b border-[#ADACB5]/40 shrink-0">
              <h2 className="text-base sm:text-lg font-black tracking-tight uppercase">
                {editingProduct ? "Edit Product" : "Add Product"}
              </h2>
              <button
                onClick={() => {
                  setIsProductModalOpen(false);
                  setEditingProduct(null);
                }}
                className="w-8 h-8 rounded-full bg-[#D8D5DB] flex items-center justify-center text-[#2D3142] hover:scale-105 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Product Image Uploader */}
              <div>
                <label className="block text-[10px] font-black tracking-widest uppercase text-[#2D3142]/70 mb-1.5">
                  Product Image
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative aspect-[4/5] w-20 bg-[#D8D5DB] rounded-[16px] border border-[#ADACB5] flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                    {imagePreview ? (
                      <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                    ) : (
                      <Upload className="w-5 h-5 text-[#2D3142]/60" />
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5 flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="text-xs text-[#2D3142]/80 file:mr-2 file:py-2 file:px-3.5 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-[#2D3142] file:text-[#D8D5DB] cursor-pointer"
                    />
                    <span className="text-[9px] text-[#2D3142]/60 font-semibold uppercase">
                      Supports JPG, PNG, WebP
                    </span>
                  </div>
                </div>
              </div>

              {/* Product Name */}
              <div>
                <label className="block text-[10px] font-black tracking-widest uppercase text-[#2D3142]/70 mb-1.5">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={editingProduct?.name}
                  placeholder="e.g. Nocturnal Heavyweight Hoodie"
                  className="w-full bg-[#D8D5DB] border border-[#ADACB5] rounded-[14px] px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[#2D3142] text-[#2D3142]"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-[10px] font-black tracking-widest uppercase text-[#2D3142]/70 mb-1.5">
                  Custom URL Slug (Optional)
                </label>
                <input
                  type="text"
                  name="slug"
                  defaultValue={editingProduct?.slug}
                  placeholder="e.g. nocturnal-heavyweight-hoodie"
                  className="w-full bg-[#D8D5DB] border border-[#ADACB5] rounded-[14px] px-4 py-3 text-xs font-mono focus:outline-none focus:border-[#2D3142] text-[#2D3142]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] font-black tracking-widest uppercase text-[#2D3142]/70 mb-1.5">
                  Description *
                </label>
                <textarea
                  name="description"
                  rows={3}
                  required
                  defaultValue={editingProduct?.description}
                  placeholder="Fabric specs, garment fit, tailoring details..."
                  className="w-full bg-[#D8D5DB] border border-[#ADACB5] rounded-[14px] px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[#2D3142] text-[#2D3142]"
                />
              </div>

              {/* Category & Collection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black tracking-widest uppercase text-[#2D3142]/70 mb-1.5">
                    Category *
                  </label>
                  <select
                    name="category"
                    required
                    defaultValue={editingProduct?.category || categories[0]?.slug || "T-SHIRTS"}
                    className="w-full bg-[#D8D5DB] border border-[#ADACB5] rounded-[14px] px-3.5 py-3 text-xs font-bold focus:outline-none text-[#2D3142] uppercase"
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
                        <option value="JACKETS">Jackets</option>
                        <option value="ACCESSORIES">Accessories</option>
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
                    className="w-full bg-[#D8D5DB] border border-[#ADACB5] rounded-[14px] px-3.5 py-3 text-xs font-bold focus:outline-none text-[#2D3142] uppercase"
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

              {/* Price & Original Price */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black tracking-widest uppercase text-[#2D3142]/70 mb-1.5">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    required
                    defaultValue={editingProduct?.price}
                    placeholder="1999"
                    className="w-full bg-[#D8D5DB] border border-[#ADACB5] rounded-[14px] px-4 py-3 text-xs font-bold focus:outline-none text-[#2D3142]"
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
                    className="w-full bg-[#D8D5DB] border border-[#ADACB5] rounded-[14px] px-4 py-3 text-xs font-bold focus:outline-none text-[#2D3142]"
                  />
                </div>
              </div>

              {/* Stock & Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black tracking-widest uppercase text-[#2D3142]/70 mb-1.5">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    required
                    defaultValue={editingProduct?.stock !== undefined ? editingProduct.stock : 20}
                    className="w-full bg-[#D8D5DB] border border-[#ADACB5] rounded-[14px] px-4 py-3 text-xs font-bold focus:outline-none text-[#2D3142]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black tracking-widest uppercase text-[#2D3142]/70 mb-1.5">
                    Status *
                  </label>
                  <select
                    name="status"
                    required
                    defaultValue={editingProduct?.status || "Published"}
                    className="w-full bg-[#D8D5DB] border border-[#ADACB5] rounded-[14px] px-3.5 py-3 text-xs font-bold focus:outline-none text-[#2D3142] uppercase"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-black tracking-widest uppercase text-[#2D3142]/70 mb-1.5">
                    Featured Item
                  </label>
                  <div className="h-[46px] flex items-center px-3.5 border border-[#ADACB5] rounded-[14px] bg-[#D8D5DB]">
                    <input
                      type="checkbox"
                      name="featured"
                      defaultChecked={editingProduct ? editingProduct.featured : true}
                      className="w-4 h-4 accent-[#2D3142]"
                    />
                    <span className="ml-2 text-xs font-bold uppercase">Homepage</span>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black tracking-widest uppercase text-[#2D3142]/70 mb-1.5">
                    Bestseller
                  </label>
                  <div className="h-[46px] flex items-center px-3.5 border border-[#ADACB5] rounded-[14px] bg-[#D8D5DB]">
                    <input
                      type="checkbox"
                      name="bestseller"
                      defaultChecked={editingProduct ? editingProduct.bestseller : false}
                      className="w-4 h-4 accent-[#2D3142]"
                    />
                    <span className="ml-2 text-xs font-bold uppercase">Badge</span>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 pb-2 flex gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setIsProductModalOpen(false);
                    setEditingProduct(null);
                  }}
                  disabled={isSaving}
                  className="flex-1 bg-[#D8D5DB] border border-[#ADACB5] text-[#2D3142] py-3.5 min-h-[48px] rounded-full font-black tracking-widest uppercase text-xs active:scale-95 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 bg-[#2D3142] text-[#D8D5DB] py-3.5 min-h-[48px] rounded-full font-black tracking-widest uppercase text-xs hover:bg-[#3D4258] active:scale-95 transition-all shadow-sm"
                >
                  {isSaving ? "Saving..." : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Form Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-[#2D3142]/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#ECEAEF] border border-[#ADACB5] rounded-[24px] w-full max-w-md p-5 md:p-6 shadow-float text-[#2D3142]">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#ADACB5]/40">
              <h2 className="text-base font-black tracking-tight uppercase">
                {editingCategory ? "Edit Category" : "Add Category"}
              </h2>
              <button
                onClick={() => {
                  setIsCategoryModalOpen(false);
                  setEditingCategory(null);
                }}
                className="w-7 h-7 rounded-full bg-[#D8D5DB] flex items-center justify-center text-[#2D3142]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black tracking-widest uppercase text-[#2D3142]/70 mb-1.5">
                  Category Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={editingCategory?.name}
                  placeholder="e.g. Hoodies"
                  className="w-full bg-[#D8D5DB] border border-[#ADACB5] rounded-[14px] px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[#2D3142] text-[#2D3142]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black tracking-widest uppercase text-[#2D3142]/70 mb-1.5">
                  Slug (Optional)
                </label>
                <input
                  type="text"
                  name="slug"
                  defaultValue={editingCategory?.slug}
                  placeholder="e.g. HOODIES"
                  className="w-full bg-[#D8D5DB] border border-[#ADACB5] rounded-[14px] px-4 py-3 text-xs font-mono focus:outline-none focus:border-[#2D3142] text-[#2D3142]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black tracking-widest uppercase text-[#2D3142]/70 mb-1.5">
                  Active
                </label>
                <div className="h-[46px] flex items-center px-3.5 border border-[#ADACB5] rounded-[14px] bg-[#D8D5DB]">
                  <input
                    type="checkbox"
                    name="active"
                    defaultChecked={editingCategory ? editingCategory.active : true}
                    className="w-4 h-4 accent-[#2D3142]"
                  />
                  <span className="ml-2.5 text-xs font-bold uppercase">Visible in navigation</span>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsCategoryModalOpen(false);
                    setEditingCategory(null);
                  }}
                  disabled={isSaving}
                  className="flex-1 bg-[#D8D5DB] border border-[#ADACB5] text-[#2D3142] py-3.5 min-h-[46px] rounded-full font-black tracking-widest uppercase text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 bg-[#2D3142] text-[#D8D5DB] py-3.5 min-h-[46px] rounded-full font-black tracking-widest uppercase text-xs hover:bg-[#3D4258]"
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
        <div className="fixed inset-0 bg-[#2D3142]/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#ECEAEF] border border-[#ADACB5] rounded-[24px] w-full max-w-lg max-h-[90vh] overflow-y-auto p-5 md:p-6 shadow-float text-[#2D3142]">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#ADACB5]/40">
              <h2 className="text-base font-black tracking-tight uppercase">
                {editingCollection ? "Edit Collection" : "Add Collection"}
              </h2>
              <button
                onClick={() => {
                  setIsCollectionModalOpen(false);
                  setEditingCollection(null);
                }}
                className="w-7 h-7 rounded-full bg-[#D8D5DB] flex items-center justify-center text-[#2D3142]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCollection} className="space-y-4">
              <div>
                <label className="block text-[10px] font-black tracking-widest uppercase text-[#2D3142]/70 mb-1.5">
                  Cover Image
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative aspect-[4/5] w-18 bg-[#D8D5DB] rounded-[14px] border border-[#ADACB5] flex items-center justify-center overflow-hidden shrink-0">
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
                    className="text-xs text-[#2D3142]/80 file:mr-2 file:py-2 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-[#2D3142] file:text-[#D8D5DB]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black tracking-widest uppercase text-[#2D3142]/70 mb-1.5">
                  Collection Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={editingCollection?.name}
                  placeholder="e.g. Nocturnal Awakening"
                  className="w-full bg-[#D8D5DB] border border-[#ADACB5] rounded-[14px] px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[#2D3142] text-[#2D3142]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black tracking-widest uppercase text-[#2D3142]/70 mb-1.5">
                  Slug (Optional)
                </label>
                <input
                  type="text"
                  name="slug"
                  defaultValue={editingCollection?.slug}
                  placeholder="e.g. nocturnal-awakening"
                  className="w-full bg-[#D8D5DB] border border-[#ADACB5] rounded-[14px] px-4 py-3 text-xs font-mono focus:outline-none focus:border-[#2D3142] text-[#2D3142]"
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
                  placeholder="Collection aesthetic..."
                  className="w-full bg-[#D8D5DB] border border-[#ADACB5] rounded-[14px] px-4 py-3 text-xs font-semibold focus:outline-none focus:border-[#2D3142] text-[#2D3142]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black tracking-widest uppercase text-[#2D3142]/70 mb-1.5">
                  Active
                </label>
                <div className="h-[46px] flex items-center px-3.5 border border-[#ADACB5] rounded-[14px] bg-[#D8D5DB]">
                  <input
                    type="checkbox"
                    name="active"
                    defaultChecked={editingCollection ? editingCollection.active : true}
                    className="w-4 h-4 accent-[#2D3142]"
                  />
                  <span className="ml-2.5 text-xs font-bold uppercase">Show on storefront</span>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsCollectionModalOpen(false);
                    setEditingCollection(null);
                  }}
                  disabled={isSaving}
                  className="flex-1 bg-[#D8D5DB] border border-[#ADACB5] text-[#2D3142] py-3.5 min-h-[46px] rounded-full font-black tracking-widest uppercase text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 bg-[#2D3142] text-[#D8D5DB] py-3.5 min-h-[46px] rounded-full font-black tracking-widest uppercase text-xs hover:bg-[#3D4258]"
                >
                  {isSaving ? "Saving..." : "Save Collection"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function PipelineDot({ active, label }: { active: boolean; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1.5 w-10">
      <div className={`w-3.5 h-3.5 rounded-full border-2 transition-colors ${
        active ? "bg-[#2D3142] border-[#2D3142]" : "bg-transparent border-[#ADACB5]"
      }`} />
      <span className={`text-[8px] font-black tracking-widest uppercase transition-colors text-center ${
        active ? "text-[#2D3142]" : "text-[#ADACB5]"
      }`}>
        {label}
      </span>
    </div>
  );
}

function PipelineLine({ active }: { active: boolean }) {
  return (
    <div className={`flex-1 h-0.5 rounded-full -mt-4 transition-colors ${
      active ? "bg-[#2D3142]" : "bg-[#ADACB5]/40"
    }`} />
  );
}
