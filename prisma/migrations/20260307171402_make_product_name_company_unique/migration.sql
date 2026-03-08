/*
  Warnings:

  - A unique constraint covering the columns `[name,company_id]` on the table `products` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "products_name_company_id_key" ON "products"("name", "company_id");
