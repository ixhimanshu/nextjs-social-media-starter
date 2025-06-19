# ---- Build stage ----
    FROM node:20-alpine AS builder

    WORKDIR /app
    
    COPY package*.json ./
    
    RUN npm install
    
    COPY . .
    
    # Pass build-time env for Next.js static optimization
    ARG MONGODB_URI
    ENV MONGODB_URI=$MONGODB_URI
    
    RUN npm run build
    
    # ---- Production stage ----
    FROM node:20-alpine AS runner
    
    WORKDIR /app
    
    COPY --from=builder /app/public ./public
    COPY --from=builder /app/.next ./.next
    COPY --from=builder /app/package.json ./package.json
    
    RUN npm install --omit=dev
    
    EXPOSE 3000
    
    CMD ["npm", "start"]
    