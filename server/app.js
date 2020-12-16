const express = require('express');
const graphqlHTTP = require('express-graphql');
// cors sert a autoriser les requetes de server etrangé (server react par exemple)
const cors = require('cors'); 

const app = express();
// pour faire en sort que le server exepress accept les requetes etrangère   
app.use(cors())
const schema = require('./schema/schema.js');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise


mongoose.connect('mongodb://localhost/graphqlTuto', { useFindAndModify: false });
mongoose.connection.once('open', () => console.log("connection to graphqlTuto db done"))
.on('error', (error) => {
            console.log("connection error");
            console.log(error)
        });



// le server express va essayer d'interagir avec graph ql et il ne va pas reussir
// il va donc passer la main au second argument graphqlHTTP qui est capable d'intepreter 
// du graphql
app.use('/graphql', graphqlHTTP({
    schema,
    //ajouter cette proproété pour avoir la parti graphic graphicl sur la page
    graphiql: true
}));
// on utilise app.listen pour indiquer a l'application d'écouter sur le port 4000

app.listen(4000,() => console.log("now listening for request on port 4000"));
