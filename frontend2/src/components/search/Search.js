import React from "react";
import styles from "./Search.module.scss";
import { BiSearch, BiSort } from "react-icons/bi";

const Search = ({ value, onChange, onFill }) => {
  return (
    <div className={styles.search}>
      <BiSearch size={18} className={styles.icon} />
      <input
        type="text"
        placeholder="Search Request or Category"
        value={value}
        onChange={onChange}
      />
      {/* <button onClick={onFill} className={styles.fillButton}>
        <BiSort size={18} />
        Fill
      </button> */}
    </div>
  );
};

export default Search;
