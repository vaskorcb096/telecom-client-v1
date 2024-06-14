"use client";
import { useSession } from "next-auth/react";
import React from "react";

const oneToTwenty = [
  "",
  "one ",
  "two ",
  "three ",
  "four ",
  "five ",
  "six ",
  "seven ",
  "eight ",
  "nine ",
  "ten ",
  "eleven ",
  "twelve ",
  "thirteen ",
  "fourteen ",
  "fifteen ",
  "sixteen ",
  "seventeen ",
  "eighteen ",
  "nineteen ",
];
const tenth = [
  "",
  "",
  "twenty",
  "thirty",
  "forty",
  "fifty",
  "sixty",
  "seventy",
  "eighty",
  "ninety",
];

const convertToWords = (numberInput) => {
  if (numberInput.toString().length > 7) {
    setResult("overlimit");
    return;
  }

  const num = ("0000000" + numberInput)
    .slice(-7)
    .match(/^(\d{1})(\d{1})(\d{2})(\d{1})(\d{2})$/);

  if (!num) return;

  let outputText =
    num[1] !== "0"
      ? (oneToTwenty[Number(num[1])] ||
          `${tenth[num[1][0]]} ${oneToTwenty[num[1][1]]}`) + " million "
      : "";
  outputText +=
    num[2] !== "0"
      ? (oneToTwenty[Number(num[2])] ||
          `${tenth[num[2][0]]} ${oneToTwenty[num[2][1]]}`) + "hundred "
      : "";
  outputText +=
    num[3] !== "0"
      ? (oneToTwenty[Number(num[3])] ||
          `${tenth[num[3][0]]} ${oneToTwenty[num[3][1]]}`) + " thousand "
      : "";
  outputText +=
    num[4] !== "0"
      ? (oneToTwenty[Number(num[4])] ||
          `${tenth[num[4][0]]} ${oneToTwenty[num[4][1]]}`) + "hundred "
      : "";
  outputText +=
    num[5] !== "0"
      ? oneToTwenty[Number(num[5])] ||
        `${tenth[num[5][0]]} ${oneToTwenty[num[5][1]]} `
      : "";

  //   setResult(outputText);
  return outputText;
};

export function generateUniqueId() {
  const timestamp = Date.now(); // Get the current timestamp (in milliseconds)
  const uniqueId = timestamp.toString();
  return uniqueId;
}

const onlyDate = (dateString) => {
  const date = new Date(dateString);
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  return formattedDate;
};
const tableHeader = ["SI NO", "Description", "Quantity", "Rate/Unit", "Amount"];

