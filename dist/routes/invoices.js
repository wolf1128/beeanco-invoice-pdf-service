"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fonts = {
    Roboto: {
        normal: 'src/fonts/Roboto-Regular.ttf',
        bold: 'src/fonts/Roboto-Medium.ttf',
        italics: 'src/fonts/Roboto-Italic.ttf',
        bolditalics: 'src/fonts/Roboto-MediumItalic.ttf'
    }
};
const pdfmake_1 = __importDefault(require("pdfmake"));
const fs_1 = __importDefault(require("fs"));
const router = express_1.Router();
const printer = new pdfmake_1.default(fonts);
router.post('/', (req, res) => {
    const { order } = req.body;
    const invoiceBody = [];
    invoiceBody.push([
        { text: 'Bestellter Artikel', bold: true, border: [false], style: 'tableHeader' },
        { text: 'Artikelnummer', bold: true, border: [false], style: 'tableHeader' },
        { text: 'Menge', bold: true, border: [false], style: 'tableHeader' },
        { text: 'Preis', bold: true, border: [false], style: 'tableHeader' }
    ]);
    if (order.items) {
        for (let index = 0; index < order.items.length; index++) {
            invoiceBody.push([
                { text: order.items[index].product.vendor.name, bold: true, color: 'black', border: [false] },
                { text: '', border: [false] },
                { text: '', border: [false] },
                { text: '', border: [false] },
            ], [
                { text: order.items[index].product.name, bold: true, color: 'gray', border: [false], style: 'tableRow' },
                { text: `#${order.items[index].product.sku}`, italics: true, color: 'gray', border: [false], style: 'tableRow' },
                { text: order.items[index].quantity, italics: true, color: 'gray', border: [false], style: 'tableRow' },
                { text: `${order.items[index].price}€`, italics: true, color: 'gray', border: [false], style: 'tableRow' }
            ]);
        }
    }
    else {
        invoiceBody.push([
            { text: 'N/A', bold: true, color: 'gray', border: [false] },
            { text: 'N/A', bold: true, color: 'gray', border: [false] },
            { text: 'N/A', bold: true, color: 'gray', border: [false] },
            { text: 'N/A', bold: true, color: 'gray', border: [false] },
        ]);
    }
    const docDefinition = {
        content: [
            { text: 'beeanco', style: 'brand', alignment: 'center', tocItem: false },
            { text: `Danke ${order.buyer.firstName},`, style: 'header' },
            { text: `für deine Bestellung!`, style: 'header' },
            { text: `Hiermit bestätigen wir deine Bestellung bei beeanco. Bitte überprüfe noch einmal unten aufgelistet deine bestellten Artikel und deine angegebene Lieferadresse`, style: 'subheader' },
            {
                style: 'addresses',
                table: {
                    widths: ['*', '*'],
                    body: [
                        [{ text: 'Shipping Address', bold: true, border: [false], style: 'tableHeader' }, { text: 'Billing Address', bold: true, border: [false], style: 'tableHeader' }],
                        [
                            { text: order.shippingAddress.name, italics: true, color: 'gray', border: [false] },
                            { text: order.billingAddress ? order.billingAddress.name : 'N/A', italics: true, color: 'gray', border: [false] }
                        ],
                        [
                            { text: order.shippingAddress.address1, italics: true, color: 'gray', border: [false] },
                            { text: order.billingAddress ? order.billingAddress.address1 : 'N/A', italics: true, color: 'gray', border: [false] }
                        ],
                        [
                            { text: order.shippingAddress.address2 ? order.shippingAddress.address2 : 'N/A', italics: true, color: 'gray', border: [false] },
                            { text: order.billingAddress && order.billingAddress.address2 ? order.billingAddress.address2 : 'N/A', italics: true, color: 'gray', border: [false] }
                        ],
                        [
                            { text: order.shippingAddress.zip, italics: true, color: 'gray', border: [false] },
                            { text: order.billingAddress ? order.billingAddress.zip : 'N/A', italics: true, color: 'gray', border: [false] }
                        ],
                        [
                            { text: order.shippingAddress.city, italics: true, color: 'gray', border: [false] },
                            { text: order.billingAddress ? order.billingAddress.city : 'N/A', italics: true, color: 'gray', border: [false] }
                        ],
                        [
                            { text: order.shippingAddress.countryCode, italics: true, color: 'gray', border: [false] },
                            { text: order.billingAddress ? order.billingAddress.countryCode : 'N/A', italics: true, color: 'gray', border: [false] }
                        ],
                    ]
                }
            },
            {
                style: 'invoice',
                table: {
                    headerRows: 1,
                    widths: ['*', 100, 50, 50],
                    body: invoiceBody
                }
            },
        ],
        styles: {
            brand: {
                fontSize: 20,
                bold: true,
                margin: [0, 0, 0, 20]
            },
            header: {
                fontSize: 18,
                bold: true,
                margin: [0, 0, 0, 10]
            },
            subheader: {
                fontSize: 16,
                bold: true,
                margin: [0, 10, 0, 5]
            },
            addresses: {
                margin: [0, 5, 0, 15],
            },
            invoice: {
                margin: [0, 5, 0, 15],
            },
            tableHeader: {
                margin: [0, 5, 0, 15]
            },
            tableRow: {
                margin: [0, 0, 0, 15]
            },
        },
        defaultStyle: {}
    };
    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    pdfDoc.pipe(fs_1.default.createWriteStream('test/results/sample-request.pdf'));
    pdfDoc.end();
    res.json({ message: 'Invoice Successfully generated!' });
});
exports.default = router;
