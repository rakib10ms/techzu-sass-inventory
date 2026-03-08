-- CreateTable
CREATE TABLE "product_imgs" (
    "id" SERIAL NOT NULL,
    "image_url" TEXT NOT NULL,
    "product_id" INTEGER NOT NULL,

    CONSTRAINT "product_imgs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "product_imgs" ADD CONSTRAINT "product_imgs_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
