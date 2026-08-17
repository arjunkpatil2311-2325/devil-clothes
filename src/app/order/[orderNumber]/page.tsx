import { supabaseAdmin } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle, MessageCircle, Package, ShoppingBag } from "lucide-react";
import { WHATSAPP_NUMBER } from "@/lib/config";

// Force dynamic rendering since we are fetching specific order data
export const dynamic = 'force-dynamic';

export default async function OrderTrackingPage({ params }: { params: { orderNumber: string } }) {
  const { orderNumber } = params;

  // Fetch the order
  const { data: order, error } = await supabaseAdmin
    .from('orders')
    .select('*')
    .eq('order_number', orderNumber)
    .single();

  if (error || !order) {
    notFound();
  }

  // Fetch the items
  const { data: orderItems, error: itemsError } = await supabaseAdmin
    .from('order_items')
    .select('*')
    .eq('order_id', order.id);

  const items = orderItems || [];

  // Generate dynamic WhatsApp Message
  const itemsText = items.map((i: any) => `• ${i.product_name} (${i.size}) × ${i.quantity} — ₹${i.subtotal}`).join('\n');
  
  const whatsappMessage = `Hi ThreeKnots 👋\n\nI'd like to place a prepaid pre-order.\n\nOrder: #${order.order_number}\n\nProducts:\n${itemsText}\n\nSubtotal: ₹${order.subtotal}\nDelivery: ₹${order.delivery_charge}\n\n*TOTAL: ₹${order.total}*\n\nPlease confirm my order and send me the payment details.\n\nThank you! ❤️`;
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

  // Determine current active timeline state
  const isCreated = true;
  const isAwaitingPayment = order.order_status === 'awaiting_payment';
  const isPaymentConfirmed = order.payment_status === 'fully_paid';
  const isProcessing = order.order_status === 'processing';
  const isShipped = order.order_status === 'shipped';
  const isDelivered = order.order_status === 'delivered';
  const isCancelled = order.order_status === 'cancelled';

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#050505] text-white pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto w-full space-y-12">
        
        {/* Header Section */}
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase mb-2">
              Order Created 🎉
            </h1>
            <p className="text-gray-400 font-medium tracking-wide">
              Your pre-order <span className="text-white font-bold">#{order.order_number}</span> has been created.
            </p>
          </div>
        </div>

        {/* Warning / Call to Action */}
        {isAwaitingPayment && (
          <div className="bg-[#111] border border-white/20 p-6 md:p-8 space-y-6">
            <h2 className="text-xl font-black tracking-widest uppercase text-yellow-400 flex items-center gap-2">
              ⚠️ IMPORTANT
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              Your order is not confirmed yet. Please send the WhatsApp message and complete payment using the payment details sent by ThreeKnots.
            </p>
            <p className="text-sm text-gray-300 leading-relaxed">
              Once payment is received and verified, your pre-order will be confirmed.
            </p>
            
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] text-black py-4 px-6 font-black tracking-widest uppercase text-xs hover:bg-[#20b858] transition-colors flex items-center justify-center"
            >
              <MessageCircle className="w-5 h-5 mr-3" />
              Complete Payment on WhatsApp
            </a>
          </div>
        )}

        {isCancelled && (
           <div className="bg-red-500/10 border border-red-500/20 p-6 md:p-8">
             <h2 className="text-xl font-black tracking-widest uppercase text-red-500">
               Order Cancelled
             </h2>
             <p className="text-sm text-gray-400 mt-2">This order has been cancelled or expired.</p>
           </div>
        )}

        {/* Order Details */}
        <div className="space-y-6">
          <h3 className="text-lg font-black tracking-widest uppercase border-b border-white/10 pb-4">Order Details</h3>
          
          <div className="bg-[#111] border border-white/5 p-6 space-y-6">
            
            {/* Items */}
            <div className="space-y-4">
              {items.map((item: any) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <div>
                    <span className="font-bold tracking-wider">{item.product_name}</span>
                    <span className="text-gray-500 ml-2">× {item.quantity} ({item.size})</span>
                  </div>
                  <div className="font-medium">₹{item.subtotal}</div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t border-white/10 pt-4 space-y-2 text-sm text-gray-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>₹{order.delivery_charge}</span>
              </div>
              <div className="flex justify-between text-white text-lg font-black tracking-widest pt-4">
                <span>TOTAL</span>
                <span>₹{order.total}</span>
              </div>
            </div>

            {/* Statuses */}
            <div className="border-t border-white/10 pt-6 grid grid-cols-2 gap-4">
              <div>
                <div className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-1">Payment Status</div>
                <div className={`text-xs font-black tracking-widest uppercase ${isPaymentConfirmed ? 'text-green-500' : 'text-yellow-500'}`}>
                  {order.payment_status === 'pending' ? 'Awaiting Payment' : order.payment_status}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-gray-500 font-bold tracking-widest uppercase mb-1">Order Status</div>
                <div className={`text-xs font-black tracking-widest uppercase ${isCancelled ? 'text-red-500' : 'text-white'}`}>
                  {order.order_status.replace('_', ' ')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Timeline */}
        <div className="space-y-6">
          <h3 className="text-lg font-black tracking-widest uppercase border-b border-white/10 pb-4">Timeline</h3>
          
          <div className="bg-[#111] border border-white/5 p-6 pl-8 space-y-8 relative">
            <div className="absolute left-10 top-10 bottom-10 w-px bg-white/10 z-0"></div>
            
            {[
              { label: 'Order Created', active: isCreated, color: 'text-yellow-500', dot: 'bg-yellow-500' },
              { label: 'Awaiting Payment', active: isAwaitingPayment, color: 'text-yellow-500', dot: 'bg-yellow-500' },
              { label: 'Payment Confirmed', active: isPaymentConfirmed, color: 'text-green-500', dot: 'bg-green-500' },
              { label: 'Processing', active: isProcessing || isShipped || isDelivered, color: 'text-white', dot: 'bg-white' },
              { label: 'Packed', active: isShipped || isDelivered, color: 'text-white', dot: 'bg-white' },
              { label: 'Shipped', active: isShipped || isDelivered, color: 'text-white', dot: 'bg-white' },
              { label: 'Delivered', active: isDelivered, color: 'text-white', dot: 'bg-white' },
            ].map((step, idx) => (
              <div key={idx} className={`relative z-10 flex items-center gap-6 ${step.active ? 'opacity-100' : 'opacity-30'}`}>
                <div className={`w-4 h-4 rounded-full border-4 border-[#111] ${step.active ? step.dot : 'bg-gray-600'}`}></div>
                <div className={`text-xs font-black tracking-widest uppercase ${step.active ? step.color : 'text-gray-500'}`}>
                  {step.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/shop"
            className="flex-1 bg-white text-black py-4 px-6 font-black tracking-widest uppercase text-xs hover:bg-gray-200 transition-colors flex items-center justify-center"
          >
            <ShoppingBag className="w-4 h-4 mr-2" />
            Continue Shopping
          </Link>
        </div>

      </div>
    </div>
  );
}
