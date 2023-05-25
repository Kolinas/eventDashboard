import React, { useContext } from 'react';
import { Grid, Container} from '@mui/material';
import Card from './Card';
import { boardContext } from './App';

const Dashboard = () => {

    const {events} = useContext(boardContext)

    console.log(events);

    return (
      <Container style={{ marginTop: 20 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Card />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Card />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Card />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Card />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Card />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Card />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <Card />
            </Grid>
            {/* Add other Grid items with cards */}
          </Grid>
      </Container>
    );
  };
  
  export default Dashboard;
