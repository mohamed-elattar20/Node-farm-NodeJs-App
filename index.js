// const inputText = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(inputText);

// const newText = `This What we know about avokado ${inputText}`;

// fs.writeFileSync("./txt/output.txt", newText);

// console.log(`File Written`);

//  Server

const fs = require("fs");
const http = require("http");
const url = require("url");
const replaceTemplate = require("./modules/replaceTemplate");



const tempOverview = fs.readFileSync(
  `${__dirname}/templates/overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/product.html`,
  "utf-8"
);
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const productsData = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);
  // console.log(req.url);

  // OVERVIEW
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardsHtml = productsData
      .map((el) => replaceTemplate(tempCard, el))
      .join("");

    // console.log(cardsHtml);

    const output = tempOverview.replace(/{%PRODUCT_CARD%}/g, cardsHtml);

    res.end(output);
    // PRODUCT
  } else if (pathname === "/product") {
    res.writeHead(200, { "Content-type": "text/html" });
    const product = productsData[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  } else if (pathname === "/api") {
    res.end(data);
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "Hello-World",
    });
    res.end("<h1>Page Not Found</h1>");
  }
});

server.listen(8000, () => {
  console.log(`listening to requests on port 8000`);
});
