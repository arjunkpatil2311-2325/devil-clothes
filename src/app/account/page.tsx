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
      <div className="flex-1 bg-[#ECEAEF] flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-[#2D3142] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-[#ECEAEF] p-4 md:p-8">
      <div className="max-w-4xl mx-auto mt-6 md:mt-12">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-[#2D3142] uppercase">
              My Account
            </h1>
            <p className="text-[#2D3142]/70 font-bold tracking-widest text-xs uppercase mt-2">
              Welcome, {profile?.full_name || user.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-[#2D3142] text-[#D8D5DB] px-6 py-3 rounded-full text-xs font-black tracking-widest uppercase hover:bg-[#3D4258] transition-colors w-fit"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#ADACB5]/20">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-[#ADACB5]/20">
                <div className="w-12 h-12 bg-[#2D3142] rounded-full flex items-center justify-center text-[#D8D5DB]">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-sm font-black tracking-widest uppercase text-[#2D3142]">Profile</h2>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-black tracking-widest uppercase text-[#ADACB5] mb-1">Name</p>
                  <p className="text-sm font-bold text-[#2D3142]">{profile?.full_name || "N/A"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black tracking-widest uppercase text-[#ADACB5] mb-1">Email</p>
                  <p className="text-sm font-bold text-[#2D3142] break-all">{profile?.email || user.email}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black tracking-widest uppercase text-[#ADACB5] mb-1">Phone</p>
                  <p className="text-sm font-bold text-[#2D3142]">{profile?.phone || "N/A"}</p>
                </div>
              </div>

              {profile?.role === 'admin' && (
                <div className="mt-8 pt-6 border-t border-[#ADACB5]/20">
                  <Link
                    href="/admin"
                    className="block w-full text-center bg-[#D8D5DB] text-[#2D3142] py-3 rounded-xl text-xs font-black tracking-widest uppercase hover:bg-[#ADACB5] transition-colors"
                  >
                    Go to Admin Dashboard
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Orders Section */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#ADACB5]/20 min-h-[400px]">
              <div className="flex items-center gap-3 mb-8">
                <Package className="w-6 h-6 text-[#2D3142]" />
                <h2 className="text-lg font-black tracking-widest uppercase text-[#2D3142]">My Orders</h2>
              </div>

              {ordersLoading ? (
                <div className="flex justify-center py-12">
                  <div className="w-6 h-6 border-4 border-[#2D3142] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-[#ADACB5]/30 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-[#2D3142]/50 transition-colors">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-black text-sm tracking-widest uppercase text-[#2D3142]">{order.order_number}</h3>
                          <span className={`text-[9px] font-black tracking-widest uppercase px-2 py-1 rounded-md ${
                            order.order_status === 'awaiting_payment' ? 'bg-amber-100 text-amber-800' :
                            order.order_status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                            order.order_status === 'delivered' ? 'bg-emerald-100 text-emerald-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.order_status.replace('_', ' ')}
                          </span>
                        </div>
                        <p className="text-xs text-[#ADACB5] font-medium">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center justify-between md:justify-end gap-6">
                        <div className="text-right">
                          <p className="font-black text-lg text-[#2D3142]">₹{order.total}</p>
                        </div>
                        <Link
                          href={`/order/${order.order_number}`}
                          className="bg-[#2D3142] text-white px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase hover:bg-black transition-colors"
                        >
                          View Order
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-[#F8F7F9] rounded-2xl">
                  <Package className="w-12 h-12 text-[#ADACB5] mx-auto mb-4 opacity-50" />
                  <p className="text-[#2D3142] font-black tracking-widest uppercase text-sm mb-2">No orders yet</p>
                  <p className="text-[#ADACB5] text-xs">When you place an order, it will appear here.</p>
                  <Link
                    href="/shop"
                    className="inline-block mt-6 bg-[#2D3142] text-[#D8D5DB] px-6 py-3 rounded-full text-xs font-black tracking-widest uppercase hover:bg-[#3D4258] transition-colors"
                  >
                    Start Shopping
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
