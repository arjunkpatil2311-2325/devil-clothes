import { supabaseAdmin } from "@/lib/supabase/server";
import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircle, MessageCircle } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/config";
import OrderClientActions from "./OrderClientActions";
import OrderSuccessOverlay from "./OrderSuccessOverlay";

export const dynamic = "force-dynamic";

export default async function OrderTrackingPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderNumber: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { orderNumber } = await params;
  const { new: isNewQuery } = await searchParams;
  const isNewOrder = isNewQuery === "1";
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?redirect=/order/${orderNumber}`);
  }

  // Fetch the order
  const { data: order, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("order_number", orderNumber)
    .single();

  if (error || !order || order.user_id !== user.id) {
    notFound();
  }

  // Fetch the items
  const { data: orderItems } = await supabaseAdmin
    .from("order_items")
    .select("*")
    .eq("order_id", order.id);

  const items = orderItems || [];

  // Generate dynamic WhatsApp Message
  const itemsText = items
    .map(
      (i: any) =>
        `▪ ${i.product_name} (${i.size}) x ${i.quantity} — ₹${i.subtotal}`
    )
    .join("\n");

  const whatsappMessage = `Hi DEVIL CLOTHES 🖤\n\nI'm reaching out regarding my order.\n\nOrder: #${order.order_number}\n\nProducts:\n${itemsText}\n\nSubtotal: ₹${order.subtotal}\nDelivery: ₹${order.delivery_charge}\n\n*TOTAL: ₹${order.total}*\n\nPlease help me with this order.\n\nThank you!`;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  const isAwaitingPayment = order.order_status === "awaiting_payment" || order.payment_status === "pending";
  const isPaymentConfirmed = order.payment_status === "fully_paid";
  const isProcessing = order.order_status === "processing";
  const isShipped = order.order_status === "shipped";
  const isDelivered = order.order_status === "delivered";
  const isCancelled = order.order_status === "cancelled";

  return (
    <>
      <OrderSuccessOverlay isNewOrder={isNewOrder} orderNumber={orderNumber} />
      
      <div className="flex flex-col w-full min-h-screen bg-[#D8D5DB] text-[#2D3142] pt-8 pb-16 px-3 md:px-6">
        <div className="max-w-xl mx-auto w-full space-y-6">
          {/* Header Confirmation Card */}
          <div className="bg-[#ECEAEF] rounded-[24px] md:rounded-[32px] p-6 md:p-8 border border-[#ADACB5] shadow-card text-center space-y-4">
            <div className="w-16 h-16 bg-[#1E9540] rounded-full flex items-center justify-center mx-auto text-white shadow-sm mb-2">
              <CheckCircle className="w-8 h-8 stroke-[2.2px]" />
            </div>

            <div>
              <span className="text-[10px] font-black tracking-[0.25em] text-[#2D3142]/70 uppercase block mb-1">
                Order Received
              </span>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight uppercase mb-2 text-[#2D3142]">
                Order #{order.order_number}
              </h1>
              <p className="text-xs text-[#2D3142]/80 font-bold uppercase tracking-wider leading-relaxed">
                Your order has been received successfully.
              </p>
            </div>
          </div>

          {/* Compact Payment Required Card */}
          {isAwaitingPayment && !isCancelled && (
            <OrderClientActions />
          )}

          {/* ONE Unified Status Tracker */}
          <div className="bg-[#C7C5CF] rounded-[24px] md:rounded-[32px] p-6 md:p-8 border border-[#ADACB5] shadow-card">
            <h2 className="text-sm font-black tracking-[0.2em] uppercase text-[#2D3142] mb-6 border-b border-[#ADACB5] pb-3">
              Order Progress
            </h2>
            <div className="space-y-6">
              <TimelineStep label="ORDER PLACED" state="completed" />
              <TimelineStep label="PAYMENT VERIFICATION" state={isPaymentConfirmed || isProcessing || isShipped || isDelivered ? "completed" : isCancelled ? "cancelled" : "active"} />
              <TimelineStep label="ORDER CONFIRMED" state={isPaymentConfirmed || isProcessing || isShipped || isDelivered ? "completed" : "pending"} />
              <TimelineStep label="PROCESSING" state={isShipped || isDelivered ? "completed" : isProcessing ? "active" : "pending"} />
              <TimelineStep label="SHIPPED" state={isDelivered ? "completed" : isShipped ? "active" : "pending"} />
              <TimelineStep label="DELIVERED" state={isDelivered ? "completed" : "pending"} isLast />
            </div>
          </div>

          {isCancelled && (
            <div className="bg-red-50 border border-red-200 rounded-[24px] p-6 text-center shadow-sm">
              <h2 className="text-sm font-black tracking-widest uppercase text-red-600">
                Order Cancelled
              </h2>
              <p className="text-xs text-red-500 font-semibold uppercase tracking-wider mt-1">
                This order has been cancelled or expired.
              </p>
            </div>
          )}

          {/* Order Details Card */}
          <div className="bg-[#ECEAEF] rounded-[24px] md:rounded-[32px] p-6 md:p-8 border border-[#ADACB5] shadow-card space-y-5">
            <h3 className="text-sm font-black tracking-[0.2em] uppercase text-[#2D3142] pb-2 border-b border-[#ADACB5]">
              Order Details
            </h3>

            <div className="space-y-3 divide-y divide-[#ADACB5]/30">
              {items.map((item: any) => (
                <div key={item.id} className="flex justify-between text-xs pt-3 first:pt-0 font-bold">
                  <div>
                    <span className="tracking-wide text-[#2D3142] uppercase line-clamp-1">{item.product_name}</span>
                    <span className="text-[#2D3142]/70 font-semibold mt-0.5 block uppercase">
                      QTY: {item.quantity} | SIZE: {item.size}
                    </span>
                  </div>
                  <div className="text-[#2D3142] font-black shrink-0 ml-4">₹{item.subtotal}</div>
                </div>
              ))}
            </div>

            <div className="border-t border-[#ADACB5] pt-4 space-y-2.5 text-xs font-semibold uppercase tracking-wider">
              <div className="flex justify-between text-[#2D3142]/70">
                <span>Subtotal</span>
                <span className="font-bold text-[#2D3142]">₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between text-[#2D3142]/70">
                <span>Delivery</span>
                <span className="font-bold text-[#2D3142]">{order.delivery_charge === 0 ? "FREE" : `₹${order.delivery_charge}`}</span>
              </div>
              <div className="flex justify-between text-lg font-black tracking-tight pt-3 border-t border-[#ADACB5] text-[#2D3142]">
                <span>TOTAL</span>
                <span>₹{order.total}</span>
              </div>
            </div>
          </div>

          {/* Secondary WhatsApp Support Option */}
          <div className="flex justify-center mt-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#2D3142]/70 hover:text-[#2D3142] transition-colors"
            >
              <MessageCircle className="w-4 h-4" /> Need help? Message us on WhatsApp
            </a>
          </div>
          
          <div className="flex justify-center pt-8">
            <Link href="/shop" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2D3142] hover:opacity-70 transition-opacity border-b-2 border-[#2D3142] pb-1">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

function TimelineStep({ label, state, isLast = false }: { label: string; state: "completed" | "active" | "pending" | "cancelled"; isLast?: boolean }) {
  return (
    <div className="relative flex items-start gap-4">
      {!isLast && (
        <div className={`absolute top-6 left-3 bottom-[-24px] w-0.5 ${state === "completed" ? "bg-[#2D3142]" : "bg-[#ADACB5]/40"}`} />
      )}
      <div
        className={`relative z-10 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
          state === "completed" ? "bg-[#2D3142] border-[#2D3142] text-[#D8D5DB]" :
          state === "active" ? "bg-transparent border-[#2D3142] text-[#2D3142]" :
          state === "cancelled" ? "bg-red-500 border-red-500 text-white" :
          "bg-transparent border-[#ADACB5]/40"
        }`}
      >
        {state === "completed" && <CheckCircle className="w-3.5 h-3.5" />}
        {state === "active" && <div className="w-2 h-2 bg-[#2D3142] rounded-full" />}
      </div>
      <div className="flex-1 pb-1">
        <p
          className={`text-xs font-black tracking-widest uppercase ${
            state === "completed" || state === "active" ? "text-[#2D3142]" : 
            state === "cancelled" ? "text-red-500" :
            "text-[#2D3142]/50"
          }`}
        >
          {label}
        </p>
        {state === "active" && label === "PAYMENT VERIFICATION" && (
          <p className="text-[10px] text-[#2D3142]/70 font-semibold tracking-wider mt-1 uppercase">
            Awaiting payment confirmation
          </p>
        )}
      </div>
    </div>
  );
}
