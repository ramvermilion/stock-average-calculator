import React, { useState, useRef } from "react";

const priceContent = [
  {
    title: "First Purchase",
    type: "first",
    units: "",
    price: "",
    id: "first"
  },
  {
    title: "Second Purchase",
    type: "second",
    units: "",
    price: "",
    id: "second"
  }
];

const purchaseItems = [
  {
    title: "Expected Average Price",
    value: "averagePrice",
    price: 0,
    extra: "previousAverage",
    styleClass: "border-2"
  },
  {
    title: "To Spend on Second Purchase",
    value: "secondPurchase",
    price: 0,
    styleClass: "bg-green-200 border-2"
  },
  {
    title: "Total Quantity after buy",
    value: "totalUnits",
    price: 0,
    extra: "previousUnits",
    styleClass: "border-2"
  },
  {
    title: "Invested on First Purchase",
    value: "firstPurchase",
    price: 0,
    styleClass: "bg-lime-200 border-2"
  },
  {
    title: "Totally Invested after Purchase",
    value: "totalAmount",
    price: 0,
    styleClass: "border-2"
  }
];

function StockAverageCalculator() {
  const [priceList, setPriceList] = useState(priceContent);
  const [purchaseValue, setPurchaseValue] = useState([...purchaseItems]);
  const priceRef = useRef(priceContent);

  const PurchaseList = () => {
    return purchaseValue.map((item, index) => {
      const {
        title,
        price = "",
        styleClass = "",
        extra = false,
        previousPrice = false
      } = item;
      return (
        <div
          key={title + index}
          className={`text-sm py-0.5 px-2.5	rounded-md shadow-md flex flex-col justify-between items-center my-1 ${styleClass}`}
        >
          <label className="text-center m-1">{title}</label>
          <div className="flex-1 text-center m-1 font-bold text-xl">
            {extra && previousPrice && previousPrice + " => "}
            {price.toLocaleString("en-IN")}
          </div>
        </div>
      );
    });
  };

  const handleCalculate = () => {
    //First Purchase => unit 1 * price 1
    //Second Purchase => unit 2 * price 2

    //Total Units => unit 1 + unit 2
    //Average unit => total amount/total units
    //Total Amount => first purchase + second Purchase

    let data = priceRef.current;
    debugger;

    const combined = data.reduce(
      (accumulator, currentItem, index) => {
        const units = Number(currentItem.units);
        const price = Number(currentItem.price);

        if (index === 0) {
          accumulator.firstPurchase = units * price;
          accumulator.previousAverage = price;
          accumulator.previousUnits = units;
        } else {
          accumulator.secondPurchase = units * price;
        }

        accumulator.totalUnits += units;
        accumulator.totalAmount += units * price;
        accumulator.averagePrice = Number(
          accumulator.totalAmount / accumulator.totalUnits
        ).toFixed(2);

        return accumulator;
      },
      { totalUnits: 0, totalAmount: 0, averagePrice: 0 }
    );

    const mergedData = purchaseValue.map((i, index) => {
      return {
        ...i,
        price: combined[i.value],
        previousPrice: combined[i.extra] || ""
      };
    });

    setPurchaseValue([...mergedData]);
    setPriceList(data);
  };

  const handleClear = () => {
    setPurchaseValue(purchaseItems);
    setPriceList(priceContent);
  };

  const CalculatorList = () => {
    return priceList.map((i, index) => {
      const { title, units = "", price = "" } = i;
      return (
        <div key={index + title} className="average-list m-4">
          <div
            className={`font-semibold my-2 ${
              index === 0 ? "bg-lime-200" : "bg-green-200"
            } text-center rounded-md`}
          >
            {title}
          </div>
          <div className="flex flex-col my-2">
            <label htmlFor={`unit_${index}`} className="font-medium my-1">
              Quantity
            </label>
            <input
              id={`unit_${index}`}
              maxLength="15"
              type="number"
              defaultValue={units}
              onChange={(el) => {
                return (priceRef.current[index]["units"] = el.target.value);
              }}
              className="border-2 py-0.5 px-3 border-sky-200 rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor={`price_${index}`} className="font-medium my-1">
              Price Per Share
            </label>
            <input
              id={`price_${index}`}
              maxLength="15"
              type="number"
              defaultValue={price}
              onChange={(el) => {
                return (priceRef.current[index]["price"] = el.target.value);
              }}
              className="border-2 py-0.5 px-3 border-sky-200 rounded-md"
            />
          </div>
        </div>
      );
    });
  };

  return (
    <div className="flex w-11/12 items-baseline justify-evenly flex-col md:flex-row">
      <div className="flex flex-col justify-center border-2 shadow-md rounded-md p-4 ">
        <div className="text-center text-xl font-bold title-wrap uppercase">
          Stock Average Calculator
        </div>

        <div>
          <div className="flex average-container-wrapper flex-col  md:flex-row">
            <CalculatorList />
          </div>

          <div className="flex justify-end m-2">
            <button
              onClick={handleClear}
              className="btn-primary mx-2 max-[600px]:text-sm"
            >
              Clear Fields
            </button>
            <button
              type="submit"
              onClick={handleCalculate}
              className="btn-secondary max-[600px]:text-sm"
            >
              Calculate Average
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col border-2 shadow-md rounded-md p-4 mt-5 md:m-0">
        <div className="flex flex-col justify-center average-list-wrapper w-64 m-2 mt-0 ">
          <div className="text-center uppercase text-xl font-bold title-wrap mb-2">
            Calculated Average
          </div>
          <PurchaseList />
        </div>
      </div>
    </div>
  );
}

export default StockAverageCalculator;
