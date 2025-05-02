import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { orange } from '@mui/material/colors';

const EditButton = styled(Button)(({ theme }) => ({
    color: 'white',
    backgroundColor: orange[600],
    '&:hover': {
      backgroundColor: orange[800],
    },
  }));

  export default EditButton;