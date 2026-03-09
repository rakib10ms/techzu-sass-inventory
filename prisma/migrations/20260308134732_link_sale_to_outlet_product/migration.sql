/*
  Warnings:

  - You are about to drop the column `product_id` on the `sales_items` table. All the data in the column will be lost.
  - Added the required column `outlet_product_id` to the `sales_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `sales_items` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "sales_items" DROP CONSTRAINT "sales_items_product_id_fkey";

-- AlterTable
ALTER TABLE "sales_items" DROP COLUMN "product_id",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "outlet_product_id" INTEGER NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "sales_items" ADD CONSTRAINT "sales_items_outlet_product_id_fkey" FOREIGN KEY ("outlet_product_id") REFERENCES "outlet_products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
