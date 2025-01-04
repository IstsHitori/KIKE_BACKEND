import { Printer } from "escpos";
import Network from "escpos-network";
import { formatDate, getNameProductByID } from "../utils";
import { IProducts_item } from "../models/Product_item";

export interface IDataOfSell {
  idTicket: unknown;
  date: Date;
  customer: {
    name: string;
    nit: number;
  };
  items: IProducts_item[];
  total_amount: Number;
}
export const createPrint = (dataOfSell: IDataOfSell) => {
  try {
    const device = new Network("192.168.1.16", 9100); // Dirección IP de la impresora y puerto
    const options = { encoding: "GB18030" }; // Cambia la codificación según sea necesario
    const printer = new Printer(device, options);

    const { customer, date, idTicket, items, total_amount } = dataOfSell;

    // Calcular longitud máxima para columnas
    const columnWidths = {
      product: 24, // Espacio para nombres de productos
      quantity: 10, // Espacio para cantidades
      price: 14, // Espacio para precios
    };

    // Función para formatear columnas con espacios fijos
    const formatColumn = (text: string, width: number) => {
      return text.length > width
        ? text.slice(0, width - 1) + "…" // Truncar si excede
        : text.padEnd(width, " "); // Agregar espacios si es corto
    };

    device.open(async function (error) {
      if (error) {
        console.log(error);
        return;
      }

      printer
        .font("A")
        .align("CT")
        .style("B")
        .text("TALLER KIKE")
        .text("Direccion aun no puesta")
        .text("Aguachica-Cesar")
        .text("Cel: no aplica")
        .text("NIT. no aplica")
        .text("")
        .text("------------------------------------------------")
        .align("LT")
        .text(`Fecha: ${formatDate(date.toString())}`)
        .text("")
        .text(`No.Ticket: ${idTicket}`)
        .text("")
        .text(`Nit del cliente: ${customer.nit.toString()}`)
        .text("")
        .text(`Cliente: ${customer.name}`)
        .text("")
        .align("CT")
        .text(
          formatColumn("Producto", columnWidths.product) +
            formatColumn("Cant.", columnWidths.quantity) +
            formatColumn("Precio", columnWidths.price)
        )
        .text("------------------------------------------------");

      // Iterar sobre los ítems para imprimir
      for (const item of items) {
        const productName = await getNameProductByID(item.product);
        printer.text(
          formatColumn(productName, columnWidths.product) +
            formatColumn(`${item.quantity}`, columnWidths.quantity) +
            formatColumn(`$${item.price}`, columnWidths.price)
        );
      }

      printer
        .text("------------------------------------------------")
        .align("CT")
        .text(`Total: $${total_amount}`)
        .text("\n")
        .text("GRACIAS POR SU COMPRA")
        .text("\n")
        .cut()
        .close();
    });
  } catch (error) {
    console.log(error);
  }
};
