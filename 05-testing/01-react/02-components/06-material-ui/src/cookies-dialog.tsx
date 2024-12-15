import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';

interface Props {
  onAgreeClick: () => void;
}

export const CookiesDialog: React.FC<Props> = (props) => {
  const { onAgreeClick } = props;
  const [open, setOpen] = React.useState(false);

  const handleAgreeClick = () => {
    setOpen(false);
    onAgreeClick();
  };

  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Learn more about our cookies
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>About cookies</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Any information that you voluntarily provide to us, including your
            name and email address, will be used for the sole purpose for which
            the information was provided to us.
          </DialogContentText>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Cookie</TableCell>
                <TableCell>Purpose</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>cookie 1</TableCell>
                <TableCell>purpose 1</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>cookie 2</TableCell>
                <TableCell>purpose 2</TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <br />
          <DialogContentText>
            In addition, communication exchanges on this website are public (not
            private) communications. Therefore, any message that you post on
            this website will be considered and treated as available for public
            use and distribution.
          </DialogContentText>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Cookie</TableCell>
                <TableCell>Purpose</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>cookie 3</TableCell>
                <TableCell>purpose 3</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>cookie 4</TableCell>
                <TableCell>purpose 4</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleAgreeClick}>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
