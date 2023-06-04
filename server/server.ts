const express = require("express");
const multer = require("multer");
const fs = require("fs");
const cors = require("cors");
const csv = require("csv-parser");
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();

const uploader = multer({
  storage: multer.memoryStorage(),
});

app.use(cors());

const port = 3001;

function getFirstLine(filePath: any) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    const firstLine = data.split('\n')[0];
    return firstLine;
  } catch (err) {
    throw err;
  }
}

app.get("/all", async (req: any, res: any) => {
  console.log("a")
  const transactions = await prisma.transactions.findMany();
  res.status(200).send(transactions);
});

app.post("/upload", uploader.single("file"), async (req: { file: any; body: { reference: any; account: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; send: { (arg0: string): void; new(): any; }; }; }) => {
  const file = req.file;
  const reference = req.body.reference;
  let account = req.body.account;

  await fs.writeFileSync(file.originalname, file.buffer);

  try {
    const firstLine = getFirstLine(file.originalname);
    console.log('First line:', firstLine);
  } catch (err) {
    console.error(err);
  }
  

  fs.createReadStream(file.originalname)
    .pipe(csv())
    .on("data", async (row: any) => {

      try {
        await prisma.transactions.create({
          data: {
            date: row.date,
            category: row.category,
            title: row.title,
            amount: row.amount,
            reference: reference,
            account: account,
            filename: file.originalname,
            // Add more columns and values as needed
          },
        });
      } catch (e) {
        console.log(e);
      }
    })
    .on("end", () => {
      fs.unlink(file.originalname, (err: any) => {
        if (err) {
          console.error(`Error deleting file: ${err}`);
          return;
        }

        console.log("File deleted successfully");
      });
      // CSV file has been processed
      res.status(200).send("ok");
    });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});

// const selectAll = () => {
//   db.all(`SELECT * FROM transactions`, [], (err, rows) => {
//     if (err) {
//       throw err;
//     }
//     rows.forEach((row) => {
//       console.log(row.date, row.category, row.title, row.amount);
//     });
//   });
// };

// const db = new sqlite3.Database("mydb.sqlite");

// const importMonth01 = () => {
//   db.run(
//     `CREATE TABLE IF NOT EXISTS transactions (date TEXT, category TEXT, title TEXT, amount TEXT, reference TEXT, account TEXT )`
//   );

//   fs.createReadStream("nubank-2023-01.csv")
//     .pipe(csv())
//     .on("data", (data) => {
//       // Insert the data into the database
//       db.run(
//         `INSERT INTO transactions (date, category, title, amount, reference, account) VALUES (?, ?, ?, ?, ?, ?)`,
//         [data.date, data.category, data.title, data.amount, "2023-01", "Nubank"]
//       );
//     })
//     .on("end", () => {
//       console.log("CSV file successfully processed");
//     });
// };

// const importMonth02 = () => {
//   db.run(
//     `CREATE TABLE IF NOT EXISTS transactions (date TEXT, category TEXT, title TEXT, amount TEXT, reference TEXT, account TEXT )`
//   );

//   fs.createReadStream("nubank-2023-02.csv")
//     .pipe(csv())
//     .on("data", (data) => {
//       // Insert the data into the database
//       db.run(
//         `INSERT INTO transactions (date, category, title, amount, reference, account) VALUES (?, ?, ?, ?, ?, ?)`,
//         [data.date, data.category, data.title, data.amount, "2023-02", "Nubank"]
//       );
//     })
//     .on("end", () => {
//       console.log("CSV file successfully processed");
//     });
// };

// const importMonth03 = () => {
//   db.run(
//     `CREATE TABLE IF NOT EXISTS transactions (date TEXT, category TEXT, title TEXT, amount TEXT, reference TEXT, account TEXT )`
//   );

//   fs.createReadStream("nubank-2023-03.csv")
//     .pipe(csv())
//     .on("data", (data) => {
//       // Insert the data into the database
//       db.run(
//         `INSERT INTO transactions (date, category, title, amount, reference, account) VALUES (?, ?, ?, ?, ?, ?)`,
//         [data.date, data.category, data.title, data.amount, "2023-03", "Nubank"]
//       );
//     })
//     .on("end", () => {
//       console.log("CSV file successfully processed");
//     });
// };

// const importMonth04 = () => {
//   db.run(
//     `CREATE TABLE IF NOT EXISTS transactions (date TEXT, category TEXT, title TEXT, amount TEXT, reference TEXT, account TEXT )`
//   );

//   fs.createReadStream("nubank-2023-04.csv")
//     .pipe(csv())
//     .on("data", (data) => {
//       // Insert the data into the database
//       db.run(
//         `INSERT INTO transactions (date, category, title, amount, reference, account) VALUES (?, ?, ?, ?, ?, ?)`,
//         [data.date, data.category, data.title, data.amount, "2023-04", "Nubank"]
//       );
//     })
//     .on("end", () => {
//       console.log("CSV file successfully processed");
//     });
// };

// const importMonth05 = () => {
//   db.run(
//     `CREATE TABLE IF NOT EXISTS transactions (date TEXT, category TEXT, title TEXT, amount TEXT, reference TEXT, account TEXT )`
//   );

//   fs.createReadStream("nubank-2023-05.csv")
//     .pipe(csv())
//     .on("data", (data) => {
//       // Insert the data into the database
//       db.run(
//         `INSERT INTO transactions (date, category, title, amount, reference, account) VALUES (?, ?, ?, ?, ?, ?)`,
//         [data.date, data.category, data.title, data.amount, "2023-05", "Nubank"]
//       );
//     })
//     .on("end", () => {
//       console.log("CSV file successfully processed");
//     });
// };

// const importMonthNu = () => {
//   const db = new sqlite3.Database("mydb.sqlite");
//   db.run(
//     `CREATE TABLE IF NOT EXISTS transactions (date TEXT, category TEXT, title TEXT, amount TEXT, reference TEXT, account TEXT )`
//   );

//   fs.createReadStream("nuconta-2023.csv")
//     .pipe(csv())
//     .on("data", (data) => {
//       // Insert the data into the database
//       db.run(
//         `INSERT INTO transactions (date, category, title, amount, reference, account) VALUES (?, ?, ?, ?, ?, ?)`,
//         [
//           data.date,
//           data.category,
//           data.title,
//           data.amount,
//           data.reference,
//           data.account,
//         ],
//         function (err) {
//           if (err) {
//             console.log("Error:", err);
//           } else {
//             console.log("Row inserted successfully");
//           }
//         }
//       );
//     })
//     .on("end", () => {
//       console.log("CSV file successfully processed");
//       db.close();
//     });
// };

// importMonth01();
// importMonth02();
// importMonth03();
// importMonth04();
// importMonth05();
