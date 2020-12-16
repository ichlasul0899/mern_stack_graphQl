import React from "react";
// import logo from './logo.svg';
// import './App.css';

// on a besoin de gql pour cree notre requetes
import { gql } from "apollo-boost";
// graphql sert a lié un requetes o composant
import { graphql } from "react-apollo";

// pour faire une requetes dans notres composant bookList
// dans un premeirt temps on dois construre cette requtes
// ensuite on prend cette requetes et on la lie o composant

// construction de la requetes books
// ceci n'est pas du javascript mais du react
const getBookQuery = gql`
  {
    books {
      name
      id
    }
  }
`;

function BookList(props) {
  const displayBooks = () => {
    let data = props.data;
    if (data.loading) {
      return <div>Loading books...</div>;
    } else {
      return data.books.map((book) => {
        return <li key={book.id}>{book.name}</li>;
      });
    }
  };

  return (
    <div id="main">
      <ul id="book-list">
        {displayBooks()}
      </ul>
    </div>
  );
}

// on fais le lien entre le composant bookList et notre requete
// getBookQuery
// ici on a ecris
// utilise la fonction graphql pour liée
// la query getBookQuery au composant BookList
// par conséquent dans le composant BookList on a acces a tout
// les data renvoyé par la requete
// cette requete initialement ne fonction pas car graphql est defini initialement pour ne pas
// accepter des requetes d'autres serveur, pour qu'il accepter des requetes d'autre server
// dans la parti server on dois installer cors npm install cors --save
// puis ensuite l'importer dans app.js coté server
export default graphql(getBookQuery)(BookList);
