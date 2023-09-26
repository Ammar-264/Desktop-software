
import toast from "react-hot-toast";


export const formattedDate = (date)=>{
  
  const dateObject = new Date(date);
  const day = dateObject.getDate().toString().padStart(2, "0");
  const month = (dateObject.getMonth() + 1)
  .toString()
  .padStart(2, "0"); // Adding 1 to the month because it's zero-based
  const year = dateObject.getFullYear().toString(); // Get the last two digits of the year
  
  return `${day}-${month}-${year}`;
}

export function capitalizeEveryWord(str) {
  return str.replace(/\b\w/g, function (match) {
    return match.toUpperCase();
  });
}


