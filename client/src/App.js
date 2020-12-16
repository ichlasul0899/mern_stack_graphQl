import React from 'react';
// import logo from './logo.svg';
// import './App.css';
import  ApolloClient from 'apollo-boost';
import {ApolloProvider} from 'react-apollo'




//component
import BookList from './components/BookList'
import AddBook from './components/addBook'
import ControlledOpenSelect from './components/addBook'


// setup apollo client

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql'
});

function App() {
  return (
    // entourer notre code des balise apoloProvider nous permet de recupérer 
    // des donnée a partir du point liant passé en parametre ici client qui
    // referencie notre server graphql
    <ApolloProvider client={client}>
      <div id = "main">
        <h1>Reading List</h1>
        <BookList/> 
        <ControlledOpenSelect/>
      </div>
    </ApolloProvider>
  );
}

export default App;
