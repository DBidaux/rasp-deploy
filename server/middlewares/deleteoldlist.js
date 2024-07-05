const cron = require("node-cron");
const ShoppingList = require("../models/list_schema");

// Configurar el cron job para que se ejecute diariamente a la medianoche
cron.schedule("0 0 * * *", async () => {
	const sixMonthAgo = new Date();
	sixMonthAgo.setMonth(sixMonthAgo.getMonth() - 6);

	try {
		const result = await ShoppingList.deleteMany({
			active: false,
			deactivatedAt: { $lte: sixMonthAgo },
		});
		console.log(
			`${result.deletedCount} listas desactivadas han sido eliminadas.`
		);
	} catch (err) {
		console.error("Error al eliminar las listas desactivadas:", err);
	}
});
