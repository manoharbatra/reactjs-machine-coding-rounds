import React, { useState, useEffect } from 'react';
import Modal from "@mui/material/Modal";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { ThemeProvider, createTheme } from '@mui/material/styles';

interface ModalFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: string[]) => void;
  editData?: string[]; // Optional prop for editing existing data
  customLabels?: string[]; // Optional prop for customizing input labels
}

const theme = createTheme({
    palette: {
      primary: {
        main: '#007bff', // Change this color code to your desired primary color
      },
      secondary: {
        main: '#ffc107', // Change this color code to your desired secondary color
      },
    },
  });

const ModalForm: React.FC<ModalFormProps> = ({ isOpen, onClose, onSubmit, editData, customLabels }) => {
  const [inputs, setInputs] = useState<string[]>(['', '', '']);

  useEffect(() => {
    if (editData) {
      setInputs(editData);
    }
  }, [editData]);

  const handleChange = (index: number, value: string) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
  };

  const handleSubmit = () => {
    onSubmit(inputs);
    setInputs(['', '', '']);
    onClose();
  };

  return (
    <ThemeProvider theme={theme}>
      <Modal
        open={isOpen}
        onClose={onClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <div className="paper"> {/* Removed classes prop */}
          <h2 id="modal-title">{editData ? 'Edit Data' : 'Add Data'}</h2>
          <div id="modal-description">
            <TextField
              label={customLabels ? customLabels[0] : 'Input 1'}
              value={inputs[0]}
              onChange={(e) => handleChange(0, e.target.value)}
              fullWidth
              className='modal_text_input'
            />
            <TextField
              label={customLabels ? customLabels[1] : 'Input 2'}
              value={inputs[1]}
              onChange={(e) => handleChange(1, e.target.value)}
              fullWidth
              className='modal_text_input'
            />
            <TextField
              label={customLabels ? customLabels[2] : 'Input 3'}
              value={inputs[2]}
              onChange={(e) => handleChange(2, e.target.value)}
              fullWidth
              className='modal_text_input'
            />
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              {editData ? 'Save Changes' : 'Submit'}
            </Button>
          </div>
        </div>
      </Modal>
    </ThemeProvider>
  );
};

export default ModalForm;