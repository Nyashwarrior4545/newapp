//ProductList.js

import React, { useEffect, useState } from "react";
import { SpinnerImg } from "../../loader/Loader";
import "./productList.scss";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { AiOutlineEye } from "react-icons/ai";
import Search from "../../search/Search";
import { useDispatch, useSelector } from "react-redux";
import {
  FILTER_PRODUCTS,
  selectFilteredPoducts,
} from "../../../redux/features/product/filterSlice";
import ReactPaginate from "react-paginate";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import {
  deleteProduct,
  getProducts,
} from "../../../redux/features/product/productSlice";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal';

const ProductList = ({ products, isLoading }) => {
  const [search, setSearch] = useState("");
  const [approvedRequestId, setApprovedRequestId] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [approvedProducts, setApprovedProducts] = useState({});
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" or "desc"
  




  const filteredProducts = useSelector(selectFilteredPoducts);

  const dispatch = useDispatch();

  const shortenText = (text, n) => {
    if (text.length > n) {
      const shortenedText = text.substring(0, n).concat("...");
      return shortenedText;
    }
    return text;
  };

  const delProduct = async (id) => {
    console.log(id);
    await dispatch(deleteProduct(id));
    await dispatch(getProducts());
  };

  const confirmDelete = (id) => {
    confirmAlert({
      title: "Delete Request",
      message: "Are you sure you want to delete this Request.",
      buttons: [
        {
          label: "Delete",
          onClick: () => delProduct(id),
        },
        {
          label: "Cancel",
          // onClick: () => alert('Click No')
        },
      ],
    });
  };

  //   Begin Pagination
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;

    setCurrentItems(filteredProducts.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(filteredProducts.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, filteredProducts]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % filteredProducts.length;
    setItemOffset(newOffset);
  };
  //   End Pagination
////////////////////////////////////////////////dx
  const updateProductStatus = async (id, status) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
  
      if (!response.ok) {
        throw new Error('HTTP status ' + response.status);
      }
  
      const product = await response.json();
      return product;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    dispatch(FILTER_PRODUCTS({ products, search }));
  }, [products, search, dispatch]);

  useEffect(() => {
    const newApprovedProducts = {};
    products.forEach(product => {
      newApprovedProducts[product._id] = 'Awaiting approval';
    });
    setApprovedProducts(newApprovedProducts);
  }, [products]);

 // Update this function
  const handleApproveClick = (id) => {
    setApprovedProducts(prevState => ({ ...prevState, [id]: 'Approved' }));
    setModalIsOpen(true);
    setTimeout(() => {
      setApprovedProducts(prevState => ({ ...prevState, [id]: 'Completed' }));
    }, 30000); // 30000 milliseconds = 30 seconds
  };
  const categoryOrder = ["Process Safety", "Environment", "Safety", "Accident", "Complaint", "Loss", "Over £100,000", "Health", "HR", "Expenses", "Overtime", "Holiday"];
  const handleSortClick = () => {
    // Toggle between ascending and descending order
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortOrder(newSortOrder);

    // Sort the products based on the predefined order of categories
    const sortedProducts = [...filteredProducts].sort((a, b) => {
      const categoryAIndex = categoryOrder.indexOf(a.category);
      const categoryBIndex = categoryOrder.indexOf(b.category);

        return categoryAIndex - categoryBIndex;

    });

    dispatch(FILTER_PRODUCTS({ products: sortedProducts, search }));
  };

  const [titleDelay, setTitleDelay] = useState(50); // Adjust this value (in milliseconds)


  

  return (
    <div className="product-list">
      <hr />
      <div className="table">
        <div className="--flex-between --flex-dir-column">
          <span>
            <h3>Request Lists</h3>
          </span>
          <span>
            <button  className ="sort"onClick={handleSortClick}>
              Sort by Category {sortOrder === "asc" ? "↑" : "↓"}
            </button>
          </span>
          <span>
            <Search
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </span>
        </div>

        {isLoading && <SpinnerImg />}

        <div className="table">
          {!isLoading && products.length === 0 ? (
            <p>-- No request found, please add a request...</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>s/n</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Value</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {currentItems.map((product, index) => {
                  const { _id, name, category,status, price, quantity } = product;

                  // Determine the color and tooltip for each category
                  let color, tooltip;
                  const categoryIndex = categoryOrder.indexOf(category);
                  if (categoryIndex < 3) {
                    color = "red";
                    tooltip = "Very Important";
                  } else if (categoryIndex < 6) {
                    color = "orange";
                    tooltip = "Important";
                  } else if (categoryIndex < 9) {
                    color = "yellow";
                    tooltip = "Needed";
                  } else {
                    color = "green";
                    tooltip = "Not Needed";
                  }
                  return (
                    <tr key={_id}>
                      <td>{index + 1}</td>
                      <td>{shortenText(name, 16)}</td>
                      <td>
                        <div
                          style={{
                            backgroundColor: color,
                            width: "12.5px",
                            height: "12.5px",
                            borderRadius: "50%",
                            display: "inline-block",
                            marginRight: "5px",
                          }}
                          title={tooltip}
                          onMouseEnter={() => setTitleDelay(50)} // Adjust this value (in milliseconds)
                          onMouseLeave={() => setTitleDelay(100)} // Reset back to the original value
                        ></div>
                        {category}
                      </td>
                      <td>{approvedProducts[_id]}</td>                      <td>
                        {"$"}
                        {price}
                      </td>
                      <td>{quantity}</td>
                      <td>
                        {"$"}
                        {price * quantity}
                      </td>
                      <td className="icons">
                        <span>
                          <Link to={`/product-detail/${_id}`}>
                            <AiOutlineEye size={25} color={"purple"} />
                          </Link>
                        </span>
                        <span>
                          <Link to={`/edit-product/${_id}`}>
                            <FaEdit size={20} color={"green"} />
                          </Link>
                        </span>
                        <span>
                          <FaTrashAlt
                            size={20}
                            color={"red"}
                            onClick={() => confirmDelete(_id)}
                          />
                        </span>
                        <div>
                        {/* Your other code... */}
                        <button onClick={() => handleApproveClick(_id)}>
                          <FontAwesomeIcon icon={faCheck} />
                        </button>
                        <Modal
                          isOpen={modalIsOpen}
                          onRequestClose={() => setModalIsOpen(false)}
                          contentLabel="Request Approved"
                          style={{
                            content: {
                              top: '50%',
                              left: '50%',
                              right: 'auto',
                              bottom: 'auto',
                              marginRight: '-50%',
                              transform: 'translate(-50%, -50%)',
                              width: '400px', // Set the width to your desired size
                              height: '300px', // Set the height to your desired size
                              backgroundColor: 'transparent',
                              borderRadius: '10px',
                              padding: '20px',
                              overflow: 'auto',
                            },
                       
                          }}
                        >
                          <h2>Request Approved</h2>
                          <button onClick={() => setModalIsOpen(false)}>Close</button>
                        </Modal>
                      </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        <ReactPaginate
          breakLabel="..."
          nextLabel="Next"
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          pageCount={pageCount}
          previousLabel="Prev"
          renderOnZeroPageCount={null}
          containerClassName="pagination"
          pageLinkClassName="page-num"
          previousLinkClassName="page-num"
          nextLinkClassName="page-num"
          activeLinkClassName="activePage"
        />
      </div>
    </div>
  );
};

export default ProductList;
