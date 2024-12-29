export enum CATEGORY_ERRORS {
  CATEGORY_EXIST = "Esta categoria ya existe",
  CATEGORY_DOESNT_EXIST = "Esta categoria no existe",
  NAME_EMPTY = "El nombre de la categoria no puede estar vacío",
  DESCRIPTION_EMPTY = "La descripción de la categoria no puede estar vacío",
  ID_NOT_VALID = "ID de categoria no valido",
}
export enum PRODUCT_ERRORS {
  CATEGORY_EMPTY = "La categoría no puede estar vacía",
  NAME_EMPTY = "El nombre del producto no puede estar vacío",
  BRAND_EMPTY = "La marca del producto no puede estar vacío",
  PRICE_EMPTY = "El precio del producto no puede estar vacío",
  QUANTITY_EMPTY = "La cantidad del producto no puede estar vacío",
  WEIGHT_EMPTY = "El peso del producto no puede estar vacío",
  DESCRIPTION_EMPTY = "La descripcion del producto no puede estar vacío",
  CODE_EMPTY = "El codigo del producto no puede estar vacío",
  CATEGORY_ID_NOT_VALID = "ID de categoria no valido",
  PRODUCT_ID_NOT_VALID = "ID del producto no valido",
  PRICE_ARE_NOT_NUMBER = "El precio debe ser numérico",
  QUANTITY_ARE_NOT_NUMBER = "La cantidad debe ser numérico",
  PRODUCT_DOESNT_EXIST = "Este producto no existe",
  PRODUCT_EXIST = "Ya existe un producto con este nombre o codigo",
}
export enum ORDER_ERRORS{
  ITEM_EMPTY = "Error, los productos están vacíos",
  NIT_CLIENT_EMPTY = "Error, no hay nit del cliente ",
  NIT_CLIENT_NOT_NUMBER = "Error, el nit debe ser numérico ",
  TOTAL_AMOUNT_EMPTY = "Error, se debe calcular el valor total a pagar ",
  METHOD_EMPTY = "Error, se debe agregar el metodo de pago",
  PRODUCT_IN_SERVICE = "No se puede eliminar este producto porque existe en un servicio.",
  PRODUCT_IN_ORDER = "No se puede eliminar este producto porque existe en una orden de compra.",
  ID_CLIENT_NOT_VALID = "El ID del cliente no es válido.",
  PRODUCTS_LENGTH = "Error, no hay ni un solo producto a vender"
}
export enum CLIENT_ERRORS{
  CLIENT_ALREADY_EXIST = "Este cliente ya existe",
  CLIENT_NOT_EXIST = "Este cliente no existe",
  NAME_EMPTY = "Error, nombre del cliente vacio",
  NIT_EMPTY = "Error, nit del cliente vacio",
  ID_NOT_VALID = "Error, ID del cliente no valido",
}
export enum DEBTOR_ERRORS{
  DEBTOR_ALREADY_EXIST = "Este deudor ya existe",
  DEBTOR_NOT_EXIST = "Este deudor no existe",
  CLIENT_EMPTY = "Error, el cliente es obligatorio",
  ID_NOT_VALID = "Error, ID de deudor no valido",
}