import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { red } from '@mui/material/colors';

const DeleteButton = styled(Button)(({ theme }) => ({
    color: 'white',
    backgroundColor: red[500],
    '&:hover': {
      backgroundColor: red[700],
    },
  }));

  export default DeleteButton;