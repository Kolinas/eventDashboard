import React, { useContext, useEffect, useRef, useState } from 'react';
import { Grid, Container, Box} from '@mui/material';
import CardEvent  from './CardEvent';
import { boardContext, iEvent } from './App';
import { useFetching } from './useFetch';

export const toCamelCase = <T extends Record<string, any>>(obj: T) => {
  const result: Record<string, any> = {};

  Object.keys(obj).forEach((key) => {
    if (key.includes('_')) {
      const camelCaseKey = key.replace(/_([a-z])/g, (match) => match[1].toUpperCase());
      result[camelCaseKey] = obj[key];
    } else {
      result[key] = obj[key];
    }
  });

  return result;
};

const Dashboard = () => {

  const {events, setEvents} = useContext(boardContext)
  const [fetchEvents, isLoading, error] = useFetching(async (page: number) => {
  const data = await fetch(`http://127.0.0.1:8000/events/?page=${page}&limit=10`)

  const {events} = await data.json()

  const eventsAll = events.map(el => {
    const tag = el.tags.replace(/'/g, '"'); 
    return {...toCamelCase(el), tags: JSON.parse(tag)}
  }) 
  setEvents(events => [...events, ...eventsAll])

 })

  const pageRef = useRef(1)

  useEffect(() => {
    fetchEvents(pageRef.current)
  }, [])



  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
    if (bottom) {
      pageRef.current += 1
      fetchEvents(pageRef.current)
    }
  };


    const createNewEvent = (arr: iEvent[]) => {
      return arr.map(({id, author, avatar, eventTitle, eventDate, eventDescription, tags}: iEvent) => (
        <Grid key={id} item xs={12} sm={6} md={4} lg={3} >
          <CardEvent
          id={id} 
          author={author} 
          avatar={avatar} 
          eventTitle={eventTitle} 
          eventDate={eventDate} 
          eventDescription={eventDescription} 
          setEvents={setEvents}
          tags={tags}/>
      </Grid>
      ))
    }

    return (
      <div className='my-custom-scrollbar' style={{ padding: '0px 20px', overflow: 'auto' }} onScroll={handleScroll}>
          <Grid container spacing={2}>
          {events.length ? createNewEvent(events) : <div className='mt-[10%] w-full text-center'>На данный момент нет активных мероприятий</div>}
          </Grid>
      </div>
    );
  };
  
  export default Dashboard;
