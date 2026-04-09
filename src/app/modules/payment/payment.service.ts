import Stripe from 'stripe';
import { prisma } from '../../lib/prisma.js';
import { PaymentStatus } from '../../../generated/prisma/enums.js';
import { v7 as uuidv7 } from 'uuid';
import { generatePaymentPdf } from './payment.utils.js';
import { sendEmail } from '../../utils/email.js';
import AppError from '../../errorHelpers/appError.js';
import status from 'http-status';
import { Prisma } from '@prisma/client/extension.js';

const handleStripeWebhookEvent = async (event: Stripe.Event) => {
  const existingPayment = await prisma.payment.findFirst({
    where: {
      stripe_event_id: event.id,
    },
  });
  if (existingPayment) {
    console.log(`Event ${event.id} already processed. Skipping`);
    return { message: `Event ${event.id} already processed. Skipping` };
  }
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;

      const learner_id = session.metadata?.learner_id;
      const course_id = session.metadata?.course_id;
      const amount = Number(session.metadata?.amount);

      if (!learner_id || !course_id) {
        throw new AppError(
          status.BAD_REQUEST,
          "'Missing metadata: learner_id or course_id'",
        );
      }

      const transaction_id = uuidv7();

      let pdfBuffer: Buffer | null = null;
      //let invoiceUrl: string | null = null;

      const result = await prisma.$transaction(
        async (tx: Prisma.TransactionClient) => {
          const enroll = await tx.enrollment.create({
            data: {
              learner_id: learner_id,
              course_id: course_id,
            },
            include: {
              learner: {
                select: {
                  name: true,
                  email: true,
                },
              },
              course: {
                select: {
                  title: true,
                },
              },
            },
          });
          const payment = await tx.payment.create({
            data: {
              enrollment_id: enroll.id,
              payment_Status:
                session.payment_status === 'paid'
                  ? PaymentStatus.PAID
                  : PaymentStatus.UNPAID,
              stripe_event_id: event.id,
              payment_gateway_data: session as any,
              transaction_id: transaction_id,
              amount: amount,
            },
          });
          return { payment, enroll };
        },
      );

      if (session.payment_status === 'paid') {
        try {
          pdfBuffer = await generatePaymentPdf({
            paymentId: result.payment.id,
            learnerName: result.enroll.learner.name,
            learnerEmail: result.enroll.learner.email,
            courseTitle: result.enroll.course.title,
            amount: amount,
            transactionId: transaction_id,
            paymentDate: new Date().toISOString(),
          });
          // const cloudinaryResponse = await uploadFileCloudinary(
          //   pdfBuffer,
          //   `learning_management/invoices/invoice-${result.payment.id}-${Date.now()}.pdf`,
          // );
          // invoiceUrl = cloudinaryResponse?.secure_url;

          console.log(`Invoice PDF generated for payment ${result.payment.id}`);
        } catch (error) {
          console.error('Error generating/uploading invoice PDF:', error);
        }
      }
      if (session.payment_status === 'paid' && pdfBuffer !== null) {
        try {
          await sendEmail({
            to: result.enroll.learner.email,
            subject: `Payment Confirmation & Invoice - Enroll in ${result.enroll.course.title}`,
            templateName: 'invoice',
            templateData: {
              paymentId: result.payment.id,
              learnerName: result.enroll.learner.name,
              learnerEmail: result.enroll.learner.email,
              courseTitle: result.enroll.course.title,
              amount: amount,
              transactionId: transaction_id,
              paymentDate: new Date().toISOString(),
            },
            attachment: [
              {
                filename: `Invoice-${result.payment.id}.pdf`,
                content: pdfBuffer || Buffer.from(''),
                contentType: 'application/pdf',
              },
            ],
          });
          console.log(
            `✅ Invoice email sent to ${result.enroll.learner.email}`,
          );
        } catch (error) {
          console.error('Error sending invoice email:', error);
        }
      }
      console.log(
        `Payment ${session.payment_status} for payment_id: ${result.payment.id}`,
      );
      break;
    }

    case 'checkout.session.expired': {
      const session = event.data.object;

      console.log(
        `Checkout session ${session.id} expired. Marking associated payment as failed.`,
      );
      break;
    }
    case 'payment_intent.payment_failed': {
      const session = event.data.object;

      console.log(
        `Payment intent ${session.id} failed. Marking associated payment as failed.`,
      );
      break;
    }
    default: {
      console.log(`Unhandled event type ${event.type}`);
    }
  }
  return { message: `Webhook event ${event.id} processed successfully` };
};

export const PaymentService = {
  handleStripeWebhookEvent,
};
