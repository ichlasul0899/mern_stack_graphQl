const grapql = require('graphql');

const _ = require('lodash');
const Book = require('../models/Book');
const Author = require('../models/Author');



// on destructure on va chercher l'object de type GraphQLObjectType dans graphql

const {GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema, GraphQLID, GraphQLList, GraphQLNonNull} = grapql;


// data

// let books = [
//     {name: "superLivre", genre: "fantastic", id:"1", authorId: "3"},
//     {name: "moyenLivre", genre: "moyen", id:"2", authorId: "1"},
//     {name: "mauvaisLivre", genre: "nul", id:"3", authorId: "2"},
//     {name: "LivreAnas", genre: "moyen", id:"3", authorId: "3"},
//     {name: "LivreDavid", genre: "fantastic", id:"3", authorId: "2"},
//     {name: "LivreSonia", genre: "nul", id:"3", authorId: "1"}




// ];

// let authors = [
//     {name: "sonia", age: 70, id: "1"},
//     {name: "david", age: 45, id: "2"},
//     {name: "anas", age:21, id: "3"}
// ]

const BookType = new GraphQLObjectType({
    name: 'Book',
    // on doi mettre une fonction dan fields car 
    // si fields n'est pas defini dans une fonction 
    // le champ author qui renvoi un type authortype ne sera pas
    // connu a la compilation donc un eerreur sera renvoyé
    // alors que si le champ field correspond a une fonction
    // cette fonction est executé a la suite de la compilation
    // par conséquent tout les types seront connu d'avance 
    // donc plus de probleme de types inconnu
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        genre: {type: GraphQLString},
        author: {
            type: AuthorType,
            resolve(parent, args) {
                return Author.findById(parent.authorId);
            }
        }

    })
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        books: {
            type: GraphQLList(BookType),
            resolve(parent, args) {
                return Book.find({authorId: parent._id});
            }
        }
    })
});




// apres avoir defini les type il s'agit de definir les rootquery
// les rootquery son le liens entre le front end et le back
// il vont permetre de definri la façon dont on va pouvoir accerder
// a nos information par exemple on va pouvoir definir une root query
// tel que on peut acceder a un livre particulier , un auteur particulier
// a tout les livres ou a tout les auteurs
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: () => ({
        // on defini la requete permetant d'acceder a un livre on appelera cette requet book
        // donc la requete a appeler pour acceder a un livre sera la requete book
        book: {
            // on commence par definir le type de renvoi de la requete
            // ici la requete va nous renvoyer un type BookType
            type: BookType,
            // on precise les argument que l'on souhaite avoir
            // en parametre dans la requete ici on veut
            // l'id du livre
            args: {
                id: {type: GraphQLID }
            },
            resolve(parent, args){
                return Book.findById(args.id);
            }
        },
        author: {
            type: AuthorType,
            args: {
                id: {type: GraphQLID}
            },
            resolve(parent, args) {
                return Author.findById(args.id);
            }
        },
        books: {
            type: GraphQLList(BookType),
            resolve(parent, args) {
                return Book.find({});
            }
        },
        authors: {
            type: GraphQLList(AuthorType),
            resolve(parent, args) {
                return Author.find({});
            }
        }
    }) 
});


const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
        addAuthor: {
            type: AuthorType,
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)},    
            },
            resolve(parent, args) {
                let author = new Author({name: args.name, age: args.age});
                return author.save()
            }
        },
        addBook: {
            type: BookType,
            args: {
                // pour faire en sorte que lors d'une matation des champs
                // ne soi pas laissé a vide on utilise grapqlnonnull
                // qui refusera la mutation si le type passé en para nest pas defini
                name: {type: new GraphQLNonNull(GraphQLString)},
                genre: {type: new GraphQLNonNull(GraphQLString)},
                authorId: {type: new GraphQLNonNull(GraphQLID)}
            },
            resolve(parent, args) {
                let book = new Book({name: args.name, genre: args.genre, authorId: args.authorId});
                return book.save();
            }
        }
    })
})


module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
