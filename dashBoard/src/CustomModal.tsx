import { Box, Modal, Typography } from "@mui/material"

const CustomModal = ({title, open, handleCloseModal, children, ...props}: any) => {
    return (
        <Modal open={open} onClose={handleCloseModal}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, backgroundColor: '#fff', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', padding: '16px 24px' }}>
          <Typography variant="h6" gutterBottom>
           {title}
          </Typography>
          <Typography variant="body1">
           {children}
          </Typography>
        </Box>
      </Modal>
    )
}

export default CustomModal