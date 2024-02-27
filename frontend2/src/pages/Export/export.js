//export.js
import "./export.scss";
import React, { Fragment, useEffect, useState } from "react";
import {
  Col,
  Row,
  Button,
  FormGroup,
  Input,
  Table,
  FormText,
} from "reactstrap";
import { read, utils } from "xlsx";
import axios from "axios";


const requiredFields = ["ID", "Name", "Category", "Status", "Quantity", "Price", "Description"];

function App() {
  const [loading, setLoading] = useState(false);
  const [excelRows, setExcelRows] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [rows, setRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editedRow, setEditedRow] = useState(null);
  const [editingRowId, setEditingRowId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = (await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/jokes`)).data;
      setRows(result);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };

  const [fileName, setFileName] = useState('');


  const readUploadFile = (e) => {
    e.preventDefault();
    if (e.target.files) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = utils.sheet_to_json(worksheet);
        setExcelRows(json);
      };
      reader.readAsArrayBuffer(file);
    }
    if (e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  const uploadData = async () => {
    try {
      setLoading(true);

      const firstItemKeys = excelRows[0] && Object.keys(excelRows[0]);

      let requiredValidation = false;

      if (firstItemKeys.length) {
        requiredFields.forEach((element) => {
          if (!firstItemKeys.find((x) => x === element)) {
            requiredValidation = true;
          }
        });
      }

      if (requiredValidation) {
        alert("Required fields " + JSON.stringify(requiredFields));
        setLoading(false);
        return;
      }

      const jokesResponse = (
        await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/v1/jokes`)
      ).data;
      const jokeList = jokesResponse || [];

      const jokes = excelRows.map((obj) => ({
        _id: jokeList.find((x) => x.jokeId == obj["ID"])?._id,
        jokeId: obj["ID"] || "",
        name: obj["Name"] || "",
        category: obj["Category"] || "",
        status: obj["Status"] || "",
        quantity: obj["Quantity"] || "",
        price: obj["Price"] || "",
        description: obj["Description"] || "",
        
      }));

      const updatedJokes = jokes.filter((x) => x._id);
      const newJokes = jokes.filter((x) => !x._id);

      if (updatedJokes.length) {
        const result = (
          await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/bulk/jokes-bulk-update`,
            updatedJokes
          )
        ).data;

        if (result) {
          alert("Successfully updated " + updatedJokes.length + " documents");
        }
      }

      console.log("newJokes:", newJokes); // Add this line

      if (newJokes.length) {
        const result = (
          await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/bulk/jokes-bulk-insert`,
            newJokes
          )
        ).data;
  
        if (result) {
          alert("Successfully added " + newJokes.length + " documents");
        }
      }

      fetchData();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("uploadData error: ", error.response);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setExcelRows([]);
    window.location.reload();
  };
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleEditClick = (id) => {
    const row = rows.find(row => row.jokeId === id);
  
    setEditingRowId(id);
    setEditedRow({...row}); // Make a copy of the row to edit
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedRow({ ...editedRow, [name]: value });
  };

  // Add a new function to handle the save button click
  const handleSaveClick = () => {
    // Update the rows state with the edited row
    setRows(rows.map(row => row.jokeId === editingRowId ? editedRow : row));
    // Reset the editingRowId and editedRow states
    setEditingRowId(null);
    setEditedRow(null);
  };
  

  function renderDataTable() {
    const filteredRows = rows.filter(row => 
      row.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      row.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return (
      <div className="right_result">
        <Table className="custom-table">
          <thead>
            <tr className="header">
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Status</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Description</th>
              <th>CreatedAt</th>
              <th>UpdatedAt</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody className="rows">
            {filteredRows.map((item, idx) => (
              <tr className="text" key={idx}>
                {editingRowId === item.jokeId ? (
                  <>
                    <td className="cute">{item.jokeId}</td>

                    <td><input name="name" value={editedRow.name} onChange={handleInputChange} /></td>
                    <td><input name="category" value={editedRow.category} onChange={handleInputChange} /></td>
                    <td><input name="status" value={editedRow.status} onChange={handleInputChange} /></td>
                    <td><input name="quantity" value={editedRow.quantity} onChange={handleInputChange} /></td>
                    <td><input name="price" value={editedRow.price} onChange={handleInputChange} /></td>
                    <td><input name="description" value={editedRow.des} onChange={handleInputChange} /></td>
                    {/* Add the rest of the fields here */}
                    <td><button className="save" onClick={handleSaveClick}>Save</button></td>
                  </>
                ) : (
                  <>
                    <td className="cute">{item.jokeId}</td>
                    <td>{item.name}</td>
                    <td>{item.category}</td>
                    <td>{item.status}</td>
                    <td>{item.quantity}</td>
                    <td>{item.price}</td>
                    <td>{item.description}</td>
                    <td>{item.createdAt
                      ? new Date(item.createdAt).toLocaleString()
                      : ""}
                    </td>
                    <td>
                      {item.updatedAt
                        ? new Date(item.updatedAt).toLocaleString()
                        : ""}
                    </td>
                    <td><button className="edit" onClick={() => handleEditClick(item.jokeId)}>Edit</button></td>

                  </>

                  
                )}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  }
  
  return (
    <Fragment>
      
      <div className="container">
        <Row>
          <Col md="6 text-left">
          <FormGroup>
          <label htmlFor="inputEmpGroupFile" className="custom-file-upload">
              {fileName || 'Choose File'}
            </label>
            <Input
              id="inputEmpGroupFile"
              name="file"
              type="file"
              className="form-control"
              onChange={readUploadFile}
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              style={{ display: 'none' }} // hide the default file input
            />
            <FormText className="text">
                {
                  
                  "NOTE: Please upload a file with the following fields and file must be an excel file:"
                }
                {requiredFields.join(", ")}
              </FormText>
            </FormGroup>
          </Col>
          <Col md="6 text-left">
            {selectedFile?.name && (
              <Button className="upload" disabled={loading} color="success" onClick={uploadData}>
                {"Upload data"}
              </Button>
            )}{" "}
            {selectedFile?.name && (
              <Button className="remove-button" disabled={loading} color="danger" onClick={removeFile}>
                {"Remove file"}
              </Button>
            )}
          </Col>
        </Row>
        
        {loading && <progress style={{ width: "100%" }}></progress>}
        <h4 className="mt-4" style={{ color: "black" }}>
          Request Table
        </h4>
        <input className="search"
        type="text" 
        placeholder="Search by name or category" 
        value={searchTerm} 
        onChange={handleSearchChange} 
        />
        <button className="refresh" onClick={fetchData}>Refresh</button>
        {renderDataTable()}
      </div>
    </Fragment>
  );
}

export default App;