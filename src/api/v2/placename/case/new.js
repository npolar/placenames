import { findCaseByNumber, findHighestCaseNumber } from "./search.js";

const emptyCase = ({
  highestCaseNumber,
  date = new Date().toJSON().split("T")[0],
} = {}) => {
  return {
    "@id": highestCaseNumber + 1,
    date,
    area: "Svalbard",
    placenames: [],
  };
};

export const newCase = async () => {
  const highestCaseNumber = await findHighestCaseNumber();
  return emptyCase({ highestCaseNumber });
};
