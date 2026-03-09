-- AddForeignKey
ALTER TABLE "outlet_products" ADD CONSTRAINT "outlet_products_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
