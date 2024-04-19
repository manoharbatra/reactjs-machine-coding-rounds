const isFormValid = (inputs: string[]): boolean => {
    return inputs.every(input => input.trim() !== '');
  };
  
export default isFormValid;
  