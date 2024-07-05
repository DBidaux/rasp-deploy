const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const Bill = require("../models/bill_schema");
const AccountFunds = require("../models/account_schema");
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get("/fetch", async (req, res) => {
	try {
		const bills = await Bill.find({ active: true });
		res.json(bills);
	} catch (error) {
		console.error("Error fetching bills:", error);
		res.status(500).send("Error fetching bills");
	}
});

router.post("/upload", upload.single("file"), async (req, res) => {
	const cleanText = (text) => {
		// quita caracteres no deseados y normaliza espacios en blanco
		return text.replace(/\s+/g, " ").trim();
	};
	console.log(req.file);
	if (!req.file) {
		return res.status(400).send("No file uploaded");
	}

	const file = req.file;

	try {
		const data = await pdfParse(file.buffer);
		const text = data.text;

		// texto puro
		console.log("Raw extracted Text:", text);

		// texto sin caracteres raros y espacios en blanco normalizados
		let textCleaned = cleanText(text);
		console.log("texto limpio: ", textCleaned);

		// Busqueda de coincidencias para guardar en cada campo
		const companyMatch = text.match(/(IBERDROLA|MONTEJURRA)/);
		const company = companyMatch ? companyMatch[0] : "MONTEJURRA";
		console.log("Company Match:", company);

		const keywordMatch = text.match(/(AGUA|ELECTRICIDAD)/i);
		console.log("Keyword Match:", keywordMatch);

		const paymentDateMatch =
			text.match(/Fecha de cargo:\s*(\d{2}\s*de\s*\w+\s*de\s*\d{4})/i) ||
			text.match(/Límite de pago sin demora\s*(\d{2}\.\d{2}\.\d{4})/i) ||
			text.match(/FECHA PREVISTA DE COBRO:\s*(\d{2}\/\d{2}\/\d{4})\n/) ||
			text.match(
				/(\d{2}\/\d{2}\/\d{4})(?=\s*\d{1,3}(?:\.\d{3})*,\d{2}\s*€)/
			);
		console.log("Payment Date Match:", paymentDateMatch);

		const amountMatch =
			text.match(/IMPORTE\s*FACTURA:\s*(\d+,\d+)/i) ||
			text.match(/TOTAL FACTURA\s*(\d+,\d{2})\s*€/) ||
			text.match(/TOTAL IMPORTE FACTURA\s*([\d,]+)\s*€/) ||
			text.match(
				/TOTAL FACTURA \/ FAKTURA GUZTIRA\s*(\d{1,3}(?:\.\d{3})*,\d{2})\s*€/
			);
		console.log("Amount Match:", amountMatch);

		const consumptionMatch =
			text.match(
				/consumo\s*en\s*el\s*periodo\s*facturado\s*ha\s*sido\s*(\d+,\d+)\s*kWh/i
			) ||
			text.match(/Consumo real:\s*(\d+)\s*m³/) ||
			text.match(/en los últimos 4 meses\.\n\s*(\d+)\s*kWh\n/) ||
			text.match(/(\d+\s*m3)/);
		console.log("Consumption Match:", consumptionMatch);

		const bill = new Bill({
			company: company,
			paymentDate: paymentDateMatch ? paymentDateMatch[1] : "",
			amount: amountMatch
				? parseFloat(amountMatch[1].replace(",", "."))
				: 0,
			consumption: consumptionMatch
				? parseFloat(consumptionMatch[1].replace(",", "."))
				: 0,
		});

		await bill.save();
		res.send("Factura guardada y procesada");
	} catch (error) {
		res.status(500).send("Error procesando la factura");
	}
});

// Patch para active:false mezcla de endpoints preguntar jesus
router.patch("/archive", async (req, res) => {
	const { id } = req.body;

	if (!id) {
		return res.status(400).send("ID de factura no proporcionado");
	}

	try {
		const bill = await Bill.findById(id);

		if (!bill) {
			return res.status(404).send("Factura no encontrada");
		}

		bill.active = false;
		await bill.save();

		const accountFunds = await AccountFunds.findOne().sort({
			createdAt: -1,
		});
		if (!accountFunds) {
			return res.status(404).json({ error: "Account funds not found" });
		}

		parseFloat((accountFunds.accountFunds -= bill.amount)).toFixed(2);
		await accountFunds.save();

		res.send("Factura archivada correctamente");
	} catch (error) {
		console.error("Error archivando la factura:", error);
		res.status(500).send("Error archivando la factura");
	}
});

module.exports = router;
