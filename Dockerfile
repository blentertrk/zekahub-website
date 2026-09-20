# ZekaHub WhatsApp beyni — Hetzner'de Evolution API ile ayni Docker aginda calisir.
# Vercel'deki pazarlama sitesi bu imaji kullanmaz; ayni depodan deploy edilir
# ama orada WHATSAPP_AKTIF tanimli olmadigi icin panel/webhook kapalidir.

FROM node:22-alpine AS bagimliliklar
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS derleyici
WORKDIR /app
COPY --from=bagimliliklar /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:22-alpine AS calistirici
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Kok olmayan kullanici
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

COPY --from=derleyici /app/public ./public
COPY --from=derleyici --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=derleyici --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
