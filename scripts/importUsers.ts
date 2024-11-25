import connectMongo from "../connectMongo";
import { parse } from "csv";
import { readFile } from "fs/promises";
import dotenv from "dotenv";
import User from "../models/User";

dotenv.config({
  path: __dirname + "/./../.env.local",
});

const parseFile = async (path: string) => {
  return new Promise<string[][]>((resolve, reject) => {
    readFile(path)
      .then((data) => {
        parse(
          data,
          {
            delimiter: ";",
            encoding: "utf8",
          },
          (err: unknown, records: string[][]) => {
            if (err) reject(err);
            else resolve(records);
          }
        );
      })
      .catch(reject);
  });
};

const importEntries = async () => {
  await connectMongo();
  await User.deleteMany({});

  const records = await parseFile(__dirname + "/./../registry.csv");

  for (const userRecord of records) {
    const [
      ,
      ,
      ,
      ,
      ,
      ,
      validUntil,
      ,
      ,
      ,
      ,
      lastName,
      callName,
      email,
      ,
      ,
      ,
      ,
      phoneNumber,
      ,
      course,
      ,
      ,
      ,
      disclosedInfo,
    ] = userRecord;
    if (new Date(validUntil) < new Date()) continue;

    const visible = disclosedInfo.includes("Nimi");
    const phoneNumberVisible = disclosedInfo.includes("puhelinnumero");
    const name = `${callName} ${lastName}`;

    const user = new User({
      name,
      course,
      email,
      visible,
    });
    if (phoneNumberVisible) user.phoneNumber = `+${phoneNumber}`;

    const userExists = await User.exists({ email });
    if (!userExists) {
      await user.save();
    } else {
      console.log(`Ignoring duplicate user ${name} (${email})`);
    }
  }

  console.log("Done");
};

importEntries();
