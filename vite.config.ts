import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Local Dev API Middleware plugin for Razorpay Webhooks and Verification
function localApiServerPlugin(): Plugin {
  return {
    name: 'local-api-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.startsWith('/api/razorpay/verify') && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => { body += chunk; });
          req.on('end', () => {
            try {
              const data = JSON.parse(body || '{}');
              const paymentId = data.paymentId || 'pay_' + Date.now();
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({
                success: true,
                message: 'Payment verified! Your Premium plan is now active.',
                paymentId,
                amount: 120,
                currency: 'INR',
                plan: 'premium',
                userId: data.userId,
                userEmail: data.userEmail,
              }));
            } catch (e) {
              res.statusCode = 400;
              res.end(JSON.stringify({ success: false, error: 'Invalid JSON payload' }));
            }
          });
          return;
        }

        if (req.url?.startsWith('/api/razorpay/webhook') && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => { body += chunk; });
          req.on('end', () => {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              status: 'success',
              message: 'Webhook received and processed.',
              plan: 'premium',
            }));
          });
          return;
        }

        if (req.url?.startsWith('/api/admin/payments') && req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({
            success: true,
            stats: {
              totalPremiumUsers: 24,
              totalFreeUsers: 142,
              totalSuccessfulPayments: 24,
              totalFailedPayments: 2,
              totalRevenue: 23976,
              currency: 'INR',
            },
          }));
          return;
        }

        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  base: './', // Use relative paths to prevent 404 errors on GitHub Pages, Netlify, Vercel, and local previews
  plugins: [
    react(),
    tailwindcss(),
    localApiServerPlugin(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            if (id.includes('pptxgenjs') || id.includes('jspdf') || id.includes('html2canvas') || id.includes('dompurify')) {
              return 'vendor-export';
            }
            if (id.includes('firebase')) {
              return 'vendor-firebase';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
          }
        },
      },
    },
    chunkSizeWarningLimit: 1500,
  },
})
