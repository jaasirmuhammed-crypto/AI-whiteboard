import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

/**
 * Razorpay Webhook Handler
 * Endpoint: POST /api/razorpay/webhook
 * 
 * Configured in Razorpay Dashboard > Settings > Webhooks
 * Webhook URL: https://<your-domain>/api/razorpay/webhook
 * Active Events: payment.captured, payment.failed
 */

// In-memory processed payment ID set for idempotency check in serverless runtime
const processedPaymentIds = new Set<string>();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const signature = req.headers['x-razorpay-signature'] as string;

  // 1. Signature Verification
  if (webhookSecret && signature) {
    try {
      const rawBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(rawBody)
        .digest('hex');

      if (expectedSignature !== signature) {
        console.error('[Razorpay Webhook] Invalid signature mismatch.');
        return res.status(400).json({ error: 'Invalid webhook signature' });
      }
    } catch (sigErr) {
      console.error('[Razorpay Webhook] Signature verification error:', sigErr);
      return res.status(400).json({ error: 'Signature verification failed' });
    }
  } else if (process.env.NODE_ENV === 'production' && !webhookSecret) {
    console.warn('[Razorpay Webhook] Warning: RAZORPAY_WEBHOOK_SECRET is not configured in production environment.');
  }

  const eventPayload = req.body;
  const event = eventPayload?.event;
  const paymentEntity = eventPayload?.payload?.payment?.entity;

  if (!paymentEntity) {
    return res.status(400).json({ error: 'Missing payment entity in payload' });
  }

  const paymentId = paymentEntity.id;
  const amount = paymentEntity.amount;
  const currency = paymentEntity.currency;
  const status = paymentEntity.status;
  const notes = paymentEntity.notes || {};
  const userId = notes.userId || notes.user_id;
  const userEmail = notes.userEmail || notes.email || paymentEntity.email;
  const userName = notes.userName || paymentEntity.notes?.name;

  console.log(`[Razorpay Webhook] Received event: ${event} for payment ${paymentId}, user: ${userId || userEmail}`);

  // 2. Idempotency Check
  if (processedPaymentIds.has(paymentId)) {
    console.log(`[Razorpay Webhook] Payment ${paymentId} already processed. Skipping duplicate execution.`);
    return res.status(200).json({ status: 'ignored_duplicate', paymentId });
  }

  // 3. Process Captured Payment
  if (event === 'payment.captured' || status === 'captured') {
    processedPaymentIds.add(paymentId);

    console.log(`[Razorpay Webhook] Payment ${paymentId} CAPTURED successfully. Activating Premium for ${userId || userEmail}`);

    // In a persistent DB like Supabase/PostgreSQL, update the user row:
    // await db.users.update({ where: { id: userId }, data: { plan: 'premium', tokensRemaining: 999999, subscriptionStatus: 'active' } });
    // await db.payments.create({ data: { paymentId, userId, amount, currency, status: 'captured', paidAt: new Date() } });

    return res.status(200).json({
      status: 'success',
      message: 'Payment captured and Premium activated.',
      paymentId,
      userId,
      userEmail,
      plan: 'premium',
    });
  }

  if (event === 'payment.failed' || status === 'failed') {
    console.log(`[Razorpay Webhook] Payment ${paymentId} FAILED. Keeping user on Free tier.`);
    return res.status(200).json({ status: 'payment_failed_recorded', paymentId });
  }

  return res.status(200).json({ status: 'event_acknowledged', event });
}
