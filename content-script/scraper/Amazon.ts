const scrapeProductDetails = () => {
    //console.log(document);
    const regex = new RegExp("\w*sections?_1");
    let productDetails = document.getElementById("prodDetails") as HTMLDivElement;

    // let productDetailsString = productDetails.outerHTML
    // let headers = productDetails.getElementsByTagName("table");
    // console.log(headers[0]);
    const technicalDetails = productDetails.getElementsByTagName("table")[0]
    // const table = document.getElementById("productDetails_techSpec_section_1") as HTMLTableElement
    for (let i = 0, row; row = technicalDetails.rows[i]; i++) {
        // console.log(row);
        // console.log(row.firstElementChild)
        let tableHead = row.firstElementChild.innerText;
        let tableData = row.lastElementChild.innerText;
        if (tableHead == "Item Weight") {
            console.log(tableData);
            console.log("we gaming");
        }
        if (tableHead == "Base Material") {
            console.log(tableData);
            console.log("gamers rise up");
        }
    }
    
    
        return {};

    // const details = productDetails.getElementsByTagName("prod");
    // const detailsArray = Array.from(details);
    // const detailsObject = detailsArray.reduce((acc, detail) => {
    //     const key = detail.getElementsByTagName("th")[0].innerText;
    //     const value = detail.getElementsByTagName("td")[0].innerText;
    //     acc[key] = value;
    //     return acc;
    // }, {});

   // return detailsObject;
};

const Amazon = () => {
    const productDetails = scrapeProductDetails()
};

export default Amazon;