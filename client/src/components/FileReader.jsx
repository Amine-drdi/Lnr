import React, { useState } from "react";
import { read, utils } from "xlsx";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { CgImport } from "react-icons/cg";

const FileReader = () => {
  const [data, setData] = useState([]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileReader = new window.FileReader(); // Assurez-vous que FileReader vient de l'environnement global.
      fileReader.onload = (e) => {
        const binaryData = e.target.result;
        const workbook = read(binaryData, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheetData = utils.sheet_to_json(workbook.Sheets[sheetName]);
        setData(sheetData);
      };
      fileReader.readAsBinaryString(file);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Button
        variant="contained"
        color="primary"
        component="label"
        startIcon={<CgImport />}
        style={{ marginBottom: "20px" }}
      >
        Import File
        <input
          type="file"
          hidden
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
        />
      </Button>

      {data.length > 0 && (
        <TableContainer component={Paper} style={{ marginTop: "20px" }}>
          <Table>
            <TableHead className="bg-blue-gray-400">
              <TableRow >
                <TableCell >N°</TableCell>
                {Object.keys(data[0]).map((key) => (
                  <TableCell key={key}>{key}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  {Object.values(row).map((value, idx) => (
                    <TableCell key={idx}>{value}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default FileReader;
