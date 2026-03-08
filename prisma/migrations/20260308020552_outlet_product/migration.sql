-- CreateTable
CREATE TABLE "outlet_products" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "outlet_id" INTEGER NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "stock_quantity" INTEGER NOT NULL DEFAULT 0,
    "min_stock_level" INTEGER NOT NULL DEFAULT 0,
    "created_by" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "outlet_products_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "outlet_products_outlet_id_product_id_key" ON "outlet_products"("outlet_id", "product_id");

-- AddForeignKey
ALTER TABLE "outlet_products" ADD CONSTRAINT "outlet_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "outlet_products" ADD CONSTRAINT "outlet_products_outlet_id_fkey" FOREIGN KEY ("outlet_id") REFERENCES "outlets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
