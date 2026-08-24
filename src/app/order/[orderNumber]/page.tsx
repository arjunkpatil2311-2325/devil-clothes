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
                Order Confirmed
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
              <TimelineStep 
                label="ORDER PLACED" 
                description="Your order has been received."
                state="completed" 
              />
              <TimelineStep 
                label="PAYMENT VERIFICATION" 
                description="Our team will verify your payment."
                state={isPaymentConfirmed || isProcessing || isShipped || isDelivered ? "completed" : isCancelled ? "cancelled" : "active"} 
              />
              <TimelineStep 
                label="ORDER CONFIRMED" 
                description="Your order is confirmed after payment verification."
                state={isPaymentConfirmed || isProcessing || isShipped || isDelivered ? "completed" : "pending"} 
              />
              <TimelineStep 
                label="PROCESSING" 
                description="Your pieces are being prepared."
                state={isShipped || isDelivered ? "completed" : isProcessing ? "active" : "pending"} 
              />
              <TimelineStep 
                label="SHIPPED" 
                description="Your order is on the way."
                state={isDelivered ? "completed" : isShipped ? "active" : "pending"} 
              />
              <TimelineStep 
                label="DELIVERED" 
                description="Your order has arrived."
                state={isDelivered ? "completed" : "pending"} 
                isLast 
              />
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
              Order Summary
            </h3>

            <div className="space-y-4">
              {items.map((item: any) => (
                <div key={item.id} className="flex justify-between items-start text-xs font-bold">
                  <div className="pr-4">
                    <span className="tracking-wide text-[#2D3142] uppercase">{item.product_name}</span>
                    <span className="text-[#2D3142]/70 font-semibold mt-0.5 block uppercase">
                      QTY: {item.quantity} | SIZE: {item.size}
                    </span>
                  </div>
                  <div className="text-[#2D3142] font-black shrink-0 flex items-end">
                    <div className="w-12 border-b-2 border-dotted border-[#ADACB5]/40 mb-1.5 mr-2 opacity-50 sm:block hidden"></div>
                    ₹{item.subtotal}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-[#ADACB5] pt-5 space-y-3 text-xs font-semibold uppercase tracking-wider">
              <div className="flex justify-between text-[#2D3142]/70 items-center">
                <span>Subtotal</span>
                <div className="flex-1 border-b-2 border-dotted border-[#ADACB5]/30 mx-3 opacity-50"></div>
                <span className="font-bold text-[#2D3142]">₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between text-[#2D3142]/70 items-center">
                <span>Delivery</span>
                <div className="flex-1 border-b-2 border-dotted border-[#ADACB5]/30 mx-3 opacity-50"></div>
                <span className="font-bold text-[#2D3142]">{order.delivery_charge === 0 ? "FREE" : `₹${order.delivery_charge}`}</span>
              </div>
              <div className="flex justify-between items-center text-lg font-black tracking-tight pt-4 border-t border-[#ADACB5] text-[#2D3142]">
                <span>TOTAL</span>
                <span>₹{order.total}</span>
              </div>
            </div>
          </div>

          {/* Simple Reassurance Section */}
          <div className="text-center px-4">
            <h4 className="text-[10px] font-black tracking-[0.2em] uppercase text-[#2D3142] mb-1">
              YOU'RE ALL SET.
            </h4>
            <p className="text-[10px] uppercase font-bold tracking-wider text-[#2D3142]/60 leading-relaxed max-w-sm mx-auto">
              Your order has been received successfully. We'll keep you updated as it moves through each stage.
            </p>
          </div>

          {/* NEED HELP? WhatsApp Section */}
          <div className="bg-[#D8D5DB] border-2 border-[#ADACB5]/30 rounded-[24px] p-6 text-center space-y-4 shadow-sm">
            <div>
              <h3 className="text-xs font-black tracking-[0.2em] uppercase text-[#2D3142] mb-1">
                NEED HELP?
              </h3>
              <p className="text-[10px] font-bold tracking-wider uppercase text-[#2D3142]/70">
                Have a question about your order? Message us on WhatsApp.
              </p>
            </div>
            
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-[#C7C5CF] text-[#2D3142] border border-[#ADACB5] py-3 px-5 rounded-full font-black tracking-[0.15em] uppercase text-[10px] hover:bg-[#ADACB5] transition-all"
            >
              <MessageCircle className="w-3.5 h-3.5 mr-2" /> MESSAGE US ON WHATSAPP &rarr;
            </a>
          </div>
          
          {/* Secondary Continue Shopping */}
          <div className="flex justify-center pt-2 pb-6">
            <Link href="/shop" className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2D3142]/60 hover:text-[#2D3142] transition-colors border-b-2 border-transparent hover:border-[#2D3142] pb-0.5">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

function TimelineStep({ 
  label, 
  description,
  state, 
  isLast = false 
}: { 
  label: string; 
  description: string;
  state: "completed" | "active" | "pending" | "cancelled"; 
  isLast?: boolean 
}) {
  return (
    <div className="relative flex items-start gap-4">
      {!isLast && (
        <div className={`absolute top-6 left-3 bottom-[-24px] w-0.5 ${state === "completed" ? "bg-[#2D3142]" : "bg-[#ADACB5]/40"}`} />
      )}
      <div
        className={`relative z-10 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
          state === "completed" ? "bg-[#2D3142] border-[#2D3142] text-[#D8D5DB]" :
          state === "active" ? "bg-[#D8D5DB] border-[#2D3142] text-[#2D3142]" :
          state === "cancelled" ? "bg-red-500 border-red-500 text-white" :
          "bg-transparent border-[#ADACB5]/40"
        }`}
      >
        {state === "completed" && <CheckCircle className="w-3.5 h-3.5" />}
        {state === "active" && <div className="w-2 h-2 bg-[#2D3142] rounded-full" />}
      </div>
      <div className="flex-1 pb-2">
        <p
          className={`text-xs font-black tracking-widest uppercase ${
            state === "completed" || state === "active" ? "text-[#2D3142]" : 
            state === "cancelled" ? "text-red-500" :
            "text-[#2D3142]/50"
          }`}
        >
          {label}
        </p>
        <p className={`text-[10px] font-bold tracking-wider mt-0.5 uppercase leading-relaxed ${
            state === "completed" || state === "active" ? "text-[#2D3142]/70" : 
            state === "cancelled" ? "text-red-400" :
            "text-[#2D3142]/40"
        }`}>
          {description}
        </p>
      </div>
    </div>
  );
}
