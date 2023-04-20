const scrapeProductDetails = () => {
    // Product Title
    const productTitle = document.getElementById("productTitle") as HTMLHeadingElement;
    if (productTitle) {
        let title = productTitle.innerText.trim();
        if(!title) return console.log("Error: No product title found.");
        console.log(title);
    }

    // Product Details
    const productDetails = document.getElementById("detailBullets_feature_div") as HTMLDivElement;
    if (productDetails) {
        const unorderedList = productDetails.getElementsByTagName("ul")[0] as HTMLUListElement;
        if(!unorderedList) return console.log("Error: No product details found.");

        const listItems = unorderedList.getElementsByTagName("li");
        if(!listItems) return console.log("Error: No elements in table found.");

        for (let i = 0, listItem; listItem = listItems[i]; i++) {
            let listItemText = listItem.innerText;
            console.log(`${i}: ${listItemText}`);
            if (listItemText.includes("Package Dimensions") || listItemText.includes("Product Dimensions")) { // || ...
                let itemDimensions = listItemText.split(":")[1].split(";")[0].trim();
                if(!itemDimensions) console.log("Warning: No item dimensions found.");
                console.log(itemDimensions);

                let itemWeight = listItemText.split(";")[1].trim();
                if(!itemWeight) console.log("Warning: No item weight found.");
                console.log(itemWeight);
            }
        }
    }

    // Technical Details
    const technicalDetails = document.getElementById("prodDetails") as HTMLDivElement;
    if (technicalDetails) {
        const table = technicalDetails.getElementsByTagName("table")[0] as HTMLTableElement;
        if(!table) return console.log("Error: No technical details found.");
        for (let i = 0, row; row = table.rows[i]; i++) {
            let tableHead = row.firstElementChild.innerText.trim();
            if(!tableHead) console.log("Warning: No table head found.");
            console.log(`${i}: ${tableHead}`);
            let tableData = row.lastElementChild.innerText.trim();
            if (tableHead == "Item Weight" || tableHead == "Base Material") { // || ...
                if(!tableData) console.log("Warning: No table data found.");
                console.log(tableData);
            }
        }
    }
    
    return {};
};

const Amazon = () => {
    const productDetails = scrapeProductDetails()
};

export default Amazon;