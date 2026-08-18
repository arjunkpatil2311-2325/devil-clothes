import { WHATSAPP_NUMBER } from "./config";
import { Product } from "./types";

export interface WhatsAppOrderItem {
  product: Product;
  size: string;
  quantity: number;
}

export function generateWhatsAppLink(items: WhatsAppOrderItem[], total: number): string {
  let message = "Hello Devil Clothes,\n\nI would like to place an order:\n\n";

  items.forEach((item) => {
    const price = item.product.salePrice || item.product.price;
    message += `Product: ${item.product.name}\n`;
    message += `Size: ${item.size}\n`;
    message += `Quantity: ${item.quantity}\n`;
    message += `Price: ₹${price.toLocaleString('en-IN')}\n\n`;
  });

  message += `Total: ₹${total.toLocaleString('en-IN')}\n\n`;
  message += "Please confirm availability and delivery details.";

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
}
