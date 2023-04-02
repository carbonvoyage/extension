const scrapeProductDetails = () => {
    const productDetails = document.querySelector("^.*[p][r][o][d].*$");

    if (!productDetails) {
        return {};
    }

    const details = productDetails.getElementsByTagName("prod");
    const detailsArray = Array.from(details);
    const detailsObject = detailsArray.reduce((acc, detail) => {
        const key = detail.getElementsByTagName("th")[0].innerText;
        const value = detail.getElementsByTagName("td")[0].innerText;
        acc[key] = value;
        return acc;
    }, {});

    return detailsObject;
};

const Amazon = () => {
    const productDetails = scrapeProductDetails();
    console.log(productDetails);
};

export default Amazon;
