//ProductSummary.js

import React, { useEffect } from "react";
import "./ProductSummary.scss";
import { AiFillDollarCircle } from "react-icons/ai";
import { BsCart4, BsCartX } from "react-icons/bs";
import { BiCategory } from "react-icons/bi";
import InfoBox from "../../infoBox/InfoBox";
import { useDispatch, useSelector } from "react-redux";
import { IoIosPaperPlane } from 'react-icons/io';
import {
  CALC_CATEGORY,
  CALC_OUTOFSTOCK,
  CALC_STORE_VALUE,
  CALC_STATUS,
  selectCategory,
  selectOutOfStock,
  selectTotalStoreValue,
  selectStatusCounts,
} from "../../../redux/features/product/productSlice";

// Icons
const earningIcon = <AiFillDollarCircle size={40} color="#fff" />;
const productIcon = <IoIosPaperPlane size={40} color="#fff" />;
const categoryIcon = <BiCategory size={40} color="#fff" />;
const outOfStockIcon = <BsCartX size={40} color="#fff" />;
const StatusIcon = <BiCategory size={40} color="#fff" />;




// Format Amount
export const formatNumbers = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const ProductSummary = ({ products }) => {
  const dispatch = useDispatch();
  const totalStoreValue = useSelector(selectTotalStoreValue);
  const outOfStock = useSelector(selectOutOfStock);
  const category = useSelector(selectCategory);
  const Status = useSelector(selectStatusCounts);

  useEffect(() => {
    dispatch(CALC_STORE_VALUE(products));
    dispatch(CALC_OUTOFSTOCK(products));
    dispatch(CALC_CATEGORY(products));
    dispatch(CALC_STATUS(products));
  }, [dispatch, products]);
  const statusList = Status ? (
    <div className="status-list">
      {Object.entries(Status).map(([key, value]) => {
        const formattedKey = key.replace(/([A-Z])/g, ' $1').trim();
        return (
          <div key={key} className="status-item">
            <span>{formattedKey}:</span> <span>{value}</span>
          </div>
        );
      })}
    </div>
  ) : null;
  const colorClasses = ['card-red', 'card-blue', 'card-yellow', 'card-pink', 'card-green'];


  return (
    <div className="product-summary">
      <h3 className="--mt">Request Stats</h3>
      <div className="info-summary">
        <InfoBox
          icon={productIcon}
          title={"Total Requests"}
          count={products.length}
          bgColor="card1"
        />
        <InfoBox
          icon={earningIcon}
          title={"Requests Value"}
          count={`$${formatNumbers(totalStoreValue.toFixed(2))}  `}
          bgColor="card2"
        />
        <InfoBox
          icon={categoryIcon}
          title={"All Categories"}
          count={category.length}
          bgColor="card4"
        />
        {Status && Object.entries(Status).map(([key, value], index) => {
        const formattedKey = key.replace(/([A-Z])/g, ' $1').trim();
        return (
          <InfoBox
            key={key}
            title={formattedKey}
            count={value}
            bgColor={colorClasses[index % colorClasses.length]} // get the color class from the array
          />
        );
      })}
    </div>
  </div>
  );
};

export default ProductSummary;
