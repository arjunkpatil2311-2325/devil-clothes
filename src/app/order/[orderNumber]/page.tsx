import { supabaseAdmin } from "@/lib/supabase/server";
import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { CheckCircle, MessageCircle, ShoppingBag } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/config";

export const dynamic = "force-dynamic";

export default async function OrderTrackingPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  
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
        `• ${i.product_name} (${i.size}) × ${i.quantity} — ₹${i.subtotal}`
    )
    .join("\n");

  const whatsappMessage = `Hi DEVIL CLOTHES 👋\n\nI'd like to confirm my order.\n\nOrder: #${order.order_number}\n\nProducts:\n${itemsText}\n\nSubtotal: ₹${order.subtotal}\nDelivery: ₹${order.delivery_charge}\n\n*TOTAL: ₹${order.total}*\n\nPlease confirm my order details.\n\nThank you!`;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  const isCreated = true;
  const isAwaitingPayment = order.order_status === "awaiting_payment";
  const isPaymentConfirmed = order.payment_status === "fully_paid";
  const isProcessing = order.order_status === "processing";
  const isShipped = order.order_status === "shipped";
  const isDelivered = order.order_status === "delivered";
  const isCancelled = order.order_status === "cancelled";

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#D8D5DB] text-[#2D3142] pt-8 pb-16 px-3 md:px-6">
      <div className="max-w-xl mx-auto w-full space-y-6">
        {/* Header Confirmation Card */}
        <div className="bg-[#C7C5CF] rounded-[24px] md:rounded-[32px] p-6 md:p-8 border border-[#ADACB5] shadow-card text-center space-y-4">
          <div className="w-16 h-16 bg-[#2D3142] rounded-full flex items-center justify-center mx-auto text-[#D8D5DB] shadow-sm">
            <CheckCircle className="w-8 h-8 stroke-[2.2px]" />
          </div>

          <div>
            <span className="text-[10px] font-black tracking-[0.25em] text-[#2D3142]/70 uppercase block mb-1">
              Order Received
            </span>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight uppercase mb-1.5 text-[#2D3142]">
              Order #{order.order_number}
            </h1>
            <p className="text-xs text-[#2D3142]/80 font-semibold uppercase tracking-wider">
              Your piece reservation has been logged successfully.
            </p>
          </div>
        </div>

        {/* WhatsApp Confirmation Action Card */}
        {isAwaitingPayment && (
          <div className="bg-[#EBE9ED] rounded-[24px] md:rounded-[32px] p-6 md:p-8 border border-[#ADACB5] shadow-card space-y-4">
            <div className="flex items-center gap-2 text-[#2D3142]">
              <span className="w-2 h-2 rounded-full bg-[#2D3142] animate-pulse" />
              <h2 className="text-xs font-black tracking-[0.2em] uppercase">
                Finalize via WhatsApp
              </h2>
            </div>
            <p className="text-xs text-[#2D3142]/85 font-semibold leading-relaxed uppercase tracking-wider">
              Tap below to send your order summary to the DEVIL CLOTHES team on WhatsApp to confirm payment and delivery.
            </p>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#2D3142] text-[#D8D5DB] py-4 px-6 min-h-[50px] rounded-full font-black tracking-[0.2em] uppercase text-xs hover:bg-[#3D4258] active:scale-98 transition-all flex items-center justify-center shadow-soft"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Message us on WhatsApp
            </a>
          </div>
        )}

        {/* Visual Timeline */}
        <div className="bg-[#C7C5CF] rounded-[24px] md:rounded-[32px] p-6 md:p-8 border border-[#ADACB5] shadow-card">
          <h2 className="text-xs font-black tracking-[0.2em] uppercase text-[#2D3142] mb-6">
            Order Status
          </h2>
          <div className="space-y-5">
            <TimelineStep label="ORDER PLACED" state="completed" />
            <TimelineStep label="PAYMENT CONFIRMED" state={isPaymentConfirmed || isProcessing || isShipped || isDelivered ? "completed" : isCancelled ? "cancelled" : "pending"} />
            <TimelineStep label="PROCESSING" state={isProcessing || isShipped || isDelivered ? "completed" : isPaymentConfirmed ? "active" : "pending"} />
            <TimelineStep label="SHIPPED" state={isShipped || isDelivered ? "completed" : isProcessing ? "active" : "pending"} />
            <TimelineStep label="DELIVERED" state={isDelivered ? "completed" : isShipped ? "active" : "pending"} isLast />
          </div>
        </div>

        {isCancelled && (
          <div className="bg-[#2D3142]/10 border border-[#2D3142]/30 rounded-[20px] p-6 text-center">
            <h2 className="text-sm font-black tracking-widest uppercase text-[#2D3142]">
              Order Cancelled
            </h2>
            <p className="text-xs text-[#2D3142]/70 font-semibold uppercase tracking-wider mt-1">
              This order has been cancelled or expired.
            </p>
          </div>
        )}

        {/* Order Details Card */}
        <div className="bg-[#C7C5CF] rounded-[24px] md:rounded-[32px] p-6 md:p-8 border border-[#ADACB5] shadow-card space-y-5">
          <h3 className="text-sm font-black tracking-[0.2em] uppercase text-[#2D3142] pb-2 border-b border-[#ADACB5]">
            Order Summary
          </h3>

          <div className="space-y-3 divide-y divide-[#ADACB5]/30">
            {items.map((item: any) => (
              <div key={item.id} className="flex justify-between text-xs pt-2.5 first:pt-0 font-bold">
                <div>
                  <span className="tracking-wide text-[#2D3142] uppercase">{item.product_name}</span>
                  <span className="text-[#2D3142]/70 ml-2 font-semibold">
                    × {item.quantity} ({item.size})
                  </span>
                </div>
                <div className="text-[#2D3142] font-black">₹{item.subtotal}</div>
              </div>
            ))}
          </div>

          <div className="border-t border-[#ADACB5] pt-4 space-y-2 text-xs font-semibold uppercase tracking-wider">
            <div className="flex justify-between text-[#2D3142]/70">
              <span>Subtotal</span>
              <span className="font-bold text-[#2D3142]">₹{order.subtotal}</span>
            </div>
            <div className="flex justify-between text-[#2D3142]/70">
              <span>Delivery</span>
              <span className="font-bold text-[#2D3142]">₹{order.delivery_charge}</span>
            </div>
            <div className="flex justify-between text-base font-black tracking-tight pt-3 border-t border-[#ADACB5] text-[#2D3142]">
              <span>TOTAL</span>
              <span>₹{order.total}</span>
            </div>
          </div>
        </div>

        {/* Timeline Card */}
        <div className="bg-[#C7C5CF] rounded-[24px] md:rounded-[32px] p-6 md:p-8 border border-[#ADACB5] shadow-card space-y-5">
          <h3 className="text-sm font-black tracking-[0.2em] uppercase text-[#2D3142] pb-2 border-b border-[#ADACB5]">
            Status Timeline
          </h3>

          <div className="pl-2 space-y-5 relative">
            <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-[#ADACB5] z-0"></div>

            {[
              { label: "Order Created", active: isCreated },
              { label: "Awaiting Confirmation", active: isAwaitingPayment },
              { label: "Order Confirmed", active: isPaymentConfirmed },
              { label: "Processing", active: isProcessing || isShipped || isDelivered },
              { label: "Packed", active: isShipped || isDelivered },
              { label: "Shipped", active: isShipped || isDelivered },
              { label: "Delivered", active: isDelivered },
            ].map((step, idx) => (
              <div
                key={idx}
                className={`relative z-10 flex items-center gap-4 ${
                  step.active ? "opacity-100" : "opacity-40"
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full border-2 border-[#C7C5CF] ${
                    step.active ? "bg-[#2D3142]" : "bg-[#ADACB5]"
                  } shrink-0`}
                />
                <div className="text-xs font-black tracking-wider uppercase text-[#2D3142]">
                  {step.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Return Button */}
        <div className="pt-2">
          <Link
            href="/shop"
            className="w-full bg-[#D8D5DB] border border-[#ADACB5] text-[#2D3142] py-4 min-h-[50px] rounded-full font-black tracking-[0.2em] uppercase text-xs hover:bg-white active:scale-98 transition-all flex items-center justify-center shadow-card"
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

function TimelineStep({ label, state, isLast = false }: { label: string; state: "completed" | "active" | "pending" | "cancelled"; isLast?: boolean }) {
  return (
    <div className="relative flex items-center gap-4">
      {!isLast && (
        <div className={`absolute top-6 left-3 bottom-[-20px] w-0.5 ${state === "completed" ? "bg-[#2D3142]" : "bg-[#ADACB5]/40"}`} />
      )}
      <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 ${
        state === "completed" ? "bg-[#2D3142] border-[#2D3142] text-[#D8D5DB]" :
        state === "active" ? "bg-white border-[#2D3142]" :
        state === "cancelled" ? "bg-red-500 border-red-500 text-white" :
        "bg-[#C7C5CF] border-[#ADACB5] text-transparent"
      }`}>
        {state === "completed" && <CheckCircle className="w-3.5 h-3.5" />}
        {state === "active" && <div className="w-2 h-2 rounded-full bg-[#2D3142]" />}
        {state === "cancelled" && <div className="w-2 h-2 rounded-full bg-white" />}
      </div>
      <span className={`text-xs font-black tracking-widest uppercase ${
        state === "completed" || state === "active" ? "text-[#2D3142]" : 
        state === "cancelled" ? "text-red-500" :
        "text-[#2D3142]/40"
      }`}>
        {label}
      </span>
    </div>
  );
}
