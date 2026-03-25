import { Request, Response } from 'express';
import { catchAsync } from '../../../sharedFunction/catchAsync';
import { envVars } from '../../../config/env';
import status from 'http-status';
import { stripe } from '../../../config/stripe.config';
import { PaymentService } from './payment.service';
import { sendResponse } from '../../../sharedFunction/sendResponse';

const handleStripeWebhookEvent = catchAsync(
  async (req: Request, res: Response) => {
    const signature = req.headers['stripe-signature'] as string;

    const webhookSecret = envVars.STRIPE.STRIPE_WEBHOOK_KEY;

    if (!signature || !webhookSecret) {
      console.error('Missing Stripe signature of webhook secret');
      return res.status(status.BAD_REQUEST).json({
        message: 'Missing Stripe signature or webhook secret',
      });
    }
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        webhookSecret,
      );
    } catch (error) {
      console.error('Error processing Stripe webhook:', error);
      return res
        .status(status.BAD_REQUEST)
        .json({ message: 'Error processing Stripe webhook' });
    }
    try {
      const result = await PaymentService.handleStripeWebhookEvent(event);

      sendResponse(res, {
        success: true,
        httpStatusCode: status.OK,
        message: 'Stripe webhook event processed successfully',
        data: result,
      });
    } catch (error) {
      console.log('Error handling stripe webhook event: ', error);
      sendResponse(res, {
        success: false,
        httpStatusCode: status.INTERNAL_SERVER_ERROR,
        message: 'Error handling Stripe webhook event',
      });
    }
  },
);

export const PaymentController = {
  handleStripeWebhookEvent,
};
