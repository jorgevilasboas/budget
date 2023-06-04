/*
  Warnings:

  - Added the required column `filename` to the `Transactions` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Transactions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "amount" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "account" TEXT NOT NULL,
    "filename" TEXT NOT NULL
);
INSERT INTO "new_Transactions" ("account", "amount", "category", "date", "id", "reference", "title") SELECT "account", "amount", "category", "date", "id", "reference", "title" FROM "Transactions";
DROP TABLE "Transactions";
ALTER TABLE "new_Transactions" RENAME TO "Transactions";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
