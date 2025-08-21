import fs from "fs";
import csvParser from "csv-parser";
import xlsx from "xlsx";

export const parseFile = async (filePath) => {
  const ext = filePath.split(".").pop().toLowerCase();
  let data = [];

  if (ext === "csv") {
    data = await new Promise((resolve, reject) => {
      const results = [];
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on("data", (row) => results.push(row))
        .on("end", () => resolve(results))
        .on("error", reject);
    });
  } else if (ext === "xlsx" || ext === "xls") {
    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    data = xlsx.utils.sheet_to_json(sheet);
  } else {
    throw new Error("Invalid file type");
  }

  return data;
};
