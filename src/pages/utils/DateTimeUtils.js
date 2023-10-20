export function getLastThreeYears() {
    const currentYear = new Date().getFullYear(); // get the current year
    const years = []; // initialize an empty array to store the years
    for (let i = 0; i < 3; i++) {
      years.push(currentYear - i); // add the current year minus the loop index to the array
    }
    return years; // return the array of years
  }
  