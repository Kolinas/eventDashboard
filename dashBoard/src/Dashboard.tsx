import React, { useContext, useEffect, useRef, useState } from 'react';
import { Grid, Container, Box} from '@mui/material';
import CardEvent  from './CardEvent';
import { iEvent } from './App';

import { useGetEventsQuery } from './apiSlice';




const Dashboard = ({term}: any) => {

  const page = useRef(1)
  const { data: events, isLoading, refetch } = useGetEventsQuery({page: page.current});


  // useEffect(() => {
  //   fetchEvents(pageRef.current)
  // }, [])

  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) {
      page.current += 1

    }
  };

    const createNewEvent = (arr: iEvent[]) => {
      console.log(arr, 'arrrr');
      return arr.map(({id, authorName, authorAvatar, eventTitle, eventDate, eventDescription, tags}: iEvent) => {
        console.log(id, 'authorAvatar authorAvatar authorAvatar');
        return <Grid key={id} item xs={12} sm={6} md={4} lg={3} >
          <CardEvent
          id={id} 
          authorName={authorName} 
          authorAvatar={authorAvatar} 
          eventTitle={eventTitle} 
          eventDate={eventDate} 
          eventDescription={eventDescription} 
          tags={tags}/>
      </Grid>
      })
    }

    // console.log(term);

    // const filteredEvents = events.filter(event => event.tags.some(tag => tag.includes(term)));


    return (
      <div className='my-custom-scrollbar' style={{ padding: '0px 20px', overflow: 'auto' }} onScroll={handleScroll}>
          <Grid container spacing={2}>
          {events && events.length ? 
          createNewEvent(events) : 
          <div className='mt-[10%] w-full text-center'>
          {term ? 'No results found for the selected filters.' : 'No active events at the moment.'}
        </div>
          }
          </Grid>
      </div>
    );
  };
  
  export default Dashboard;
