import Amazon from "./Amazon";

const InitScraper = () => {
    // Check if we are on an Amazon product page
    // Product pages Regex: https://regex101.com/r/0rGdUF/1
    // /https?:\/\/(?=(?:....)?amazon)www\S+com((\/.*)?\/(dp)\/([A-Z0-9]+)?)/g

    // Check if we are on an Amazon product page
    if (
        window.location.href.match(
            /https?:\/\/(?=(?:....)?amazon)www\S+com((\/.*)?\/(dp)\/([A-Z0-9]+)?)/g
        )
    ) {
        Amazon();
    }
};

export default InitScraper;
