import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './pdfGenerator.css';

const PdfGenerator = () => {
  const generatePDF = () => {
    // Create a new PDF document
    const doc = new jsPDF();

    // Define table columns and rows
    const columns = ['ID', 'Name', 'Age'];
    const data = [
      [1, 'John Doe', 30],
      [2, 'Jane Smith', 25],
      [3, 'Bob Johnson', 40]
    ];

    // Add table using autoTable plugin
    doc.autoTable({
      head: [columns],
      body: data
    });

    // Save the PDF
    doc.save('sample.pdf');
  };

  return (
    <div className="pdf-generator">
      <h1>PDF Generator</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>John Doe</td>
            <td>30</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Jane Smith</td>
            <td>25</td>
          </tr>
          <tr>
            <td>3</td>
            <td>Bob Johnson</td>
            <td>40</td>
          </tr>
        </tbody>
      </table>
      <button onClick={generatePDF}>Generate PDF</button>
    </div>
  );
};

export default PdfGenerator;
