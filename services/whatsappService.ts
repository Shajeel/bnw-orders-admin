import axios from 'axios';

export interface WhatsAppAction {
  action: 'set_field_value' | 'send_flow';
  field_name?: string;
  value?: string | number;
  flow_id?: number;
}

export interface SendWhatsAppDto {
  phone: string;
  email: string;
  first_name: string;
  last_name: string;
  actions: WhatsAppAction[];
}

export interface SendOrderConfirmationDto {
  phone: string;
  customerName: string;
  orderNumber: string;
  orderPrice: number;
  flowId: number;
}

export const whatsappService = {
  sendOrderConfirmation: async (data: SendOrderConfirmationDto): Promise<void> => {
    const requestBody: SendWhatsAppDto = {
      phone: data.phone,
      email: '',
      first_name: data.customerName,
      last_name: '',
      actions: [
        {
          action: 'set_field_value',
          field_name: 'order_number',
          value: data.orderNumber,
        },
        {
          action: 'set_field_value',
          field_name: 'order_price',
          value: data.orderPrice,
        },
        {
          action: 'send_flow',
          flow_id: data.flowId,
        },
      ],
    };

    await axios.post('https://app.thewhatbot.com/api/contacts', requestBody);
  },

  sendBulkOrderConfirmations: async (
    orders: Array<{
      phone: string;
      customerName: string;
      orderNumber: string;
      orderPrice: number;
    }>,
    flowId: number
  ): Promise<{ success: number; failed: number; errors: Array<{ orderNumber: string; error: string }> }> => {
    let success = 0;
    let failed = 0;
    const errors: Array<{ orderNumber: string; error: string }> = [];

    for (const order of orders) {
      try {
        await whatsappService.sendOrderConfirmation({
          ...order,
          flowId,
        });
        success++;
      } catch (error: any) {
        failed++;
        errors.push({
          orderNumber: order.orderNumber,
          error: error.message || 'Unknown error',
        });
      }
    }

    return { success, failed, errors };
  },
};
