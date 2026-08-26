"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/utils/supabase/client";
import { User, LogOut, Package } from "lucide-react";
import Link from "next/link";

export default function AccountPage() {
  const { user, profile, loading, signOut } = useAuth();
  const router = useRouter();
  const supabase = createClient();
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login?redirect=/account");
    }
  }, [user, loading, router]);

  useEffect(() => {
    async function fetchOrders() {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (!error && data) {
          setOrders(data);
        }
      } catch (err) {
        console.error("Error fetching orders", err);
      } finally {
        setOrdersLoading(false);
      }
    }
    fetchOrders();
  }, [user, supabase]);

  const handleLogout = async () => {
    await signOut();
    router.push("/");
  };

  if (loading || !user) {
    return (
      <div className="flex-1 bg-[#D8D5DB] flex items-center justify-center min-h-[70vh]">
        <div className="w-8 h-8 border-4 border-[#2D3142] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#D8D5DB] text-[#2D3142]">
      <section className="px-3 pt-6 pb-12 md:px-6 md:pt-8 md:pb-16 max-w-6xl mx-auto w-full flex-1">
        
        {/* Header */}
        <div className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4 px-2">
          <div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-[#2D3142] uppercase leading-none mb-2">
              My Account
            </h1>
            <p className="text-[#2D3142]/70 font-bold tracking-widest text-[10px] md:text-xs uppercase">
              Welcome, {profile?.full_name || user.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 bg-[#2D3142] text-[#D8D5DB] px-6 min-h-[44px] md:min-h-[48px] rounded-full text-xs font-black tracking-[0.2em] uppercase hover:bg-[#3D4258] active:scale-95 transition-all shadow-sm w-full md:w-auto shrink-0"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
          {/* Profile Card */}
          <div className="md:col-span-4">
            <div className="bg-[#ECEAEF] rounded-[24px] p-6 md:p-8 shadow-card border border-[#ADACB5]/60 h-full flex flex-col">
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-[#ADACB5]/30">
                <div className="w-14 h-14 bg-[#2D3142] rounded-full flex items-center justify-center text-[#D8D5DB] shadow-sm shrink-0">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-sm md:text-base font-black tracking-widest uppercase text-[#2D3142] leading-tight">Profile</h2>
                </div>
              </div>

              <div className="space-y-6 flex-1">
                <div>
                  <p className="text-[10px] font-black tracking-[0.2em] uppercase text-[#2D3142]/60 mb-1.5">Name</p>
                  <p className="text-sm font-bold text-[#2D3142] tracking-wide">{profile?.full_name || "N/A"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black tracking-[0.2em] uppercase text-[#2D3142]/60 mb-1.5">Email</p>
                  <p className="text-sm font-bold text-[#2D3142] tracking-wide break-all">{profile?.email || user.email}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black tracking-[0.2em] uppercase text-[#2D3142]/60 mb-1.5">Phone</p>
                  <p className="text-sm font-bold text-[#2D3142] tracking-wide">{profile?.phone || "N/A"}</p>
                </div>
              </div>

              {profile?.role === 'admin' && (
                <div className="mt-8 pt-6 border-t border-[#ADACB5]/30">
                  <Link
                    href="/admin"
                    className="flex items-center justify-center w-full bg-[#D8D5DB] border border-[#ADACB5] text-[#2D3142] min-h-[44px] rounded-full text-xs font-black tracking-[0.2em] uppercase hover:bg-white active:scale-95 transition-all"
                  >
                    Admin Dashboard
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Orders Section */}
          <div className="md:col-span-8">
            <div className="bg-[#ECEAEF] rounded-[24px] md:rounded-[36px] p-6 md:p-8 shadow-card border border-[#ADACB5]/60 min-h-[400px] h-full">
              <div className="flex items-center gap-3 mb-8">
                <Package className="w-6 h-6 text-[#2D3142]" />
                <h2 className="text-base md:text-lg font-black tracking-widest uppercase text-[#2D3142]">My Orders</h2>
              </div>

              {ordersLoading ? (
                <div className="flex justify-center items-center h-48">
                  <div className="w-8 h-8 border-4 border-[#2D3142] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-white/50 border border-[#ADACB5]/40 rounded-[20px] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white hover:border-[#2D3142]/40 hover:shadow-sm transition-all">
                      <div>
                        <div className="flex items-center gap-3 mb-1.5">
                          <h3 className="font-black text-sm tracking-[0.1em] uppercase text-[#2D3142]">{order.order_number}</h3>
                          <span className={`text-[9px] font-black tracking-[0.2em] uppercase px-2.5 py-1 rounded-md ${
                            order.order_status === 'awaiting_payment' ? 'bg-amber-100 text-amber-900' :
                            order.order_status === 'shipped' ? 'bg-blue-100 text-blue-900' :
                            order.order_status === 'delivered' ? 'bg-emerald-100 text-emerald-900' :
                            'bg-gray-200 text-gray-800'
                          }`}>
                            {order.order_status.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#2D3142]/70 font-bold tracking-widest uppercase">
                          {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-8">
                        <div className="text-right">
                          <p className="font-black text-lg text-[#2D3142]">₹{order.total}</p>
                        </div>
                        <Link
                          href={`/order/${order.order_number}`}
                          className="bg-[#2D3142] text-[#D8D5DB] px-5 py-2.5 min-h-[36px] rounded-full text-[10px] font-black tracking-[0.2em] uppercase hover:bg-[#3D4258] active:scale-95 transition-all shrink-0"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-16 bg-white/40 rounded-[20px] border border-[#ADACB5]/30">
                  <Package className="w-12 h-12 text-[#2D3142]/30 mb-4" />
                  <p className="text-[#2D3142] font-black tracking-[0.2em] uppercase text-sm mb-2">No orders yet</p>
                  <p className="text-[#2D3142]/60 text-xs font-medium tracking-wide max-w-[250px]">When you place an order, it will appear here.</p>
                  <Link
                    href="/shop"
                    className="inline-flex mt-6 bg-[#2D3142] text-[#D8D5DB] px-7 min-h-[44px] items-center rounded-full text-xs font-black tracking-[0.2em] uppercase hover:bg-[#3D4258] active:scale-95 transition-all shadow-sm"
                  >
                    Start Shopping
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