const CustomerReceiptPDF = ({
  companyInfo,
  selectedProduct,
  price,
  quality,
  discount,
  receiveAmount,
  sum,
  payment_method,
}) => {
  const session = useSession();
  console.log("companyInfo", companyInfo, selectedProduct, "selectedProduct");
  const words = convertToWords(sum);
  return (
    <div id="invoice" className="bg-white rounded-lg">
      <div className="flex  p-6 xl:p-8 items-center justify-between ">
        <div>Chaity Telecommm</div>
      </div>

      <div className="mt-6  px-6 xl:px-8">
        <div className="flex  justify-between">
          <div className="col-span-6">
            <h1 className="font-bold">
              Invoice Number:{" "}
              <span className="font-normal">{generateUniqueId()}</span>
            </h1>
            <h1 className="font-bold">
              Invoice Date:{" "}
              <span className="font-normal">{onlyDate(new Date())}</span>
            </h1>
          </div>
          <div className="col-span-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-1">
                <h3 className="mb-2 font-bold text-secondary-11">
                  Billing Address
                </h3>
                <h1 className="font-bold">CHAITY TELECOM</h1>
                <h3 className="text-sm mb-1 ">{}</h3>

                <h3 className="text-sm mb-1 truncate">
                  chaitytelecom@gmail.com
                </h3>
                <h3 className="text-sm">{session.data.user.phone}</h3>
              </div>
              <div className="col-span-1 flex justify-end">
                <div>
                  <h1 className="mb-2 font-bold text-secondary-11">Bill To</h1>
                  <h3>{companyInfo?.customer_name}</h3>
                  <p className="text-sm mb-1">{companyInfo?.address}</p>
                  <p className="text-sm mb-1 truncate">{companyInfo?.phone}</p>
                  <p className="text-sm mb-1">
                    Shop name: {companyInfo?.shop_name}
                  </p>
                  <p className="text-sm mb-1">Payment Type: {payment_method}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="inline-block min-w-full align-middle">
          <div className={"bg-white  dark:bg-black-deepDark rounded-lg"}>
            <div className="w-full">
              <table className="min-w-full divide-y border-t dark:border-secondary-9 overflow-x-auto border-white-100 divide-secondary-2 dark:divide-secondary-9 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    {tableHeader.map((header, index) => (
                      <th
                        key={index}
                        scope="col"
                        className={
                          "px-6 md:px-4 bg-secondary-3 uppercase py-3.5  text-left  font-extrabold text-xs text-secondary-7 dark:text-secondary-1 sticky top-0 z-10"
                        }
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className={"bg-white dark:bg-black-dark"}>
                  {selectedProduct?.map((singleData, index) => (
                    <tr
                      className=" border-b border-secondary-2 dark:border-secondary-9"
                      key={index}
                    >
                      <td
                        // style={{ minWidth: '300px' }}
                        className={" px-6 py-4  text-sm font-bold"}
                      >
                        {index + 1}
                      </td>

                      <td className=" whitespace-nowrap px-3 py-4   ">
                        <p> {singleData?.product_name}</p>
                        <p className="text-xs mt-1">
                          {" "}
                          memo ref: {singleData?.memo_ref}
                        </p>
                      </td>
                      <td className="whitespace-nowrap   px-3 py-4 text-sm text-secondary-9">
                        {quality[singleData?._id]}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm ">
                        {price[singleData?._id]}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm ">
                        {quality[singleData?._id] * price[singleData?._id]}
                      </td>
                    </tr>
                  ))}
                  <tr className="  border-secondary-2 bg-secondary-3 dark:border-secondary-9">
                    <td
                      // style={{ minWidth: '300px' }}
                      className={" px-6 py-3  text-sm font-bold"}
                    >
                      Subtotal
                    </td>

                    <td className=" whitespace-nowrap px-3 py-3   "></td>
                    <td className="whitespace-nowrap   px-3 py-3 text-sm text-secondary-9"></td>
                    <td className="whitespace-nowrap px-3 py-3 text-sm "></td>
                    <td className="whitespace-nowrap px-3 py-3 text-sm ">
                      {sum} tk
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="flex justify-between bg-secondary-3 pb-3">
          <h1 className="px-6 font-bold text-secondary-11 text-sm">
            Grand Total
          </h1>

          <p className="text-sm">Amount (in words) : BDT {words} Only</p>
          <h1 className="mr-14">{sum} tk</h1>
        </div>
      </div>

      {/* <div className="p-6 xl:p-8 grid grid-cols-12 items-center justify-between  ">
        <div className="col-span-5">
          <h3 className="font-bold text-md mt-2">Payment method</h3>
          <p className="mt-1 text-sm">
            <span className="font-medium">
              01. Cheque in favor of Journeymaker Limited
            </span>
          </p>
          <p className="mt-1 text-sm">
            <span className="font-medium">02. Bank Transfer</span>
          </p>
          <p className="pl-7 text-sm">
            Bank Name: UCB Bank, Branch: Shahjalal Upashahar Branch,
          </p>
          <p className="pl-7 text-sm">Account Name: JOURNEYMAKER LIMITED</p>
          <p className="pl-7 text-sm">Account Number: 0852112000002805</p>
          <p className="mt-1 text-sm">
            <span className="font-medium">03. Bkash</span> : 01979 560 560
            (Merchant)
          </p>
          <div>iamge</div>
        </div>
        <div className="col-span-7 text-right flex justify-end "></div>
      </div> */}

      <div className="flex items-center justify-center py-4 border-t text-secondary-9">
        <p className="text-sm">
          Thank you for using Chaity telecom service |{" "}
          {new Date().getFullYear()} ©{" "}
          <span className="text-primary-400">ChaityTelecom</span>
        </p>
      </div>
    </div>
  );
};

export default CustomerReceiptPDF;
