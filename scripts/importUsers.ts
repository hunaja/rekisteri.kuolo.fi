import connectMongo from "../connectMongo";
import { parse } from "csv";
import { readFile } from "fs/promises";
import dotenv from "dotenv";
import User from "../models/User";

dotenv.config({
  path: __dirname + "/./../.env.local",
});

const importEntries = async () => {
  await connectMongo();
  await User.deleteMany({});

  parse(
    await readFile(__dirname + "/rekisteri.csv"),
    {
      delimiter: ";",
      encoding: "utf8",
    },
    async (err: unknown, records: string[][]) => {
      if (err) return console.log(err);

      for (const userRecord of records) {
        const [
          ,
          ,
          ,
          ,
          ,
          ,
          // First name
          // Last name
          // Email
          // Direct Marketing Allowed
          // Status
          // Valid from
          validUntil, // Valid until // Duration in days // Membership Was Created // Last Modified // Etunimi / Etunimet
          ,
          ,
          ,
          ,
          sukunimi, // Sukunimi
          kutsumanimi, // Kutsumanimi
          uefSahkis, // Sähköpostiosoite @student.uef.fi // Katuosoite // Postinumero // Postitoimipaikka // Syntymäaika
          ,
          ,
          ,
          ,
          puhelinnumero, // Puhelinnumero // Opintojen aloitusvuosi
          ,
          kurssiasema, // Kurssiasema // Vastuutehtävä // 5. Vakuutan opiskelevani Itä-Suomen yliopiston lääketieteen koulutusohjelmassa ja haluan liittyä KuoLO ry:n eli Kuopion lääketieteen opiskelijat ry:n jäseneksi. // 6. Hyväksyn tietojen tallentamisen, käsittelyn ja siirtämisen KuoLO ry:n jäsenrekisteriin sekä hyväksyn jäsenrekisterin tietosuojailmoituksen (löytyy alta)
          ,
          ,
          ,
          luovutettavatTiedot, // Sallin seuraavien tietojen luovuttamisenn...
        ] = userRecord;
        if (new Date(validUntil) < new Date()) continue;

        const osoiteluettelo = luovutettavatTiedot.includes("Nimi");
        const luovutaPuhnro = luovutettavatTiedot.includes("puhelinnumero");

        // Tämä ei halua tietojaan osoiteluetteloon
        if (!osoiteluettelo) continue;

        const name = kutsumanimi + " " + sukunimi;

        const user = new User({
          name,
          course: kurssiasema,
          email: uefSahkis,
        });
        if (luovutaPuhnro) user.phoneNumber = "+" + puhelinnumero;

        if (!(await User.exists({ email: uefSahkis }))) {
          await user.save();
        } else {
          console.log(`Ignoring duplicate user ${name} (${uefSahkis})`);
        }
      }

      console.log("Done");
    }
  );
};

importEntries();

export {};
